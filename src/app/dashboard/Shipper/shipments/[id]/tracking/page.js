"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, AlertTriangle, Loader } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getShipmentDetails } from '@/components/lib/apiClient';
import LiveTracking from '@/components/lib/LiveTracking';

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

  useEffect(() => {
    console.log('🔍 ShipmentTracking - Current ID from params:', id);
    console.log('🔍 ShipmentTracking - ID type:', typeof id);
    console.log('🔍 ShipmentTracking - ID value:', id);

    if (id) {
      fetchTrackingInfo();
    } else {
      console.error('❌ No shipment ID found in params');
    }
  }, [id]);

  // Fetch tracking information
  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching tracking info for shipment:', id);

      const response = await getShipmentDetails(id);

      console.log('📦 Tracking response:', response);

      if (response.success && response.data) {
        const shipmentData = response?.data?.shipment;

        setTracking({
          id: shipmentData._id,
          title: shipmentData.shipment_title,
          status: shipmentData.status,
          estimatedDelivery: '14 Feb, 3:45 PM',
          vehicleType: shipmentData.vehicle?.vehicle_type || 'Not assigned',
          capacity: shipmentData.vehicle?.capicity ? `${shipmentData.vehicle.capicity} Tons` : 'N/A',
          plateNumber: shipmentData.vehicle?.plate_number || 'N/A',
          driverName: shipmentData.driver?.driver_name || 'Not assigned',
          driverPhone: shipmentData.driver?.phone || 'N/A',
          proofOfDelivery: false,
          vehicleImages: shipmentData.vehicle?.vehicle_images || [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
          ],
          pickup_address: shipmentData.pickup_address,
          delivery_address: shipmentData.delivery_address,
          contact_person: shipmentData.contact_person,
          price: shipmentData.price,
          weight: shipmentData.weight,
          dimensions: shipmentData.dimensions,
          type_of_packaging: shipmentData.type_of_packaging,
          createdAt: shipmentData.createdAt,
          updatedAt: shipmentData.updatedAt,
        });
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

  useEffect(() => {
    if (id) {
      fetchTrackingInfo();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/dashboard/Shipper/shipments');
  };

  const handleReportIssue = async () => {
    const issue = prompt('Please describe the issue:');
    if (issue) {
      setReportingIssue(true);
      try {
        console.log('Reporting issue:', issue);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Issue reported: ${issue}\nOur support team will contact you shortly.`);
      } catch (error) {
        console.error('Error reporting issue:', error);
        alert('Failed to report issue. Please try again.');
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
        alert('Delivery confirmed successfully!');
        fetchTrackingInfo();
      } catch (error) {
        console.error('Error confirming delivery:', error);
        alert('Failed to confirm delivery. Please try again.');
      } finally {
        setConfirmingDelivery(false);
      }
    }
  };

  const handleLocationUpdate = (location) => {
    setLiveLocation(location);
    console.log('Live location updated:', location);
  };

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

      <div className="flex items-center mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tracking.status)}`}>
          {tracking.status}
        </span>
        <span className="ml-3 text-sm text-gray-500">
          ID: {tracking.id?.slice(-8)}
        </span>
        {liveLocation && (
          <span className="ml-3 text-xs text-green-600">
            Live: {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
          </span>
        )}
      </div>

      {/* Live Map - Integrated */}
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
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Vehicle Details</h2>
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Driver Details */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Driver Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-black font-medium">{tracking.driverName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="text-black font-medium">{tracking.driverPhone}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
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
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${tracking.status === 'DELIVERED' || tracking.status === 'COMPLETED'
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
            </div>
          </div>

          {/* Additional Information */}
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
                  {tracking.price ? new Intl.NumberFormat('en-US').format(tracking.price) + ' FCFA' : 'N/A'}
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