import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, HeatmapLayer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)'
};

// Center of Bhopal, MP
const center = {
  lat: 23.2599,
  lng: 77.4126
};

// Mock data for heatmap and vehicles
const mockVehicles = [
  { id: 1, position: { lat: 23.2500, lng: 77.4000 }, type: 'available' },
  { id: 2, position: { lat: 23.2650, lng: 77.4200 }, type: 'busy' },
  { id: 3, position: { lat: 23.2550, lng: 77.4100 }, type: 'available' },
];

const libraries = ['visualization'];

const LiveMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-red-500 font-bold text-xl px-4 text-center">
        <p>Google Maps couldn't be loaded.</p>
        <p className="text-sm text-gray-500 mt-2 font-medium">{loadError.message || "Please check your API key and network connection."}</p>
      </div>
    );
  }

  if (!isLoaded) return <div className="flex items-center justify-center h-screen bg-gray-50 text-brand font-bold text-xl">Loading Map...</div>;

  // Mock heatmap data (requires window.google to be loaded)
  const heatmapData = [
    new window.google.maps.LatLng(23.2599, 77.4126),
    new window.google.maps.LatLng(23.2600, 77.4130),
    new window.google.maps.LatLng(23.2590, 77.4120),
    new window.google.maps.LatLng(23.2550, 77.4200),
    new window.google.maps.LatLng(23.2551, 77.4210),
  ];

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-72">
        <h2 className="font-black text-gray-900 mb-2">Live System Status</h2>
        <div className="space-y-2 text-sm font-medium">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Active Drivers</span>
            <span className="text-gray-900">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Live Requests</span>
            <span className="text-gray-900">38</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-2">
            <span className="text-gray-500">Map Mode</span>
            <span className="text-brand font-bold bg-brand-50 px-2 rounded">Heatmap Active</span>
          </div>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            // Minimal styling for the map to look modern
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
            { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
          ]
        }}
      >
        <HeatmapLayer
          data={heatmapData}
          options={{
            radius: 40,
            opacity: 0.6,
            gradient: [
              'rgba(0, 255, 255, 0)',
              'rgba(0, 255, 255, 1)',
              'rgba(0, 191, 255, 1)',
              'rgba(0, 127, 255, 1)',
              'rgba(0, 63, 255, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(0, 0, 223, 1)',
              'rgba(0, 0, 191, 1)',
              'rgba(0, 0, 159, 1)',
              'rgba(0, 0, 127, 1)',
              'rgba(63, 0, 91, 1)',
              'rgba(127, 0, 63, 1)',
              'rgba(191, 0, 31, 1)',
              'rgba(255, 0, 0, 1)'
            ]
          }}
        />

        {mockVehicles.map(vehicle => (
          <Marker
            key={vehicle.id}
            position={vehicle.position}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + (vehicle.type === 'available' ? '#10b981' : '#f59e0b') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>'),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LiveMap;
