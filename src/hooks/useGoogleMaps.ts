import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const useGoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setLoadError('Google Maps API key is missing');
      return;
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 7.8731, lng: 80.7718 },
          zoom: 8,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true
        });

        const directionsServiceInstance = new google.maps.DirectionsService();
        const directionsRendererInstance = new google.maps.DirectionsRenderer({
          draggable: true,
          suppressMarkers: true
        });

        directionsRendererInstance.setMap(mapInstance);

        setMap(mapInstance);
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
        setIsLoaded(true);
      }
    }).catch((error) => {
      setLoadError(`Failed to load Google Maps: ${error.message}`);
    });
  }, []);

  const addMarker = (position: google.maps.LatLngLiteral, title: string, stopNumber: number) => {
    if (!map) return null;

    const marker = new google.maps.Marker({
      position,
      map,
      title,
      label: {
        text: stopNumber.toString(),
        color: 'white',
        fontWeight: 'bold'
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#1E40AF',
        strokeWeight: 2,
        scale: 15
      }
    });

    setMarkers(prev => [...prev, marker]);
    return marker;
  };

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const calculateRoute = async (waypoints: google.maps.LatLngLiteral[]) => {
    if (!directionsService || !directionsRenderer || waypoints.length < 2) return null;

    try {
      const result = await directionsService.route({
        origin: waypoints[0],
        destination: waypoints[waypoints.length - 1],
        waypoints: waypoints.slice(1, -1).map(point => ({ location: point, stopover: true })),
        travelMode: google.maps.TravelMode.WALKING
      });

      directionsRenderer.setDirections(result);
      return result;
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    }
  };

  const getDistanceBetweenPoints = (point1: google.maps.LatLngLiteral, point2: google.maps.LatLngLiteral) => {
    if (!isLoaded) return 0;
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1.lat, point1.lng),
      new google.maps.LatLng(point2.lat, point2.lng)
    );
  };

  const getWalkingTime = (distanceInMeters: number) => {
    return Math.ceil(distanceInMeters / 1.4); // returns time in seconds
  };

  return {
    mapRef,
    map,
    isLoaded,
    loadError,
    addMarker,
    clearMarkers,
    calculateRoute,
    getDistanceBetweenPoints,
    getWalkingTime,
    markers
  };
};