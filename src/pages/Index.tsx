
import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import LocationDetector from '@/components/LocationDetector';

const Index = () => {
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const handleLocationDetected = (location: string) => {
    setUserLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {!userLocation ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <LocationDetector onLocationDetected={handleLocationDetected} />
          </div>
        ) : (
          <div className="h-[90vh]">
            <ChatInterface userLocation={userLocation} />
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-white border-t py-4 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            HR AI Companion • Specialized in employment law and cultural best practices
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Always consult with legal professionals for specific compliance matters
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
