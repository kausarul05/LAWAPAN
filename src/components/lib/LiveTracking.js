// lib/LiveTracking.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons in Next.js
const fixLeafletIcon = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }
};

const LiveTracking = ({ shipmentId, shipmentTitle, onLocationUpdate }) => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const intervalRef = useRef(null);

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  // Get current location from API
  const fetchCurrentLocation = async () => {
    if (!shipmentId) {
      console.error('No shipment ID provided');
      return;
    }

    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://server.lawapantruck.com/api/v1/map/shipment/${shipmentId}/location`,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Extract coordinates from response
        let lat = null, lng = null;
        
        if (data.data && data.data.current_location) {
          const loc = data.data.current_location;
          if (loc.coordinates && loc.coordinates.length === 2) {
            lng = loc.coordinates[0];
            lat = loc.coordinates[1];
          } else if (loc.lat && loc.lng) {
            lat = loc.lat;
            lng = loc.lng;
          }
        }
        
        if (lat && lng) {
          setCurrentLocation({ lat, lng });
          onLocationUpdate?.({ lat, lng });
          setLastUpdated(new Date());
          setError(null);
          console.log('📍 Location updated:', { lat, lng });
        } else {
          console.log('No location data available yet');
        }
      } else {
        console.log('API response:', data);
        // Don't set error for "no location yet" - just keep default
        if (data.message !== 'Location not found') {
          setError(data.message || 'Failed to fetch location');
        }
      }
    } catch (err) {
      console.error('Error fetching location:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get location history (optional - for route display)
  const fetchLocationHistory = async () => {
    if (!shipmentId) return;

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `https://server.lawapantruck.com/api/v1/map/shipment/${shipmentId}/location/history`,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (response.ok && data.success && data.data && data.data.length > 0) {
        // You can use this data to draw a route on the map
        const points = data.data.map(point => {
          if (point.location && point.location.coordinates) {
            return [point.location.coordinates[1], point.location.coordinates[0]];
          }
          return null;
        }).filter(p => p);
        
        console.log('📍 Location history points:', points.length);
        // Future enhancement: draw polyline on map
      }
    } catch (err) {
      console.error('Error fetching location history:', err);
    }
  };

  // Manual refresh
  const refreshLocation = () => {
    setRefreshing(true);
    fetchCurrentLocation();
  };

  // Set up auto-refresh interval
  useEffect(() => {
    fixLeafletIcon();
    
    if (shipmentId) {
      fetchCurrentLocation();
      // fetchLocationHistory(); // Uncomment if you want route history
      
      // Auto-refresh every 30 seconds
      intervalRef.current = setInterval(() => {
        fetchCurrentLocation();
      }, 30000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Last Updated Badge */}
      {lastUpdated && (
        <div className="absolute top-3 right-3 z-10 bg-white rounded-full px-3 py-1 shadow-md text-xs">
          <span className="text-gray-500">Updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={refreshLocation}
        disabled={refreshing}
        className="absolute bottom-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        title="Refresh location"
      >
        <RefreshCw className={`w-4 h-4 text-[#036BB4] ${refreshing ? 'animate-spin' : ''}`} />
      </button>

      {/* Map */}
      {typeof window !== 'undefined' && (
        <MapContainer
          key={currentLocation.lat + currentLocation.lng}
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB'
          />
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>{shipmentTitle || 'Shipment'}</strong><br />
                Current Location<br />
                {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
                {lastUpdated && (
                  <span className="text-gray-500 text-xs block mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="bg-white rounded-lg p-4 text-center max-w-xs">
            <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={refreshLocation}
              className="mt-3 px-3 py-1 bg-[#036BB4] text-white rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;