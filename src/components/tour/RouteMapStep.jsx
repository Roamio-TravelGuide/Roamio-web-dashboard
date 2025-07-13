import React, { useState, useEffect } from 'react';
import { CoreMap } from '../map/CoreMap';
import { StopDetailsForm } from './StopDetailsForm';
import { StopList } from './StopList';
import { reverseGeocode } from '../../utils/mapUtils';
import LoadingSpinner from '../ui/LoadingSpinner';

export const RouteMapStep = ({ 
  packageId = 1,
  stops = [], 
  onStopsUpdate,
  selectedStopId: externalSelectedStopId,
  onSelectStop: externalOnSelectStop
}) => {
  const [internalStops, setInternalStops] = useState(stops);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    setInternalStops(stops);
    if (stops.length > 0) {
      const maxId = Math.max(...stops.map(s => s.id || 0));
      setNextId(maxId + 1);
    }
  }, [stops]);

  const updateStops = (newStops) => {
    setInternalStops(newStops);
    if (onStopsUpdate) {
      onStopsUpdate(newStops);
    }
  };

  const handleMapClick = async (event) => {
    if (!event.lngLat) return;
    
    setIsGeocoding(true);
    try {
      const clickedPos = {
        lat: event.lngLat.lat,
        lng: event.lngLat.lng
      };

      const location = await reverseGeocode(clickedPos.lat, clickedPos.lng);

      const newStop = {
        id: nextId,
        package_id: packageId,
        sequence_no: internalStops.length + 1,
        stop_name: `Stop ${internalStops.length + 1}`,
        description: '',
        location: location
      };
      
      setNextId(nextId + 1);
      updateStops([...internalStops, newStop]);
      setSelectedStop(newStop);
      setIsEditing(true);
      if (externalOnSelectStop) externalOnSelectStop(newStop);
    } catch (error) {
      console.error('Geocoding error:', error);
      
      const newStop = {
        id: nextId,
        package_id: packageId,
        sequence_no: internalStops.length + 1,
        stop_name: `Stop ${internalStops.length + 1}`,
        description: '',
        location: {
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          address: `Location at ${event.lngLat.lat.toFixed(6)}, ${event.lngLat.lng.toFixed(6)}`
        }
      };
      setNextId(nextId + 1);
      updateStops([...internalStops, newStop]);
      setSelectedStop(newStop);
      setIsEditing(true);
      if (externalOnSelectStop) externalOnSelectStop(newStop);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMarkerClick = (stop) => {
    setSelectedStop(stop);
    setIsEditing(true);
    if (externalOnSelectStop) externalOnSelectStop(stop);
  };

  const handleSaveStop = (updatedStop) => {
    const updatedStops = internalStops.map(stop => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(updatedStop);
    if (externalOnSelectStop) externalOnSelectStop(updatedStop);
  };

  const handleDeleteStop = (stopId) => {
    const updatedStops = internalStops
      .filter(stop => stop.id !== stopId)
      .map((stop, index) => ({
        ...stop,
        sequence_no: index + 1
      }));
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(null);
    if (externalOnSelectStop) externalOnSelectStop(null);
  };

  const handleReorderStops = (newOrder) => {
    const updatedStops = newOrder.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));
    updateStops(updatedStops);
  };

  const handleStopSelect = (stop) => {
    setSelectedStop(stop);
    setIsEditing(true);
    if (externalOnSelectStop) externalOnSelectStop(stop);
  };

  const currentSelectedStopId = externalSelectedStopId !== undefined 
    ? externalSelectedStopId 
    : selectedStop?.id || null;

  const sortedStops = [...internalStops].sort((a, b) => a.sequence_no - b.sequence_no);

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
        {/* Show StopList only if there are stops or we're editing */}
        {(internalStops.length > 0 || isEditing) && (
          <div className="w-72">
            <StopList
              stops={internalStops}
              selectedStopId={currentSelectedStopId}
              onStopSelect={handleStopSelect}
              onReorder={handleReorderStops}
            />
          </div>
        )}

        {/* Map container - takes remaining space */}
        <div className={`relative bg-white border border-gray-200 shadow-xs rounded-xl ${
          internalStops.length > 0 || isEditing 
            ? 'flex-1' 
            : 'w-full h-[600px]'
        }`}>
          <CoreMap
            stops={sortedStops}
            selectedStopId={currentSelectedStopId}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            isGeocoding={isGeocoding}
          />
        </div>

        {/* Show StopDetailsForm only when editing */}
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