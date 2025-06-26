
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Pin, Eye, Heart } from 'lucide-react';

const Forum = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ['forum-posts', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          forum_categories(name, icon),
          forum_replies(count)
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
          <p className="text-gray-600">Connect with HR professionals worldwide</p>
        </div>
        <Button>Start Discussion</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-100'
                }`}
              >
                All Discussions
              </button>
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {posts?.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.is_pinned && (
                        <Pin className="h-4 w-4 text-blue-600" />
                      )}
                      <Badge variant="outline">
                        {post.forum_categories?.icon} {post.forum_categories?.name}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {post.content}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.forum_replies?.length || 0} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.like_count} likes</span>
                    </div>
                  </div>
                  <span>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts && posts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-500">
                Be the first to start a conversation in this category!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
