import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CoreMap } from '../map/CoreMap';
import { StopDetailsForm } from './StopDetailsForm';
import { StopList } from './StopList';
import { reverseGeocode } from '../../utils/mapUtils';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

export const RouteMapStep = ({ 
  packageId = 1,
  stops = [], 
  onStopsUpdate,
  selectedStopId: externalSelectedStopId,
  onSelectStop: externalOnSelectStop,
  isEditable = true
}) => {
  // State management
  const [internalStops, setInternalStops] = useState(stops);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [nextId, setNextId] = useState(1);

  // Use ref to track previous stops to prevent infinite loop
  const previousStopsRef = useRef(stops);

  // FIX: Initialize stops only when stops prop actually changes
  useEffect(() => {
    // Compare current stops with previous stops using ref
    const stopsChanged = JSON.stringify(stops) !== JSON.stringify(previousStopsRef.current);
    
    if (stopsChanged) {
      setInternalStops(stops);
      previousStopsRef.current = stops;
      
      if (stops.length > 0) {
        const maxId = Math.max(...stops.map(s => s.id || 0), 0);
        setNextId(maxId + 1);
      }
    }
  }, [stops]); // Only depend on stops

  // Memoized sorted stops
  const sortedStops = useMemo(() => 
    [...internalStops].sort((a, b) => a.sequence_no - b.sequence_no), 
    [internalStops]
  );

  const currentSelectedStopId = externalSelectedStopId !== undefined 
    ? externalSelectedStopId 
    : selectedStop?.id || null;

  // FIX: Update stops without causing infinite loop
  const updateStops = useCallback((newStops) => {
    setInternalStops(newStops);
    
    // Only call onStopsUpdate if stops actually changed
    const stopsChanged = JSON.stringify(newStops) !== JSON.stringify(previousStopsRef.current);
    if (stopsChanged) {
      onStopsUpdate?.(newStops);
    }
  }, [onStopsUpdate]);

  // Handle map click to add new stop
  const handleMapClick = useCallback(async (event) => {
    if (!event.lngLat || !isEditable) return;
    
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
        package_id: packageId,
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
      externalOnSelectStop?.(newStop);
    } finally {
      setIsGeocoding(false);
    }
  }, [isEditable, internalStops, nextId, packageId, updateStops, externalOnSelectStop]);

  // Handle marker click to select stop
  const handleMarkerClick = useCallback((stop) => {
    if (!isEditable) return;
    setSelectedStop(stop);
    setIsEditing(true);
    externalOnSelectStop?.(stop);
  }, [isEditable, externalOnSelectStop]);

  // Save stop changes
  const handleSaveStop = useCallback((updatedStop) => {
    if (!isEditable) return;
    
    const updatedStops = internalStops.map(stop => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(updatedStop);
    externalOnSelectStop?.(updatedStop);
    toast.success('Stop updated successfully');
  }, [isEditable, internalStops, updateStops, externalOnSelectStop]);

  // Delete a stop
  const handleDeleteStop = useCallback((stopId) => {
    if (!isEditable) return;
    
    const updatedStops = internalStops
      .filter(stop => stop.id !== stopId)
      .map((stop, index) => ({
        ...stop,
        sequence_no: index + 1
      }));
      
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(null);
    externalOnSelectStop?.(null);
    toast.success('Stop deleted successfully');
  }, [isEditable, internalStops, updateStops, externalOnSelectStop]);

  // Reorder stops
  const handleReorderStops = useCallback((newOrder) => {
    if (!isEditable) return;
    
    const updatedStops = newOrder.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));
    
    updateStops(updatedStops);
    toast.success('Stops reordered successfully');
  }, [isEditable, updateStops]);

  // Select a stop from the list
  const handleStopSelect = useCallback((stop) => {
    if (!isEditable) return;
    setSelectedStop(stop);
    setIsEditing(true);
    externalOnSelectStop?.(stop);
  }, [isEditable, externalOnSelectStop]);

  return (
    <div className="flex flex-col h-full gap-4 rounded-xl">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        {isGeocoding && (
          <div className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
            <LoadingSpinner className="w-4 h-4 mr-2" />
            Processing location...
          </div>
        )}
        {!isEditable && (
          <div className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full">
            View mode - editing disabled
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 min-h-[500px]">
        {/* Stop List Panel */}
        {(internalStops.length > 0 || isEditing) && (
          <div className="w-72">
            <StopList
              stops={internalStops}
              selectedStopId={currentSelectedStopId}
              onStopSelect={handleStopSelect}
              onReorder={isEditable ? handleReorderStops : null}
              isEditable={isEditable}
            />
          </div>
        )}

        {/* Map Panel */}
        <div className={`relative bg-white border border-gray-200 shadow-xs rounded-xl ${
          internalStops.length > 0 || isEditing 
            ? 'flex-1' 
            : 'w-full h-[600px]'
        }`}>
          <CoreMap
            stops={sortedStops}
            selectedStopId={currentSelectedStopId}
            onMarkerClick={isEditable ? handleMarkerClick : null}
            onMapClick={isEditable ? handleMapClick : null}
            isGeocoding={isGeocoding}
          />
        </div>

        {/* Stop Details Panel */}
        {isEditing && selectedStop && (
          <div className="w-96">
            <StopDetailsForm
              stop={selectedStop}
              onSave={isEditable ? handleSaveStop : null}
              onDelete={isEditable ? handleDeleteStop : null}
              onCancel={() => setIsEditing(false)}
              isEditable={isEditable}
            />
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        {isEditable ? (
          "Tip: Click on the map to add a new stop, or click on existing stops to edit them."
        ) : (
          "View mode: Editing is disabled for this tour status."
        )}
      </div>
    </div>
  );
};