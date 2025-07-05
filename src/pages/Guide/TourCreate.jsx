import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StepIndicator } from '../../components/ui/StepIndicator.jsx';
import { BasicInfoStep } from '../../components/tour/BasicInfoStep.jsx';
import { RouteMapStep } from '../../components/tour/RouteMapStep.jsx';
import { MediaUploadStep } from '../../components/tour/MediaUploadStep.jsx';
import { ReviewStep } from '../../components/tour/ReviewStep.jsx';
import { useMapbox } from '../../hooks/useMaps.js';
import { createTour } from '../../api/tour/tourApi.js';
import { useAuth } from '../../contexts/authContext.jsx';

const STEPS = [
  { title: 'Basic Info', description: 'Tour details' },
  { title: 'Plan Route', description: 'Map & stops' },
  { title: 'Add Media', description: 'Audio & images' },
  { title: 'Review', description: 'Final check' }
];

const PRICE_PER_MINUTE = 500;
const MINIMUM_PRICE = 1000;

export const TourCreate = () => {
  const { authState } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [tourData, setTourData] = useState({
    title: '',
    description: '',
    price: 0,
    duration_minutes: 0,
    tour_stops: [],
    cover_image: undefined,
    cover_image_url: undefined
  });
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();

  const validateCurrentStep = () => {
  switch (currentStep) {
    case 1: 
      return tourData.title?.trim() && tourData.cover_image;
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

  useEffect(() => {
    if (currentStep >= 3) {
      validateMediaContent();
    }
  }, [tourData.tour_stops, currentStep]);

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

      if (totalAudioDuration > maxRecommendedAudioTime) {
        warnings.push({
          stopIndex: index,
          message: `Audio duration (${totalAudioDuration}s) exceeds 80% of walking time (${maxRecommendedAudioTime}s) to next stop`,
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

    setValidationWarnings(warnings);
  };

  const calculateTourDuration = () => {
    const totalSeconds = tourData.tour_stops.reduce((total, stop) => {
      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      return total + audioFiles.reduce((stopTotal, audio) => stopTotal + (audio.duration_seconds || 0), 0);
    }, 0);
    return Math.ceil(totalSeconds / 60);
  };

  const calculateTourPrice = () => {
    const totalMinutes = calculateTourDuration();
    const basePrice = totalMinutes * PRICE_PER_MINUTE;
    return Math.max(basePrice, MINIMUM_PRICE);
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleTourDataUpdate = (updates) => {
    setTourData(prev => ({ ...prev, ...updates }));
  };

  const handleStopsUpdate = (stops) => {
    setTourData(prev => ({ ...prev, tour_stops: stops }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!authState.user?.id) {
        throw new Error('User not authenticated');
      }

      const finalData = {
        ...tourData,
        price: calculateTourPrice(),
        duration_minutes: calculateTourDuration(),
        status: 'pending_approval',
        guide_id: authState.user.id,
      };

      const requestData = {
        title: finalData.title,
        description: finalData.description || '',
        price: finalData.price,
        duration_minutes: finalData.duration_minutes,
        status: finalData.status,
        guide_id: finalData.guide_id,
        cover_image_url: finalData.cover_image_url || '',
        tour_stops: finalData.tour_stops.map((stop, index) => ({
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
          media: stop.media?.map(mediaItem => ({
            media_type: mediaItem.media_type,
            url: mediaItem.url || '',
            duration_seconds: mediaItem.duration_seconds || 0,
            caption: mediaItem.caption || ''
          })) || []
        }))
      };

      const res = await createTour(requestData);
      console.log('Tour created successfully:', res);
      
      // Redirect or show success message
    } catch (error) {
      console.error('Error submitting tour:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderCurrentStep = () => {
    const commonProps = {
      tourData,
      onUpdate: handleTourDataUpdate,
      stops: tourData.tour_stops,
      onStopsUpdate: handleStopsUpdate,
      validationWarnings
    };

    switch (currentStep) {
      case 1: 
        return <BasicInfoStep {...commonProps} />;
      case 2: 
        return <RouteMapStep {...commonProps} />;
      case 3: 
        return <MediaUploadStep {...commonProps} />;
      case 4: 
        return (
          <ReviewStep
            {...commonProps}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            tourData={{
              ...tourData,
              price: calculateTourPrice(),
              duration_minutes: calculateTourDuration()
            }}
          />
        );
      default: 
        return null;
    }
  };

  const isCurrentStepValid = validateCurrentStep();
  const canProceed = isCurrentStepValid;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-12 mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Create New Tour Package
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Craft an immersive experience with our step-by-step tour creation process
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={STEPS.length}
              steps={STEPS}
              activeColor="bg-gradient-to-r from-teal-600 to-blue-600"
            />
          </div>

          {/* Form Container */}
          <div className="overflow-hidden bg-white shadow-lg rounded-xl">
            {/* Form Content */}
            <div className="p-8">
              {renderCurrentStep()}
            </div>

            {/* Navigation Footer */}
            {currentStep < 4 && (
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </button>

                  <div className="text-sm font-medium text-gray-500">
                    Step {currentStep} of {STEPS.length}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all ${
                      canProceed
                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                {!isCurrentStepValid && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-red-500">
                      Please complete all required fields to continue
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-gray-500">
            Need assistance?{' '}
            <a href="#" className="font-medium text-teal-600 hover:text-teal-700">
              View our guide
            </a>{' '}
            or{' '}
            <a href="#" className="font-medium text-teal-600 hover:text-teal-700">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourCreate;