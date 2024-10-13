"use client";

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  interface Incident {
    longitude: number;
    latitude: number;
    title: string;
    description: string;
    location: string;
    date: string;
    severity: 'high' | 'low';
  }

  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Fetch incidents from the API
  useEffect(() => {
    const fetchIncidents = async () => {
      const res = await fetch('/api/incidents');  // Fetch from your API
      const data = await res.json();
      setIncidents(data);  // Store incidents in state
    };

    fetchIncidents();
  }, []);

  // Initialize the map and plot incidents
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // Open-source tile style
        center: [0, 0], // Initial map center [longitude, latitude]
        zoom: 1, // Initial zoom level
      });
    }

    if (map.current && incidents.length) {
      // Add markers for each incident
      incidents.forEach((incident) => {
        new maplibregl.Marker({ color: incident.severity === 'high' ? 'red' : 'yellow' })
          .setLngLat([incident.longitude, incident.latitude])
          .setPopup(new maplibregl.Popup().setHTML(`
            <h3>${incident.title}</h3>
            <p>${incident.description}</p>
            <p><strong>Location:</strong> ${incident.location}</p>
            <p><strong>Date:</strong> ${incident.date}</p>
            <p><strong>Severity:</strong> ${incident.severity}</p>
          `))
          .addTo(map.current as maplibregl.Map);
      });
    }
  }, [incidents]);

  return <div className="w-full h-screen" ref={mapContainer}></div>;
};

export default Map;
