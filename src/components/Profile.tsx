
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState({
    full_name: '',
    organization: '',
    position: '',
    experience_years: 0,
    specialization: [] as string[],
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        organization: profile.organization || '',
        position: profile.position || '',
        experience_years: profile.experience_years || 0,
        specialization: profile.specialization || [],
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const specializations = [
    'Talent Acquisition',
    'Employee Relations',
    'Performance Management',
    'Compensation & Benefits',
    'Learning & Development',
    'Diversity & Inclusion',
    'HR Analytics',
    'Employment Law',
    'Organizational Development',
    'HR Technology',
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your professional information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={profileData.organization}
                onChange={(e) => setProfileData(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={profileData.position}
                onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select 
                value={profileData.experience_years.toString()} 
                onValueChange={(value) => setProfileData(prev => ({ ...prev, experience_years: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0-1 years</SelectItem>
                  <SelectItem value="2">2-5 years</SelectItem>
                  <SelectItem value="6">6-10 years</SelectItem>
                  <SelectItem value="11">11+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileData.specialization.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    {spec}
                    <button
                      type="button"
                      onClick={() => setProfileData(prev => ({
                        ...prev,
                        specialization: prev.specialization.filter((_, i) => i !== index)
                      }))}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => {
                if (!profileData.specialization.includes(value)) {
                  setProfileData(prev => ({
                    ...prev,
                    specialization: [...prev.specialization, value]
                  }));
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Add specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations
                    .filter(spec => !profileData.specialization.includes(spec))
                    .map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
