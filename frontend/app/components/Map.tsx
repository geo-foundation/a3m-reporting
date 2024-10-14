// components/Map.tsx

"use client";

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Import MapLibre CSS

interface Incident {
  id: number;
  title: string;
  description: string;
  country: string;
  city: string;
  date: string; // ISO format 'YYYY-MM-DD'
  severity: 'high' | 'medium' | 'low';
  impact: string;
  latitude: number;
  longitude: number;
  type: string;
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Fetch incidents from the API
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch('/api/incidents');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Incident[] = await res.json();
        console.log('Fetched incidents:', data); // Debugging
        setIncidents(data);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
      }
    };

    fetchIncidents();
  }, []);

  // Initialize the map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      console.log('Initializing map'); // Debugging
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [0, 0],
        zoom: 1,
      });

      map.current.on('load', () => {
        console.log('Map loaded'); // Debugging
        setMapReady(true);
      });
    }

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (map.current) {
        console.log('Removing map'); // Debugging
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when the map is ready and incidents are fetched
  useEffect(() => {
    console.log('useEffect for markers triggered'); // Debugging
    console.log('Map Ready:', mapReady);
    console.log('Map Reference:', map.current);
    console.log('Number of Incidents:', incidents.length);

    if (mapReady && map.current && incidents.length > 0) {
      console.log('Adding markers to the map');

      incidents.forEach((incident) => {
        console.log('Processing Incident:', incident);

        // Validate necessary fields
        if (
          typeof incident.longitude !== 'number' ||
          typeof incident.latitude !== 'number' ||
          !incident.title ||
          !incident.description ||
          !incident.country ||
          !incident.city ||
          !incident.date ||
          !incident.severity ||
          !incident.type
        ) {
          console.warn('Incomplete incident data:', incident);
          return; // Skip this incident
        }

        // Create marker color based on severity
        const markerColor =
          incident.severity === 'high'
            ? 'red'
            : incident.severity === 'medium'
            ? 'orange'
            : 'yellow';

        // Create the marker
        const marker = new maplibregl.Marker({ color: markerColor })
          .setLngLat([incident.longitude, incident.latitude])
          .setPopup(
            new maplibregl.Popup().setHTML(`
              <h3>${incident.title}</h3>
              <p>${incident.description}</p>
              <p><strong>Location:</strong> ${incident.city}, ${incident.country}</p>
              <p><strong>Date:</strong> ${incident.date}</p>
              <p><strong>Severity:</strong> ${incident.severity}</p>
              <p><strong>Type:</strong> ${incident.type}</p>
            `)
          )
          .addTo(map.current);

        console.log('Marker added for incident ID:', incident.id);
      });

      // Optionally, fit the map to the bounds of the incidents
      try {
        const bounds = new maplibregl.LngLatBounds();
        incidents.forEach((incident) => {
          bounds.extend([incident.longitude, incident.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 50 });
        console.log('Map bounds adjusted to fit all markers');
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    } else {
      console.log('Map not ready or no incidents to display');
    }
  }, [mapReady, incidents]);

  return (
    <div className="w-full h-screen">
      <div ref={mapContainer} className="w-full h-full rounded-xl shadow-sm overflow-hidden" />
    </div>
  );
};

export default Map;
