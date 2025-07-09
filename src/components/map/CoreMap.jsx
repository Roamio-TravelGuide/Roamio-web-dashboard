import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from '../../utils/mapUtils';
import LoadingSpinner from '../ui/LoadingSpinner';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const LocationPinMarker = ({ stop, isSelected, onClick }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(stop);
      }}
      style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-out',
        transform: isSelected ? 'scale(1.8)' : 'scale(1.6)',
        zIndex: isSelected ? 10 : 1,
        filter: isSelected 
          ? 'drop-shadow(0 4px 8px rgba(56, 178, 172, 0.4))' 
          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
      }}
      aria-label={`${stop.stop_name} location marker`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isSelected ? (
          <>
            <defs>
              <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="url(#pinGradient)"
              stroke="#083344"
              strokeWidth="1.2"
            />
          </>
        ) : (
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth="1"
          />
        )}
      </svg>
      
      <div style={{
        position: 'absolute',
        fontSize: '10px',
        fontWeight: 'bold',
        marginTop: '-4px',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        ...(isSelected ? {
          color: '#e5e7eb'
        } : {
          background: 'linear-gradient(135deg, #0d9488, #2563eb)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        })
      }}>
        {stop.sequence_no}
      </div>
    </div>
  );
};

export const CoreMap = ({ 
  stops, 
  selectedStopId, 
  onMarkerClick, 
  onMapClick,
  isGeocoding = false
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const routeSourceId = 'route';

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/abdul011/cmct15o5w034v01s164a2gvjo',
      center: [79.8612, 6.9271],
      zoom: 12,
      pitch: 45,
      bearing: -20,
    });

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

    return () => map.current?.remove();
  }, [onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    stops.forEach((stop) => {
      if (!stop.location?.longitude || !stop.location?.latitude) return;
      
      const container = document.createElement('div');
      const root = createRoot(container);
      
      root.render(
        <LocationPinMarker 
          stop={stop}
          isSelected={selectedStopId === stop.id}
          onClick={onMarkerClick}
        />
      );

      const marker = new mapboxgl.Marker(container)
        .setLngLat([stop.location.longitude, stop.location.latitude])
        .addTo(map.current);

      markersRef.current[stop.id] = marker;
    });

    if (selectedStopId) {
      const stop = stops.find(s => s.id === selectedStopId);
      if (stop?.location) {
        map.current.flyTo({
          center: [stop.location.longitude, stop.location.latitude],
          zoom: 16,
          speed: 1.2,
          curve: 1.4
        });
      }
    }
  }, [stops, selectedStopId, onMarkerClick]);

  // Draw route
  useEffect(() => {
    if (!map.current) return;

    const drawRoute = async () => {
      if (stops.length < 2) {
        if (map.current.getSource(routeSourceId)) {
          map.current.removeLayer(routeSourceId);
          map.current.removeSource(routeSourceId);
        }
        return;
      }

      try {
        const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);
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
          
          if (map.current.getSource(routeSourceId)) {
            map.current.removeLayer(routeSourceId);
            map.current.removeSource(routeSourceId);
          }

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
              'line-color': '#008080',
              'line-width': 4,
              'line-opacity': 1
            }
          });
        }
      } catch (error) {
        console.error('Directions request failed:', error);
      }
    };

    drawRoute();
  }, [stops]);

  // Fit bounds
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {isGeocoding && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner size={32} className="text-blue-500" />
        </div>
      )}
    </div>
  );
};