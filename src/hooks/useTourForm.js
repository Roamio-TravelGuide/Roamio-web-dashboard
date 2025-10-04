import { useState, useCallback, useMemo, useEffect } from 'react';
import { useMapbox } from './useMaps';
import { calculateTourPrice, formatTime } from '../utils/tourUtils';
import { TOUR_CONSTANTS, VALIDATION_MESSAGES } from '../utils/tourConstants';

export const useTourForm = (initialStops = []) => {
  const [stops, setStops] = useState(initialStops);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const { getDistanceBetweenPoints, getWalkingTime } = useMapbox();

  // FIX: Sync with external stops when they change
  useEffect(() => {
    setStops(initialStops);
  }, [initialStops]);

  // Calculate derived values
  const { totalAudioDuration, totalImages, totalAudioFiles } = useMemo(() => {
    return stops.reduce((acc, stop) => {
      const audioFiles = stop.media?.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO && !m._deleted
      ) || [];
      
      const images = stop.media?.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.IMAGE && !m._deleted
      ) || [];

      return {
        totalAudioDuration: acc.totalAudioDuration + 
          audioFiles.reduce((total, audio) => total + (audio.duration_seconds || 0), 0),
        totalImages: acc.totalImages + images.length,
        totalAudioFiles: acc.totalAudioFiles + audioFiles.length
      };
    }, { totalAudioDuration: 0, totalImages: 0, totalAudioFiles: 0 });
  }, [stops]);

  const totalPrice = useMemo(() => 
    calculateTourPrice(totalAudioDuration), 
    [totalAudioDuration]
  );

  const totalMinutes = useMemo(() => 
    Math.round((totalAudioDuration / 60) * 100) / 100, 
    [totalAudioDuration]
  );

  // Validation
  const validateAudioDurations = useCallback(() => {
    const warnings = [];

    stops.forEach((stop, index) => {
      if (index === stops.length - 1) return;

      const nextStop = stops[index + 1];
      if (!stop.location || !nextStop.location) {
        warnings.push({
          stopIndex: index,
          message: VALIDATION_MESSAGES.NO_LOCATION,
          severity: 'error'
        });
        return;
      }

      const distance = getDistanceBetweenPoints(
        { lat: stop.location.latitude, lng: stop.location.longitude },
        { lat: nextStop.location.latitude, lng: nextStop.location.longitude }
      );

      const walkingTime = getWalkingTime(distance);
      const minRecommendedAudioTime = Math.floor(walkingTime * 0.8);

      const audioFiles = stop.media?.filter(m => 
        m.media_type === TOUR_CONSTANTS.MEDIA_TYPES.AUDIO && !m._deleted
      ) || [];
      
      const totalAudioDuration = audioFiles.reduce(
        (total, audio) => total + (audio.duration_seconds || 0), 0
      );

      // Required validation
      if (audioFiles.length === 0) {
        warnings.push({
          stopIndex: index,
          message: VALIDATION_MESSAGES.REQUIRED_AUDIO,
          severity: 'error'
        });
      }

      // Recommended validation
      if (totalAudioDuration < minRecommendedAudioTime) {
        warnings.push({
          stopIndex: index,
          message: `${VALIDATION_MESSAGES.INSUFFICIENT_AUDIO} ${formatTime(minRecommendedAudioTime)} (${formatTime(totalAudioDuration)} currently)`,
          severity: 'warning'
        });
      }
    });

    setValidationWarnings(warnings);
    return warnings;
  }, [stops, getDistanceBetweenPoints, getWalkingTime]);

  // Stop management
  const updateStops = useCallback((newStops) => {
    setStops(newStops);
  }, []);

  const addStop = useCallback((newStop) => {
    const updatedStops = [...stops, newStop];
    setStops(updatedStops);
    return updatedStops;
  }, [stops]);

  const updateStop = useCallback((stopId, updates) => {
    const updatedStops = stops.map(stop => 
      stop.id === stopId ? { ...stop, ...updates } : stop
    );
    setStops(updatedStops);
    return updatedStops;
  }, [stops]);

  const deleteStop = useCallback((stopId) => {
    const updatedStops = stops
      .filter(stop => stop.id !== stopId)
      .map((stop, index) => ({
        ...stop,
        sequence_no: index + 1
      }));
    setStops(updatedStops);
    return updatedStops;
  }, [stops]);

  const reorderStops = useCallback((newOrder) => {
    const updatedStops = newOrder.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));
    setStops(updatedStops);
    return updatedStops;
  }, []);

  return {
    // State
    stops,
    validationWarnings,
    
    // Calculated values
    totalAudioDuration,
    totalImages,
    totalAudioFiles,
    totalPrice,
    totalMinutes,
    
    // Actions
    updateStops,
    addStop,
    updateStop,
    deleteStop,
    reorderStops,
    validateAudioDurations,
    
    // Utilities
    getStopValidation: (stopIndex) => ({
      errors: validationWarnings.filter(w => 
        w.stopIndex === stopIndex && w.severity === 'error'
      ),
      warnings: validationWarnings.filter(w => 
        w.stopIndex === stopIndex && w.severity === 'warning'
      ),
      hasIssues: validationWarnings.some(w => 
        w.stopIndex === stopIndex && (w.severity === 'error' || w.severity === 'warning')
      )
    })
  };
};