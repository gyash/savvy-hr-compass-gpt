
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Brain, 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Globe,
  Award,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered HR Expertise",
      description: "Get instant answers to complex HR questions with our AI trained on global employment laws and best practices."
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Navigate employment regulations across different countries and regions with confidence."
    },
    {
      icon: Users,
      title: "Community-Driven Knowledge",
      description: "Connect with HR professionals worldwide and share insights in our collaborative platform."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security ensuring your sensitive HR data remains protected and compliant."
    },
    {
      icon: Zap,
      title: "Instant Solutions",
      description: "Get immediate responses to urgent HR situations, available 24/7 when you need it most."
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Our AI learns from your organization's policies and adapts to provide personalized guidance."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "HR Director, TechCorp",
      company: "Fortune 500 Company",
      content: "This platform transformed how we handle HR compliance. The AI responses are incredibly accurate and save us hours of research time.",
      rating: 5
    },
    {
      name: "Miguel Rodriguez",
      role: "People Operations Lead",
      company: "Scale-up (200+ employees)",
      content: "As a growing company, we needed expert HR guidance without the huge costs. This solution gave us enterprise-level expertise at a fraction of the price.",
      rating: 5
    },
    {
      name: "Dr. Priya Patel",
      role: "Chief Human Resources Officer",
      company: "Healthcare Organization",
      content: "The global compliance features are outstanding. Managing our international workforce became significantly easier with region-specific guidance.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active HR Professionals", icon: Users },
    { number: "50+", label: "Countries Covered", icon: Globe },
    { number: "99.9%", label: "Accuracy Rate", icon: CheckCircle },
    { number: "24/7", label: "Available Support", icon: Zap }
  ];

  const useCases = [
    {
      title: "Employment Law Compliance",
      description: "Navigate complex labor laws across different jurisdictions with AI-powered legal guidance.",
      example: "\"What are the termination notice requirements in Germany vs. UK?\""
    },
    {
      title: "Policy Development",
      description: "Create comprehensive HR policies tailored to your organization and location.",
      example: "\"Help me draft a remote work policy for a hybrid workforce in Canada.\""
    },
    {
      title: "Performance Management",
      description: "Design effective performance review systems and handle difficult conversations.",
      example: "\"How should I structure a performance improvement plan for underperforming employees?\""
    },
    {
      title: "Recruitment Strategy",
      description: "Optimize hiring processes and create inclusive recruitment practices.",
      example: "\"What's the best approach for diversity hiring in tech roles?\""
    }
  ];

  if (user) {
    // Redirect authenticated users to dashboard
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🚀 Now with AI Training Capabilities
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI-Powered HR Intelligence
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your HR operations with our advanced AI companion trained on global employment laws, 
            best practices, and real-world scenarios. Get expert guidance instantly, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Try Free Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-2 hover:bg-blue-50"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why HR Professionals Choose Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to solve real HR challenges with intelligent automation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Helps Your Daily HR Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real scenarios where our AI makes the difference
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 mb-3">{useCase.description}</p>
                      <div className="bg-gray-50 p-3 rounded-lg italic text-sm">
                        {useCase.example}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by HR Leaders Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how professionals like you are transforming their HR operations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <Award className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of HR professionals who are already saving time and making better decisions with AI-powered guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/auth'}
            >
              Start Free Trial - No Credit Card Required
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-4">
            ✓ Free forever plan available ✓ Setup in under 2 minutes ✓ Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
