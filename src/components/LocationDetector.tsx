
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface LocationDetectorProps {
  onLocationDetected: (location: string) => void;
}

const LocationDetector: React.FC<LocationDetectorProps> = ({ onLocationDetected }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  // Simulate geolocation detection with fallback to IP-based detection
  const detectLocation = async () => {
    setIsDetecting(true);
    
    try {
      // First try browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // In a real app, you'd use reverse geocoding service
            // For demo, we'll simulate based on timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const location = getLocationFromTimezone(timezone);
            onLocationDetected(location);
            setIsDetecting(false);
            toast.success(`Location detected: ${location}`);
          },
          () => {
            // Fallback to timezone-based detection
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const location = getLocationFromTimezone(timezone);
            onLocationDetected(location);
            setIsDetecting(false);
            toast.info(`Location estimated: ${location}`);
          }
        );
      } else {
        // Fallback for browsers without geolocation
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const location = getLocationFromTimezone(timezone);
        onLocationDetected(location);
        setIsDetecting(false);
        toast.info(`Location estimated: ${location}`);
      }
    } catch (error) {
      setIsDetecting(false);
      toast.error('Unable to detect location. Please select manually.');
    }
  };

  const getLocationFromTimezone = (timezone: string): string => {
    // Simple mapping based on timezone - in production, use proper geolocation service
    if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
      return 'India';
    } else if (timezone.includes('America/New_York') || timezone.includes('America/Chicago')) {
      return 'United States';
    } else if (timezone.includes('Europe/London')) {
      return 'United Kingdom';
    } else if (timezone.includes('Europe/')) {
      return 'Europe';
    } else if (timezone.includes('Asia/Singapore')) {
      return 'Singapore';
    } else if (timezone.includes('Australia/')) {
      return 'Australia';
    } else if (timezone.includes('Asia/')) {
      return 'Asia-Pacific';
    } else {
      return 'Global';
    }
  };

  const commonLocations = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Singapore', 'Germany', 'France', 'Netherlands', 'UAE', 'Global'
  ];

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Location Setup</h2>
        <p className="text-gray-600 text-sm">
          Help us provide region-specific HR guidance by detecting your location
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={detectLocation}
          disabled={isDetecting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isDetecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Detecting Location...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Auto-Detect Location
            </div>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or select manually</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {commonLocations.map((location) => (
            <Button
              key={location}
              variant="outline"
              size="sm"
              onClick={() => onLocationDetected(location)}
              className="text-sm"
            >
              {location}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        This helps us provide accurate legal compliance and cultural guidance
      </p>
    </Card>
  );
};

export default LocationDetector;
