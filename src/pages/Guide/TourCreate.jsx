import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BasicInfoStep } from '../../components/tour/BasicInfoStep';
import { RouteMapStep } from '../../components/tour/RouteMapStep';
import { MediaUploadStep } from '../../components/tour/MediaUploadStep';
import { ReviewStep } from '../../components/tour/ReviewStep';
import { useTourForm } from '../../hooks/useTourForm';
import { createCompleteTour, getTourById, updateTour } from '../../api/tour/tourApi';
import { useAuth } from '../../contexts/authContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { TOUR_CONSTANTS, UI_LABELS } from '../../utils/tourConstants';
import { transformTourData } from '../../utils/tourUtils';

const STEPS = [
  { id: TOUR_CONSTANTS.STEPS.BASIC_INFO, name: 'Basic Info' },
  { id: TOUR_CONSTANTS.STEPS.ROUTE, name: 'Route' },
  { id: TOUR_CONSTANTS.STEPS.MEDIA, name: 'Media' },
  { id: TOUR_CONSTANTS.STEPS.REVIEW, name: 'Review' }
];

const initialTourData = {
  title: '',
  description: '',
  price: 0,
  duration_minutes: 0,
  tour_stops: [],
  cover_image_temp: undefined,
  cover_image_url: undefined,
  cover_image_file: undefined
};

export const TourCreate = ({ mode = 'create', tourId }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [currentStep, setCurrentStep] = useState(TOUR_CONSTANTS.STEPS.BASIC_INFO);
  const [tourData, setTourData] = useState(initialTourData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');

  const isEditMode = mode === 'edit';
  
  // Initialize useTourForm with the current tour_stops
  const {
    stops,
    validationWarnings,
    totalAudioDuration,
    totalPrice,
    updateStops,
    validateAudioDurations
  } = useTourForm(tourData.tour_stops);

  // Sync stops back to tourData whenever stops change
  useEffect(() => {
    const stopsChanged = JSON.stringify(stops) !== JSON.stringify(tourData.tour_stops);
    
    if (stopsChanged) {
      setTourData(prev => ({ ...prev, tour_stops: stops }));
    }
  }, [stops]);

  // Fetch tour data for edit mode
  useEffect(() => {
    if (isEditMode && tourId) {
      const fetchTourData = async () => {
        try {
          setIsLoading(true);
          const response = await getTourById(tourId);
          if (response.success) {
            const transformedData = transformTourData(response.data);
            setTourData(transformedData);
          } else {
            throw new Error('Failed to load tour data');
          }
        } catch (error) {
          toast.error('Failed to load tour data');
          navigate('/guide/tourpackages');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTourData();
    }
  }, [isEditMode, tourId, navigate]);

  // Step validation
  const validateCurrentStep = useMemo(() => {
    switch (currentStep) {
      case TOUR_CONSTANTS.STEPS.BASIC_INFO:
        return tourData.title?.trim() && tourData.description?.trim();
      case TOUR_CONSTANTS.STEPS.ROUTE: 
        return stops.length >= 2 && stops.every(stop => stop.location);
      case TOUR_CONSTANTS.STEPS.MEDIA: 
        return stops.every(stop => 
          stop.media?.some(m => m.media_type === 'audio')
        ) && validationWarnings.every(w => w.severity !== 'error');
      case TOUR_CONSTANTS.STEPS.REVIEW: 
        return true;
      default: 
        return false;
    }
  }, [currentStep, tourData, stops, validationWarnings]);

  const canGoNext = currentStep < STEPS.length && validateCurrentStep;
  const canGoBack = currentStep > TOUR_CONSTANTS.STEPS.BASIC_INFO;

  // Navigation handlers
  const handleNext = () => canGoNext && setCurrentStep(c => c + 1);
  const handlePrevious = () => canGoBack && setCurrentStep(c => c - 1);

  // Data handlers
  const handleTourDataUpdate = (updates) => {
    setTourData(prev => ({ ...prev, ...updates }));
  };

  const handleStopsUpdate = (newStops) => {
    updateStops(newStops);
    setTourData(prev => ({ ...prev, tour_stops: newStops }));
  };

  // Submission logic
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading(isEditMode ? 'Updating your tour...' : 'Creating your tour...');

    try {
      if (!authState.user?.id) {
        throw new Error('User authentication required');
      }

      const formData = new FormData();
      
      const apiMethod = isEditMode ? updateTour : createCompleteTour;

      // Prepare tour data
      const tourJson = {
        title: tourData.title,
        description: tourData.description,
        price: totalPrice,
        duration_minutes: Math.ceil(totalAudioDuration / 60),
        status: 'pending_approval',
        guide_id: authState.user.id,
        ...(isEditMode && { id: tourId })
      };

      formData.append('tour', JSON.stringify(tourJson));
      
      // Add cover image
      if (tourData.cover_image_file) {
        formData.append('cover_image', tourData.cover_image_file);
      }
      
      // Add stops and media with durations
      stops.forEach((stop, index) => {
        // Prepare media metadata for this stop (without file objects)
        const mediaMetadata = stop.media?.filter(m => !m._deleted).map(mediaItem => ({
          ...(mediaItem.id && { id: mediaItem.id }),
          media_type: mediaItem.media_type,
          duration_seconds: mediaItem.duration_seconds || 0,
          file_name: mediaItem.file_name || mediaItem.name,
          file_type: mediaItem.file_type,
          file_size: mediaItem.file_size,
          ...(mediaItem.url && { url: mediaItem.url })
        })) || [];

        const stopJson = {
          ...(isEditMode && { id: stop.id }),
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
          } : null,
          // ✅ INCLUDED: Media metadata with durations
          media: mediaMetadata
        };
        
        formData.append(`stops[${index}]`, JSON.stringify(stopJson));
        
        // Add new media files
        if (stop.media) {
          stop.media.forEach((mediaItem) => {
            if (mediaItem.file && !mediaItem.id && !mediaItem._deleted) {
              formData.append(`stop_${index}_media`, mediaItem.file);
            }
          });
        }
      });

      // Call API method
      let response;
      if (isEditMode) {
        response = await apiMethod(tourId, formData);
      } else {
        response = await apiMethod(formData);
      }
      
      if (response.success) {
        toast.success(
          isEditMode ? 'Tour updated successfully!' : 'Tour created successfully!', 
          { id: toastId }
        );
        navigate('/guide/tourpackages');
      } else {
        throw new Error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} tour`);
      }

    } catch (error) {
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} tour. Please try again.`;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      }
      
      toast.error(errorMessage, { id: toastId, duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render helpers
  const getPageTitle = () => 
    isEditMode ? UI_LABELS.EDIT.TITLE : UI_LABELS.CREATE.TITLE;

  const getPageDescription = () => 
    isEditMode ? UI_LABELS.EDIT.DESCRIPTION : UI_LABELS.CREATE.DESCRIPTION;

  const getSubmitButtonText = () => {
    if (isSubmitting) return isEditMode ? 'Updating...' : 'Submitting...';
    return isEditMode ? UI_LABELS.EDIT.SUBMIT : UI_LABELS.CREATE.SUBMIT;
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading tour data...</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      tourData: {
        ...tourData,
        price: totalPrice,
        duration_minutes: Math.ceil(totalAudioDuration / 60),
        tour_stops: stops
      },
      stops: stops,
      onUpdate: handleTourDataUpdate,
      onStopsUpdate: handleStopsUpdate,
      onValidate: validateAudioDurations
    };

    switch (currentStep) {
      case TOUR_CONSTANTS.STEPS.BASIC_INFO:
        return <BasicInfoStep {...commonProps} />;
      case TOUR_CONSTANTS.STEPS.ROUTE:
        return <RouteMapStep {...commonProps} />;
      case TOUR_CONSTANTS.STEPS.MEDIA:
        return <MediaUploadStep {...commonProps} />;
      case TOUR_CONSTANTS.STEPS.REVIEW:
        return <ReviewStep {...commonProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-lg text-gray-700">Loading tour data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {renderCurrentStep()}
        </div>
      </main>

      {/* Footer Navigation */}
      {currentStep !== TOUR_CONSTANTS.STEPS.REVIEW && (
        <footer className="bg-white border-t border-gray-200">
          <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={!canGoBack}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default TourCreate;