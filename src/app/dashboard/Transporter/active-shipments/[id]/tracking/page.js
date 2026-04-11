"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, AlertTriangle, Loader } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getShipmentDetails, getDriverDetails, getVehicleDetails } from '../../../../../../components/lib/apiClient';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

// Dynamically import LiveTracking to avoid SSR issues
const LiveTracking = dynamic(
  () => import('../../../../../../components/lib/LiveTracking'),
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

const ShipmentTracking = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportingIssue, setReportingIssue] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [driver, setDriver] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  // Fetch shipment details
  const fetchShipmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching tracking info for shipment:', id);
      
      const response = await getShipmentDetails(id);
      
      console.log('📦 Shipment details response:', response);

      if (response.success && response.data) {
        const shipmentData = response.data.shipment || response.data;
        
        setTracking({
          id: shipmentData._id,
          title: shipmentData.shipment_title,
          status: shipmentData.status,
          estimatedDelivery: '14 Feb, 3:45 PM', // This would come from tracking API
          vehicleType: 'Not assigned',
          capacity: 'N/A',
          plateNumber: 'N/A',
          driverName: 'Not assigned',
          driverPhone: 'N/A',
          proofOfDelivery: false,
          vehicleImages: [],
          pickup_address: shipmentData.pickup_address,
          delivery_address: shipmentData.delivery_address,
          contact_person: shipmentData.contact_person,
          price: shipmentData.price,
          weight: shipmentData.weight,
          dimensions: shipmentData.dimensions,
          type_of_packaging: shipmentData.type_of_packaging,
          driver_id: shipmentData.driver_id,
          vehicle_id: shipmentData.vehicle_id,
          createdAt: shipmentData.createdAt,
          updatedAt: shipmentData.updatedAt
        });
        
        // Fetch driver details if available
        if (shipmentData.driver_id) {
          fetchDriverDetails(shipmentData.driver_id);
        }
        
        // Fetch vehicle details if available
        if (shipmentData.vehicle_id) {
          fetchVehicleDetails(shipmentData.vehicle_id);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch tracking information');
      }
    } catch (err) {
      console.error('❌ Error fetching tracking info:', err);
      setError(err.message);
      
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
        
        // Update tracking with driver info
        setTracking(prev => ({
          ...prev,
          driverName: response.data.driver_name,
          driverPhone: response.data.phone
        }));
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
        
        // Update tracking with vehicle info
        setTracking(prev => ({
          ...prev,
          vehicleType: response.data.vehicle_type,
          capacity: `${response.data.capicity} Tons`,
          plateNumber: response.data.plate_number,
          vehicleImages: response.data.vehicle_images?.map(img => replaceImageUrl(img)) || []
        }));
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

  const handleReportIssue = async () => {
    const issue = prompt('Please describe the issue:');
    if (issue) {
      setReportingIssue(true);
      try {
        console.log('Reporting issue:', issue);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`Issue reported: ${issue}\nOur support team will contact you shortly.`);
      } catch (error) {
        console.error('Error reporting issue:', error);
        toast.error('Failed to report issue. Please try again.');
      } finally {
        setReportingIssue(false);
      }
    }
  };

  const handleConfirmDelivery = async () => {
    if (window.confirm('Are you sure you want to confirm delivery?')) {
      setConfirmingDelivery(true);
      try {
        console.log('Confirming delivery for shipment:', id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Delivery confirmed successfully!');
      } catch (error) {
        console.error('Error confirming delivery:', error);
        toast.error('Failed to confirm delivery. Please try again.');
      } finally {
        setConfirmingDelivery(false);
      }
    }
  };

  const handleLocationUpdate = (location) => {
    setLiveLocation(location);
    console.log('Live location updated:', location);
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

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <h1 className="text-xl font-semibold text-black">Shipment Tracking</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error || 'Tracking information not found'}</p>
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
        <h1 className="text-xl font-semibold text-black">Shipment Tracking</h1>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tracking.status)}`}>
          {formatStatus(tracking.status)}
        </span>
        <span className="text-sm text-gray-500">
          ID: {tracking.id?.slice(-8)}
        </span>
        {liveLocation && (
          <span className="text-xs text-green-600">
            Live: {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
          </span>
        )}
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-3">Live Location</h2>
        <div className="h-[400px] w-full rounded-lg overflow-hidden bg-gray-100">
          <LiveTracking 
            shipmentId={id} 
            shipmentTitle={tracking.title}
            onLocationUpdate={handleLocationUpdate}
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Live tracking updates when driver shares location
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Shipment Id</p>
                <p className="text-black font-bold text-xl">{tracking.id?.slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                <p className="text-black font-medium">{tracking.estimatedDelivery}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Shipment title</p>
                <p className="text-black font-medium">{tracking.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
                <p className="text-black font-medium">{tracking.pickup_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                <p className="text-black font-medium">{tracking.delivery_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                <p className="text-black font-medium">{tracking.contact_person || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Proof of delivery</p>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                    tracking.proofOfDelivery 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-blue-500'
                  }`}>
                    {tracking.proofOfDelivery && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-black">
                    {tracking.proofOfDelivery ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Vehicle Details xxx</h2>
            {loadingVehicle ? (
              <div className="flex justify-center py-4">
                <Loader className="w-6 h-6 animate-spin text-[#036BB4]" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
                    <p className="text-black font-medium">{tracking.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Plate Number</p>
                    <p className="text-black font-medium">{tracking.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Capacity</p>
                    <p className="text-black font-medium">{tracking.capacity}</p>
                  </div>
                </div>

                {/* Vehicle Images */}
                {tracking.vehicleImages && tracking.vehicleImages.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">Vehicle Images</p>
                    <div className="grid grid-cols-3 gap-3">
                      {tracking.vehicleImages.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Vehicle ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Driver Details */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Driver Details</h2>
            {loadingDriver ? (
              <div className="flex justify-center py-4">
                <Loader className="w-6 h-6 animate-spin text-[#036BB4]" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-black font-medium">{tracking.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-black font-medium">{tracking.driverPhone}</p>
                </div>
                {driver?.email && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-black font-medium">{driver.email}</p>
                  </div>
                )}
              </div>
            )}

            {/* <div className="mt-6 space-y-3">
              <button 
                onClick={handleReportIssue}
                disabled={reportingIssue}
                className="w-full py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportingIssue ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Reporting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Report an Issue
                  </>
                )}
              </button>
              <button 
                onClick={handleConfirmDelivery}
                disabled={confirmingDelivery || tracking.status === 'DELIVERED' || tracking.status === 'COMPLETED'}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  tracking.status === 'DELIVERED' || tracking.status === 'COMPLETED'
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {confirmingDelivery ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : tracking.status === 'DELIVERED' || tracking.status === 'COMPLETED' ? (
                  'Already Delivered'
                ) : (
                  'Confirm Delivery'
                )}
              </button>
            </div> */}
          </div>

          {/* Shipment Details */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Shipment Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Weight:</span>
                <span className="text-black font-medium">{tracking.weight || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dimensions:</span>
                <span className="text-black font-medium">{tracking.dimensions || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Packaging:</span>
                <span className="text-black font-medium">{tracking.type_of_packaging || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="text-black font-medium">
                  {tracking.price ? `${formatPrice(tracking.price)} FCFA` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-6 text-xs text-gray-400 flex justify-between">
        <p>Created: {tracking.createdAt ? new Date(tracking.createdAt).toLocaleString() : 'N/A'}</p>
        <p>Last Updated: {tracking.updatedAt ? new Date(tracking.updatedAt).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  );
};

export default ShipmentTracking;