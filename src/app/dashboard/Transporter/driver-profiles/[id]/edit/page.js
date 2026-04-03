"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Pencil, X, Upload, Loader, FileText } from "lucide-react";
import { getDriverDetails, updateDriver, deleteDriver } from "@/components/lib/apiClient";

export default function EditDriver() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    driver_name: '',
    phone: '',
    email: '',
    country: '',
    profile_picture: null,
    driver_license: null
  });
  const [originalData, setOriginalData] = useState(null);
  const [previews, setPreviews] = useState({
    profile_picture: null,
    driver_license: null
  });
  const [newFiles, setNewFiles] = useState({
    profile_picture: null,
    driver_license: null
  });

  // Fetch driver details
  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching driver details for ID:', params.id);
      
      const response = await getDriverDetails(params.id);
      
      console.log('📦 Driver details:', response);

      if (response.success && response.data) {
        setOriginalData(response.data);
        setFormData({
          driver_name: response.data.driver_name || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          country: response.data.country || '',
          profile_picture: null,
          driver_license: null
        });
      } else {
        throw new Error(response.message || 'Failed to fetch driver details');
      }
    } catch (err) {
      console.error('Error fetching driver details:', err);
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
  };

  // Handle file upload
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setNewFiles(prev => ({ ...prev, [fieldName]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove new file
  const removeNewFile = (fieldName) => {
    setNewFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData.driver_name.trim() || !formData.phone.trim()) {
      alert('Driver name and phone number are required');
      return;
    }

    try {
      setSubmitting(true);
      
      const submitFormData = new FormData();
      submitFormData.append('driver_name', formData.driver_name);
      submitFormData.append('phone', formData.phone);
      if (formData.email) submitFormData.append('email', formData.email);
      if (formData.country) submitFormData.append('country', formData.country);
      if (newFiles.profile_picture) submitFormData.append('profile_picture', newFiles.profile_picture);
      if (newFiles.driver_license) submitFormData.append('driver_license', newFiles.driver_license);

      console.log('📝 Updating driver:', params.id);
      
      const response = await updateDriver(params.id, submitFormData);
      
      console.log('✅ Update response:', response);

      if (response.success) {
        alert('Driver updated successfully!');
        router.push(`/dashboard/Transporter/driver-profiles/${params.id}`);
      } else {
        throw new Error(response.message || 'Failed to update driver');
      }
    } catch (err) {
      console.error('Error updating driver:', err);
      alert(err.message || 'Failed to update driver. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return;
    }

    try {
      setDeleting(true);
      
      console.log('🗑️ Deleting driver:', params.id);
      
      const response = await deleteDriver(params.id);
      
      console.log('✅ Delete response:', response);

      if (response.success) {
        alert('Driver deleted successfully!');
        router.push('/dashboard/Transporter/driver-profiles');
      } else {
        throw new Error(response.message || 'Failed to delete driver');
      }
    } catch (err) {
      console.error('Error deleting driver:', err);
      alert(err.message || 'Failed to delete driver. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchDriverDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading driver details...</p>
        </div>
      </div>
    );
  }

  if (error || !originalData) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-800 mb-4">{error || 'Driver not found'}</p>
            <button
              onClick={() => router.push('/dashboard/Transporter/driver-profiles')}
              className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
            >
              Back to Drivers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard/Transporter/driver-profiles/${params.id}`} className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
          <ArrowLeft size={20} className="text-blue-600" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Edit Driver Profile Details</h1>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Driver Name *</label>
          <input 
            type="text" 
            name="driver_name"
            value={formData.driver_name}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number *</label>
          <input 
            type="text" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Country</label>
          <input 
            type="text" 
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Profile Picture</label>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-[200px] h-[200px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            {previews.profile_picture ? (
              <img src={previews.profile_picture} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : originalData.profile_picture?.[0] ? (
              <img src={originalData.profile_picture[0]} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <FileText size={40} className="text-slate-400" />
            )}
            
            <label className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 cursor-pointer transition">
              <Pencil size={16} className="text-slate-700" />
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile_picture')} className="hidden" />
            </label>
            {newFiles.profile_picture && (
              <button 
                onClick={() => removeNewFile('profile_picture')}
                className="absolute top-4 left-4 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        {newFiles.profile_picture && (
          <p className="text-xs text-green-600 mt-2">New file selected. Will be uploaded on save.</p>
        )}
      </div>

      {/* Driver License Section */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Driving License</label>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-[350px] h-[200px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            {previews.driver_license ? (
              <img src={previews.driver_license} alt="License Preview" className="w-full h-full object-contain" />
            ) : originalData.driver_license?.[0] ? (
              <a 
                href={originalData.driver_license[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <FileText size={40} className="text-blue-500" />
                <span className="text-xs block">View Current License</span>
              </a>
            ) : (
              <FileText size={40} className="text-slate-400" />
            )}
            
            <label className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 cursor-pointer transition">
              <Pencil size={16} className="text-slate-700" />
              <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'driver_license')} className="hidden" />
            </label>
            {newFiles.driver_license && (
              <button 
                onClick={() => removeNewFile('driver_license')}
                className="absolute top-4 left-4 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        {newFiles.driver_license && (
          <p className="text-xs text-green-600 mt-2">New file selected. Will be uploaded on save.</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <button 
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 flex justify-center items-center gap-2 py-3 border border-red-500 text-red-500 rounded-full font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 size={18} />}
          Remove
        </button>
        
        <button 
          onClick={handleUpdate}
          disabled={submitting}
          className="flex-1 flex justify-center items-center gap-2 py-3 bg-[#006bbd] text-white rounded-full font-medium hover:bg-[#005da3] transition shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Pencil size={18} />}
          Save & Change
        </button>
      </div>
    </div>
  );
}