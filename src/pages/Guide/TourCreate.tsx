import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { TourPackage, TourStop, ValidationWarning } from '../../types/tour';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { BasicInfoStep } from '../../components/tour/BasicInfoStep';
import { RouteMapStep } from '../../components/tour/RouteMapStep';
import { MediaUploadStep } from '../../components/tour/MediaUploadStep';
import { ReviewStep } from '../../components/tour/ReviewStep';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

const STEPS = [
  {
    title: 'Basic Info',
    description: 'Tour details'
  },
  {
    title: 'Plan Route',
    description: 'Map & stops'
  },
  {
    title: 'Add Media',
    description: 'Audio & images'
  },
  {
    title: 'Review',
    description: 'Final check'
  }
];

function TourCreate(){
  const [currentStep, setCurrentStep] = useState(1);
  const [tourData, setTourData] = useState<TourPackage>({
    title: '',
    description: '',
    price: 0,
    duration_minutes: 0,
    tour_stops: []
  });
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarning[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getDistanceBetweenPoints, getWalkingTime } = useGoogleMaps();

  // Validate current step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Basic Info
        return !!(tourData.title && tourData.price > 0 && tourData.duration_minutes > 0);
      
      case 2: // Route Map
        return tourData.tour_stops.length >= 2 && 
               tourData.tour_stops.every(stop => stop.location);
      
      case 3: // Media Upload
        return tourData.tour_stops.every(stop => 
          stop.media && stop.media.some(m => m.media_type === 'audio')
        );
      
      case 4: // Review
        return true;
      
      default:
        return false;
    }
  };

  // Update validation warnings
  useEffect(() => {
    if (currentStep >= 3) {
      validateMediaContent();
    }
  }, [tourData.tour_stops, currentStep]);

  const validateMediaContent = () => {
    const warnings: ValidationWarning[] = [];

    tourData.tour_stops.forEach((stop, index) => {
      if (index === tourData.tour_stops.length - 1) return; // Skip last stop

      const nextStop = tourData.tour_stops[index + 1];
      if (!stop.location || !nextStop.location) return;

      const distance = getDistanceBetweenPoints(
        { lat: stop.location.latitude, lng: stop.location.longitude },
        { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
      );

      const walkingTime = getWalkingTime(distance);
      const maxRecommendedAudioTime = Math.floor(walkingTime * 0.8);

      const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
      const totalAudioDuration = audioFiles.reduce((total, audio) => {
        return total + (audio.duration_seconds || 0);
      }, 0);

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

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      // Here you would submit to your API
      console.log('Submitting tour:', tourData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message or redirect
      alert('Tour submitted successfully! It will be reviewed before publication.');
      
    } catch (error) {
      console.error('Error submitting tour:', error);
      alert('Error submitting tour. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            tourData={tourData}
            onUpdate={handleTourDataUpdate}
          />
        );
      
      case 2:
        return (
          <RouteMapStep
            stops={tourData.tour_stops}
            onStopsUpdate={handleStopsUpdate}
          />
        );
      
      case 3:
        return (
          <MediaUploadStep
            stops={tourData.tour_stops}
            onStopsUpdate={handleStopsUpdate}
          />
        );
      
      case 4:
        return (
          <ReviewStep
            tourData={tourData}
            validationWarnings={validationWarnings}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      
      default:
        return null;
    }
  };

  const isCurrentStepValid = validateCurrentStep();
  const canProceed = isCurrentStepValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create New Tour Package
          </h1>
          <p className="text-gray-600">
            Share your local knowledge with travelers around the world
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
            <div className="p-8">
              {renderCurrentStep()}
            </div>

            {/* Navigation */}
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

        {/* Footer */}
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
