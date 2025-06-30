import { useState, useRef, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// Type definitions
interface Location {
  latitude: number;
  longitude: number;
}

interface Stop {
  id: string;
  title: string;
  location: Location;
  media: any[];
  distanceToNext?: number;
  durationToNext?: number;
}

interface RouteMapStepProps {
  stops: Stop[];
  onStopsUpdate: (stops: Stop[]) => void;
}

export function RouteMapStep({ stops, onStopsUpdate }: RouteMapStepProps) {
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.DirectionsService) {
        setIsGoogleMapsLoaded(true);
        if (!directionsServiceRef.current) {
          directionsServiceRef.current = new google.maps.DirectionsService();
        }
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleMaps, 100);
      }
    };
    
    checkGoogleMaps();
  }, []);

  // Calculate route when stops change and Google Maps is loaded
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapRef.current || !directionsServiceRef.current) {
      return;
    }

    if (stops.length < 2) {
      setRoutePath([]);
      // Clear existing polyline
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    const calculateRoute = async () => {
      if (!directionsServiceRef.current || !mapRef.current) return;

      try {
        const waypoints = stops.slice(1, -1).map(stop => ({
          location: new google.maps.LatLng(stop.location.latitude, stop.location.longitude),
          stopover: true
        }));

        const request: google.maps.DirectionsRequest = {
          origin: new google.maps.LatLng(stops[0].location.latitude, stops[0].location.longitude),
          destination: new google.maps.LatLng(stops[stops.length - 1].location.latitude, stops[stops.length - 1].location.longitude),
          waypoints,
          travelMode: google.maps.TravelMode.WALKING,
          optimizeWaypoints: true
        };

        const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
          directionsServiceRef.current!.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          });
        });

        const path = result.routes[0].overview_path.map(p => ({
          lat: p.lat(),
          lng: p.lng()
        }));

        setRoutePath(path);

        // Create native Google Maps polyline
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        polylineRef.current = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#3B82F6',
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });

        polylineRef.current.setMap(mapRef.current);

        // Update stops with distance/duration info
        const updatedStops = stops.map((stop, index) => {
          if (index < stops.length - 1 && result.routes[0].legs[index]) {
            const leg = result.routes[0].legs[index];
            return {
              ...stop,
              distanceToNext: leg.distance?.value || 0,
              durationToNext: leg.duration?.value || 0
            };
          }
          return stop;
        });

        onStopsUpdate(updatedStops);
      } catch (error) {
        console.error("Directions request failed:", error);
        
        // Fallback to straight line between stops
        const path = stops.map(stop => ({
          lat: stop.location.latitude,
          lng: stop.location.longitude
        }));

        setRoutePath(path);

        // Create fallback polyline
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        polylineRef.current = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#EF4444',
          strokeOpacity: 0.6,
          strokeWeight: 3,
        });

        polylineRef.current.setMap(mapRef.current!);
      }
    };

    calculateRoute();
  }, [stops, isGoogleMapsLoaded]);

  // Cleanup polyline on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, []);

  const handleMapClick = (event: any) => {
    if (!event.detail?.latLng) return;
    
    const clickedPos = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng
    };
    
    const newStop: Stop = {
      id: Date.now().toString(),
      title: `Stop ${stops.length + 1}`,
      location: {
        latitude: clickedPos.lat,
        longitude: clickedPos.lng
      },
      media: []
    };
    onStopsUpdate([...stops, newStop]);
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Initialize DirectionsService when map loads
    if (window.google && window.google.maps && !directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
      setIsGoogleMapsLoaded(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[500px] w-full border rounded-lg overflow-hidden">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            defaultCenter={{ lat: 6.9271, lng: 79.8612 }}
            defaultZoom={12}
            onClick={handleMapClick}
            onLoad={handleMapLoad}
            gestureHandling="greedy"
          >
            {/* Markers */}
            {stops.map((stop, index) => (
              <AdvancedMarker
                key={stop.id}
                position={{
                  lat: stop.location.latitude,
                  lng: stop.location.longitude
                }}
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
      
      {/* Debug info */}
      {stops.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>Stops: {stops.length}</p>
          <p>Google Maps Loaded: {isGoogleMapsLoaded ? 'Yes' : 'No'}</p>
          <p>Route Points: {routePath.length}</p>
        </div>
      )}
    </div>
  );
}