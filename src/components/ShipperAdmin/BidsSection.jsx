"use client";

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MinusCircle,
    Search,
    Truck,
    ShieldCheck,
    Globe,
    Loader
} from 'lucide-react';
import { getAvailableBids } from '@/components/lib/apiClient';

const BidsSection = () => {
    const [shipments, setShipments] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAllBids, setShowAllBids] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;

    // Replace localhost URL with server URL
    const replaceImageUrl = (url) => {
        if (!url) return '/shipment-sample.jpg';
        // Replace localhost:5000 with server.lawapantruck.com
        return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
    };

    // Fetch all available bids with pagination
    const fetchBids = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching available bids for page:', page);

            const response = await getAvailableBids(page, itemsPerPage, '');

            console.log('📦 Bids response:', response);

            if (response.success && response.data) {
                // Transform shipments data
                const transformedShipments = response.data.map(bid => ({
                    _id: bid._id,
                    title: bid.shipment_title,
                    status: bid.status,
                    image: bid.shipment_images?.[0] ? replaceImageUrl(bid.shipment_images[0]) : '/shipment-sample.jpg',
                    pickup: bid.pickup_address,
                    delivery: bid.delivery_address,
                    price: bid.price,
                    weight: bid.weight,
                    packaging: bid.type_of_packaging
                }));

                setShipments(transformedShipments);
                
                // Update pagination info
                if (response.data.pagination) {
                    setTotalPages(response.data.pagination.totalPage || 0);
                    setTotalItems(response.data.pagination.total || 0);
                } else {
                    setTotalPages(Math.ceil(transformedShipments.length / itemsPerPage));
                    setTotalItems(transformedShipments.length);
                }

                // If there are shipments, select the first one
                if (transformedShipments.length > 0) {
                    setSelectedShipment(transformedShipments[0]);
                    setCurrentIndex(0);
                    setBids([]);
                } else {
                    setSelectedShipment(null);
                    setBids([]);
                }
            } else {
                throw new Error(response.message || 'Failed to fetch bids');
            }
        } catch (err) {
            console.error('Error fetching bids:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            fetchBids(currentPage + 1);
        }
    };

    // Handle previous page
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchBids(currentPage - 1);
        }
    };

    // Handle next shipment
    const handleNextShipment = () => {
        if (shipments.length > 0) {
            const nextIndex = (currentIndex + 1) % shipments.length;
            setCurrentIndex(nextIndex);
            setSelectedShipment(shipments[nextIndex]);
            setBids([]);
        }
    };

    // Handle previous shipment
    const handlePrevShipment = () => {
        if (shipments.length > 0) {
            const prevIndex = (currentIndex - 1 + shipments.length) % shipments.length;
            setCurrentIndex(prevIndex);
            setSelectedShipment(shipments[prevIndex]);
            setBids([]);
        }
    };

    // Remove shipment
    const handleRemoveShipment = (shipmentId) => {
        if (window.confirm('Are you sure you want to remove this shipment?')) {
            const updatedShipments = shipments.filter(s => s._id !== shipmentId);
            setShipments(updatedShipments);
            if (updatedShipments.length > 0) {
                setSelectedShipment(updatedShipments[0]);
                setCurrentIndex(0);
                setBids([]);
            } else {
                setSelectedShipment(null);
                setBids([]);
            }
        }
    };

    // View all bids modal
    const handleViewAllBids = () => {
        setShowAllBids(true);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const total = totalPages;

        if (total <= maxVisible) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            } else if (currentPage >= total - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = total - 3; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            }
        }
        return pages;
    };

    useEffect(() => {
        fetchBids(currentPage);
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen font-sans flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
                    <p className="text-gray-600">Loading bids...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white min-h-screen font-sans">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <div className="text-red-500 mb-4">⚠️</div>
                    <p className="text-gray-800 mb-4">{error}</p>
                    <button
                        onClick={() => fetchBids(currentPage)}
                        className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white min-h-screen font-sans">

            {/* 1. Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Live Bids & Assigned transporter</h2>
                    {totalItems > 0 && (
                        <p className="text-sm text-gray-500 mt-1">Showing {shipments.length} of {totalItems} bids</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevShipment}
                        disabled={shipments.length === 0}
                        className="p-1 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: '#036BB4', color: '#036BB4' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNextShipment}
                        disabled={shipments.length === 0}
                        className="p-1 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: '#036BB4', color: '#036BB4' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* 2. Horizontal Shipment Cards Slider */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
                {shipments.length > 0 ? (
                    shipments.map((ship, idx) => (
                        <div
                            key={ship._id}
                            className={`relative min-w-[220px] h-[130px] rounded-xl overflow-hidden shadow-md cursor-pointer transition-all ${selectedShipment?._id === ship._id ? 'ring-2 ring-[#036BB4]' : ''
                                }`}
                            onClick={() => {
                                setSelectedShipment(ship);
                                setCurrentIndex(idx);
                                setBids([]);
                            }}
                        >
                            <div className="absolute inset-0 bg-gray-600">
                                <div 
                                    className="w-full h-full opacity-60 bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${ship.image})` }} 
                                />
                            </div>

                            <div className="absolute top-2 left-2 right-2 flex justify-between">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveShipment(ship._id);
                                    }}
                                    className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-700 transition-colors"
                                >
                                    <MinusCircle size={10} /> Remove
                                </button>
                                <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> {ship.status}
                                </span>
                            </div>

                            <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                                {ship.title.length > 25 ? ship.title.substring(0, 25) + '...' : ship.title}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-8 text-gray-500">
                        No shipments available
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mb-6">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={idx} className="text-gray-500 px-2">...</span>
                        ) : (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentPage(page);
                                    fetchBids(page);
                                }}
                                className={`w-10 h-10 rounded text-sm font-medium transition-colors ${page === currentPage
                                        ? 'bg-[#036BB4] text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 3. Bids Table Section */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-lg">Bids for {selectedShipment?.title || 'Shipment'}</h3>
                        <button
                            onClick={handleViewAllBids}
                            className="text-sm text-[#036BB4] hover:underline"
                            disabled={bids.length === 0}
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#036BB4] text-white text-sm">
                                    <th className="py-3 px-6 font-semibold">Bidders</th>
                                    <th className="py-3 px-6 font-semibold">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bids.length > 0 ? (
                                    bids.slice(0, 5).map((bid, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border border-gray-100" style={{ backgroundColor: '#f0f7ff' }}>
                                                        <span className="text-[10px] font-bold" style={{ color: '#036BB4' }}>{bid.logo}</span>
                                                    </div>
                                                    <span className="text-gray-700 text-sm font-medium">{bid.bidder}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-sm text-gray-600 font-semibold">{bid.price}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="py-8 text-center text-gray-500">
                                            No bids available for this shipment
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Assigned Transporter Placeholder Section */}
                <div className="relative border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl bg-gradient-to-b from-white to-blue-50/30 overflow-hidden min-h-[400px]">

                    {/* Animated Background Radar Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-64 h-64 bg-blue-100 rounded-full animate-ping opacity-20" />
                        <div className="absolute w-48 h-48 bg-blue-200 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
                    </div>

                    <div className="relative mb-8">
                        {/* Main Center Icon */}
                        <div className="relative z-10 w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border shadow-2xl" style={{ color: '#036BB4', borderColor: '#f0f7ff' }}>
                            <Search size={40} className="animate-bounce" />
                        </div>

                        {/* Orbiting Icons */}
                        <div className="absolute -top-4 -left-12 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg animate-float" style={{ backgroundColor: '#036BB4' }}>
                            <Truck size={18} />
                        </div>
                        <div className="absolute -bottom-2 -right-10 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-float-delayed">
                            <ShieldCheck size={22} />
                        </div>
                        <div className="absolute top-10 -right-14 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white shadow-lg animate-float">
                            <Globe size={16} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
                            Finding the Best Match <br />
                            <span style={{ color: '#036BB4' }}>for Your Shipment</span>
                        </h3>
                        <p className="text-gray-500 text-base max-w-xs mx-auto leading-relaxed">
                            Our AI is analyzing live bids and transporter ratings to secure the most reliable partner for you.
                        </p>

                        {/* Animated Loading Dots */}
                        <div className="flex gap-1.5 justify-center mt-6">
                            <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: '#036BB4' }} />
                            <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: '#036BB4' }} />
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#036BB4' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* View All Bids Modal */}
            {showAllBids && bids.length > 0 && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAllBids(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">All Bids</h3>
                                <button
                                    onClick={() => setShowAllBids(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="py-3 px-4 font-semibold text-sm">Bidder</th>
                                            <th className="py-3 px-4 font-semibold text-sm">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bids.map((bid, idx) => (
                                            <tr key={idx} className="border-b border-gray-100">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f7ff' }}>
                                                            <span className="text-xs font-bold" style={{ color: '#036BB4' }}>{bid.logo}</span>
                                                        </div>
                                                        <span className="text-gray-700">{bid.bidder}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-gray-800">{bid.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
        </div>
    );
};

export default BidsSection;