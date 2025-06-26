
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MapPin, Users, Scale, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: string;
}

interface ChatInterfaceProps {
  userLocation: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm your HR AI companion, specialized in employment laws and best practices. I've detected you're in ${userLocation}, so I'll provide region-specific guidance. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
      context: 'welcome'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // HR-specific responses with regional context
    if (lowerMessage.includes('culture') || lowerMessage.includes('best practices')) {
      return `Based on ${userLocation} workplace standards, here are key culture-building practices:

1. **Inclusive Communication**: Foster open dialogue across all levels
2. **Recognition Programs**: Implement peer-to-peer recognition systems
3. **Work-Life Balance**: Adapt to local expectations (${userLocation} typically values flexible working arrangements)
4. **Professional Development**: Invest in continuous learning opportunities
5. **Diversity & Inclusion**: Create policies that reflect local diversity goals

${userLocation}-specific considerations:
- Compliance with local employment standards
- Cultural sensitivity in communication styles
- Regional holiday and leave policies

Would you like me to elaborate on any of these areas?`;
    }
    
    if (lowerMessage.includes('hiring') || lowerMessage.includes('recruitment')) {
      return `For hiring in ${userLocation}, here's a comprehensive approach:

**Legal Compliance:**
- Follow ${userLocation} anti-discrimination laws
- Ensure proper background check procedures
- Comply with local wage disclosure requirements

**Best Practices:**
- Structured interview processes
- Diverse hiring panels
- Skills-based assessments
- Transparent job descriptions

**Regional Insights:**
- Local talent market conditions
- Competitive compensation benchmarks
- Cultural fit considerations for ${userLocation}

What specific aspect of hiring would you like to explore further?`;
    }
    
    if (lowerMessage.includes('policy') || lowerMessage.includes('compliance')) {
      return `Policy development for ${userLocation} should consider:

**Essential Policies:**
- Employee handbook aligned with local laws
- Anti-harassment and discrimination policies
- Data privacy (GDPR compliance if applicable)
- Remote work guidelines
- Performance management frameworks

**${userLocation} Specific Requirements:**
- Statutory leave entitlements
- Notice period regulations
- Termination procedures
- Workplace safety standards

I can help you draft specific policies or review existing ones for compliance. What area needs attention?`;
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('review')) {
      return `Performance management in ${userLocation} should balance:

**Global Best Practices:**
- Regular feedback cycles (not just annual reviews)
- SMART goal setting
- 360-degree feedback systems
- Career development planning

**Local Adaptations:**
- Communication styles preferred in ${userLocation}
- Cultural approaches to feedback
- Performance improvement protocols
- Documentation requirements for legal protection

**Modern Approaches:**
- Continuous performance conversations
- Skills gap analysis
- Succession planning integration

Which aspect of performance management would you like to dive deeper into?`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". As your HR AI companion with expertise in ${userLocation} employment practices, I'm here to help with:

• Employment law compliance
• Hiring and recruitment strategies  
• Performance management systems
• Workplace culture development
• Policy creation and updates
• Employee relations guidance

Could you provide more specific details about your HR challenge? I'll give you targeted advice based on ${userLocation} regulations and best practices.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
        context: 'response'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const quickActions = [
    { text: "Best practices for building team culture", icon: Users },
    { text: "Compliance requirements for hiring", icon: Scale },
    { text: "Performance review frameworks", icon: BookOpen },
    { text: "Employee retention strategies", icon: Sparkles }
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HR AI Companion</h1>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              <span>{userLocation}</span>
            </div>
          </div>
        </div>
        <p className="text-sm opacity-90">
          Specialized in employment law, culture building, and HR best practices
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-x">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto p-3"
              onClick={() => handleQuickAction(action.text)}
            >
              <action.icon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{action.text}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white border-x">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-50 border'
            }`}>
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {message.text}
              </div>
              <div className={`text-xs mt-2 opacity-70 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gray-50 border p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-600 ml-2">Analyzing your query...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about HR policies, compliance, culture building..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Powered by AI • Trained on {userLocation} employment laws and global HR best practices
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
