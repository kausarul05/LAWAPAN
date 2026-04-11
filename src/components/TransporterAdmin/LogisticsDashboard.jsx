"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, FileText, Loader, MapPin, RefreshCw } from 'lucide-react';
import { getTransporterShipments, getShipmentDetails, getDriverDetails, getVehicleDetails } from '../../components/lib/apiClient';
import dynamic from 'next/dynamic';

// Dynamically import LiveTracking to avoid SSR issues
const LiveTracking = dynamic(
  () => import('../../components/lib/LiveTracking'),
  { ssr: false, loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <Loader className="w-8 h-8 animate-spin text-[#036BB4]" />
      <span className="ml-2 text-gray-500">Loading map...</span>
    </div>
  )}
);

// Helper function to replace localhost URLs with server URL
const replaceImageUrl = (url) => {
  if (!url) return null;
  return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
};

const ActiveShipmentsDashboard = () => {
  const router = useRouter();
  const [selectedShipment, setSelectedShipment] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentData, setSelectedShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const scrollContainerRef = useRef(null);

  // Get transporter ID from localStorage
  const getTransporterId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transporter_id');
    }
    return null;
  };

  // Fetch active shipments for transporter
  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      console.log('🔍 Fetching shipments for transporter:', transporterId);
      
      const response = await getTransporterShipments(transporterId, 1, 100, '');
      
      console.log('📦 Shipments response:', response);

      if (response.success && response.data) {
        const activeShipments = response.data.shipments.filter(
          shipment => shipment.status === 'IN_PROGRESS' || shipment.status === 'PENDING'
        );
        
        const transformedShipments = activeShipments.map(shipment => ({
          id: shipment._id,
          name: shipment.shipment_title,
          type: shipment.vehicle_type || 'Truck',
          status: shipment.status,
          image: shipment.shipment_images?.[0] ? replaceImageUrl(shipment.shipment_images[0]) : 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&h=120&fit=crop',
          pickup_address: shipment.pickup_address,
          delivery_address: shipment.delivery_address,
          contact_person: shipment.contact_person,
          contact_phone: shipment.contact_person,
          weight: shipment.weight,
          dimensions: shipment.dimensions,
          packaging: shipment.type_of_packaging,
          price: shipment.price,
          driver_id: shipment.driver_id,
          vehicle_id: shipment.vehicle_id,
          shipment_images: shipment.shipment_images?.map(img => replaceImageUrl(img)) || [],
          createdAt: shipment.createdAt,
          updatedAt: shipment.updatedAt
        }));
        
        setShipments(transformedShipments);
        
        if (transformedShipments.length > 0 && !selectedShipmentData) {
          setSelectedShipmentData(transformedShipments[0]);
          // Fetch driver and vehicle details for the selected shipment
          if (transformedShipments[0].driver_id) {
            fetchDriverDetails(transformedShipments[0].driver_id);
          }
          if (transformedShipments[0].vehicle_id) {
            fetchVehicleDetails(transformedShipments[0].vehicle_id);
          }
        }
      } else {
        throw new Error(response.message || 'Failed to fetch shipments');
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch driver details from driver API
  const fetchDriverDetails = async (driverId) => {
    if (!driverId) return;
    
    try {
      setLoadingDriver(true);
      console.log('👤 Fetching driver details for ID:', driverId);
      
      const response = await getDriverDetails(driverId);
      
      console.log('📦 Driver details:', response);
      
      if (response.success && response.data) {
        setSelectedShipmentData(prev => ({
          ...prev,
          driver_name: response.data.driver_name,
          driver_phone: response.data.phone,
          driver_email: response.data.email,
          driver_license: response.data.driver_license?.[0] ? replaceImageUrl(response.data.driver_license[0]) : null,
          profile_picture: response.data.profile_picture?.[0] ? replaceImageUrl(response.data.profile_picture[0]) : null,
        }));
      }
    } catch (err) {
      console.error('Error fetching driver details:', err);
    } finally {
      setLoadingDriver(false);
    }
  };

  // Fetch vehicle details from vehicle API
  const fetchVehicleDetails = async (vehicleId) => {
    if (!vehicleId) return;
    
    try {
      setLoadingVehicle(true);
      console.log('🚛 Fetching vehicle details for ID:', vehicleId);
      
      const response = await getVehicleDetails(vehicleId);
      
      console.log('📦 Vehicle details:', response);
      
      if (response.success && response.data) {
        setSelectedShipmentData(prev => ({
          ...prev,
          vehicle_type: response.data.vehicle_type,
          vehicle_plate: response.data.plate_number,
          vehicle_capacity: response.data.capicity,
          vehicle_images: response.data.vehicle_images?.map(img => replaceImageUrl(img)) || [],
        }));
      }
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
    } finally {
      setLoadingVehicle(false);
    }
  };

  // Fetch detailed shipment data when selected
  const fetchShipmentDetails = async (shipmentId) => {
    try {
      const response = await getShipmentDetails(shipmentId);
      if (response.success && response.data) {
        const shipment = response.data.shipment || response.data;
        
        // Update driver and vehicle IDs if they exist in the response
        if (shipment.driver_id && shipment.driver_id !== selectedShipmentData?.driver_id) {
          fetchDriverDetails(shipment.driver_id);
        }
        if (shipment.vehicle_id && shipment.vehicle_id !== selectedShipmentData?.vehicle_id) {
          fetchVehicleDetails(shipment.vehicle_id);
        }
      }
    } catch (err) {
      console.error('Error fetching shipment details:', err);
    }
  };

  const handlePrevSlide = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const handlePrevImage = () => {
    if (selectedShipmentData?.shipment_images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedShipmentData.shipment_images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedShipmentData?.shipment_images) {
      setCurrentImageIndex((prev) => 
        prev === selectedShipmentData.shipment_images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleLocationUpdate = (location) => {
    setLiveLocation(location);
    console.log('Live location updated:', location);
  };

  const handleSelectShipment = (index, shipment) => {
    setSelectedShipment(index);
    setSelectedShipmentData(shipment);
    setCurrentImageIndex(0);
    
    // Fetch driver and vehicle details for the selected shipment
    if (shipment.driver_id) {
      fetchDriverDetails(shipment.driver_id);
    }
    if (shipment.vehicle_id) {
      fetchVehicleDetails(shipment.vehicle_id);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (shipments[selectedShipment]?.id && !selectedShipmentData?.driver_name) {
      fetchShipmentDetails(shipments[selectedShipment].id);
    }
  }, [selectedShipment, shipments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading active shipments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button
            onClick={fetchShipments}
            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">🚚</div>
          <p className="text-gray-500">No active shipments found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Active Shipments Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Shipments</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevSlide}
              className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center hover:bg-blue-50 transition-all text-blue-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center hover:bg-blue-50 transition-all text-blue-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shipments Slider */}
        <div className="overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {shipments.map((shipment, index) => (
              <div
                key={shipment.id}
                onClick={() => handleSelectShipment(index, shipment)}
                className={`flex-shrink-0 w-[200px] bg-white rounded-xl p-4 cursor-pointer transition-all ${
                  index === selectedShipment
                    ? 'border-2 border-orange-500 shadow-lg'
                    : 'border-2 border-transparent hover:border-gray-200'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 mb-3 animate-pulse" />
                <div className="w-full h-24 rounded-lg overflow-hidden mb-3">
                  <img
                    src={shipment.image}
                    alt={shipment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-900 truncate">{shipment.name}</h3>
                <p className="text-xs text-gray-400">{shipment.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Driver Details & Map */}
        <div className="col-span-7 space-y-6">
          {/* Driver Details Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Driver Details</h2>
            {loadingDriver ? (
              <div className="flex justify-center py-4">
                <Loader className="w-6 h-6 animate-spin text-[#036BB4]" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-2">Name</p>
                  <p className="font-bold text-gray-900">{selectedShipmentData?.driver_name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-2">Phone</p>
                  <p className="font-bold text-gray-900">{selectedShipmentData?.driver_phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-2">Driving License</p>
                  {selectedShipmentData?.driver_license ? (
                    <a 
                      href={selectedShipmentData.driver_license} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-lg w-fit mt-1 block hover:bg-gray-200 transition"
                    >
                      <FileText size={20} className="text-gray-600" />
                    </a>
                  ) : (
                    <div className="bg-gray-100 p-2 rounded-lg w-fit mt-1">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Map Section with Live Tracking */}
          <div className="relative h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {selectedShipmentData?.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending'}
            </div>
            {liveLocation && (
              <div className="absolute top-4 right-4 z-10 bg-white rounded-lg px-3 py-1.5 shadow-md text-xs">
                <MapPin className="w-3 h-3 inline text-green-500 mr-1" />
                Live: {liveLocation.lat.toFixed(4)}, {liveLocation.lng.toFixed(4)}
              </div>
            )}
            <LiveTracking 
              shipmentId={selectedShipmentData?.id} 
              shipmentTitle={selectedShipmentData?.name}
              onLocationUpdate={handleLocationUpdate}
            />
          </div>
        </div>

        {/* Right Column - Shipment Details */}
        <div className="col-span-5">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipment Details</h2>

              {/* Image Slider */}
              {selectedShipmentData?.shipment_images && selectedShipmentData.shipment_images.length > 0 && (
                <div className="relative mb-6 group">
                  <img
                    src={selectedShipmentData.shipment_images[currentImageIndex]}
                    alt="Shipment"
                    className="w-full h-56 object-cover rounded-xl"
                  />
                  {selectedShipmentData.shipment_images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </button>
                    </>
                  )}
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedShipmentData.shipment_images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Shipment Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedShipmentData?.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">ID: {selectedShipmentData?.id?.slice(-8)}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Pickup Address</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{selectedShipmentData?.pickup_address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Delivery Address</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{selectedShipmentData?.delivery_address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Contact Person</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{selectedShipmentData?.contact_person || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Contact Number</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{selectedShipmentData?.contact_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Weight</p>
                    <p className="text-sm font-bold text-gray-900">{selectedShipmentData?.weight || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Dimensions</p>
                    <p className="text-sm font-bold text-gray-900">{selectedShipmentData?.dimensions || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Packaging</p>
                    <p className="text-sm font-bold text-gray-900">{selectedShipmentData?.packaging || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Price</p>
                    <p className="text-sm font-bold text-green-600">
                      {selectedShipmentData?.price ? new Intl.NumberFormat('en-US').format(selectedShipmentData.price) + ' FCFA' : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-500 text-xs font-semibold mb-2">Assigned Vehicle</p>
                  {loadingVehicle ? (
                    <div className="flex justify-center py-2">
                      <Loader className="w-5 h-5 animate-spin text-[#036BB4]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Type</p>
                        <p className="text-sm font-bold text-gray-900">{selectedShipmentData?.vehicle_type || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Plate Number</p>
                        <p className="text-sm font-bold text-gray-900">{selectedShipmentData?.vehicle_plate || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Capacity</p>
                        <p className="text-sm font-bold text-gray-900">{selectedShipmentData?.vehicle_capacity || 'N/A'} Tons</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Vehicle Images */}
                  {selectedShipmentData?.vehicle_images && selectedShipmentData.vehicle_images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-400 mb-2">Vehicle Images</p>
                      <div className="flex gap-2">
                        {selectedShipmentData.vehicle_images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Vehicle ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View Full Details Button */}
              <button 
                onClick={() => router.push(`/dashboard/Transporter/active-shipments/${selectedShipmentData?.id}`)}
                className="w-full mt-6 py-3 border-2 border-[#036BB4] text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
              >
                View full details
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ActiveShipmentsDashboard;