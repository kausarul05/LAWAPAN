"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, MapPin, Loader } from "lucide-react";
import { getAvailableBids } from "@/components/lib/apiClient";

const AvailableBidsPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
        total: 0,
        totalPage: 0
    });
    const itemsPerPage = 8;

    // Fetch available bids
    const fetchAvailableBids = async (page = 1, search = '') => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔍 Fetching available bids...');
            
            const response = await getAvailableBids(page, itemsPerPage, search);
            
            console.log('📦 Bids response:', response);

            if (response.success) {
                setBids(response.data || []);
                setPagination({
                    page: page,
                    limit: itemsPerPage,
                    total: response.data?.length || 0,
                    totalPage: Math.ceil((response.data?.length || 0) / itemsPerPage)
                });
            } else {
                throw new Error(response.message || 'Failed to fetch bids');
            }
        } catch (err) {
            console.error('Error fetching bids:', err);
            setError(err.message);
            
            // If unauthorized, redirect to login
            if (err.message.includes('Session expired') || err.message.includes('401')) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load bids on mount and when page/search changes
    useEffect(() => {
        fetchAvailableBids(currentPage, searchQuery);
    }, [currentPage]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchAvailableBids(1, searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleBidClick = (bidId) => {
        router.push(`/dashboard/Transporter/bids/${bidId}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPage) {
            setCurrentPage(page);
        }
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    // Get first image from shipment_images array
    const getFirstImage = (images) => {
        if (images && images.length > 0) {
            return images[0];
        }
        return "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg"; // fallback image
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const total = pagination.totalPage || 1;

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

    if (loading && bids.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
                    <p className="text-gray-600">Loading available bids...</p>
                </div>
            </div>
        );
    }

    if (error && bids.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className=" mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Available Bids</h1>
                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                        <div className="text-red-500 mb-4">⚠️</div>
                        <p className="text-gray-800 mb-4">{error}</p>
                        <button
                            onClick={() => fetchAvailableBids(currentPage, searchQuery)}
                            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className=" mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Available Bids</h1>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        {loading && (
                            <div className="absolute right-3 top-3">
                                <Loader className="w-5 h-5 animate-spin text-[#036BB4]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bids Grid */}
                {bids.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                            {bids.map((bid) => (
                                <div
                                    key={bid._id}
                                    onClick={() => handleBidClick(bid._id)}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="relative h-40">
                                        <Image
                                            src={getFirstImage(bid.shipment_images)}
                                            alt={bid.shipment_title}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg";
                                            }}
                                        />
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                                            {bid.shipment_title?.length > 30 
                                                ? bid.shipment_title.substring(0, 30) + '...' 
                                                : bid.shipment_title || 'Untitled'}
                                        </div>
                                        {bid.status === 'BIDDING' && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                BIDDING
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">
                                                {bid.pickup_address?.split(',')[0] || 'Pickup'} → {bid.delivery_address?.split(',')[0] || 'Delivery'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-900">
                                                ${formatPrice(bid.price)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {bid.weight}
                                            </p>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            {bid.type_of_packaging}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPage > 1 && (
                            <>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {getPageNumbers().map((page, idx) => (
                                        page === '...' ? (
                                            <span key={idx} className="w-10 h-10 flex items-center justify-center text-gray-400">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={idx}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    page === currentPage
                                                        ? 'bg-[#036BB4] text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === pagination.totalPage}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Summary */}
                                <div className="text-center mt-4 text-sm text-gray-500">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, bids.length)} of {pagination.total} bids
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                        <p className="text-gray-500">
                            {searchQuery 
                                ? 'No bids found matching your search.' 
                                : 'No available bids at the moment.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableBidsPage;