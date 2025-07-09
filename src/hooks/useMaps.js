import { useCallback } from 'react';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWJkdWwwMTEiLCJhIjoiY21jYnN5OXl0MDBvMDJrc2I1MjU2Z28yZSJ9.jzJqzPye1bItMiZf7Tyzhg';

export const useMapbox = () => {
  const getDistanceBetweenPoints = useCallback(
    (point1, point2) => {
      const R = 6371000;
      const dLat = (point2.lat - point1.lat) * Math.PI / 180;
      const dLng = (point2.lng - point1.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    },
    []
  );

  const getWalkingTime = useCallback((distanceInMeters) => {
    // Average walking speed: 1.4 m/s (about 5 km/h)
    return Math.ceil(distanceInMeters / 1.4); // returns time in seconds
  }, []);

  const getDirections = useCallback(async (origin, destination, waypoints = []) => {
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
        path: route.geometry.coordinates.map(coord => ({
          lat: coord[1],
          lng: coord[0]
        }))
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }, []);

  const geocode = useCallback(async (address) => {
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

  const reverseGeocode = useCallback(async (lat, lng) => {
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