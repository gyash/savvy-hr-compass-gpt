
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'hr_professional', 'user');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  organization TEXT,
  position TEXT,
  experience_years INTEGER,
  specialization TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create knowledge_base table for training content
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text', -- 'text', 'url', 'document'
  source_url TEXT,
  tags TEXT[],
  category TEXT,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_categories table
CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_posts table
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES public.forum_categories(id),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_replies table
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id),
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_sessions table for AI training records
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name TEXT NOT NULL,
  training_data JSONB,
  trained_by UUID REFERENCES auth.users(id),
  model_version TEXT,
  performance_metrics JSONB,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'moderator')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for knowledge_base
CREATE POLICY "Everyone can view approved knowledge" ON public.knowledge_base FOR SELECT USING (status = 'approved' OR auth.uid() = created_by OR public.is_admin_or_moderator(auth.uid()));
CREATE POLICY "Authenticated users can create knowledge" ON public.knowledge_base FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Moderators can approve knowledge" ON public.knowledge_base FOR UPDATE USING (public.is_admin_or_moderator(auth.uid()) OR auth.uid() = created_by);

-- RLS Policies for forum_categories
CREATE POLICY "Everyone can view categories" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Moderators can manage categories" ON public.forum_categories FOR ALL USING (public.is_admin_or_moderator(auth.uid()));

-- RLS Policies for forum_posts
CREATE POLICY "Everyone can view posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id OR public.is_admin_or_moderator(auth.uid()));

-- RLS Policies for forum_replies
CREATE POLICY "Everyone can view replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id OR public.is_admin_or_moderator(auth.uid()));

-- RLS Policies for training_sessions
CREATE POLICY "Moderators can view training sessions" ON public.training_sessions FOR SELECT USING (public.is_admin_or_moderator(auth.uid()));
CREATE POLICY "Moderators can manage training sessions" ON public.training_sessions FOR ALL USING (public.is_admin_or_moderator(auth.uid()));

-- Create trigger function for updating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default forum categories
INSERT INTO public.forum_categories (name, description, icon) VALUES
('General Discussion', 'General HR topics and discussions', '💬'),
('Recruitment & Talent Acquisition', 'Hiring strategies, interview techniques, and talent sourcing', '🎯'),
('Employee Relations', 'Managing workplace relationships and conflicts', '🤝'),
('Performance Management', 'Performance reviews, goal setting, and employee development', '📊'),
('Compliance & Legal', 'Employment law, regulations, and compliance matters', '⚖️'),
('Learning & Development', 'Training programs, skill development, and career growth', '📚'),
('Compensation & Benefits', 'Salary structures, benefits administration, and rewards', '💰'),
('Culture & Engagement', 'Building workplace culture and employee engagement', '🌟');
