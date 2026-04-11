"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getShipmentDetails } from '../../../../../components/lib/apiClient';

const ShipmentDetail = () => {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch shipment details
    const fetchShipmentDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching shipment details for ID:', id);

            // Call the API function like loginUser
            const response = await getShipmentDetails(id);

            console.log('📦 Shipment details response:', response);

            if (response.success && response.data) {
                setShipment(response.data?.shipment);
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

    useEffect(() => {
        if (id) {
            fetchShipmentDetails();
        }
    }, [id]);

    console.log('shipment', shipment)

    const handleBack = () => {
        router.push('/dashboard/Shipper/shipments');
    };

    const nextImage = () => {
        if (shipment?.shipment_images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === shipment.shipment_images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (shipment?.shipment_images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? shipment.shipment_images.length - 1 : prev - 1
            );
        }
    };

    // Format price with commas
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

            <div className="flex items-center mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status || 'PENDING'}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                    ID: {shipment._id}
                </span>
            </div>

            {/* Image Carousel */}
            {shipment.shipment_images && shipment.shipment_images.length > 0 && (
                <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="relative w-full max-w-3xl mx-auto">
                        <img
                            src={shipment.shipment_images[currentImageIndex]}
                            alt="Shipment"
                            className="w-full h-96 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                            }}
                        />
                        {shipment.shipment_images.length > 1 && (
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
                        {/* Image counter */}
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {shipment.shipment_images.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Shipment Title</p>
                        <p className="text-black font-medium">{shipment.shipment_title || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Category</p>
                        <p className="text-black font-medium">{shipment.category || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Description</p>
                        <p className="text-black font-medium">{shipment.discription || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Weight</p>
                        <p className="text-black font-medium">{shipment.weight || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Type of Packaging</p>
                        <p className="text-black font-medium">{shipment.type_of_packaging || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                        <p className="text-black font-medium">{shipment.dimensions || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Pickup & Delivery Details */}
            <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-black mb-4">Pickup & Delivery Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
                        <p className="text-black font-medium">{shipment.pickup_address || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Time Window</p>
                        <p className="text-black font-medium">{shipment.time_window || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                        <p className="text-black font-medium">{shipment.delivery_address || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                        <p className="text-black font-medium">{shipment.contact_person || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Date Preference</p>
                        <p className="text-black font-medium">{shipment.date_preference || 'N/A'}</p>
                    </div>
                </div>
            </div>

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

            {/* Additional Information */}
            <div className="mt-6 text-xs text-gray-400 flex justify-between">
                <p>Created: {new Date(shipment.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(shipment.updatedAt).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default ShipmentDetail;