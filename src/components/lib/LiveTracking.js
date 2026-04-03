// lib/LiveTracking.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Wifi, WifiOff, Loader, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';
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
    const [socketConnected, setSocketConnected] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const socketRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    // Get token from localStorage
    const getToken = () => {
        if (typeof window !== 'undefined') {
            // Try multiple possible token storage locations
            const token = localStorage.getItem('auth_token') ||
                localStorage.getItem('token') ||
                document.cookie.split('token=')[1]?.split(';')[0];
            return token;
        }
        return null;
    };

    // Connect to Socket.IO
    const connectSocket = () => {

        console.log('🔍 Shipment ID being used:', shipmentId);
        console.log('🔍 Shipment Title:', shipmentTitle);

        const token = getToken();

        console.log('🔍 Token exists:', !!token);

        if (!token) {
            setError('No authentication token found. Please login again.');
            setLoading(false);
            return;
        }

        // Close existing connection if any
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const serverUrl = 'https://server.lawapantruck.com';

        console.log('🔄 Connecting to Socket.IO server...');

        socketRef.current = io(serverUrl, {
            auth: { token },
            transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            withCredentials: true
        });

        socketRef.current.on('connect', () => {
            console.log('✅ Socket connected successfully');
            setSocketConnected(true);
            setLoading(false);
            setError(null);
            setRetryCount(0);

            // Join shipment room after connection
            if (shipmentId) {
                console.log(`📡 Attempting to join shipment room with ID: ${shipmentId}`);
                setTimeout(() => {
                    console.log(`📡 Emitting join_shipment_room for: ${shipmentId}`);
                    socketRef.current?.emit('join_shipment_room', shipmentId);
                    setSubscribed(true);

                    // Request current location after joining
                    setTimeout(() => {
                        socketRef.current?.emit('get-shipment-location', { shipmentId });
                    }, 500);
                }, 500);
            } else {
                console.error('❌ No shipmentId available to join room');
                setError('No shipment ID provided');
            }
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log(`❌ Socket disconnected: ${reason}`);
            setSocketConnected(false);
            setSubscribed(false);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
            setError(`Connection error: ${err.message}`);
            setSocketConnected(false);

            // Auto retry logic
            if (retryCount < 3) {
                if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = setTimeout(() => {
                    console.log(`🔄 Retrying connection (${retryCount + 1}/3)...`);
                    setRetryCount(prev => prev + 1);
                    connectSocket();
                }, 3000);
            } else {
                setLoading(false);
            }
        });

        // Listen for location updates
        socketRef.current.on('location-updated', (data) => {
            console.log('📍 Location update received:', data);
            if (data && data.current_location && data.current_location.coordinates) {
                const [lng, lat] = data.current_location.coordinates;
                setCurrentLocation({ lat, lng });
                onLocationUpdate?.({ lat, lng });
            } else if (data && data.lat && data.lng) {
                setCurrentLocation({ lat: data.lat, lng: data.lng });
                onLocationUpdate?.({ lat: data.lat, lng: data.lng });
            }
        });

        socketRef.current.on('shipment-location', (data) => {
            console.log('📍 Shipment location event:', data);
            if (data && data.current_location && data.current_location.coordinates) {
                const [lng, lat] = data.current_location.coordinates;
                setCurrentLocation({ lat, lng });
                onLocationUpdate?.({ lat, lng });
            }
        });

        socketRef.current.on('subscribed', (data) => {
            console.log('✅ Subscribed to shipment:', data);
            setSubscribed(true);
        });

        socketRef.current.on('error', (err) => {
            console.error('Socket error:', err);
            setError(err.message || 'Socket error occurred');
        });
    };

    // Request current location
    const refreshLocation = () => {
        if (!socketRef.current || !socketConnected) {
            console.log('Cannot refresh: Socket not connected');
            setError('Not connected. Please wait for reconnection.');
            return;
        }
        console.log('🔄 Requesting current location...');
        socketRef.current.emit('get-shipment-location', { shipmentId });
    };

    // Manual reconnect
    const handleReconnect = () => {
        setError(null);
        setLoading(true);
        setRetryCount(0);
        connectSocket();
    };

    useEffect(() => {
        fixLeafletIcon();
        connectSocket();

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            if (socketRef.current) {
                if (shipmentId) {
                    socketRef.current.emit('leave_shipment_room', shipmentId);
                }
                socketRef.current.disconnect();
            }
        };
    }, [shipmentId]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Connecting to tracking server...</p>
                    <p className="text-xs text-gray-400 mt-1">Attempt {retryCount + 1}/3</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center p-6">
                    <div className="text-red-500 mb-3">⚠️</div>
                    <p className="text-sm text-gray-600 mb-3">{error}</p>
                    <button
                        onClick={handleReconnect}
                        className="px-4 py-2 bg-[#036BB4] text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            {/* Connection Status Badge */}
            <div className="absolute top-3 right-3 z-10 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-2 text-xs">
                {socketConnected ? (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-600">Live</span>
                    </>
                ) : (
                    <>
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-600">Offline</span>
                    </>
                )}
            </div>

            {/* Subscription Status */}
            {subscribed && (
                <div className="absolute top-3 left-3 z-10 bg-blue-100 rounded-full px-3 py-1 shadow-md">
                    <span className="text-xs text-blue-700">📍 Tracking Active</span>
                </div>
            )}

            {/* Refresh Button */}
            <button
                onClick={refreshLocation}
                disabled={!socketConnected}
                className="absolute bottom-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Refresh location"
            >
                <RefreshCw className="w-4 h-4 text-[#036BB4]" />
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
                                {socketConnected && <span className="text-green-500 text-xs ml-2">● Live</span>}
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            )}

            {/* Fallback for no map */}
            {!socketConnected && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Waiting for connection...</p>
                        <button
                            onClick={handleReconnect}
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