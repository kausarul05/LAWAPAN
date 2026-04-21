"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Truck, ChevronLeft, ChevronRight, Loader, Search } from 'lucide-react';
import { getTransporterShipments } from '../../components/lib/apiClient';
import { toast } from 'react-toastify';

// Main Shipments List Component
const ActiveShipments = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0
  });
  const [requestingPayment, setRequestingPayment] = useState(null);

  // Get transporter ID from localStorage
  const getTransporterId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transporter_id');
    }
    return null;
  };

  // Fetch shipments
  const fetchShipments = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      console.log('🔍 Fetching shipments for transporter:', transporterId);
      
      const response = await getTransporterShipments(transporterId, page, 10, search);
      
      console.log('📦 Shipments response:', response);

      if (response.success) {
        // Transform the API response to match your component structure
        const transformedShipments = response.data.shipments.map(shipment => ({
          id: shipment._id,
          title: shipment.shipment_title || 'Untitled',
          route: `${shipment.pickup_address?.split(',')[0] || 'Pickup'} – ${shipment.delivery_address?.split(',')[0] || 'Delivery'}`,
          status: shipment.status || 'Unknown',
          statusColor: getStatusColor(shipment.status),
          pickup: shipment.pickup_address,
          delivery: shipment.delivery_address,
          driver_id: shipment.driver_id,
          vehicle_id: shipment.vehicle_id,
          price: shipment.price,
          weight: shipment.weight,
          packaging: shipment.type_of_packaging,
          ...shipment
        }));

        setShipments(transformedShipments);
        setPagination(response.data.pagination || {
          page: page,
          limit: 10,
          total: transformedShipments.length,
          totalPage: Math.ceil(transformedShipments.length / 10)
        });
      } else {
        throw new Error(response.message || 'Failed to fetch shipments');
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message);
      
      // If unauthorized, redirect to login
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle payment request
  const handlePaymentRequest = async (shipmentId, shipmentTitle) => {
    // if (!window.confirm(`Request payment for "${shipmentTitle}"?`)) {
    //   return;
    // }

    try {
      setRequestingPayment(shipmentId);
      
      // Here you would make an API call to send payment request to admin
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Payment request sent for shipment: ${shipmentId}`);
      
      toast.success(`Payment request for "${shipmentTitle}" has been sent to the admin. You will be notified once processed.`);
    } catch (error) {
      console.error('Error sending payment request:', error);
      toast.error('Failed to send payment request. Please try again.');
    } finally {
      setRequestingPayment(null);
    }
  };

  // Helper function to determine status color
  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('progress') || statusLower.includes('in_progress') || statusLower.includes('pending')) {
      return 'orange';
    } else if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return 'green';
    } else if (statusLower.includes('cancelled') || statusLower.includes('failed')) {
      return 'red';
    }
    return 'orange'; // default
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('en-US').format(price);
  };

  // Load shipments on component mount and when page changes
  useEffect(() => {
    fetchShipments(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1); // Reset to first page on search
        fetchShipments(1, searchTerm);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewDetail = (id) => {
    router.push(`/dashboard/Transporter/active-shipments/${id}`);
  };

  const handleViewTracking = (id) => {
    router.push(`/dashboard/Transporter/active-shipments/${id}/tracking`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  if (loading && shipments.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading shipments...</p>
        </div>
      </div>
    );
  }

  if (error && shipments.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button 
            onClick={() => fetchShipments(currentPage, searchTerm)}
            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">My Shipments</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader className="w-4 h-4 animate-spin text-[#036BB4]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#036BB4] text-white">
              <th className="text-left py-3 px-6 text-sm font-semibold">Shipment ID</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Shipment Title</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Pickup – Delivery</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Amount</th>
              <th className="text-left py-3 px-6 text-sm font-semibold">Status</th>
              <th className="text-center py-3 px-6 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length > 0 ? (
              shipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-black">
                    #{shipment.id?.slice(-6)}
                  </td>
                  <td className="py-4 px-6 text-sm text-black font-medium">
                    {shipment.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-black">
                    {shipment.route}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-green-600">
                    ${formatPrice(shipment.price)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      shipment.statusColor === 'orange' 
                        ? 'bg-orange-100 text-orange-600' 
                        : shipment.statusColor === 'green'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {formatStatus(shipment.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(shipment.id)}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewTracking(shipment.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Track Shipment"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePaymentRequest(shipment.id, shipment.title)}
                        disabled={requestingPayment === shipment.id}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {requestingPayment === shipment.id ? (
                          <Loader className="w-4 h-4 animate-spin inline mr-1" />
                        ) : (
                          'Request Payment'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  {searchTerm ? 'No shipments found matching your search.' : 'No active shipments found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPage > 0 && (
        <>
          <div className="flex items-center justify-end gap-2 mt-8 px-6 pb-6">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4] ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                  page === currentPage 
                    ? 'bg-[#036BB4] text-white shadow-md' 
                    : page === '...'
                    ? 'text-gray-500 cursor-default'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPage}
              className={`w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4] ${
                currentPage === pagination.totalPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Summary */}
          <div className="text-right px-6 pb-4 text-sm text-gray-600">
            Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} shipments
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveShipments;