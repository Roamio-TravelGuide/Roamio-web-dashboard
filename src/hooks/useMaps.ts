// // hooks/useGoogleMaps.ts
// import { useCallback } from 'react';

// export const useGoogleMaps = () => {
//   const getDistanceBetweenPoints = useCallback(
//     (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
//       if (typeof google === 'undefined') return 0;
      
//       return google.maps.geometry.spherical.computeDistanceBetween(
//         new google.maps.LatLng(point1.lat, point1.lng),
//         new google.maps.LatLng(point2.lat, point2.lng)
//       );
//     },
//     []
//   );

//   const getWalkingTime = useCallback((distanceInMeters: number) => {
//     // Average walking speed: 1.4 m/s (about 5 km/h)
//     return Math.ceil(distanceInMeters / 1.4); // returns time in seconds
//   }, []);

//   const getDirections = useCallback(async (
//     origin: { lat: number; lng: number },
//     destination: { lat: number; lng: number },
//     waypoints: Array<{ lat: number; lng: number }>
//   ) => {
//     if (typeof google === 'undefined') return null;

//     const directionsService = new google.maps.DirectionsService();
    
//     try {
//       const result = await directionsService.route({
//         origin: new google.maps.LatLng(origin.lat, origin.lng),
//         destination: new google.maps.LatLng(destination.lat, destination.lng),
//         waypoints: waypoints.map(waypoint => ({
//           location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
//           stopover: true
//         })),
//         travelMode: google.maps.TravelMode.WALKING,
//         optimizeWaypoints: true
//       });
      
//       return {
//         distance: result.routes[0].legs.reduce(
//           (total, leg) => total + (leg.distance?.value || 0), 0
//         ),
//         duration: result.routes[0].legs.reduce(
//           (total, leg) => total + (leg.duration?.value || 0), 0
//         ),
//         path: result.routes[0].overview_path.map(point => ({
//           lat: point.lat(),
//           lng: point.lng()
//         }))
//       };
//     } catch (error) {
//       console.error('Error getting directions:', error);
//       return null;
//     }
//   }, []);

//   return {
//     getDistanceBetweenPoints,
//     getWalkingTime,
//     getDirections
//   };
// };

// hooks/useMapbox.ts
import { useCallback } from 'react';

// You'll need to set your Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWJkdWwwMTEiLCJhIjoiY21jYnN5OXl0MDBvMDJrc2I1MjU2Z28yZSJ9.jzJqzPye1bItMiZf7Tyzhg';

export const useMapbox = () => {
  const getDistanceBetweenPoints = useCallback(
    (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
      // Haversine formula to calculate distance between two points
      const R = 6371000; // Earth's radius in meters
      const dLat = (point2.lat - point1.lat) * Math.PI / 180;
      const dLng = (point2.lng - point1.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; // Distance in meters
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
    waypoints: Array<{ lat: number; lng: number }> = []
  ) => {
    try {
      // Build coordinates string for Mapbox Directions API
      const coordinates = [
        `${origin.lng},${origin.lat}`,
        ...waypoints.map(wp => `${wp.lng},${wp.lat}`),
        `${destination.lng},${destination.lat}`
      ].join(';');

      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?` +
        new URLSearchParams({
          access_token: MAPBOX_ACCESS_TOKEN,
          geometries: 'geojson',
          overview: 'full',
          steps: 'true'
        });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        return null;
      }

      const route = data.routes[0];
      
      return {
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        path: route.geometry.coordinates.map((coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0]
        }))
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }, []);

  const geocode = useCallback(async (address: string) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
        new URLSearchParams({
          access_token: MAPBOX_ACCESS_TOKEN,
          limit: '1'
        });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return null;
      }

      const feature = data.features[0];
      return {
        lat: feature.center[1],
        lng: feature.center[0],
        formatted_address: feature.place_name
      };
    } catch (error) {
      console.error('Error geocoding:', error);
      return null;
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
        new URLSearchParams({
          access_token: MAPBOX_ACCESS_TOKEN,
          limit: '1'
        });

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return null;
      }

      const feature = data.features[0];
      return {
        formatted_address: feature.place_name,
        components: feature.context || []
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }, []);

  return {
    getDistanceBetweenPoints,
    getWalkingTime,
    getDirections,
    geocode,
    reverseGeocode
  };
};