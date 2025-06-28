// hooks/useGoogleMaps.ts
import { useCallback } from 'react';

export const useGoogleMaps = () => {
  const getDistanceBetweenPoints = useCallback(
    (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
      if (typeof google === 'undefined') return 0;
      
      return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(point1.lat, point1.lng),
        new google.maps.LatLng(point2.lat, point2.lng)
      );
    },
    []
  );

  const getWalkingTime = useCallback((distanceInMeters: number) => {
    // Average walking speed: 1.4 m/s (about 5 km/h)
    return Math.ceil(distanceInMeters / 1.4); // returns time in seconds
  }, []);

  const getDirections = useCallback(async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints: Array<{ lat: number; lng: number }>
  ) => {
    if (typeof google === 'undefined') return null;

    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints.map(waypoint => ({
          location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
          stopover: true
        })),
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: true
      });
      
      return {
        distance: result.routes[0].legs.reduce(
          (total, leg) => total + (leg.distance?.value || 0), 0
        ),
        duration: result.routes[0].legs.reduce(
          (total, leg) => total + (leg.duration?.value || 0), 0
        ),
        path: result.routes[0].overview_path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }))
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }, []);

  return {
    getDistanceBetweenPoints,
    getWalkingTime,
    getDirections
  };
};