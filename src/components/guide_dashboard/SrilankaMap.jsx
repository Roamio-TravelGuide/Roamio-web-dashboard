import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { MAPBOX_ACCESS_TOKEN } from '../../utils/mapUtils';

// Initialize Mapbox token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const SriLankaMap = ({ tours }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState('');

  // Determine current season based on date
  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth() + 1; // January is 0
    
    // Sri Lanka's tropical seasons:
    // Winter (Dec-Feb) - Northeast monsoon
    // Spring (Mar-May) - Inter-monsoon
    // Summer (Jun-Aug) - Southwest monsoon
    // Autumn (Sep-Nov) - Inter-monsoon
    if (month === 12 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'autumn';
  };

  // Seasonal data for heatmap intensity
  const seasonalData = {
    winter: {
      'Sigiriya': 0.7,
      'Kandy': 0.6,
      'Colombo': 0.5,
      'Galle': 0.9,
      'Nuwara Eliya': 0.8,
      'Anuradhapura': 0.6,
      'Trincomalee': 0.4,
      'Jaffna': 0.3
    },
    spring: {
      'Sigiriya': 0.9,
      'Kandy': 0.8,
      'Colombo': 0.6,
      'Galle': 0.7,
      'Nuwara Eliya': 0.7,
      'Anuradhapura': 0.85,
      'Trincomalee': 0.5,
      'Jaffna': 0.4
    },
    summer: {
      'Sigiriya': 0.6,
      'Kandy': 0.5,
      'Colombo': 0.4,
      'Galle': 0.8,
      'Nuwara Eliya': 0.9,
      'Anuradhapura': 0.7,
      'Trincomalee': 0.7,
      'Jaffna': 0.6
    },
    autumn: {
      'Sigiriya': 0.8,
      'Kandy': 0.9,
      'Colombo': 0.7,
      'Galle': 0.7,
      'Nuwara Eliya': 0.8,
      'Anuradhapura': 0.8,
      'Trincomalee': 0.6,
      'Jaffna': 0.5
    }
  };

  // Location coordinates
  const locations = {
    'Sigiriya': [80.7607, 7.9579],
    'Kandy': [80.6337, 7.2906],
    'Colombo': [79.8612, 6.9271],
    'Galle': [80.2210, 6.0535],
    'Nuwara Eliya': [80.7829, 6.9497],
    'Anuradhapura': [80.4029, 8.3114],
    'Trincomalee': [81.2335, 8.5692],
    'Jaffna': [80.0275, 9.6615]
  };

  useEffect(() => {
    // Set current season when component mounts
    const season = getCurrentSeason();
    setCurrentSeason(season);

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.7718, 7.8731], // Sri Lanka center
      zoom: 7,
      maxBounds: [[79, 5], [82, 10]] // Bounds for Sri Lanka
    });

    map.current.on('load', () => {
      setLoading(false);
      updateHeatmap(season);
    });

    return () => map.current?.remove();
  }, []);

  const updateHeatmap = (season) => {
    if (!map.current) return;

    // Remove existing layers
    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
      map.current.removeSource('heatmap-data');
    }

    // Clear all markers
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

    // Prepare heatmap data
    const heatmapData = {
      type: 'FeatureCollection',
      features: Object.entries(seasonalData[season]).map(([location, intensity]) => ({
        type: 'Feature',
        properties: {
          intensity,
          name: location
        },
        geometry: {
          type: 'Point',
          coordinates: locations[location]
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
          0, 2,
          9, 20
        ],
        'heatmap-opacity': 0.8
      }
    });

    // Add markers for each location
    Object.entries(locations).forEach(([name, coords]) => {
      const marker = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${name}</h3>
            <p>Current popularity: ${(seasonalData[season][name] * 100).toFixed(0)}%</p>
            <p class="text-sm text-gray-600">${getSeasonDescription(season)}</p>
          </div>
        `))
        .addTo(map.current);
    });
  };

  const getSeasonDescription = (season) => {
    switch(season) {
      case 'winter': return 'Dec-Feb: Northeast monsoon, best for south/west coasts';
      case 'spring': return 'Mar-May: Inter-monsoon, ideal for cultural sites';
      case 'summer': return 'Jun-Aug: Southwest monsoon, hill country escapes';
      case 'autumn': return 'Sep-Nov: Inter-monsoon, festival season';
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
        <h3 className="text-lg font-semibold text-gray-800">Tourist Activity Heatmap</h3>
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
              <p className="mt-2 text-gray-600">Loading seasonal data...</p>
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
          {getSeasonDescription(currentSeason)}
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