"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, Plus, X, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTransporterIssues, deleteIssue, createIssue, getTransporterShipments } from '@/components/lib/apiClient';

const IssueReported = () => {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
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
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeShipments, setActiveShipments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shipment_id: '',
    issue_title: '',
    reported_on: '',
    issue_description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Get transporter ID from localStorage
  const getTransporterId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transporter_id');
    }
    return null;
  };

  // Fetch issues
  const fetchIssues = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      console.log('🔍 Fetching issues for transporter:', transporterId);
      
      const response = await getTransporterIssues(transporterId, page, 10, search);
      
      console.log('📦 Issues response:', response);

      if (response.success) {
        setIssues(response.data.issues || []);
        setPagination(response.data.pagination || {
          page: page,
          limit: 10,
          total: response.data.issues?.length || 0,
          totalPage: Math.ceil((response.data.issues?.length || 0) / 10)
        });
      } else {
        throw new Error(response.message || 'Failed to fetch issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError(err.message);
      
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch active shipments for dropdown
  const fetchActiveShipments = async () => {
    try {
      const transporterId = getTransporterId();
      if (!transporterId) return;

      console.log('🔍 Fetching active shipments for transporter:', transporterId);
      
      const response = await getTransporterShipments(transporterId, 1, 100, '');
      
      console.log('📦 Active shipments response:', response);

      if (response.success) {
        // Filter only active/in-progress shipments
        const active = response.data.shipments.filter(
          shipment => shipment.status === 'IN_PROGRESS' || shipment.status === 'PENDING'
        );
        setActiveShipments(active);
      }
    } catch (err) {
      console.error('Error fetching active shipments:', err);
    }
  };

  // Handle delete issue
  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    try {
      setDeletingId(issueId);
      
      console.log('🗑️ Deleting issue:', issueId);
      
      const response = await deleteIssue(issueId);
      
      console.log('✅ Delete response:', response);

      if (response.success) {
        fetchIssues(currentPage, searchTerm);
      } else {
        throw new Error(response.message || 'Failed to delete issue');
      }
    } catch (err) {
      console.error('Error deleting issue:', err);
      alert(err.message || 'Failed to delete issue. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle create issue
  const handleCreateIssue = async () => {
    // Validate form
    const errors = {};
    if (!formData.shipment_id) errors.shipment_id = 'Please select a shipment';
    if (!formData.issue_title.trim()) errors.issue_title = 'Issue title is required';
    if (!formData.issue_description.trim()) errors.issue_description = 'Issue description is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }
      
      const payload = {
        shipment_id: formData.shipment_id,
        transporter_id: transporterId,
        issue_title: formData.issue_title,
        reported_on: formData.reported_on || new Date().toISOString(),
        issue_description: formData.issue_description
      };
      
      console.log('📝 Creating issue with payload:', payload);
      
      const response = await createIssue(payload);
      
      console.log('✅ Create issue response:', response);

      if (response.success) {
        alert('Issue reported successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchIssues(currentPage, searchTerm);
      } else {
        throw new Error(response.message || 'Failed to create issue');
      }
    } catch (err) {
      console.error('Error creating issue:', err);
      alert(err.message || 'Failed to create issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      shipment_id: '',
      issue_title: '',
      reported_on: '',
      issue_description: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues(1, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPage) {
      setCurrentPage(page);
      fetchIssues(page, searchTerm);
    }
  };

  // Load issues on mount and fetch active shipments when modal opens
  useEffect(() => {
    fetchIssues(currentPage, searchTerm);
  }, [currentPage]);

  useEffect(() => {
    if (showCreateModal) {
      fetchActiveShipments();
    }
  }, [showCreateModal]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('open')) {
      return 'bg-[#FF5C00]';
    } else if (statusLower.includes('resolved') || statusLower.includes('closed')) {
      return 'bg-green-600';
    } else if (statusLower.includes('in progress')) {
      return 'bg-blue-600';
    }
    return 'bg-gray-600';
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

  if (loading && issues.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Issue reported</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#036BB4] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Report Issue
            </button>
            <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden w-full md:w-80">
              <div className="pl-3 py-2 bg-white">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search by title or shipment..." 
                value={searchTerm}
                onChange={handleSearch}
                className="px-2 py-2 text-sm w-full focus:outline-none text-gray-700"
              />
              {loading && (
                <div className="pr-3">
                  <Loader className="w-4 h-4 animate-spin text-[#036BB4]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#036BB4] text-white">
                <th className="py-4 px-4 font-semibold text-sm">Issue ID</th>
                <th className="py-4 px-4 font-semibold text-sm">Issue Title</th>
                <th className="py-4 px-4 font-semibold text-sm">Shipment Id</th>
                <th className="py-4 px-4 font-semibold text-sm">Transporter</th>
                <th className="py-4 px-4 font-semibold text-sm">Reported On</th>
                <th className="py-4 px-4 font-semibold text-sm">Status</th>
                <th className="py-4 px-4 font-semibold text-sm text-center">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-500 font-medium">#{issue._id?.slice(-6)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{issue.issue_title || issue.title || 'N/A'}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">#{issue.shipment_id?.slice(-6)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 overflow-hidden border border-gray-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                          T
                        </div>
                        {issue.transporter_name || 'Truck Lagbe'}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatDate(issue.reported_on || issue.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`${getStatusColor(issue.status)} text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit`}>
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        {issue.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => router.push(`/dashboard/Transporter/Issue-reported/${issue._id}`)}
                          className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                          disabled={deletingId === issue._id}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteIssue(issue._id)}
                          disabled={deletingId === issue._id}
                          className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === issue._id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    {searchTerm ? 'No issues found matching your search.' : 'No issues reported yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPage > 0 && (
          <div className="flex items-center justify-end gap-2 mt-8">
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
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreateModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Report an Issue</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Shipment Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipment <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shipment_id"
                    value={formData.shipment_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.shipment_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-gray-900`}
                  >
                    <option value="">Select a shipment</option>
                    {activeShipments.map(shipment => (
                      <option key={shipment._id} value={shipment._id}>
                        {shipment.shipment_title} - {shipment._id?.slice(-6)}
                      </option>
                    ))}
                  </select>
                  {formErrors.shipment_id && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.shipment_id}</p>
                  )}
                  {activeShipments.length === 0 && (
                    <p className="text-yellow-500 text-xs mt-1">No active shipments available to report issues for.</p>
                  )}
                </div>

                {/* Issue Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="issue_title"
                    value={formData.issue_title}
                    onChange={handleInputChange}
                    placeholder="e.g., Delay, Damaged Goods, Wrong Delivery"
                    className={`w-full px-4 py-3 border ${formErrors.issue_title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-gray-900`}
                  />
                  {formErrors.issue_title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.issue_title}</p>
                  )}
                </div>

                {/* Reported On / Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason / Details
                  </label>
                  <input
                    type="text"
                    name="reported_on"
                    value={formData.reported_on}
                    onChange={handleInputChange}
                    placeholder="e.g., Legal issue, Technical issue, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-gray-900"
                  />
                </div>

                {/* Issue Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="issue_description"
                    value={formData.issue_description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the issue in detail..."
                    className={`w-full px-4 py-3 border ${formErrors.issue_description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-gray-900 resize-none`}
                  />
                  {formErrors.issue_description && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.issue_description}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateIssue}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Report Issue'
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

export default IssueReported;