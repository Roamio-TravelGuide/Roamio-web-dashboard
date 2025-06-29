import { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

interface Location {
  latitude: number;
  longitude: number;
}

interface TourStop {
  id: string;
  title: string;
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
    if (!directionsService || !directionsRenderer) return;

    // Clear existing polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (stops.length < 2) {
      directionsRenderer.setMap(null);
      return;
    }

    const waypoints = stops
      .slice(1, -1)
      .map(stop => ({
        location: { lat: stop.location.latitude, lng: stop.location.longitude },
        stopover: true
      }));

    const origin = {
      lat: stops[0].location.latitude,
      lng: stops[0].location.longitude
    };
    const destination = {
      lat: stops[stops.length - 1].location.latitude,
      lng: stops[stops.length - 1].location.longitude
    };

    directionsService.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.WALKING,
      optimizeWaypoints: true
    })
    .then(response => {
      directionsRenderer.setDirections(response);
    })
    .catch(error => {
      console.error('Directions request failed:', error);
      drawStraightLines(stops, map);
    });

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [directionsService, directionsRenderer, stops]);

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
  onDelete: (stopId: string) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<TourStop>(stop);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Stop Name</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <div className="mt-1 text-sm text-gray-600">
          Lat: {formData.location.latitude.toFixed(6)}, Lng: {formData.location.longitude.toFixed(6)}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => onDelete(stop.id)}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function StopList({
  stops,
  selectedStopId,
  onStopSelect,
  onReorder
}: {
  stops: TourStop[];
  selectedStopId: string | null;
  onStopSelect: (stop: TourStop) => void;
  onReorder: (newStops: TourStop[]) => void;
}) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const newStops = [...stops];
    const draggedItem = newStops[dragItem.current];
    newStops.splice(dragItem.current, 1);
    newStops.splice(dragOverItem.current, 0, draggedItem);

    dragItem.current = null;
    dragOverItem.current = null;

    onReorder(newStops);
  };

  return (
    <div className="w-64 p-4 overflow-y-auto bg-white border rounded-lg shadow-lg">
      <h3 className="mb-4 font-bold">Tour Stops</h3>
      <ul className="space-y-2">
        {stops.map((stop, index) => (
          <li
            key={stop.id}
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
              {index + 1}
            </span>
            <span className="truncate">{stop.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RouteMapStep({ stops, onStopsUpdate }: { 
  stops: TourStop[]; 
  onStopsUpdate: (stops: TourStop[]) => void 
}) {
  const [selectedStop, setSelectedStop] = useState<TourStop | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleMapClick = (event: MapClickEvent) => {
    if (!event.detail?.latLng) return;
    
    const clickedPos = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng
    };

    const newStop: TourStop = {
      id: Date.now().toString(),
      title: `Stop ${stops.length + 1}`,
      description: '',
      location: {
        latitude: clickedPos.lat,
        longitude: clickedPos.lng
      }
    };
    onStopsUpdate([...stops, newStop]);
    setSelectedStop(newStop);
    setIsEditing(true);
  };

  const handleMarkerClick = (stop: TourStop) => {
    setSelectedStop(stop);
    setIsEditing(true);
  };

  const handleSaveStop = (updatedStop: TourStop) => {
    const updatedStops = stops.map(stop => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    onStopsUpdate(updatedStops);
    setIsEditing(false);
  };

  const handleDeleteStop = (stopId: string) => {
    const updatedStops = stops.filter(stop => stop.id !== stopId);
    onStopsUpdate(updatedStops);
    setIsEditing(false);
    setSelectedStop(null);
  };

  const handleReorderStops = (newOrder: TourStop[]) => {
    onStopsUpdate(newOrder);
  };

  return (
    <div className="flex h-[500px] w-full gap-4">
      <StopList
        stops={stops}
        selectedStopId={selectedStop?.id || null}
        onStopSelect={(stop) => {
          setSelectedStop(stop);
          setIsEditing(true);
        }}
        onReorder={handleReorderStops}
      />

      <div className="relative flex-1 overflow-hidden border rounded-lg">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            defaultCenter={{ lat: 6.9271, lng: 79.8612 }}
            defaultZoom={12}
            onClick={handleMapClick}
            gestureHandling="greedy"
          >
            <DirectionsRenderer stops={stops} />
            
            {stops.map((stop, index) => (
              <AdvancedMarker
                key={stop.id}
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
                  {index + 1}
                </Pin>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
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