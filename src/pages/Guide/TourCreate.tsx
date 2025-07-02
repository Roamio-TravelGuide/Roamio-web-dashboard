import React, { useState, useEffect , useCallback} from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { TourPackage, TourStop, ValidationWarning } from '../../types/tour';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { BasicInfoStep } from '../../components/tour/BasicInfoStep';
import { RouteMapStep } from '../../components/tour/RouteMapStep';
import { MediaUploadStep } from '../../components/tour/MediaUploadStep';
import { ReviewStep } from '../../components/tour/ReviewStep';
import { useMapbox } from '../../hooks/useMaps';
import { createTour } from '../../api/tour/tourApi';
import { useAuth } from '../../contexts/authContext';


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
  const [tourData, setTourData] = useState<TourPackage>({
    title: '',
    description: '',
    price: 0,
    duration_minutes: 0,
    tour_stops: [],
    cover_image: undefined,
    cover_image_url: undefined
  });
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarning[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: return !!tourData.title && !!tourData.cover_image;
      case 2: return tourData.tour_stops.length >= 2;
      case 3: return tourData.tour_stops.every(stop => 
        stop.media?.some(m => m.media_type === 'audio')
      ) && validationWarnings.every(w => w.severity !== 'error');
      case 4: return true;
      default: return false;
    }
  };

  useEffect(() => {
    if (currentStep >= 3) validateMediaContent();
  }, [tourData.tour_stops, currentStep]);

  const validateMediaContent = () => {
    const warnings: ValidationWarning[] = [];

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
          message: `Audio duration exceeds 80% of walking time to next stop`,
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

  const handleTourDataUpdate = (updates: Partial<TourPackage>) => {
    setTourData(prev => ({ ...prev, ...updates }));
  };

  const handleStopsUpdate = (stops: TourStop[]) => {
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

    // Prepare the request data with URLs instead of files
    const requestData = {
      title: finalData.title,
      description: finalData.description || '',
      price: finalData.price,
      duration_minutes: finalData.duration_minutes,
      status: finalData.status,
      guide_id: finalData.guide_id,
      cover_image_url: tourData.cover_image_url || '', // Use the URL instead of file
      tour_stops: tourData.tour_stops.map((stop, index) => ({
        sequence_no: index + 1,
        stop_name: stop.stop_name,
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
          url: mediaItem.url || '', // Use the URL instead of file
          duration_seconds: mediaItem.duration_seconds || 0,
          caption: mediaItem.caption || ''
        })) || []
      }))
    };

    console.log('Submitting tour with:', {
      title: finalData.title,
      guide_id: finalData.guide_id,
      stop_count: requestData.tour_stops.length
    });

    // Assuming createTour now accepts JSON data instead of FormData
    const res = await createTour(requestData);
    console.log('Tour created successfully:', res);
    
  } catch (error) {
    console.error('Error submitting tour:', error);
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
      case 1: return <BasicInfoStep {...commonProps} />;
      case 2: return <RouteMapStep {...commonProps} />;
      case 3: return <MediaUploadStep {...commonProps} />;
      case 4: return (
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
      default: return null;
    }
  };

  const isCurrentStepValid = validateCurrentStep();
  const canProceed = isCurrentStepValid;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create New Tour Package
          </h1>
          <p className="text-gray-600">
            Share your local knowledge with travelers around the world
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
            <div className="p-8">
              {renderCurrentStep()}
            </div>

            {currentStep < 4 && (
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <div className="text-sm text-gray-500">
                    Step {currentStep} of {STEPS.length}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      canProceed
                        ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {!isCurrentStepValid && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-red-600">
                      Please complete all required fields to continue
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 text-sm text-center text-gray-500">
          <p>
            Need help? Check our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              tour creation guide
            </a>{' '}
            or{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourCreate;