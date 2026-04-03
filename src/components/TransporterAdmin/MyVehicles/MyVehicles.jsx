"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Loader, X, Upload } from 'lucide-react';
import { getTransporterVehicles, deleteVehicle, createVehicle } from '@/components/lib/apiClient';

// Helper function to replace localhost URLs with server URL
const replaceImageUrl = (url) => {
  if (!url) return null;
  return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
};

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    plate_number: '',
    vehicle_type: '',
    capacity: '',
    year_model: '',
    plate_id: null,
    insurance: null,
    technical_visit: null,
    vehicle_images: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [previews, setPreviews] = useState({
    plate_id: null,
    insurance: null,
    technical_visit: null,
    vehicle_images: null
  });

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
        const transformedVehicles = response.data.vehicles.map(vehicle => ({
          id: vehicle._id,
          name: `${vehicle.vehicle_type} - ${vehicle.capicity}T`,
          plate: vehicle.plate_number,
          img: replaceImageUrl(vehicle.vehicle_images?.[0]),
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

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file upload
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove file
  const removeFile = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.vehicle_number) errors.vehicle_number = 'Vehicle number is required';
    if (!formData.plate_number) errors.plate_number = 'Plate number is required';
    if (!formData.vehicle_type) errors.vehicle_type = 'Vehicle type is required';
    if (!formData.capacity) errors.capacity = 'Capacity is required';
    if (!formData.year_model) errors.year_model = 'Year model is required';
    if (!formData.plate_id) errors.plate_id = 'Plate ID document is required';
    if (!formData.insurance) errors.insurance = 'Insurance document is required';
    if (!formData.technical_visit) errors.technical_visit = 'Technical visit document is required';
    if (!formData.vehicle_images) errors.vehicle_images = 'Vehicle image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      vehicle_number: '',
      plate_number: '',
      vehicle_type: '',
      capacity: '',
      year_model: '',
      plate_id: null,
      insurance: null,
      technical_visit: null,
      vehicle_images: null
    });
    setPreviews({
      plate_id: null,
      insurance: null,
      technical_visit: null,
      vehicle_images: null
    });
    setFormErrors({});
  };

  // Handle add vehicle
  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }

      // Create FormData for API
      const submitFormData = new FormData();
      submitFormData.append('transporter_id', transporterId);
      submitFormData.append('vehicle_number', formData.vehicle_number);
      submitFormData.append('plate_number', formData.plate_number);
      submitFormData.append('vehicle_type', formData.vehicle_type);
      submitFormData.append('capicity', formData.capacity);
      submitFormData.append('year_model', formData.year_model);
      submitFormData.append('plate_id', formData.plate_id);
      submitFormData.append('insurance', formData.insurance);
      submitFormData.append('technical_visit', formData.technical_visit);
      submitFormData.append('vehicle_images', formData.vehicle_images);

      console.log('🚛 Creating new vehicle...');
      
      const response = await createVehicle(submitFormData);
      
      console.log('✅ Create vehicle response:', response);

      if (response.success) {
        alert('Vehicle added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchVehicles(currentPage, searchTerm);
      } else {
        throw new Error(response.message || 'Failed to add vehicle');
      }
    } catch (err) {
      console.error('Error adding vehicle:', err);
      alert(err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setSubmitting(false);
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
  // const getVehicleImage = (vehicle) => {
  //   if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
  //     return vehicle.vehicle_images[0];
  //   }
  //   // return 'https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg';
  // };

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
            onClick={() => setShowAddModal(true)}
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
                    src={replaceImageUrl(v.vehicle_images?.[0])} 
                    alt={v.name} 
                    className="w-full h-32 object-contain group-hover:scale-105 transition duration-300"
                    // onError={(e) => {
                    //   e.target.src = 'https://www.thecarexpert.co.uk/wp-content/uploads/2021/10/Tesla-Model-3-2024-1920x960.jpg';
                    // }}
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
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Your First Vehicle
          </button>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Add New Vehicle</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vehicle_number"
                      value={formData.vehicle_number}
                      onChange={handleInputChange}
                      placeholder="Enter vehicle number"
                      className={`w-full px-4 py-3 border text-black ${formErrors.vehicle_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4]`}
                    />
                    {formErrors.vehicle_number && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.vehicle_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plate Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="plate_number"
                      value={formData.plate_number}
                      onChange={handleInputChange}
                      placeholder="Enter plate number"
                      className={`w-full px-4 py-3 border text-black ${formErrors.plate_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4]`}
                    />
                    {formErrors.plate_number && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.plate_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleInputChange}
                      placeholder="e.g., Truck, Van, Trailer"
                      className={`w-full px-4 py-3 border text-black ${formErrors.vehicle_type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4]`}
                    />
                    {formErrors.vehicle_type && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.vehicle_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity (Tons) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="Enter capacity in tons"
                      className={`w-full px-4 py-3 border text-black ${formErrors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4]`}
                    />
                    {formErrors.capacity && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.capacity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="year_model"
                      value={formData.year_model}
                      onChange={handleInputChange}
                      placeholder="e.g., 2022"
                      className={`w-full px-4 py-3 border text-black ${formErrors.year_model ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4]`}
                    />
                    {formErrors.year_model && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.year_model}</p>
                    )}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plate ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plate ID Document <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#036BB4] transition">
                      <input
                        type="file"
                        id="plate_id"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'plate_id')}
                        className="hidden"
                      />
                      <label htmlFor="plate_id" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload Plate ID</span>
                      </label>
                    </div>
                    {previews.plate_id && (
                      <div className="mt-2 relative inline-block">
                        <img src={previews.plate_id} alt="Plate ID Preview" className="w-20 h-20 object-cover rounded-lg border" />
                        <button onClick={() => removeFile('plate_id')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {formErrors.plate_id && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.plate_id}</p>
                    )}
                  </div>

                  {/* Insurance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Document <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#036BB4] transition">
                      <input
                        type="file"
                        id="insurance"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'insurance')}
                        className="hidden"
                      />
                      <label htmlFor="insurance" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload Insurance</span>
                      </label>
                    </div>
                    {previews.insurance && (
                      <div className="mt-2 relative inline-block">
                        <img src={previews.insurance} alt="Insurance Preview" className="w-20 h-20 object-cover rounded-lg border" />
                        <button onClick={() => removeFile('insurance')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {formErrors.insurance && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.insurance}</p>
                    )}
                  </div>

                  {/* Technical Visit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Visit Document <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#036BB4] transition">
                      <input
                        type="file"
                        id="technical_visit"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'technical_visit')}
                        className="hidden"
                      />
                      <label htmlFor="technical_visit" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload Technical Visit</span>
                      </label>
                    </div>
                    {previews.technical_visit && (
                      <div className="mt-2 relative inline-block">
                        <img src={previews.technical_visit} alt="Technical Visit Preview" className="w-20 h-20 object-cover rounded-lg border" />
                        <button onClick={() => removeFile('technical_visit')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {formErrors.technical_visit && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.technical_visit}</p>
                    )}
                  </div>

                  {/* Vehicle Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Image <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#036BB4] transition">
                      <input
                        type="file"
                        id="vehicle_images"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'vehicle_images')}
                        className="hidden"
                      />
                      <label htmlFor="vehicle_images" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload Vehicle Image</span>
                      </label>
                    </div>
                    {previews.vehicle_images && (
                      <div className="mt-2 relative inline-block">
                        <img src={previews.vehicle_images} alt="Vehicle Preview" className="w-20 h-20 object-cover rounded-lg border" />
                        <button onClick={() => removeFile('vehicle_images')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {formErrors.vehicle_images && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.vehicle_images}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVehicle}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Vehicle'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}