
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from './Navigation';
import EnhancedChatInterface from './EnhancedChatInterface';
import KnowledgeBase from './KnowledgeBase';
import Forum from './Forum';
import Profile from './Profile';
import AITraining from './AITraining';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('chat');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'chat':
        return <EnhancedChatInterface userLocation="Global HR Platform" />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'forum':
        return <Forum />;
      case 'profile':
        return <Profile />;
      case 'training':
        return <AITraining />;
      default:
        return <EnhancedChatInterface userLocation="Global HR Platform" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Dashboard;
