import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Route, AlertCircle, Trash2 } from 'lucide-react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import type { TourStop, Location } from '../../types/tour';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RouteMapStepProps {
  stops: TourStop[];
  onStopsUpdate: (stops: TourStop[]) => void;
}

export const RouteMapStep: React.FC<RouteMapStepProps> = ({
  stops,
  onStopsUpdate
}) => {
  const {
    mapRef,
    map,
    isLoaded,
    loadError,
    addMarker,
    clearMarkers,
    calculateRoute,
    getDistanceBetweenPoints,
    getWalkingTime
  } = useGoogleMaps();

  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
  const [routeInfo, setRouteInfo] = useState<{distance: number; duration: number} | null>(null);

  const updateMarkers = useCallback(() => {
    if (!map || !isLoaded) return;

    clearMarkers();
    
    stops.forEach((stop, index) => {
      if (stop.location) {
        addMarker(
          { lat: stop.location.latitude, lng: stop.location.longitude },
          stop.stop_name || `Stop ${index + 1}`,
          index + 1
        );
      }
    });

    if (stops.length >= 2) {
      const waypoints = stops
        .filter(stop => stop.location)
        .map(stop => ({
          lat: stop.location!.latitude,
          lng: stop.location!.longitude
        }));

      calculateRoute(waypoints).then(result => {
        if (result) {
          const route = result.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;

          route.legs.forEach(leg => {
            totalDistance += leg.distance?.value || 0;
            totalDuration += leg.duration?.value || 0;
          });

          setRouteInfo({
            distance: totalDistance,
            duration: totalDuration
          });
        }
      });
    }
  }, [map, isLoaded, stops, addMarker, clearMarkers, calculateRoute]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || selectedStopIndex === null) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const updatedStops = [...stops];
    updatedStops[selectedStopIndex] = {
      ...updatedStops[selectedStopIndex],
      location: {
        latitude: lat,
        longitude: lng
      }
    };

    onStopsUpdate(updatedStops);
    setSelectedStopIndex(null);
  };

  useEffect(() => {
    if (map && selectedStopIndex !== null) {
      const clickListener = map.addListener('click', handleMapClick);
      map.setOptions({ cursor: 'crosshair' });

      return () => {
        google.maps.event.removeListener(clickListener);
        map.setOptions({ cursor: 'default' });
      };
    }
  }, [map, selectedStopIndex]);

  const addStop = () => {
    const newStop: TourStop = {
      tempId: Date.now().toString(),
      sequence_no: stops.length + 1,
      stop_name: `Stop ${stops.length + 1}`,
      description: ''
    };

    onStopsUpdate([...stops, newStop]);
  };

  const removeStop = (index: number) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    const reorderedStops = updatedStops.map((stop, i) => ({
      ...stop,
      sequence_no: i + 1
    }));
    
    onStopsUpdate(reorderedStops);
  };

  const updateStopName = (index: number, name: string) => {
    const updatedStops = [...stops];
    updatedStops[index] = { ...updatedStops[index], stop_name: name };
    onStopsUpdate(updatedStops);
  };

  const updateStopDescription = (index: number, description: string) => {
    const updatedStops = [...stops];
    updatedStops[index] = { ...updatedStops[index], description };
    onStopsUpdate(updatedStops);
  };

  const getWalkingTimeBetweenStops = (fromIndex: number, toIndex: number) => {
    const fromStop = stops[fromIndex];
    const toStop = stops[toIndex];
    
    if (!fromStop.location || !toStop.location) return 0;
    
    const distance = getDistanceBetweenPoints(
      { lat: fromStop.location.latitude, lng: fromStop.location.longitude },
      { lat: toStop.location.latitude, lng: toStop.location.longitude }
    );
    
    return getWalkingTime(distance);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Show error state if Google Maps failed to load
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Google Maps Failed to Load</h3>
          <p className="mb-4 text-gray-600">{loadError}</p>
          <div className="p-4 text-left border border-yellow-200 rounded-lg bg-yellow-50">
            <h4 className="mb-2 font-medium text-yellow-800">Possible Solutions:</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Check if the API key is valid</li>
              <li>• Ensure Maps JavaScript API is enabled</li>
              <li>• Verify billing is set up in Google Cloud Console</li>
              <li>• Check if localhost is allowed in API restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size={32} className="mb-4" />
          <p className="text-gray-600">Loading Google Maps...</p>
          <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Plan Your Route
        </h2>
        <p className="text-gray-600">
          Add stops and mark their locations on the map to create your tour route
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stops List */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Tour Stops</h3>
            <button
              onClick={addStop}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              + Add Stop
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-96">
            {stops.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <MapPin className="mx-auto mb-2" size={24} />
                <p>No stops added yet</p>
                <p className="text-sm">Click "Add Stop" to begin</p>
              </div>
            ) : (
              stops.map((stop, index) => (
                <div
                  key={stop.tempId || stop.id}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    selectedStopIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={stop.stop_name}
                        onChange={(e) => updateStopName(index, e.target.value)}
                        className="p-0 font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
                        placeholder="Stop name"
                      />
                    </div>
                    <button
                      onClick={() => removeStop(index)}
                      className="text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <textarea
                    value={stop.description || ''}
                    onChange={(e) => updateStopDescription(index, e.target.value)}
                    placeholder="Add description..."
                    rows={2}
                    className="w-full p-0 text-sm text-gray-600 bg-transparent border-none resize-none focus:outline-none focus:ring-0"
                  />

                  <div className="mt-3 space-y-2">
                    {!stop.location ? (
                      <button
                        onClick={() => setSelectedStopIndex(index)}
                        className={`w-full py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          selectedStopIndex === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedStopIndex === index ? 'Click on map to place' : 'Set Location'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <MapPin size={12} />
                          <span>Location set</span>
                        </div>
                        <button
                          onClick={() => setSelectedStopIndex(index)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Update
                        </button>
                      </div>
                    )}

                    {index > 0 && stops[index - 1].location && stop.location && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Route size={12} />
                        <span>
                          Walk time: {formatTime(getWalkingTimeBetweenStops(index - 1, index))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {routeInfo && (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <h4 className="mb-2 font-medium text-green-900">Route Summary</h4>
              <div className="space-y-1 text-sm text-green-800">
                <div>Total Distance: {formatDistance(routeInfo.distance)}</div>
                <div>Estimated Walking Time: {formatTime(routeInfo.duration)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 lg:h-[500px] rounded-lg border border-gray-300"
            />
            {selectedStopIndex !== null && (
              <div className="absolute px-4 py-2 bg-white border rounded-lg shadow-lg top-4 left-4">
                <div className="flex items-center space-x-2 text-sm">
                  <AlertCircle className="text-blue-500" size={16} />
                  <span className="font-medium">
                    Click on the map to place Stop {selectedStopIndex + 1}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {stops.length > 0 && stops.some(stop => !stop.location) && (
        <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-medium text-amber-900">Missing Locations</p>
              <p className="text-sm text-amber-700">
                Some stops don't have locations set. Click "Set Location" and then click on the map to place them.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};