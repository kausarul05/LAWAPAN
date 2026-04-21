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
  Globe,
  Receipt,
  DollarSign
} from 'lucide-react';
// import { getShipperShipments, initializePayment } from '../../../components/lib/apiClient';

const AdminPaymentRequestsPage = () => {
  const router = useRouter();
  const [paymentRequests, setPaymentRequests] = useState([]);
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
  const [selectedRequest, setSelectedRequest] = useState(null);
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

  // Mock payment requests data (replace with actual API call)
  const fetchPaymentRequests = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Replace with real API response
      const mockRequests = [
        {
          _id: '1',
          shipment_id: '69a749d79e1d313ca0719f26',
          shipment_title: 'Furniture Delivery',
          amount: 150000,
          status: 'PENDING',
          due_date: '2026-04-30',
          created_at: '2026-04-20T10:00:00Z',
          payment_method: null,
          pickup_address: '123 Main St, Abidjan',
          delivery_address: '456 Market St, Ouagadougou'
        },
        {
          _id: '2',
          shipment_id: '69a749d79e1d313ca0719f27',
          shipment_title: 'Electronics Shipment',
          amount: 250000,
          status: 'PENDING',
          due_date: '2026-05-05',
          created_at: '2026-04-22T14:30:00Z',
          payment_method: null,
          pickup_address: '789 Tech Park, Accra',
          delivery_address: '101 Business Hub, Lagos'
        },
        {
          _id: '3',
          shipment_id: '69a749d79e1d313ca0719f28',
          shipment_title: 'Food Products',
          amount: 75000,
          status: 'PAID',
          due_date: '2026-04-15',
          created_at: '2026-04-10T09:00:00Z',
          payment_method: 'ONLINE',
          pickup_address: '321 Farm Road, Nairobi',
          delivery_address: '555 Supermarket, Kampala'
        }
      ];
      
      const filtered = mockRequests.filter(req =>
        req.shipment_title.toLowerCase().includes(search.toLowerCase()) ||
        req._id.includes(search)
      );
      
      setPaymentRequests(filtered);
      setPagination({
        page: page,
        limit: itemsPerPage,
        total: filtered.length,
        totalPage: Math.ceil(filtered.length / itemsPerPage)
      });
      
    } catch (err) {
      console.error('Error fetching payment requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize PayDunya payment
  const initializePayDunyaPayment = async (amount) => {
    try {
      setProcessingPayment(true);
      
      const response = await fetch('https://server.lawapantruck.com/api/v1/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount })
      });
      
      const data = await response.json();
      
      if (data.success && data.payment_url) {
        window.open(data.payment_url, '_blank');
        alert('Payment window opened. Please complete your payment.');
        setShowPaymentModal(false);
        setSelectedRequest(null);
        fetchPaymentRequests(currentPage, searchTerm);
      } else {
        throw new Error(data.message || data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('PayDunya initialization error:', error);
      alert(error.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedRequest) return;
    
    if (selectedPaymentMethod === 'online') {
      await initializePayDunyaPayment(selectedRequest.amount);
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const paymentMethodName = selectedPaymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';
      
      alert(`${paymentMethodName} payment initiated for "${selectedRequest.shipment_title}". Our team will contact you shortly to confirm.`);
      setShowPaymentModal(false);
      setSelectedRequest(null);
      fetchPaymentRequests(currentPage, searchTerm);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleViewPayment = (request) => {
    setSelectedRequest(request);
    setSelectedPaymentMethod('online');
    setShowPaymentModal(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
    if (statusLower.includes('paid')) {
      return { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Paid' };
    } else if (statusLower.includes('pending')) {
      return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, text: 'Pending' };
    } else if (statusLower.includes('failed')) {
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

  useEffect(() => {
    fetchPaymentRequests(currentPage, searchTerm);
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPaymentRequests(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading && paymentRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading payment requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-black">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Payment Requests</h1>
          
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
        {paymentRequests.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#036BB4] text-white">
                      <th className="text-left py-3 px-4 text-sm font-semibold">Request ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Shipment Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paymentRequests.map((request) => {
                      const statusBadge = getStatusBadge(request.status);
                      const StatusIcon = statusBadge.icon;
                      
                      return (
                        <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                            #{request._id?.slice(-8)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                            {request.shipment_title}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                            ${formatPrice(request.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(request.due_date)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {request.status === 'PENDING' ? (
                              <button
                                onClick={() => handleViewPayment(request)}
                                className="px-4 py-2 bg-[#036BB4] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pay Now
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">Completed</span>
                            )}
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
            )}

            {/* Summary */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} payment requests
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Receipt className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500">
              {searchTerm ? 'No payment requests found matching your search.' : 'No pending payment requests from admin.'}
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRequest && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 text-black" onClick={() => setShowPaymentModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-black">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Payment Request Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Payment Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Request ID:</span>
                      <span className="font-mono">#{selectedRequest._id?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipment:</span>
                      <span className="font-medium">{selectedRequest.shipment_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due Date:</span>
                      <span>{formatDate(selectedRequest.due_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Amount to Pay</p>
                  <p className="text-4xl font-bold text-[#036BB4]">
                    ${formatPrice(selectedRequest.amount)}
                  </p>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Select Payment Method</h3>
                  <div className="space-y-3">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'online' 
                          ? 'border-[#036BB4] bg-blue-50' 
                          : 'border-gray-200 hover:border-[#036BB4]'
                      }`}
                      onClick={() => setSelectedPaymentMethod('online')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={selectedPaymentMethod === 'online'} readOnly className="w-4 h-4 text-[#036BB4]" />
                        <Globe className="w-5 h-5 text-[#036BB4]" />
                        <div>
                          <span className="font-medium">Online Payment</span>
                          <p className="text-xs text-gray-500">Pay securely with PayDunya</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'bank' 
                          ? 'border-[#036BB4] bg-blue-50' 
                          : 'border-gray-200 hover:border-[#036BB4]'
                      }`}
                      onClick={() => setSelectedPaymentMethod('bank')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={selectedPaymentMethod === 'bank'} readOnly className="w-4 h-4 text-[#036BB4]" />
                        <Building2 className="w-5 h-5 text-[#036BB4]" />
                        <div>
                          <span className="font-medium">Bank Transfer</span>
                          <p className="text-xs text-gray-500">Transfer directly to our bank account</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'cod' 
                          ? 'border-[#036BB4] bg-blue-50' 
                          : 'border-gray-200 hover:border-[#036BB4]'
                      }`}
                      onClick={() => setSelectedPaymentMethod('cod')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={selectedPaymentMethod === 'cod'} readOnly className="w-4 h-4 text-[#036BB4]" />
                        <TruckIcon className="w-5 h-5 text-[#036BB4]" />
                        <div>
                          <span className="font-medium">Cash</span>
                          <p className="text-xs text-gray-500">Pay when shipment is delivered</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPaymentMethod === 'bank' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Bank Account Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank Name:</span>
                        <span className="font-medium">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Number:</span>
                        <span className="font-mono">{bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">SWIFT Code:</span>
                        <span className="font-mono">{bankDetails.swiftCode}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'cod' && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-700">
                      You will pay <strong>${formatPrice(selectedRequest.amount)}</strong> when your shipment is delivered.
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

export default AdminPaymentRequestsPage;