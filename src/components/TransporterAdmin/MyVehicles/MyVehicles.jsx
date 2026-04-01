"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { getTransporterVehicles, deleteVehicle } from '@/components/lib/apiClient';

export default function MyVehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
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

  // Fetch vehicles
  const fetchVehicles = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      console.log('🔍 Fetching vehicles for transporter:', transporterId);
      
      const response = await getTransporterVehicles(transporterId, page, 10, search);
      
      console.log('📦 Vehicles response:', response);

      if (response.success) {
        // Transform the API response to match your component structure
        const transformedVehicles = response.data.vehicles.map(vehicle => ({
          id: vehicle._id,
          name: `${vehicle.vehicle_type} - ${vehicle.capicity}T`,
          plate: vehicle.plate_number,
          img: vehicle.vehicle_images?.[0] || 'https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg',
          vehicle_number: vehicle.vehicle_number,
          vehicle_type: vehicle.vehicle_type,
          capacity: vehicle.capicity,
          year_model: vehicle.year_model,
          plate_id: vehicle.plate_id,
          insurance: vehicle.insurance,
          technical_visit: vehicle.technical_visit,
          ...vehicle
        }));

        setVehicles(transformedVehicles);
        setPagination(response.data.pagination || {
          page: page,
          limit: 10,
          total: transformedVehicles.length,
          totalPage: Math.ceil(transformedVehicles.length / 10)
        });
      } else {
        throw new Error(response.message || 'Failed to fetch vehicles');
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message);
      
      // If unauthorized, redirect to login
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      setDeletingId(vehicleId);
      
      console.log('🗑️ Deleting vehicle:', vehicleId);
      
      const response = await deleteVehicle(vehicleId);
      
      console.log('✅ Delete response:', response);

      if (response.success) {
        // Refresh the vehicles list
        fetchVehicles(currentPage, searchTerm);
      } else {
        throw new Error(response.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert(err.message || 'Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1);
        fetchVehicles(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load vehicles on mount and when page changes
  useEffect(() => {
    fetchVehicles(currentPage, searchTerm);
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

  // Get first image URL
  const getVehicleImage = (vehicle) => {
    if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
      return vehicle.vehicle_images[0];
    }
    return 'https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg';
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error && vehicles.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-800 mb-4">{error}</p>
            <button
              onClick={() => fetchVehicles(currentPage, searchTerm)}
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
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => router.push('/dashboard/Transporter/my-vehicles/add')}
            className="flex items-center gap-2 bg-blue-50 text-[#036BB4] px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition"
          >
            <Plus size={18} /> Add Vehicle
          </button>
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Search by plate number or type..." 
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-400 text-black rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute left-3 top-2.5 text-gray-700" size={18} />
            {loading && (
              <div className="absolute right-3 top-2.5">
                <Loader className="w-4 h-4 animate-spin text-[#036BB4]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      {vehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 flex flex-col items-center group hover:shadow-md transition">
                <div className="relative w-full h-32 mb-4">
                  <img 
                    src={getVehicleImage(v)} 
                    alt={v.name} 
                    className="w-full h-32 object-contain group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = 'https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg';
                    }}
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-sm text-center line-clamp-1">{v.name}</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase mt-1 mb-4 tracking-widest">{v.plate}</p>
                
                <div className="flex gap-2">
                  <Link href={`/dashboard/Transporter/my-vehicles/${v.id}`}>
                    <button className="p-2.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/dashboard/Transporter/my-vehicles/${v.id}?edit=true`}>
                    <button className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDeleteVehicle(v.id)}
                    disabled={deletingId === v.id}
                    className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === v.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPage > 0 && (
            <>
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
              
              {/* Summary */}
              <div className="text-right mt-4 text-sm text-gray-500">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} vehicles
              </div>
            </>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">🚛</div>
          <p className="text-gray-500">
            {searchTerm ? 'No vehicles found matching your search.' : 'No vehicles added yet.'}
          </p>
          <button 
            onClick={() => router.push('/dashboard/Transporter/my-vehicles/add')}
            className="mt-4 px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Your First Vehicle
          </button>
        </div>
      )}
    </div>
  );
}