
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, BookOpen, Users, Brain, User, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'documents', label: 'Smart Docs', icon: Upload },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'forum', label: 'Community', icon: Users },
    { id: 'training', label: 'AI Training', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-orange-700 mr-6">Global HR</h1>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "gap-2 rounded-full",
                  currentPage === item.id ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "text-gray-600 hover:text-gray-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                  <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                {user?.user_metadata?.full_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate('/auth')}>Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
