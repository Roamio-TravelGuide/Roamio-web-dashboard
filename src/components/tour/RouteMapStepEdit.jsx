import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CoreMap } from '../map/CoreMap';
import { StopDetailsForm } from './StopDetailsForm';
import { StopList } from './StopList';
import { reverseGeocode } from '../../utils/mapUtils';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

export const RouteMapStepEdit = ({ 
  tourData,
  stops = [], 
  onStopsUpdate,
  onUpdate
}) => {
  const [internalStops, setInternalStops] = useState(stops);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    setInternalStops(stops);
    if (stops.length > 0) {
      const maxId = Math.max(...stops.map(s => s.id || 0), 0);
      setNextId(maxId + 1);
    }
  }, [stops]);

  const sortedStops = useMemo(() => 
    [...internalStops].sort((a, b) => a.sequence_no - b.sequence_no), 
    [internalStops]
  );

  const updateStops = useCallback((newStops) => {
    setInternalStops(newStops);
    onStopsUpdate(newStops);
  }, [onStopsUpdate]);

  const handleMapClick = useCallback(async (event) => {
    if (!event.lngLat) return;
    
    setIsGeocoding(true);
    try {
      const clickedPos = { lat: event.lngLat.lat, lng: event.lngLat.lng };
      let location;

      try {
        location = await reverseGeocode(clickedPos.lat, clickedPos.lng);
      } catch (error) {
        console.error('Geocoding error:', error);
        location = {
          longitude: clickedPos.lng,
          latitude: clickedPos.lat,
          address: `Location at ${clickedPos.lat.toFixed(6)}, ${clickedPos.lng.toFixed(6)}`
        };
      }

      const newStop = {
        id: nextId,
        package_id: tourData.id,
        sequence_no: internalStops.length + 1,
        stop_name: `Stop ${internalStops.length + 1}`,
        description: '',
        location
      };
      
      const updatedStops = [...internalStops, newStop];
      updateStops(updatedStops);
      setNextId(nextId + 1);
      setSelectedStop(newStop);
      setIsEditing(true);
    } finally {
      setIsGeocoding(false);
    }
  }, [internalStops, nextId, tourData.id, updateStops]);

  const handleMarkerClick = useCallback((stop) => {
    setSelectedStop(stop);
    setIsEditing(true);
  }, []);

  const handleSaveStop = useCallback((updatedStop) => {
    const updatedStops = internalStops.map(stop => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(updatedStop);
    toast.success('Stop updated successfully');
  }, [internalStops, updateStops]);

  const handleDeleteStop = useCallback((stopId) => {
    const updatedStops = internalStops
      .filter(stop => stop.id !== stopId)
      .map((stop, index) => ({
        ...stop,
        sequence_no: index + 1
      }));
      
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(null);
    toast.success('Stop deleted successfully');
  }, [internalStops, updateStops]);

  const handleReorderStops = useCallback((newOrder) => {
    const updatedStops = newOrder.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));
    
    updateStops(updatedStops);
    toast.success('Stops reordered successfully');
  }, [updateStops]);

  const handleStopSelect = useCallback((stop) => {
    setSelectedStop(stop);
    setIsEditing(true);
  }, []);

  return (
    <div className="flex flex-col h-full gap-4 rounded-xl">
      <div className="flex items-center justify-between">
        {isGeocoding && (
          <div className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
            <LoadingSpinner className="w-4 h-4 mr-2" />
            Processing location...
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-4 min-h-[500px]">
        {(internalStops.length > 0 || isEditing) && (
          <div className="w-72">
            <StopList
              stops={internalStops}
              selectedStopId={selectedStop?.id || null}
              onStopSelect={handleStopSelect}
              onReorder={handleReorderStops}
            />
          </div>
        )}

        <div className={`relative bg-white border border-gray-200 shadow-xs rounded-xl ${
          internalStops.length > 0 || isEditing 
            ? 'flex-1' 
            : 'w-full h-[600px]'
        }`}>
          <CoreMap
            stops={sortedStops}
            selectedStopId={selectedStop?.id || null}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            isGeocoding={isGeocoding}
          />
        </div>

        {isEditing && selectedStop && (
          <div className="w-96">
            <StopDetailsForm
              stop={selectedStop}
              onSave={handleSaveStop}
              onDelete={handleDeleteStop}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Tip: Click on the map to add a new stop, or click on existing stops to edit them.
      </div>
    </div>
  );
};