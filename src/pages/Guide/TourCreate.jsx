import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BasicInfoStep } from '../../components/tour/BasicInfoStep.jsx';
import { RouteMapStep } from '../../components/tour/RouteMapStep.jsx';
import { MediaUploadStep } from '../../components/tour/MediaUploadStep.jsx';
import { ReviewStep } from '../../components/tour/ReviewStep.jsx';
import { useMapbox } from '../../hooks/useMaps.js';
import { createCompleteTour } from '../../api/tour/tourApi.js';
import { useAuth } from '../../contexts/authContext.jsx';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PRICE_PER_MINUTE = 500;
const MINIMUM_PRICE = 1000;

const tabs = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Route' },
  { id: 3, name: 'Media' },
  { id: 4, name: 'Review' }
];

const initialTourData = {
  title: '',
  description: '',
  price: 0,
  duration_minutes: 0,
  tour_stops: [],
  cover_image_temp: undefined,
  cover_image_url: undefined
};

export const TourCreate = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [tourData, setTourData] = useState(initialTourData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return tourData.title?.trim() && tourData.description?.trim();
      case 2: 
        return tourData.tour_stops?.length >= 2 &&
               tourData.tour_stops.every(stop => stop.location);
      case 3: 
        return tourData.tour_stops.every(stop => 
          stop.media?.some(m => m.media_type === 'audio')
        ) && validationWarnings.every(w => w.severity !== 'error');
      case 4: 
        return true;
      default: 
        return false;
    }
  };

  const validateMediaContent = () => {
    const warnings = [];

    tourData.tour_stops.forEach((stop, index) => {
      if (index === tourData.tour_stops.length - 1) return;

      const nextStop = tourData.tour_stops[index + 1];
      if (!stop.location || !nextStop.location) {
        warnings.push({
          stopIndex: index,
          message: 'Location not set for this stop',
          severity: 'error'
        });
        return;
      }

      const distance = getDistanceBetweenPoints(
        { lat: stop.location.latitude, lng: stop.location.longitude },
        { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
      );

      const walkingTime = getWalkingTime(distance);
      const maxRecommendedAudioTime = Math.floor(walkingTime * 0.8);

      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      const totalAudioDuration = audioFiles.reduce((total, audio) => total + (audio.duration_seconds || 0), 0);

      if (totalAudioDuration < maxRecommendedAudioTime) {
        warnings.push({
          stopIndex: index,
          message: `Audio duration (${totalAudioDuration}s) is too short for this stop`,
          severity: 'warning'
        });
      }

      if (audioFiles.length === 0) {
        warnings.push({
          stopIndex: index,
          message: 'No audio content added',
          severity: 'error'
        });
      }
    });

    return warnings;
  };

  const validationWarnings = useMemo(() => {
    return currentStep >= 3 ? validateMediaContent() : [];
  }, [tourData.tour_stops, currentStep]);

  const durationSeconds = useMemo(() => {
    return tourData.tour_stops.reduce((total, stop) => {
      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      return total + audioFiles.reduce((stopTotal, audio) => 
        stopTotal + (audio.duration_seconds || 0), 0);
    }, 0);
  }, [tourData.tour_stops]);

  const price = useMemo(() => {
    const basePrice = durationSeconds * (PRICE_PER_MINUTE / 60);
    return Math.max(basePrice, MINIMUM_PRICE);
  }, [durationSeconds]);

  const canGoNext = currentStep < tabs.length && validateCurrentStep();
  const canGoBack = currentStep > 1;

  const handleNext = () => canGoNext && setCurrentStep(c => c + 1);
  const handlePrevious = () => canGoBack && setCurrentStep(c => c - 1);

  const handleTourDataUpdate = (updates) => {
    setTourData(prev => ({ ...prev, ...updates }));
  };

  const handleStopsUpdate = (stops) => {
    setTourData(prev => ({ ...prev, tour_stops: stops }));
  };

  // const handleSubmit = async () => {
  //   setIsSubmitting(true);
  //   const toastId = toast.loading('Creating your tour...');

  //   try {
  //     // Validate authentication
  //     if (!authState.user?.id) {
  //       throw new Error('User authentication required');
  //     }

  //     // Use FormData for file uploads
  //     const formData = new FormData();
      
  //     // Add tour data as JSON
  //     formData.append('tour', JSON.stringify({
  //       title: tourData.title,
  //       description: tourData.description,
  //       price: price,
  //       duration_minutes: Math.ceil(durationSeconds / 60),
  //       status: 'pending_approval',
  //       guide_id: authState.user.id,
  //     }));
      
  //     // Add cover image as file
  //     if (tourData.cover_image_temp && tourData.cover_image_temp.file) {
  //       formData.append('cover_image', tourData.cover_image_temp.file);
  //     }
      
  //     // Add stops as JSON and media as files
  //     tourData.tour_stops.forEach((stop, index) => {
  //       formData.append(`stops[${index}]`, JSON.stringify({
  //         sequence_no: index + 1,
  //         stop_name: stop.stop_name || `Stop ${index + 1}`,
  //         description: stop.description || '',
  //         location: stop.location ? {
  //           longitude: stop.location.longitude,
  //           latitude: stop.location.latitude,
  //           address: stop.location.address || '',
  //           city: stop.location.city || '',
  //           province: stop.location.province || '',
  //           district: stop.location.district || '',
  //           postal_code: stop.location.postal_code || ''
  //         } : null
  //       }));
        
  //       // Add media files for this stop
  //       stop.media?.forEach((mediaItem, mediaIndex) => {
  //         if (mediaItem.file) {
  //           formData.append(`stop_${index}_media`, mediaItem.file);
  //         }
  //       });
  //     });

  //     const response = await createCompleteTour(formData);
      
  //     if (response.success) {
  //       toast.success('Tour created successfully!', { id: toastId });
  //       // setTimeout(() => navigate('/guide/tourpackages'), 1500);
  //     } else {
  //       throw new Error(response.message || 'Failed to create tour');
  //     }

  //   } catch (error) {
  //     console.error('Tour submission failed:', error);
  //     toast.error(
  //       error.response?.data?.message || 
  //       error.message ||
  //       'Failed to create tour. Please try again.',
  //       { id: toastId }
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // In the handleSubmit function in TourCreate.jsx
const handleSubmit = async () => {
  setIsSubmitting(true);
  const toastId = toast.loading('Creating your tour...');

  try {
    if (!authState.user?.id) {
      throw new Error('User authentication required');
    }

    const formData = new FormData();
    
    // Add tour data as JSON
    const tourJson = {
      title: tourData.title,
      description: tourData.description,
      price: price,
      duration_minutes: Math.ceil(durationSeconds / 60),
      status: 'pending_approval',
      guide_id: authState.user.id,
    };
    
    console.log('Tour JSON:', tourJson);
    formData.append('tour', JSON.stringify(tourJson));
    
    // Add cover image as file (if exists)
    if (tourData.cover_image_file) {
      console.log('Adding cover image:', tourData.cover_image_file.name);
      formData.append('cover_image', tourData.cover_image_file);
    } else {
      console.log('No cover image to add');
    }
    
    // Add stops as JSON and media as files
    tourData.tour_stops.forEach((stop, index) => {
      const stopJson = {
        sequence_no: index + 1,
        stop_name: stop.stop_name || `Stop ${index + 1}`,
        description: stop.description || '',
        location: stop.location ? {
          longitude: stop.location.longitude,
          latitude: stop.location.latitude,
          address: stop.location.address || '',
          city: stop.location.city || '',
          province: stop.location.province || '',
          district: stop.location.district || '',
          postal_code: stop.location.postal_code || ''
        } : null
      };
      
      console.log(`Stop ${index} JSON:`, stopJson);
      formData.append(`stops[${index}]`, JSON.stringify(stopJson));
      
      // Add media files for this stop
      if (stop.media && stop.media.length > 0) {
        stop.media.forEach((mediaItem, mediaIndex) => {
          if (mediaItem.file) {
            console.log(`Adding media for stop ${index}:`, mediaItem.file.name);
            formData.append(`stop_${index}_media`, mediaItem.file);
          }
        });
      } else {
        console.log(`No media for stop ${index}`);
      }
    });

    // Debug: Log FormData contents
    console.log('=== FORM DATA CONTENTS ===');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: FILE - ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value.substring(0, 100) + (value.length > 100 ? '...' : ''));
      }
    }

    const response = await createCompleteTour(formData);
    
    if (response.success) {
      toast.success('Tour created successfully!', { id: toastId });
      navigate('/guide/tourpackages');
    } else {
      throw new Error(response.message || 'Failed to create tour');
    }

  } catch (error) {
    console.error('Tour submission failed:', error);
    toast.error(
      error.response?.data?.message || 
      error.message ||
      'Failed to create tour. Please try again.',
      { id: toastId }
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const renderCurrentStep = () => {
    const commonProps = {
      tourData: {
        ...tourData,
        price,
        duration_minutes: Math.ceil(durationSeconds / 60)
      },
      onUpdate: handleTourDataUpdate,
      stops: tourData.tour_stops,
      onStopsUpdate: handleStopsUpdate,
      validationWarnings,
      isEditable: true
    };

    switch (currentStep) {
      case 1: return <BasicInfoStep {...commonProps}/>;
      case 2: return <RouteMapStep {...commonProps} />;
      case 3: return <MediaUploadStep {...commonProps} />;
      case 4: return <ReviewStep {...commonProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-fixed bg-center bg-cover">
      <div className="px-4 py-8 mx-auto">
        <div className="mx-8 overflow-hidden bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            {renderCurrentStep()}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={!canGoBack}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  !canGoBack
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < tabs.length ? (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
                    canGoNext
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${
                    !isSubmitting
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Tour'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCreate;