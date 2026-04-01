"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { getTransporterDrivers, deleteDriver } from "@/components/lib/apiClient";

export default function DriverManagement() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
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

  // Get transporter ID from localStorage
  const getTransporterId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transporter_id');
    }
    return null;
  };

  // Fetch drivers
  const fetchDrivers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      console.log('🔍 Fetching drivers for transporter:', transporterId);
      
      const response = await getTransporterDrivers(transporterId, page, 10, search);
      
      console.log('📦 Drivers response:', response);

      if (response.success) {
        // Transform the API response to match your component structure
        const transformedDrivers = response.data.drivers.map(driver => ({
          id: driver._id,
          name: driver.driver_name || 'Unnamed Driver',
          number: driver.phone || 'No phone',
          email: driver.email || '',
          user_id: driver.user_id,
          profile_picture: driver.profile_picture?.[0] || null,
          driver_license: driver.driver_license,
          ...driver
        }));

        setDrivers(transformedDrivers);
        setPagination(response.data.pagination || {
          page: page,
          limit: 10,
          total: transformedDrivers.length,
          totalPage: Math.ceil(transformedDrivers.length / 10)
        });
      } else {
        throw new Error(response.message || 'Failed to fetch drivers');
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.message);
      
      // If unauthorized, redirect to login
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete driver
  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return;
    }

    try {
      setDeletingId(driverId);
      
      console.log('🗑️ Deleting driver:', driverId);
      
      const response = await deleteDriver(driverId);
      
      console.log('✅ Delete response:', response);

      if (response.success) {
        // Refresh the drivers list
        fetchDrivers(currentPage, searchTerm);
      } else {
        throw new Error(response.message || 'Failed to delete driver');
      }
    } catch (err) {
      console.error('Error deleting driver:', err);
      alert(err.message || 'Failed to delete driver. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1);
        fetchDrivers(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load drivers on mount and when page changes
  useEffect(() => {
    fetchDrivers(currentPage, searchTerm);
  }, [currentPage]);

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

  if (loading && drivers.length === 0) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading drivers...</p>
        </div>
      </div>
    );
  }

  if (error && drivers.length === 0) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-800 mb-4">{error}</p>
            <button
              onClick={() => fetchDrivers(currentPage, searchTerm)}
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
    <div className="min-h-screen bg-white p-8 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Driver Profile Management</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Add Driver Button */}
          <button 
            onClick={() => router.push('/dashboard/Transporter/driver-profiles/add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Add Driver</span>
          </button>
          {/* Search Bar */}
          <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 w-full md:w-64">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={handleSearch}
              className="outline-none text-sm w-full placeholder:text-slate-400" 
            />
            {loading && (
              <Loader className="w-4 h-4 animate-spin text-[#036BB4] ml-2" />
            )}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      {drivers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {drivers.map((driver) => (
              <div key={driver.id} className="border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{driver.name}</h3>
                
                {/* Phone Number */}
                <div className="flex items-center text-slate-500 text-xs mb-4">
                  <span className="mr-1">📞</span>
                  {driver.number}
                </div>

                {/* Email (if available) */}
                {driver.email && (
                  <div className="flex items-center text-slate-500 text-xs mb-4">
                    <span className="mr-1">✉️</span>
                    {driver.email}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link href={`/dashboard/Transporter/driver-profiles/${driver.id}`}>
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 cursor-pointer transition">
                      <Eye size={14} />
                    </div>
                  </Link>
                  <Link href={`/dashboard/Transporter/driver-profiles/${driver.id}/edit`}>
                    <div className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 cursor-pointer transition">
                      <Pencil size={14} />
                    </div>
                  </Link>
                  <button 
                    onClick={() => handleDeleteDriver(driver.id)}
                    disabled={deletingId === driver.id}
                    className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === driver.id ? (
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          {pagination.totalPage > 1 && (
            <>
              <div className="flex justify-end items-center gap-2 mt-8">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 border border-[#036BB4] rounded-full text-[#036BB4] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={idx} className="text-slate-400 text-sm px-2">...</span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition ${
                        page === currentPage
                          ? 'bg-[#036BB4] text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPage}
                  className={`p-2 border border-[#036BB4] rounded-full text-[#036BB4] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              
              {/* Summary */}
              <div className="text-right mt-4 text-sm text-gray-500">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} drivers
              </div>
            </>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">👤</div>
          <p className="text-gray-500">
            {searchTerm ? 'No drivers found matching your search.' : 'No drivers added yet.'}
          </p>
          <button 
            onClick={() => router.push('/dashboard/Transporter/driver-profiles/add')}
            className="mt-4 px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Your First Driver
          </button>
        </div>
      )}
    </div>
  );
}