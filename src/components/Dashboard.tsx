
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from './Navigation';
import EnhancedChatInterface from './EnhancedChatInterface';
import KnowledgeBase from './KnowledgeBase';
import Forum from './Forum';
import Profile from './Profile';
import AITraining from './AITraining';
import DocumentProcessor from './DocumentProcessor';

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
      case 'documents':
        return <DocumentProcessor />;
      default:
        return <EnhancedChatInterface userLocation="Global HR Platform" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="p-8">
            {renderCurrentPage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
