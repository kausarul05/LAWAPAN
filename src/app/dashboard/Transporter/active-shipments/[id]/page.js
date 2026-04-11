"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getShipmentDetails, getDriverDetails, getVehicleDetails } from '../../../../../components/lib/apiClient';

// Helper function to replace localhost URLs with server URL
const replaceImageUrl = (url) => {
  if (!url) return null;
  return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
};

const ActiveShipmentDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driver, setDriver] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  console.log("Shipment ID:", id);

  // Fetch shipment details
  const fetchShipmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching shipment details for ID:', id);
      
      const response = await getShipmentDetails(id);
      
      console.log('📦 Shipment details response:', response);

      if (response.success && response.data) {
        const shipmentData = response.data.shipment || response.data;
        
        // Transform the data
        const transformedShipment = {
          id: shipmentData._id,
          title: shipmentData.shipment_title,
          status: shipmentData.status,
          description: shipmentData.discription,
          weight: shipmentData.weight,
          packagingType: shipmentData.type_of_packaging,
          category: shipmentData.category,
          dimensions: shipmentData.dimensions,
          pickupAddress: shipmentData.pickup_address,
          deliveryAddress: shipmentData.delivery_address,
          datePreference: shipmentData.date_preference,
          timeWindow: shipmentData.time_window,
          contactPerson: shipmentData.contact_person,
          price: shipmentData.price,
          images: shipmentData.shipment_images?.map(img => replaceImageUrl(img)) || [],
          driver_id: shipmentData.driver_id,
          vehicle_id: shipmentData.vehicle_id,
          createdAt: shipmentData.createdAt,
          updatedAt: shipmentData.updatedAt
        };
        
        setShipment(transformedShipment);
        
        // Fetch driver details if available
        if (transformedShipment.driver_id) {
          fetchDriverDetails(transformedShipment.driver_id);
        }
        
        // Fetch vehicle details if available
        if (transformedShipment.vehicle_id) {
          fetchVehicleDetails(transformedShipment.vehicle_id);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch shipment details');
      }
    } catch (err) {
      console.error('❌ Error fetching shipment details:', err);
      setError(err.message);
      
      // If unauthorized, redirect to login
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch driver details
  const fetchDriverDetails = async (driverId) => {
    try {
      setLoadingDriver(true);
      console.log('👤 Fetching driver details for ID:', driverId);
      
      const response = await getDriverDetails(driverId);
      
      console.log('📦 Driver details:', response);
      
      if (response.success && response.data) {
        setDriver({
          name: response.data.driver_name,
          phone: response.data.phone,
          email: response.data.email,
          license: response.data.driver_license?.[0] ? replaceImageUrl(response.data.driver_license[0]) : null,
          profile_picture: response.data.profile_picture?.[0] ? replaceImageUrl(response.data.profile_picture[0]) : null
        });
      }
    } catch (err) {
      console.error('Error fetching driver details:', err);
    } finally {
      setLoadingDriver(false);
    }
  };

  // Fetch vehicle details
  const fetchVehicleDetails = async (vehicleId) => {
    try {
      setLoadingVehicle(true);
      console.log('🚛 Fetching vehicle details for ID:', vehicleId);
      
      const response = await getVehicleDetails(vehicleId);
      
      console.log('📦 Vehicle details:', response);
      
      if (response.success && response.data) {
        setVehicle({
          type: response.data.vehicle_type,
          plate: response.data.plate_number,
          capacity: response.data.capicity,
          number: response.data.vehicle_number,
          year: response.data.year_model,
          images: response.data.vehicle_images?.map(img => replaceImageUrl(img)) || []
        });
      }
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
    } finally {
      setLoadingVehicle(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchShipmentDetails();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/dashboard/Transporter/active-shipments');
  };

  const nextImage = () => {
    if (shipment?.images) {
      setCurrentImageIndex((prev) => 
        prev === shipment.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (shipment?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? shipment.images.length - 1 : prev - 1
      );
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('progress') || statusLower.includes('pending')) {
      return 'bg-orange-100 text-orange-600';
    } else if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return 'bg-green-100 text-green-600';
    } else if (statusLower.includes('cancelled') || statusLower.includes('failed')) {
      return 'bg-red-100 text-red-600';
    }
    return 'bg-gray-100 text-gray-600';
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <h1 className="text-xl font-semibold text-black">Shipment Detail</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error || 'Shipment not found'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h1 className="text-xl font-semibold text-black">Shipment Detail</h1>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
          {formatStatus(shipment.status)}
        </span>
        <span className="text-sm text-gray-500">
          ID: {shipment.id?.slice(-8)}
        </span>
      </div>

      {/* Image Carousel */}
      {shipment.images && shipment.images.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="relative w-full max-w-2xl mx-auto">
            <img
              src={shipment.images[currentImageIndex]}
              alt="Shipment"
              className="w-full h-64 object-cover rounded-lg"
            />
            {shipment.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {currentImageIndex + 1} / {shipment.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipment title</p>
            <p className="text-black font-medium">{shipment.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="text-black font-medium">{shipment.category}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-black font-medium">{shipment.description || 'No description'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Dimensions (L/W/H)</p>
            <p className="text-black font-medium">{shipment.dimensions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Weight</p>
            <p className="text-black font-medium">{shipment.weight}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Type of packaging</p>
            <p className="text-black font-medium">{shipment.packagingType}</p>
          </div>
        </div>
      </div>

      {/* Pickup & Delivery Details */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">Pickup & Delivery Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
            <p className="text-black font-medium">{shipment.pickupAddress || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Time Window</p>
            <p className="text-black font-medium">{shipment.timeWindow || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p className="text-black font-medium">{shipment.deliveryAddress || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Contact Person</p>
            <p className="text-black font-medium">{shipment.contactPerson || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Date Preference</p>
            <p className="text-black font-medium">{shipment.datePreference || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Driver Details */}
      {driver && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Driver Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Driver Name</p>
              <p className="text-black font-medium">{driver.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="text-black font-medium">{driver.phone || 'N/A'}</p>
            </div>
            {driver.email && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-black font-medium">{driver.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle Details */}
      {vehicle && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Vehicle Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
              <p className="text-black font-medium">{vehicle.type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Plate Number</p>
              <p className="text-black font-medium">{vehicle.plate || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Capacity</p>
              <p className="text-black font-medium">{vehicle.capacity} Tons</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Vehicle Number</p>
              <p className="text-black font-medium">{vehicle.number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Year Model</p>
              <p className="text-black font-medium">{vehicle.year || 'N/A'}</p>
            </div>
          </div>
          
          {/* Vehicle Images */}
          {vehicle.images && vehicle.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Vehicle Images</p>
              <div className="flex gap-2 overflow-x-auto">
                {vehicle.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Vehicle ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Amount */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Amount</h2>
        <div>
          <p className="text-sm text-gray-500 mb-1">Price</p>
          <p className="text-2xl font-bold text-black">
            {shipment.price ? `${formatPrice(shipment.price)} FCFA` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-6 text-xs text-gray-400 flex justify-between">
        <p>Created: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : 'N/A'}</p>
        <p>Last Updated: {shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default ActiveShipmentDetail;