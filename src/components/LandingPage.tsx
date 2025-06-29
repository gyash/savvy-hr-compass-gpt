
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, BookOpen, Brain, Upload, Zap, TrendingUp, Globe, Shield, Heart } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-amber-200/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200">
              <Heart className="h-5 w-5 text-orange-500" />
              <span className="text-orange-800 font-medium">Join Our Growing HR Community</span>
              <Badge className="bg-orange-500 text-white">2,500+ Members</Badge>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-800 leading-tight">
              Your Global HR
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Community Hub
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Connect with HR professionals worldwide, access region-specific employment laws, 
              and get AI-powered insights tailored to your unique challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Users className="mr-3 h-6 w-6" />
                Join Free Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-10 py-4 text-lg rounded-full"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Explore Knowledge Base
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '2,500+', label: 'Active Members', icon: Users },
              { number: '45+', label: 'Countries', icon: Globe },
              { number: '1,200+', label: 'Knowledge Articles', icon: BookOpen },
              { number: '98%', label: 'Satisfaction Rate', icon: Heart }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Community */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Why HR Professionals 
              <span className="text-orange-500"> Love Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of HR leaders who've transformed their practice with our community-driven platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Insights',
                description: 'Get instant, personalized advice powered by global HR knowledge and your specific context.',
                color: 'from-orange-400 to-red-400'
              },
              {
                icon: Upload,
                title: 'Smart Document Processing',
                description: 'Upload any HR document and watch our AI automatically categorize and extract key insights.',
                color: 'from-amber-400 to-orange-400'
              },
              {
                icon: MessageCircle,
                title: 'Global Community',
                description: 'Connect with HR professionals worldwide and share experiences across different cultures.',
                color: 'from-orange-400 to-amber-400'
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 rounded-3xl overflow-hidden">
                <CardHeader className="pb-4 pt-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-center text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <CardDescription className="text-center text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-20 bg-gradient-to-r from-orange-100/50 to-amber-100/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Community Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from HR professionals who've found their community with us
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'HR Director, Singapore',
                content: 'This platform helped me navigate complex employment laws across 5 countries. The AI insights are incredibly accurate and the community support is unmatched.',
                avatar: '👩‍💼'
              },
              {
                name: 'Marcus Rodriguez',
                role: 'People Operations, Brazil',
                content: 'The document processing feature saved me 20+ hours per week. It automatically categorizes policies and highlights compliance gaps.',
                avatar: '👨‍💼'
              },
              {
                name: 'Priya Sharma',
                role: 'Talent Acquisition, India',
                content: 'Connected with HR professionals globally and learned best practices that transformed our recruitment process. Amazing community!',
                avatar: '👩‍🎓'
              }
            ].map((story, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
                <CardContent className="space-y-4 p-0">
                  <div className="text-4xl text-center">{story.avatar}</div>
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                    "{story.content}"
                  </blockquote>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{story.name}</div>
                    <div className="text-orange-600 text-sm">{story.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Getting Started is 
              <span className="text-orange-500"> Simple</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community in minutes and start connecting with HR professionals worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Join our welcoming community by setting up your professional profile in under 2 minutes.',
                icon: Users
              },
              {
                step: '02',
                title: 'Upload Documents',
                description: 'Share your HR documents and let our AI automatically organize and analyze them for insights.',
                icon: Upload
              },
              {
                step: '03',
                title: 'Connect & Learn',
                description: 'Engage with the community, ask questions, and get AI-powered answers tailored to your region.',
                icon: MessageCircle
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-10 w-10 text-orange-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-orange-100 leading-relaxed">
            Start your journey with thousands of HR professionals who trust our platform for their daily challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50 px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Heart className="mr-3 h-6 w-6" />
              Start Free Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 text-lg rounded-full"
            >
              <Shield className="mr-3 h-5 w-5" />
              Learn More
            </Button>
          </div>
          <p className="text-orange-100 text-sm">
            Free forever • No credit card required • Join 2,500+ HR professionals
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
