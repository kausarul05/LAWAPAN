"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, X, Loader, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBankDetails, createBankDetails, updateBankDetails, deleteBankDetails } from '../../../components/lib/apiClient';
import { toast } from 'react-toastify';

const BankDetailsView = () => {
  const router = useRouter();
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    account_number: '',
    bank_name: '',
    routing_number: '',
    bankholder_name: '',
    bank_address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Get user ID from localStorage
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userID');
    }
    return null;
  };

  // Fetch bank details
  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      console.log('🔍 Fetching bank details for user:', userId);
      
      const response = await getBankDetails();
      
      console.log('📦 Bank details response:', response);

      if (response.success) {
        if (response.data && Array.isArray(response.data)) {
          setBankDetails(response.data);
        } else if (response.data && !Array.isArray(response.data)) {
          setBankDetails([response.data]);
        } else {
          setBankDetails([]);
        }
      } else if (response.message === 'Bank details not found') {
        setBankDetails([]);
      } else {
        throw new Error(response.message || 'Failed to fetch bank details');
      }
    } catch (err) {
      console.error('Error fetching bank details:', err);
      setError(err.message);
      
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.account_number.trim()) errors.account_number = 'Account number is required';
    if (!formData.bank_name.trim()) errors.bank_name = 'Bank name is required';
    if (!formData.routing_number.trim()) errors.routing_number = 'Routing number is required';
    if (!formData.bankholder_name.trim()) errors.bankholder_name = 'Bankholder name is required';
    if (!formData.bank_address.trim()) errors.bank_address = 'Bank address is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      account_number: '',
      bank_name: '',
      routing_number: '',
      bankholder_name: '',
      bank_address: ''
    });
    setFormErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setShowModal(true);
  };

  // Open edit modal
  const handleEditClick = (bank) => {
    setFormData({
      account_number: bank.account_number || '',
      bank_name: bank.bank_name || '',
      routing_number: bank.routing_number || '',
      bankholder_name: bank.bankholder_name || '',
      bank_address: bank.bank_address || ''
    });
    setIsEditing(true);
    setEditingId(bank._id);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (bankId) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) {
      return;
    }

    try {
      setDeletingId(bankId);
      
      console.log('🗑️ Deleting bank account:', bankId);
      
      const response = await deleteBankDetails(bankId);
      
      console.log('✅ Delete response:', response);

      if (response.success) {
        toast.success('Bank account deleted successfully!');
        fetchBankDetails();
      } else {
        throw new Error(response.message || 'Failed to delete bank account');
      }
    } catch (err) {
      console.error('Error deleting bank account:', err);
      toast.error(err.message || 'Failed to delete bank account. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle submit (create or update)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      const payload = {
        user_id: userId,
        ...formData
      };

      let response;
      
      if (isEditing && editingId) {
        console.log('📝 Updating bank details:', payload);
        response = await updateBankDetails(editingId, payload);
      } else {
        console.log('💰 Creating bank details:', payload);
        response = await createBankDetails(payload);
      }
      
      console.log('✅ Bank details response:', response);

      if (response.success) {
        toast.success(isEditing ? 'Bank details updated successfully!' : 'Bank account added successfully!');
        setShowModal(false);
        resetForm();
        fetchBankDetails();
      } else {
        throw new Error(response.message || 'Failed to save bank details');
      }
    } catch (err) {
      console.error('Error saving bank details:', err);
      toast.error(err.message || 'Failed to save bank details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-[#F4F7FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading bank details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F4F7FA] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-black">Bank Details</h1>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#036BB4] text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Add Bank Account
        </button>
      </div>

      {bankDetails && bankDetails.length > 0 ? (
        <div className="space-y-6">
          {bankDetails.map((bank, index) => (
            <div key={bank._id || index} className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-black">Account {index + 1}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(bank)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  {/* <button 
                    onClick={() => handleDelete(bank._id)}
                    disabled={deletingId === bank._id}
                    className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deletingId === bank._id ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button> */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-r border-b border-gray-100">
                  <p className="text-sm text-gray-400 mb-1">Account Number</p>
                  <p className="font-bold text-black">{bank.account_number}</p>
                </div>
                <div className="p-6 border-b border-gray-100">
                  <p className="text-sm text-gray-400 mb-1">Routing Number</p>
                  <p className="font-bold text-black">{bank.routing_number}</p>
                </div>
                <div className="p-6 border-r border-b border-gray-100">
                  <p className="text-sm text-gray-400 mb-1">Bank Name</p>
                  <p className="font-bold text-black">{bank.bank_name}</p>
                </div>
                <div className="p-6 border-b border-gray-100">
                  <p className="text-sm text-gray-400 mb-1">Bankholder Name</p>
                  <p className="font-bold text-black">{bank.bankholder_name}</p>
                </div>
                <div className="p-6 col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">Bank Address</p>
                  <p className="font-bold text-black">{bank.bank_address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 6h12M5 14h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2zm0 0h14M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No bank accounts added yet</p>
          <button 
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#036BB4] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add Your First Bank Account
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-black">
                  {isEditing ? 'Edit Bank Account' : 'Add Bank Account'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className={`w-full px-4 py-3 border ${formErrors.account_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-black`}
                  />
                  {formErrors.account_number && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.account_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Routing Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="routing_number"
                    value={formData.routing_number}
                    onChange={handleInputChange}
                    placeholder="Enter routing number"
                    className={`w-full px-4 py-3 border ${formErrors.routing_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-black`}
                  />
                  {formErrors.routing_number && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.routing_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    className={`w-full px-4 py-3 border ${formErrors.bank_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-black`}
                  />
                  {formErrors.bank_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.bank_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Bankholder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankholder_name"
                    value={formData.bankholder_name}
                    onChange={handleInputChange}
                    placeholder="Enter bankholder name"
                    className={`w-full px-4 py-3 border ${formErrors.bankholder_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] text-black`}
                  />
                  {formErrors.bankholder_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.bankholder_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Bank Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bank_address"
                    value={formData.bank_address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter bank address"
                    className={`w-full px-4 py-3 border ${formErrors.bank_address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] resize-none text-black`}
                  />
                  {formErrors.bank_address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.bank_address}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {isEditing ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    isEditing ? 'Update' : 'Add'
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

export default BankDetailsView;