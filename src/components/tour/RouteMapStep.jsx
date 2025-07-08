import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LoadingSpinner from '../ui/LoadingSpinner';

// Set your Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWJkdWwwMTEiLCJhIjoiY21jYnN5OXl0MDBvMDJrc2I1MjU2Z28yZSJ9.jzJqzPye1bItMiZf7Tyzhg';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Mock toast for error handling since it's not imported
const toast = {
  error: (message) => {
    console.error(message);
    alert(message);
  }
};

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
      new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        limit: '1',
        types: 'address,place,region,postcode,locality,neighborhood',
        country: 'lk'
      });

    const response = await fetch(url);
    const data = await response.json();

    if (!data.features?.length) throw new Error('No results found');

    const feature = data.features[0];
    console.log('Raw geocoding data:', feature); // Debug log

    // Sri Lanka-specific parsing
    const address = feature.place_name || '';
    let city = '';
    let province = '';
    let district = '';
    let postal_code = '';

    // Parse context items
    if (feature.context) {
      feature.context.forEach((ctx) => {
        const [type] = ctx.id.split('.');
        if (type === 'region') province = ctx.text; // Western Province
        if (type === 'district') district = ctx.text;
        if (type === 'postcode') postal_code = ctx.text;
        if (type === 'place') city = ctx.text;
      });
    }

    // Colombo-specific fallbacks
    if (!province && address.includes('Colombo')) {
      province = 'Western Province';
      district = 'Colombo District';
    }

    return {
      longitude: lng,
      latitude: lat,
      address,
      city: city || 'Colombo',
      province: province || 'Western Province',
      district: district || 'Colombo District',
      postal_code
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      longitude: lng,
      latitude: lat,
      address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      city: 'Colombo',
      province: 'Western Province',
      district: 'Colombo District'
    };
  }
}

function MapboxMap({ 
  stops, 
  onMapClick, 
  onMarkerClick, 
  selectedStopId 
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const routeSourceId = 'route';

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [79.8612, 6.9271], // Colombo, Sri Lanka
      zoom: 12
    });

    // Add click handler if onMapClick is provided
    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick({
          lngLat: {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng
          }
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onMapClick]);

  // Update markers when stops change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    stops.forEach((stop) => {
      if (!stop.location || typeof stop.location.longitude !== 'number' || typeof stop.location.latitude !== 'number') return;
      const el = document.createElement('div');
      el.className = 'custom-marker';
      const isSelected = selectedStopId === stop.id;
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${isSelected ? '#F59E42' : '#3B82F6'};
        border: 2px solid ${isSelected ? '#EA580C' : '#1E40AF'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ${isSelected ? 'transform: scale(1.3); box-shadow: 0 4px 12px 2px #EA580C55;' : ''}
        z-index: ${isSelected ? 10 : 1};
      `;
      el.textContent = stop.sequence_no?.toString() || '';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onMarkerClick(stop);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([stop.location.longitude, stop.location.latitude])
        .addTo(map.current);

      if (stop.id) {
        markersRef.current[stop.id.toString()] = marker;
      }
    });

    // Zoom to selected stop when it changes
    if (selectedStopId) {
      const stop = stops.find(s => s.id === selectedStopId);
      if (stop && stop.location && typeof stop.location.longitude === 'number' && typeof stop.location.latitude === 'number') {
        map.current.flyTo({
          center: [stop.location.longitude, stop.location.latitude],
          zoom: 16,
          speed: 1.2,
          curve: 1.4,
          essential: true
        });
      }
    }
  }, [stops, onMarkerClick, selectedStopId]);

  // Update route when stops change
  useEffect(() => {
    if (!map.current) return;

    const drawRoute = async () => {
      if (stops.length < 2) {
        // Remove existing route
        if (map.current.getSource(routeSourceId)) {
          map.current.removeLayer(routeSourceId);
          map.current.removeSource(routeSourceId);
        }
        return;
      }

      try {
        // Sort stops by sequence_no
        const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);
        
        // Build coordinates string for Mapbox Directions API
        const coordinates = sortedStops
          .map(stop => `${stop.location.longitude},${stop.location.latitude}`)
          .join(';');

        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?` +
          new URLSearchParams({
            access_token: MAPBOX_ACCESS_TOKEN,
            geometries: 'geojson',
            overview: 'full'
          });

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Remove existing route
          if (map.current.getSource(routeSourceId)) {
            map.current.removeLayer(routeSourceId);
            map.current.removeSource(routeSourceId);
          }

          // Add new route
          map.current.addSource(routeSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });

          map.current.addLayer({
            id: routeSourceId,
            type: 'line',
            source: routeSourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3B82F6',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
        } else {
          // Fallback to straight lines
          drawStraightLines(sortedStops);
        }
      } catch (error) {
        console.error('Directions request failed:', error);
        // Fallback to straight lines
        const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);
        drawStraightLines(sortedStops);
      }
    };

    const drawStraightLines = (sortedStops) => {
      if (sortedStops.length < 2) return;

      const coordinates = [];
      for (let i = 0; i < sortedStops.length - 1; i++) {
        coordinates.push([
          sortedStops[i].location.longitude,
          sortedStops[i].location.latitude
        ]);
        coordinates.push([
          sortedStops[i + 1].location.longitude,
          sortedStops[i + 1].location.latitude
        ]);
      }

      // Remove existing route
      if (map.current.getSource(routeSourceId)) {
        map.current.removeLayer(routeSourceId);
        map.current.removeSource(routeSourceId);
      }

      // Add straight line route
      map.current.addSource(routeSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      map.current.addLayer({
        id: routeSourceId,
        type: 'line',
        source: routeSourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3B82F6',
          'line-width': 3,
          'line-opacity': 0.7
        }
      });
    };

    drawRoute();
  }, [stops]);

  // Fit bounds when stops change
  useEffect(() => {
    if (!map.current || stops.length === 0) return;

    if (stops.length === 1) {
      map.current.flyTo({
        center: [stops[0].location.longitude, stops[0].location.latitude],
        zoom: 15
      });
    } else {
      const bounds = new mapboxgl.LngLatBounds();
      stops.forEach(stop => {
        bounds.extend([stop.location.longitude, stop.location.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [stops]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

function StopDetailsForm({ 
  stop, 
  onSave, 
  onDelete,
  onCancel 
}) {
  const [formData, setFormData] = useState(stop);

  useEffect(() => {
    setFormData(stop);
  }, [stop]);

  const handleChange = (e) => {
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
            {formData.location.address || 'Address not available'}
          </div>
        </div>
        
        {formData.location.city && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <div className="mt-1 text-sm text-gray-600">
                {formData.location.city}
              </div>
            </div>
            
            {formData.location.district && (
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <div className="mt-1 text-sm text-gray-600">
                  {formData.location.district}
                </div>
              </div>
            )}
            
            {formData.location.province && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Province</label>
                <div className="mt-1 text-sm text-gray-600">
                  {formData.location.province}
                </div>
              </div>
            )}
            
            {formData.location.postal_code && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <div className="mt-1 text-sm text-gray-600">
                  {formData.location.postal_code}
                </div>
              </div>
            )}
          </div>
        )}
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
}) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Sort stops by sequence_no for display
  const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
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

// ...existing code...
export function RouteMapStep({ stops = [], selectedStopId, onSelectStop }) {
  // This is a function component, so hooks are valid here
  const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);
  // Handler for marker click
  const handleMarkerClick = (stop) => {
    if (onSelectStop) onSelectStop(stop);
  };
  return (
    <div className="w-full h-full min-h-[400px]">
      <MapboxMap
        stops={sortedStops}
        selectedStopId={selectedStopId}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}