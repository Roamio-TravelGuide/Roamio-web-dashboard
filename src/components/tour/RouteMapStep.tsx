import { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

import LoadingSpinner from '../ui/LoadingSpinner'

interface Location {
  id?: number;
  longitude: number;
  latitude: number;
  address?: string;
  city?: string;
  province?: string;
  district?: string;
  postal_code?: string;
}

interface TourStop {
  id?: number;
  package_id: number;
  sequence_no: number;
  stop_name: string;
  description?: string;
  location: Location;
}

interface MapClickEvent {
  detail?: {
    latLng?: {
      lat: number;
      lng: number;
    };
  };
}

// Mock toast for error handling since it's not imported
const toast = {
  error: (message: string) => {
    console.error(message);
    alert(message);
  }
};

async function reverseGeocode(lat: number, lng: number): Promise<Location> {
  const geocoder = new google.maps.Geocoder();
  const latLng = new google.maps.LatLng(lat, lng);
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const address = results[0].formatted_address || '';
        let city = '';
        let province = '';
        let district = '';
        let postal_code = '';

        for (const component of results[0].address_components) {
          const types = component.types;
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            province = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            district = component.long_name;
          } else if (types.includes('postal_code')) {
            postal_code = component.long_name;
          }
        }

        resolve({
          longitude: lng,
          latitude: lat,
          address,
          city,
          province,
          district,
          postal_code
        });
      } else {
        reject(new Error('Geocoding failed'));
      }
    });
  });
}

function DirectionsRenderer({ stops }: { stops: TourStop[] }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        zIndex: 1
      }
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !map) return;

    // Clear existing polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (stops.length < 2) {
      directionsRenderer.setMap(null);
      return;
    }

    // Sort stops by sequence_no to ensure correct order
    const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);

    const waypoints = sortedStops
      .slice(1, -1)
      .map(stop => ({
        location: { lat: stop.location.latitude, lng: stop.location.longitude },
        stopover: true
      }));

    const origin = {
      lat: sortedStops[0].location.latitude,
      lng: sortedStops[0].location.longitude
    };
    const destination = {
      lat: sortedStops[sortedStops.length - 1].location.latitude,
      lng: sortedStops[sortedStops.length - 1].location.longitude
    };

    directionsService.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.WALKING,
      optimizeWaypoints: false // Don't optimize to maintain sequence
    })
    .then(response => {
      directionsRenderer.setDirections(response);
    })
    .catch(error => {
      console.error('Directions request failed:', error);
      drawStraightLines(sortedStops, map);
    });

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [directionsService, directionsRenderer, stops, map]);

  const drawStraightLines = (stops: TourStop[], map: google.maps.Map) => {
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (stops.length < 2) return;

    for (let i = 0; i < stops.length - 1; i++) {
      const path = [
        { lat: stops[i].location.latitude, lng: stops[i].location.longitude },
        { lat: stops[i+1].location.latitude, lng: stops[i+1].location.longitude }
      ];

      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.7,
        strokeWeight: 3,
        map
      });

      polylinesRef.current.push(polyline);
    }
  };

  return null;
}

function StopDetailsForm({ 
  stop, 
  onSave, 
  onDelete,
  onCancel 
}: { 
  stop: TourStop; 
  onSave: (stop: TourStop) => void;
  onDelete: (stopId: number) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<TourStop>(stop);

  useEffect(() => {
    setFormData(stop);
  }, [stop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.stop_name.trim() === '') {
      alert('Stop name is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Stop Name</label>
        <input
          type="text"
          name="stop_name"
          value={formData.stop_name}
          onChange={handleChange}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Coordinates</label>
          <div className="mt-1 text-sm text-gray-600">
            Lat: {formData.location.latitude.toFixed(6)}, Lng: {formData.location.longitude.toFixed(6)}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 text-sm text-gray-600">
            {formData.location.address || 'Not available'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <div className="mt-1 text-sm text-gray-600">
              {formData.location.city || 'Not available'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">District</label>
            <div className="mt-1 text-sm text-gray-600">
              {formData.location.district || 'Not available'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <div className="mt-1 text-sm text-gray-600">
              {formData.location.province || 'Not available'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <div className="mt-1 text-sm text-gray-600">
              {formData.location.postal_code || 'Not available'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => stop.id && onDelete(stop.id)}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={!stop.id}
        >
          Delete
        </button>
        
        <div className="space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function StopList({
  stops,
  selectedStopId,
  onStopSelect,
  onReorder
}: {
  stops: TourStop[];
  selectedStopId: number | null;
  onStopSelect: (stop: TourStop) => void;
  onReorder: (newStops: TourStop[]) => void;
}) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sort stops by sequence_no for display
  const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const newStops = [...sortedStops];
    const draggedItem = newStops[dragItem.current];
    newStops.splice(dragItem.current, 1);
    newStops.splice(dragOverItem.current, 0, draggedItem);

    // Update sequence numbers
    const updatedStops = newStops.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));

    dragItem.current = null;
    dragOverItem.current = null;

    onReorder(updatedStops);
  };

  return (
    <div className="w-64 p-4 overflow-y-auto bg-white border rounded-lg shadow-lg">
      <h3 className="mb-4 font-bold">Tour Stops</h3>
      <ul className="space-y-2">
        {sortedStops.map((stop, index) => (
          <li
            key={stop.id || `temp-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => onStopSelect(stop)}
            className={`p-2 border rounded cursor-move hover:bg-gray-50 flex items-center ${
              selectedStopId === stop.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <span className="flex items-center justify-center w-6 h-6 mr-2 text-white bg-blue-500 rounded-full">
              {stop.sequence_no}
            </span>
            <span className="truncate">{stop.stop_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RouteMapStep({ 
  packageId = 1,
  stops = [], 
  onStopsUpdate 
}: { 
  packageId?: number;
  stops?: TourStop[]; 
  onStopsUpdate?: (stops: TourStop[]) => void 
}) {
  const [internalStops, setInternalStops] = useState<TourStop[]>(stops);
  const [selectedStop, setSelectedStop] = useState<TourStop | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [nextId, setNextId] = useState(1);

  // Update internal stops when props change
  useEffect(() => {
    setInternalStops(stops);
    if (stops.length > 0) {
      const maxId = Math.max(...stops.map(s => s.id || 0));
      setNextId(maxId + 1);
    }
  }, [stops]);

  const updateStops = (newStops: TourStop[]) => {
    setInternalStops(newStops);
    if (onStopsUpdate) {
      onStopsUpdate(newStops);
    }
  };

  const handleMapClick = async (event: MapClickEvent) => {
    if (!event.detail?.latLng) return;
    
    setIsGeocoding(true);
    try {
      const clickedPos = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng
      };

      const location = await reverseGeocode(clickedPos.lat, clickedPos.lng);

      const newStop: TourStop = {
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
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Could not fetch address details for this location');
      
      // Fallback with just coordinates
      const newStop: TourStop = {
        id: nextId,
        package_id: packageId,
        sequence_no: internalStops.length + 1,
        stop_name: `Stop ${internalStops.length + 1}`,
        description: '',
        location: {
          longitude: event.detail.latLng.lng,
          latitude: event.detail.latLng.lat
        }
      };
      setNextId(nextId + 1);
      updateStops([...internalStops, newStop]);
      setSelectedStop(newStop);
      setIsEditing(true);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMarkerClick = (stop: TourStop) => {
    setSelectedStop(stop);
    setIsEditing(true);
  };

  const handleSaveStop = (updatedStop: TourStop) => {
    const updatedStops = internalStops.map(stop => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(updatedStop);
  };

  const handleDeleteStop = (stopId: number) => {
    const updatedStops = internalStops
      .filter(stop => stop.id !== stopId)
      .map((stop, index) => ({
        ...stop,
        sequence_no: index + 1
      }));
    updateStops(updatedStops);
    setIsEditing(false);
    setSelectedStop(null);
  };

  const handleReorderStops = (newOrder: TourStop[]) => {
    const updatedStops = newOrder.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));
    updateStops(updatedStops);
  };

  const handleStopSelect = (stop: TourStop) => {
    setSelectedStop(stop);
    setIsEditing(true);
  };

  // Sort stops by sequence for display
  const sortedStops = [...internalStops].sort((a, b) => a.sequence_no - b.sequence_no);

  return (
    <div className="flex h-[500px] w-full gap-4">
      <StopList
        stops={internalStops}
        selectedStopId={selectedStop?.id || null}
        onStopSelect={handleStopSelect}
        onReorder={handleReorderStops}
      />

      <div className="relative flex-1 overflow-hidden border rounded-lg">
        <APIProvider 
          apiKey="AIzaSyD6PZc-Ep4OwjDJwdXEE9xh0ch2GdTK1ec"
          libraries={['routes', 'geocoding']}
        >
          <Map
            mapId="349683cf35b68ceb30607edb"
            defaultCenter={{ lat: 6.9271, lng: 79.8612 }}
            defaultZoom={12}
            onClick={handleMapClick}
            gestureHandling="greedy"
            style={{ width: '100%', height: '100%' }}
          >
            <DirectionsRenderer stops={sortedStops} />
            
            {sortedStops.map((stop, index) => (
              <AdvancedMarker
                key={stop.id || index}
                position={{
                  lat: stop.location.latitude,
                  lng: stop.location.longitude
                }}
                onClick={() => handleMarkerClick(stop)}
              >
                <Pin
                  background={'#3B82F6'}
                  borderColor={'#1E40AF'}
                  glyphColor={'#FFFFFF'}
                >
                  {stop.sequence_no}
                </Pin>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
        
        {isGeocoding && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-">
            <div className="flex flex-col items-center p-4 space-y-2 bg-white rounded-lg shadow-lg">
              <LoadingSpinner size={32} className="text-blue-500" />
              <p className="text-sm font-medium text-gray-700">Loading address details...</p>
            </div>
          </div>
        )}
      </div>

      {isEditing && selectedStop && (
        <div className="p-4 bg-white border rounded-lg shadow-lg w-80">
          <StopDetailsForm
            stop={selectedStop}
            onSave={handleSaveStop}
            onDelete={handleDeleteStop}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}