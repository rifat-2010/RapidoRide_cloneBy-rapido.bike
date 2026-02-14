import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Location } from '../types';

interface MapProps {
  center: Location;
  destination?: Location;
  markers?: Location[];
  showRoute?: boolean;
}

const MapComponent: React.FC<MapProps> = ({ center, destination, markers, showRoute }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false // Hide default zoom controls for cleaner look
      }).setView([center.lat, center.lng], 14);
      
      // Standard OpenStreetMap Tiles (Natural View)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update View and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    // Custom Neon Icons
    // We add a slight shadow to make them pop on the light map
    const createIcon = (color: string) => L.divIcon({
      className: 'custom-pin',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const iconUser = createIcon('#00E700'); // Neon Green
    const iconDest = createIcon('#ef4444'); // Red
    
    // Bike Icon
    // Removed 'invert' so it stays black/dark to be visible on the light map
    const iconBike = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        className: '' // Standard black icon for light map
    });

    // Add Center Marker (User)
    const centerMarker = L.marker([center.lat, center.lng], { icon: iconUser }).addTo(map);
    markersRef.current.push(centerMarker);

    // Add Destination Marker
    if (destination) {
      const destMarker = L.marker([destination.lat, destination.lng], { icon: iconDest }).addTo(map);
      markersRef.current.push(destMarker);

      // Draw Route (Black Line for contrast on light map, or keep Neon if preferred)
      // Keeping Neon Green but adding a dark outline/weight for visibility
      if (showRoute) {
        const latlngs = [
          [center.lat, center.lng],
          [destination.lat, destination.lng]
        ];
        // @ts-ignore
        const polyline = L.polyline(latlngs, { color: '#000000', weight: 5, opacity: 0.8 }).addTo(map);
        // @ts-ignore
        const polylineInner = L.polyline(latlngs, { color: '#00E700', weight: 3, opacity: 1 }).addTo(map);
        
        routeLineRef.current = polyline; // Track one for removal, leafet cleans up layers usually but good practice
        
        // Fit bounds
        const bounds = L.latLngBounds([center.lat, center.lng], [destination.lat, destination.lng]);
        map.fitBounds(bounds, { padding: [80, 50] });
      }
    } else {
        map.setView([center.lat, center.lng], 14);
    }

    // Add other markers (e.g. nearby captains)
    if (markers) {
        markers.forEach(m => {
            const marker = L.marker([m.lat, m.lng], { icon: iconBike }).addTo(map);
            markersRef.current.push(marker);
        })
    }

  }, [center, destination, markers, showRoute]);

  return <div ref={mapContainerRef} className="h-full w-full bg-gray-200" />;
};

export default MapComponent;
