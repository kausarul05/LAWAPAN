"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Building2,
  Truck as TruckIcon,
  Globe
} from 'lucide-react';
import { getShipperShipments } from '../../../../components/lib/apiClient';

const PaymentRequestPage = () => {
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0
  });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');
  const [bankDetails, setBankDetails] = useState({
    accountName: 'LAWAPAN TRUCK SARL',
    accountNumber: '1234 5678 9012 3456',
    bankName: 'ECOBANK',
    swiftCode: 'ECOCCICI',
    country: 'Côte d\'Ivoire'
  });

  const itemsPerPage = 10;

  // Get shipper ID from localStorage
  const getShipperId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shipper_id');
    }
    return null;
  };

  // Fetch shipments
  const fetchShipments = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const shipperId = getShipperId();
      if (!shipperId) {
        throw new Error('Shipper ID not found. Please login again.');
      }

      console.log('🔍 Fetching shipments for shipper:', shipperId);

      const response = await getShipperShipments(shipperId, page, itemsPerPage, search);

      console.log('📦 Shipments response:', response);

      if (response.success) {
        const allShipments = response.data?.shipments || [];

        // Filter shipments that need payment
        const pendingPaymentShipments = allShipments.filter(shipment =>
          shipment.payment_status === 'PENDING' ||
          shipment.payment_status === 'UNPAID' ||
          !shipment.payment_status ||
          shipment.status === 'PENDING' ||
          shipment.status === 'BIDDING'
        );

        setShipments(pendingPaymentShipments);

        const responsePagination = response.data?.pagination;
        if (responsePagination) {
          setPagination(responsePagination);
        } else {
          setPagination({
            page: page,
            limit: itemsPerPage,
            total: pendingPaymentShipments.length,
            totalPage: Math.ceil(pendingPaymentShipments.length / itemsPerPage)
          });
        }
      } else {
        throw new Error(response.message || 'Failed to fetch shipments');
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message);

      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load shipments on mount and when page changes
  useEffect(() => {
    fetchShipments(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1);
        fetchShipments(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment);
    setSelectedPaymentMethod('online');
    setShowPaymentModal(true);
  };

  // Initialize PayDunya payment
  const initializePayDunyaPayment = async () => {
    try {
      // In a real implementation, you would call your backend API to create a PayDunya invoice
      const response = await fetch('https://server.lawapantruck.com/api/v1/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('auth_token')
        },
        body: JSON.stringify({
          shipment_id: selectedShipment._id,
          amount: selectedShipment.price,
          description: `Payment for shipment: ${selectedShipment.shipment_title}`,
          customer_name: localStorage.getItem('user_name') || 'Customer',
          customer_email: localStorage.getItem('user_email') || 'customer@example.com'
        })
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        // Redirect to PayDunya payment page
        window.location.href = data.payment_url;
      } else {
        throw new Error(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('PayDunya initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedShipment) return;

    if (selectedPaymentMethod === 'online') {
      // For online payment, redirect to PayDunya
      await initializePayDunyaPayment();
      return;
    }

    // For bank transfer and cash on delivery, show confirmation
    setProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentMethodName = selectedPaymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';

      // In a real app, you would call an API to record the payment request
      console.log(`Payment initiated via ${paymentMethodName} for shipment:`, selectedShipment._id);

      alert(`${paymentMethodName} payment initiated for "${selectedShipment.shipment_title}". Our team will contact you shortly to confirm.`);
      setShowPaymentModal(false);
      setSelectedShipment(null);

      // Refresh the list
      fetchShipments(currentPage, searchTerm);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('en-US').format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('paid') || statusLower.includes('completed')) {
      return { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Paid' };
    } else if (statusLower.includes('pending') || statusLower.includes('unpaid')) {
      return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, text: 'Pending' };
    } else if (statusLower.includes('failed') || statusLower.includes('cancelled')) {
      return { color: 'bg-red-100 text-red-700', icon: XCircle, text: 'Failed' };
    }
    return { color: 'bg-gray-100 text-gray-700', icon: Clock, text: status || 'Pending' };
  };

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
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading payment requests...</p>
        </div>
      </div>
    );
  }

  if (error && shipments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Requests</h1>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by shipment title or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4]"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            {loading && (
              <div className="absolute right-3 top-3">
                <Loader className="w-5 h-5 animate-spin text-[#036BB4]" />
              </div>
            )}
          </div>
        </div>

        {/* Payment Requests Table */}
        {shipments.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#036BB4] text-white">
                      <th className="text-left py-3 px-4 text-sm font-semibold">Shipment ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Route</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Created</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shipments.map((shipment) => {
                      const statusBadge = getStatusBadge(shipment.payment_status || shipment.status);
                      const StatusIcon = statusBadge.icon;

                      return (
                        <tr key={shipment._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                            #{shipment._id?.slice(-8)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                            {shipment.shipment_title}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span>{shipment.pickup_address?.split(',')[0] || 'Pickup'}</span>
                              <span>→</span>
                              <span>{shipment.delivery_address?.split(',')[0] || 'Delivery'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                            ${formatPrice(shipment.price)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(shipment.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleViewDetails(shipment)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Make Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${page === currentPage
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
            )}

            {/* Summary */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} payment requests
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500">
              {searchTerm ? 'No payment requests found matching your search.' : 'No pending payment requests.'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                When you create a shipment, payment requests will appear here.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedShipment && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPaymentModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Shipment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Shipment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipment ID:</span>
                      <span className="font-mono text-black">#{selectedShipment._id?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Title:</span>
                      <span className="font-medium text-black">{selectedShipment.shipment_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Route:</span>
                      <span className="text-black">{selectedShipment.pickup_address?.split(',')[0]} → {selectedShipment.delivery_address?.split(',')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight:</span>
                      <span className="text-black">{selectedShipment.weight}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Amount to Pay</p>
                  <p className="text-4xl font-bold text-[#036BB4]">
                    ${formatPrice(selectedShipment.price)}
                  </p>
                </div>

                {/* Payment Methods - 3 Options */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Select Payment Method</h3>
                  <div className="space-y-3">
                    {/* Online Payment - PayDunya */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all text-black ${selectedPaymentMethod === 'online'
                        ? 'border-[#036BB4] bg-blue-50'
                        : 'border-gray-200 hover:border-[#036BB4]'
                        }`}
                      onClick={() => setSelectedPaymentMethod('online')}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={selectedPaymentMethod === 'online'}
                          readOnly
                          className="w-4 h-4 text-[#036BB4]"
                        />
                        <Globe className="w-5 h-5 text-[#036BB4]" />
                        <div>
                          <span className="font-medium">Online Payment</span>
                          <p className="text-xs text-gray-500">Pay securely with PayDunya (Credit Card, Mobile Money, etc.)</p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all text-black ${selectedPaymentMethod === 'bank'
                        ? 'border-[#036BB4] bg-blue-50'
                        : 'border-gray-200 hover:border-[#036BB4]'
                        }`}
                      onClick={() => setSelectedPaymentMethod('bank')}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={selectedPaymentMethod === 'bank'}
                          readOnly
                          className="w-4 h-4 text-[#036BB4]"
                        />
                        <Building2 className="w-5 h-5 text-[#036BB4]" />
                        <div>
                          <span className="font-medium">Bank Transfer</span>
                          <p className="text-xs text-gray-500">Transfer directly to our bank account</p>
                        </div>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all text-black ${selectedPaymentMethod === 'cod'
                        ? 'border-[#036BB4] bg-blue-50'
                        : 'border-gray-200 hover:border-[#036BB4]'
                        }`}
                      onClick={() => setSelectedPaymentMethod('cod')}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={selectedPaymentMethod === 'cod'}
                          readOnly
                          className="w-4 h-4 text-[#036BB4]"
                        />
                        <TruckIcon className="w-5 h-5 text-[#036BB4]" />
                        <div>
                          <span className="font-medium">Cash on Delivery</span>
                          <p className="text-xs text-gray-500">Pay when your shipment is delivered</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details - Show only when Bank Transfer is selected */}
                {selectedPaymentMethod === 'bank' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Bank Account Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank Name:</span>
                        <span className="font-medium text-black">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Name:</span>
                        <span className="font-medium text-black">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Number:</span>
                        <span className="font-mono text-black">{bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">SWIFT Code:</span>
                        <span className="font-mono text-black">{bankDetails.swiftCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Country:</span>
                        <span className="font-medium text-black">{bankDetails.country}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                      Please use your Shipment ID as reference when making the transfer.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery Info */}
                {selectedPaymentMethod === 'cod' && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">Cash on Delivery</h3>
                    <p className="text-sm text-yellow-700">
                      You will pay the amount of <strong>${formatPrice(selectedShipment.price)}</strong> when your shipment is delivered to the destination.
                      Our delivery team will contact you before delivery.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={processingPayment}
                  className="px-6 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processingPayment ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === 'online' && <Globe className="w-4 h-4" />}
                      {selectedPaymentMethod === 'bank' && <Building2 className="w-4 h-4" />}
                      {selectedPaymentMethod === 'cod' && <TruckIcon className="w-4 h-4" />}
                      {selectedPaymentMethod === 'online' ? 'Pay Online' :
                        selectedPaymentMethod === 'bank' ? 'Confirm Transfer' : 'Confirm COD'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentRequestPage;