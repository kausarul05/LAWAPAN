"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, FileText, Loader } from "lucide-react";
import { getDriverDetails, deleteDriver } from "@/components/lib/apiClient";
import { toast } from "react-toastify";

export default function DriverDetails() {
  const router = useRouter();
  const params = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch driver details
  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching driver details for ID:', params.id);
      
      const response = await getDriverDetails(params.id);
      
      console.log('📦 Driver details:', response);

      if (response.success && response.data) {
        setDriver(response.data);
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
        toast.success('Driver deleted successfully!');
        router.push('/dashboard/Transporter/driver-profiles');
      } else {
        throw new Error(response.message || 'Failed to delete driver');
      }
    } catch (err) {
      console.error('Error deleting driver:', err);
      toast.error(err.message || 'Failed to delete driver. Please try again.');
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

  if (error || !driver) {
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
        <Link href="/dashboard/Transporter/driver-profiles" className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
          <ArrowLeft size={20} className="text-blue-600" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Driver Profile Details</h1>
      </div>

      {/* Details Container */}
      <div className="border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Driver Name */}
          <div>
            <label className="block text-sm text-slate-500 mb-1">Driver Name</label>
            <div className="font-semibold text-slate-900">{driver.driver_name || 'N/A'}</div>
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-sm text-slate-500 mb-1">Phone Number</label>
            <div className="font-semibold text-slate-900">{driver.phone || 'N/A'}</div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-500 mb-1">Email</label>
            <div className="font-semibold text-slate-900">{driver.email || 'N/A'}</div>
          </div>
          {/* Country */}
          <div>
            <label className="block text-sm text-slate-500 mb-1">Country</label>
            <div className="font-semibold text-slate-900">{driver.country || 'N/A'}</div>
          </div>
        </div>
        
        <hr className="border-slate-100 mb-6" />

        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block text-sm text-slate-500 mb-2">Profile Picture</label>
          {driver.profile_picture && driver.profile_picture.length > 0 ? (
            <img 
              src={driver.profile_picture[0]} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-500">
              <FileText size={24} />
            </div>
          )}
        </div>

        {/* Driving License */}
        <div>
          <label className="block text-sm text-slate-500 mb-2">Driving License</label>
          {driver.driver_license && driver.driver_license.length > 0 ? (
            <a 
              href={driver.driver_license[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              <FileText size={18} />
              View License Document
            </a>
          ) : (
            <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center border border-slate-200 text-slate-500">
              <FileText size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/dashboard/Transporter/driver-profiles/${driver._id}/edit`} className="flex-1">
          <button className="w-full flex justify-center items-center gap-2 py-3 border border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 transition">
            <Pencil size={18} />
            Edit Details
          </button>
        </Link>
        
        <button 
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 w-full flex justify-center items-center gap-2 py-3 border border-red-500 text-red-500 rounded-full font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 size={18} />}
          Remove
        </button>
      </div>
    </div>
  );
}