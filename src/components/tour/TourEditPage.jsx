import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { BasicInfoStep } from './BasicInfoStep';
import { RouteMapStep } from './RouteMapStep';
import { MediaUploadStep } from './MediaUploadStep';

const API_BASE_URL = 'http://localhost:3001/api/v1';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_approval: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Approval' },
    published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export const TourEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/tour-packages/${id}`);
        setTour(response.data.data);
      } catch (error) {
        console.error('Error fetching tour:', error);
        setError(error.response?.data?.message || 'Failed to load tour');
        toast.error('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleUpdateTour = (updates) => {
    setTour(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateStops = (stops) => {
    setTour(prev => ({ ...prev, tour_stops: stops }));
  };

  const validateTour = () => {
    const errors = [];
    
    if (!tour?.title?.trim()) {
      errors.push('Tour title is required');
    }
    
    if (!tour?.description?.trim()) {
      errors.push('Tour description is required');
    }
    
    if (!tour?.tour_stops || tour.tour_stops.length < 2) {
      errors.push('At least two tour stops are required');
    } else {
      tour.tour_stops.forEach((stop, index) => {
        if (!stop.stop_name?.trim()) {
          errors.push(`Stop ${index + 1} name is required`);
        }
        
        if (!stop.location) {
          errors.push(`Stop ${index + 1} location is required`);
        }
        
        const audioFiles = stop.media?.filter(m => m.media_type === 'audio') || [];
        if (audioFiles.length === 0) {
          errors.push(`Stop ${index + 1} needs at least one audio file`);
        }
      });
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSaveTour = async () => {
    // if (!validateTour()) {
    //   toast.error('Please fix validation errors before saving');
    //   return;
    // }

    setIsSaving(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/tour-packages/edit/${id}`, {
        tour: {
          title: tour.title,
          description: tour.description,
          status: 'rejected',
          cover_image_temp_id: tour.cover_image_temp?.tempId,
          tour_stops_attributes: tour.tour_stops?.map(stop => ({
            id: stop.id,
            sequence_no: stop.sequence_no,
            stop_name: stop.stop_name,
            description: stop.description,
            location_attributes: stop.location,
            media_attributes: stop.media?.map(media => ({
              id: media.id,
              media_type: media.media_type,
              temp_id: media.tempId,
              description: media.description,
              _destroy: false
            }))
          }))
        }
      });

      console.log(tour)
      toast.success('Tour updated successfully!');
      navigate(`/guide/tours/${id}`);
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error(error.response?.data?.message || 'Failed to save tour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    // if (!validateTour()) {
    //   toast.error('Please fix validation errors before submitting');
    //   return;
    // }

    try {
      setIsSaving(true);
      await handleSaveTour();
      
      const response = await axios.post(`${API_BASE_URL}/tour-packages/${id}/submit_for_approval`);
      toast.success('Tour submitted for approval!');
      navigate(`/guide/tours/${id}`);
    } catch (error) {
      console.error('Error submitting tour:', error);
      toast.error(error.response?.data?.message || 'Failed to submit tour');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen p-6">
        <div className="p-4 rounded-lg bg-red-50">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            <h3 className="text-red-800">{error || 'Tour not found'}</h3>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center mt-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to tours
          </button>
        </div>
      </div>
    );
  }

  const isEditable = ['draft', 'rejected'].includes(tour.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tour
          </button>

          <div className="flex items-center space-x-4">
            <StatusBadge status={tour.status} />
            
            {isEditable && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveTour}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Draft
                </button>

                {tour.status === 'draft' && (
                  <button
                    onClick={handleSubmitForApproval}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-70"
                  >
                    Submit for Approval
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky z-10 bg-white border-b border-gray-200 top-16">
        <div className="container px-6 mx-auto">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveStep('basic')}
              className={`px-1 py-4 text-sm font-medium border-b-2 ${activeStep === 'basic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveStep('route')}
              className={`px-1 py-4 text-sm font-medium border-b-2 ${activeStep === 'route' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Route & Stops
            </button>
            <button
              onClick={() => setActiveStep('media')}
              className={`px-1 py-4 text-sm font-medium border-b-2 ${activeStep === 'media' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Media Content
            </button>
          </nav>
        </div>
      </div>

      <div className="container px-6 py-8 mx-auto">
        {/* {validationErrors.length > 0 && (
          <div className="p-4 mb-6 rounded-lg bg-red-50">
            <h3 className="flex items-center mb-2 font-medium text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Fix these issues to continue
            </h3>
            <ul className="ml-6 list-disc">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">{error}</li>
              ))}
            </ul>
          </div>
        )} */}

        {activeStep === 'basic' && (
          <BasicInfoStep 
            tourData={tour}
            onUpdate={handleUpdateTour}
            isEditable={isEditable}
          />
        )}

        {activeStep === 'route' && (
          <RouteMapStep
            stops={tour.tour_stops || []}
            onStopsUpdate={handleUpdateStops}
            isEditable={isEditable}
          />
        )}

        {activeStep === 'media' && (
          <MediaUploadStep
            stops={tour.tour_stops || []}
            onStopsUpdate={handleUpdateStops}
            isEditable={isEditable}
          />
        )}
      </div>
    </div>
  );
};