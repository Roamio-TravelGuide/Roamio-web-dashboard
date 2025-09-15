import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { MAPBOX_ACCESS_TOKEN } from '../../utils/mapUtils';

// Initialize Mapbox token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const SriLankaMap = ({ tours = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState('');

  // Determine current season based on date
  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth() + 1; // January is 0
    
    if (month === 12 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'autumn';
  };

  // Major Sri Lankan cities with coordinates
  const majorCities = {
    'Colombo': [79.8612, 6.9271],
    'Kandy': [80.6337, 7.2906],
    'Galle': [80.2210, 6.0535],
    'Jaffna': [80.0275, 9.6615],
    'Negombo': [79.8370, 7.2099],
    'Trincomalee': [81.2335, 8.5692],
    'Anuradhapura': [80.4029, 8.3114],
    'Polonnaruwa': [81.0088, 7.9329],
    'Nuwara Eliya': [80.7829, 6.9497],
    'Ella': [81.0469, 6.8694],
    'Sigiriya': [80.7607, 7.9579],
    'Dambulla': [80.6510, 7.8567],
    'Matara': [80.5480, 5.9480],
    'Hikkaduwa': [80.0870, 6.1390],
    'Bentota': [79.9950, 6.4210],
    'Mirissa': [80.4540, 5.9460],
    'Arugam Bay': [81.8270, 6.8520]
  };

  // Calculate heat intensity based on tour data
  const calculateHeatIntensity = () => {
    const cityIntensity = {};
    
    // Initialize all cities with 0 intensity
    Object.keys(majorCities).forEach(city => {
      cityIntensity[city] = 0;
    });

    // Count tours for each city
    tours.forEach(tour => {
      // Check if tour has location data
      if (tour.location && tour.location.city) {
        const cityName = tour.location.city;
        if (cityIntensity.hasOwnProperty(cityName)) {
          cityIntensity[cityName] += 1;
        }
      }
      
      // Also check tour stops if available
      if (tour.tour_stops && Array.isArray(tour.tour_stops)) {
        tour.tour_stops.forEach(stop => {
          if (stop.location && stop.location.city) {
            const cityName = stop.location.city;
            if (cityIntensity.hasOwnProperty(cityName)) {
              cityIntensity[cityName] += 0.5; // Less weight for stops than main location
            }
          }
        });
      }
    });

    // Normalize intensities to 0-1 range
    const maxIntensity = Math.max(...Object.values(cityIntensity));
    const normalizedIntensity = {};
    
    Object.keys(cityIntensity).forEach(city => {
      normalizedIntensity[city] = maxIntensity > 0 
        ? cityIntensity[city] / maxIntensity 
        : 0.1; // Default minimal intensity for visibility
    });

    return normalizedIntensity;
  };

  useEffect(() => {
    // Set current season when component mounts
    const season = getCurrentSeason();
    setCurrentSeason(season);

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [80.7718, 7.8731], // Sri Lanka center [lng, lat]
      zoom: 7,
      maxBounds: [[79, 5], [82, 10]] // Bounds for Sri Lanka
    });

    map.current.on('load', () => {
      setLoading(false);
      updateHeatmap();
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    });

    map.current.on('error', (e) => {
      console.error('Mapbox error:', e.error);
      setLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [tours]);

  const updateHeatmap = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Remove existing layers and sources if they exist
    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
    }
    if (map.current.getSource('heatmap-data')) {
      map.current.removeSource('heatmap-data');
    }

    // Clear all markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Calculate intensity based on actual tour data
    const heatIntensity = calculateHeatIntensity();

    // Prepare heatmap data
    const heatmapData = {
      type: 'FeatureCollection',
      features: Object.entries(heatIntensity).map(([city, intensity]) => ({
        type: 'Feature',
        properties: {
          intensity,
          name: city,
          tourCount: Math.round(intensity * 10) // Approximate count for display
        },
        geometry: {
          type: 'Point',
          coordinates: majorCities[city]
        }
      }))
    };

    // Add heatmap source and layer
    map.current.addSource('heatmap-data', {
      type: 'geojson',
      data: heatmapData
    });

    map.current.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'heatmap-data',
      maxzoom: 15,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 0,
          1, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 30,
          9, 60
        ],
        'heatmap-opacity': 0.7
      }
    }, 'waterway-label');

    // Add markers for cities with tour activity
    Object.entries(heatIntensity).forEach(([city, intensity]) => {
      if (intensity > 0.1) { // Only show markers for cities with some activity
        // Create a custom marker element
        const el = document.createElement('div');
        el.className = 'heatmap-marker';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '2px solid white';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Create the marker
        new mapboxgl.Marker(el)
          .setLngLat(majorCities[city])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-bold text-sm mb-1">${city}</h3>
                <p class="text-xs mb-1">Tour Activity: ${Math.round(intensity * 100)}%</p>
                <p class="text-xs text-gray-600">Based on ${Math.round(intensity * 10)} tours</p>
              </div>
            `))
          .addTo(map.current);
      }
    });
  };

  const getSeasonDescription = () => {
    const season = getCurrentSeason();
    switch(season) {
      case 'winter': return 'Dec-Feb: Northeast monsoon season';
      case 'spring': return 'Mar-May: Inter-monsoon period';
      case 'summer': return 'Jun-Aug: Southwest monsoon season';
      case 'autumn': return 'Sep-Nov: Second inter-monsoon period';
      default: return '';
    }
  };

  const getSeasonName = (season) => {
    switch(season) {
      case 'winter': return 'Winter (Dec-Feb)';
      case 'spring': return 'Spring (Mar-May)';
      case 'summer': return 'Summer (Jun-Aug)';
      case 'autumn': return 'Autumn (Sep-Nov)';
      default: return '';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col mb-4 space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-800">Tour Activity Heatmap</h3>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Current Season: {getSeasonName(currentSeason)}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gray-100 rounded-lg h-80">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="w-12 h-12 mx-auto text-indigo-500 animate-pulse" />
              <p className="mt-2 text-gray-600">Loading tour data...</p>
            </div>
          </div>
        )}
        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        />
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          {getSeasonDescription()}
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
          <span>Low</span>
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default SriLankaMap;