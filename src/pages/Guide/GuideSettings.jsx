import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/authContext';
import {
  getGuideProfile,
  getGuidePerformance,
  getDocuments
} from '../../api/guide/settingApi';
import ProfileSection from '../../components/guide_settings/ProfileSection';
import LanguagesSection from '../../components/guide_settings/LanguagesSection';
import DocumentsSection from '../../components/guide_settings/DocumentsSection';
import PasswordSection from '../../components/guide_settings/PasswordSection';
import PerformanceSection from '../../components/guide_settings/PerformanceSection';
import SupportSection from '../../components/guide_settings/SupportSection';
import QuickInfoSection from '../../components/guide_settings/QuickInfoSection';

const GuideSettings = () => {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_no: '',
    bio: '',
    years_of_experience: 0,
    profile_picture_url: '',
    last_login: '',
    languages_spoken: [],
    verification_status: ''
  });

  // Performance metrics
  const [performance, setPerformance] = useState({
    rating: 0,
    reviewsCount: 0,
    toursConducted: 0,
    totalEarnings: 0,
    responseRate: 0,
    avgResponseTime: 0
  });

  // Profile photo state
  const [photoPreview, setPhotoPreview] = useState('');

  // Languages state - extracted from profile data
  const [languages, setLanguages] = useState([]);

  // Documents state
  const [documents, setDocuments] = useState([]);

  // Support tickets state
  const [tickets, setTickets] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profile data
      const profileResponse = await getGuideProfile(authState.user?.id);
      if (profileResponse.success) {
        const profileData = profileResponse.data;
        setProfile(profileData);
        setPhotoPreview(profileData.profile_picture_url || '');
        
        // Extract languages from the profile data
        if (profileData.guides && profileData.guides.languages_spoken) {
          const languageArray = profileData.guides.languages_spoken.map(lang => ({
            language: lang,
            proficiency: 'Fluent' // Default proficiency since it's not in your data
          }));
          setLanguages(languageArray);
        }
      }
      
      // Fetch performance data
      const performanceResponse = await getGuidePerformance(authState.user?.id);
      if (performanceResponse.success) {
        setPerformance(performanceResponse.data);
      }
      
      // Fetch documents
      const docsResponse = await getDocuments(authState.user?.id);
      if (docsResponse.success) {
        setDocuments(docsResponse.data);
      }
      
      // Fetch support tickets
      // const ticketsResponse = await getSupportTickets(authState.user?.id);
      // if (ticketsResponse.success) {
      //   setTickets(ticketsResponse.data);
      // }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    
    try {
      setIsSaving(true);
      // await updateGuideProfile({ [field]: value });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      // Revert the change on error
      setProfile({ ...profile });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - 2/3 width */}
              <div className="space-y-6 lg:col-span-2">
                <ProfileSection
                  profile={profile}
                  photoPreview={photoPreview}
                  isSaving={isSaving}
                  onProfileUpdate={handleProfileUpdate}
                  onPhotoChange={() => {}}
                  onRemovePhoto={() => {}}
                />
                
                <LanguagesSection
                  languages={languages}
                  isSaving={isSaving}
                  onLanguageAdd={() => {}}
                  onLanguageRemove={() => {}}
                />
                
                <DocumentsSection
                  documents={documents}
                  isSaving={isSaving}
                  onDocumentUpload={() => {}}
                />
                
                <PasswordSection
                  isSaving={isSaving}
                  onSubmitPassword={() => {}}
                />
              </div>
              
              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                <PerformanceSection performance={performance} />
                
                <SupportSection
                  tickets={tickets}
                  onCreateTicket={() => {}}
                />
                
                <QuickInfoSection
                  profile={profile}
                  performance={performance}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideSettings;