"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Truck, ChevronLeft, ChevronRight, X, Plus, Image as ImageIcon } from 'lucide-react';
import { createShipment, getShipperShipments } from '../../../components/lib/apiClient';

// Create Shipment Modal Component
const CreateShipmentModal = ({ isOpen, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        shipment_title: '',
        category: '',
        description: '',
        weight: '',
        type_of_packaging: '',
        dimensions: '',
        shipment_images: [],
        pickup_address: '',
        time_window: '',
        delivery_address: '',
        contact_person: '',
        date_preference: '',
        price: '',
        status: 'PENDING'
    });

    const getShipperId = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('shipper_id');
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            shipment_images: [...prev.shipment_images, ...files]
        }));

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            shipment_images: prev.shipment_images.filter((_, i) => i !== index)
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.shipment_title.trim()) newErrors.shipment_title = 'Shipment title is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
        if (!formData.type_of_packaging.trim()) newErrors.type_of_packaging = 'Packaging type is required';
        if (!formData.dimensions.trim()) newErrors.dimensions = 'Dimensions are required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.pickup_address.trim()) newErrors.pickup_address = 'Pickup address is required';
        if (!formData.time_window.trim()) newErrors.time_window = 'Time window is required';
        if (!formData.delivery_address.trim()) newErrors.delivery_address = 'Delivery address is required';
        if (!formData.contact_person.trim()) newErrors.contact_person = 'Contact person is required';
        if (!formData.date_preference.trim()) newErrors.date_preference = 'Date preference is required';
        if (!formData.price) newErrors.price = 'Price is required';
        else if (isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Please enter a valid price';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            shipment_title: '',
            category: '',
            description: '',
            weight: '',
            type_of_packaging: '',
            dimensions: '',
            shipment_images: [],
            pickup_address: '',
            time_window: '',
            delivery_address: '',
            contact_person: '',
            date_preference: '',
            price: '',
            status: 'PENDING'
        });
        setImagePreviews([]);
        setCurrentStep(1);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            if (validateStep2()) {
                try {
                    setLoading(true);
                    const shipperId = getShipperId();
                    
                    if (!shipperId) {
                        throw new Error('Shipper ID not found. Please login again.');
                    }

                    // Create FormData for API
                    const submitFormData = new FormData();
                    
                    // Add shipper_id
                    submitFormData.append('shipper_id', shipperId);
                    
                    // Add all form fields
                    submitFormData.append('shipment_title', formData.shipment_title);
                    submitFormData.append('category', formData.category);
                    submitFormData.append('discription', formData.description);
                    submitFormData.append('weight', formData.weight);
                    submitFormData.append('type_of_packaging', formData.type_of_packaging);
                    submitFormData.append('dimensions', formData.dimensions);
                    submitFormData.append('pickup_address', formData.pickup_address);
                    submitFormData.append('time_window', formData.time_window);
                    submitFormData.append('delivery_address', formData.delivery_address);
                    submitFormData.append('contact_person', formData.contact_person);
                    submitFormData.append('date_preference', formData.date_preference);
                    submitFormData.append('price', formData.price);
                    submitFormData.append('status', formData.status);

                    // Add multiple images
                    formData.shipment_images.forEach((image) => {
                        submitFormData.append('shipment_images', image);
                    });

                    console.log('📦 Submitting shipment data...');

                    // FIXED: Pass submitFormData, not formData
                    const response = await createShipment(submitFormData);

                    console.log('✅ Shipment created:', response);

                    if (response.success) {
                        onSuccess(response.data);
                        resetForm();
                        onClose();
                    } else {
                        throw new Error(response.message || 'Failed to create shipment');
                    }
                } catch (error) {
                    console.error('❌ Error creating shipment:', error);
                    setErrors({ submit: error.message || 'Failed to create shipment' });
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">Create New Shipment</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentStep >= 1 ? 'bg-[#036BB4] text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                1
                            </div>
                            <div className={`w-12 h-1 mx-2 ${
                                currentStep >= 2 ? 'bg-[#036BB4]' : 'bg-gray-200'
                            }`} />
                        </div>
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentStep >= 2 ? 'bg-[#036BB4] text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                2
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between max-w-md mx-auto mt-2 text-sm">
                        <span className={currentStep === 1 ? 'text-[#036BB4] font-medium' : 'text-gray-600'}>
                            Shipment Details
                        </span>
                        <span className={currentStep === 2 ? 'text-[#036BB4] font-medium' : 'text-gray-600'}>
                            Location & Pricing
                        </span>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Shipment Details</h3>
                            
                            {/* Shipment Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shipment Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="shipment_title"
                                    value={formData.shipment_title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.shipment_title ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter shipment title"
                                />
                                {errors.shipment_title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.shipment_title}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.category ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter category"
                                />
                                {errors.category && (
                                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={`w-full px-4 py-2 border ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter description"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Weight and Packaging */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weight <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border ${
                                            errors.weight ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                        placeholder="e.g., 1000 KG"
                                    />
                                    {errors.weight && (
                                        <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type of Packaging <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="type_of_packaging"
                                        value={formData.type_of_packaging}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border ${
                                            errors.type_of_packaging ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                        placeholder="e.g., cloths, boxes"
                                    />
                                    {errors.type_of_packaging && (
                                        <p className="text-red-500 text-xs mt-1">{errors.type_of_packaging}</p>
                                    )}
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dimensions <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.dimensions ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="e.g., 100KM, 2x2x2"
                                />
                                {errors.dimensions && (
                                    <p className="text-red-500 text-xs mt-1">{errors.dimensions}</p>
                                )}
                            </div>

                            {/* Shipment Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shipment Images
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#036BB4] transition">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-1">Upload</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">Upload images of your shipment (optional)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Location & Pricing</h3>

                            {/* Pickup Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pickup Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="pickup_address"
                                    value={formData.pickup_address}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.pickup_address ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter pickup address"
                                />
                                {errors.pickup_address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.pickup_address}</p>
                                )}
                            </div>

                            {/* Time Window */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time Window <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="time_window"
                                    value={formData.time_window}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.time_window ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="e.g., 2 days"
                                />
                                {errors.time_window && (
                                    <p className="text-red-500 text-xs mt-1">{errors.time_window}</p>
                                )}
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Delivery Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="delivery_address"
                                    value={formData.delivery_address}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.delivery_address ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter delivery address"
                                />
                                {errors.delivery_address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.delivery_address}</p>
                                )}
                            </div>

                            {/* Contact Person */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Person/Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.contact_person ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter contact number"
                                />
                                {errors.contact_person && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>
                                )}
                            </div>

                            {/* Date Preference */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Preference <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="date_preference"
                                    value={formData.date_preference}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.date_preference ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter date preference"
                                />
                                {errors.date_preference && (
                                    <p className="text-red-500 text-xs mt-1">{errors.date_preference}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.price ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#036BB4] focus:border-transparent text-black`}
                                    placeholder="Enter price"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between">
                    {currentStep === 1 ? (
                        <>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-[#025191] transition disabled:opacity-50"
                            >
                                Next Step
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-[#025191] transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    'Create Shipment'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Shipments List Component
const MyShipments = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 0
    });

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

            console.log('🌐 Fetching shipments for shipper:', shipperId, 'page:', page, 'search:', search);

            // FIXED: Use the imported function correctly
            const response = await getShipperShipments(shipperId, page, 10, search);

            console.log('📦 Shipments response:', response);

            if (response.success) {
                const transformedShipments = response.data.shipments.map(shipment => ({
                    id: shipment._id,
                    title: shipment.shipment_title || 'Untitled',
                    route: `${shipment.pickup_address || 'Pickup'} – ${shipment.delivery_address || 'Delivery'}`,
                    status: shipment.status || 'Unknown',
                    statusColor: getStatusColor(shipment.status),
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
        } finally {
            setLoading(false);
        }
    };

    // Helper function to determine status color
    const getStatusColor = (status) => {
        const statusLower = (status || '').toLowerCase();
        if (statusLower.includes('progress') || statusLower.includes('pending')) {
            return 'orange';
        } else if (statusLower.includes('delivered') || statusLower.includes('completed')) {
            return 'green';
        } else if (statusLower.includes('cancelled') || statusLower.includes('failed')) {
            return 'red';
        }
        return 'orange'; // default
    };

    // Load shipments on component mount and when page changes
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

    const handleViewDetail = (id) => {
        router.push(`/dashboard/Shipper/shipments/${id}`);
    };

    const handleViewTracking = (id) => {
        router.push(`/dashboard/Shipper/shipments/${id}/tracking`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPage) {
            setCurrentPage(page);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateSuccess = (newShipment) => {
        // Refresh the shipments list
        fetchShipments(currentPage, searchTerm);
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
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#036BB4] mb-4"></div>
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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-[#036BB4] text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-[#025191] flex items-center gap-2 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Create Shipment
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search shipments..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 text-black focus:outline-none focus:ring-2 focus:ring-[#036BB4]"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#036BB4]"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Shipment Modal */}
            <CreateShipmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#036BB4] text-white">
                            <th className="text-left py-3 px-6 text-sm font-semibold">Shipment ID</th>
                            <th className="text-left py-3 px-6 text-sm font-semibold">Shipment Title</th>
                            <th className="text-left py-3 px-6 text-sm font-semibold">Pickup – Delivery</th>
                            <th className="text-left py-3 px-6 text-sm font-semibold">Status</th>
                            <th className="text-left py-3 px-6 text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.length > 0 ? (
                            shipments.map((shipment, index) => (
                                <tr key={shipment.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-black">{shipment.id}</td>
                                    <td className="py-4 px-6 text-sm text-black">{shipment.title}</td>
                                    <td className="py-4 px-6 text-sm text-black">{shipment.route}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            shipment.statusColor === 'orange'
                                                ? 'bg-orange-100 text-orange-600'
                                                : shipment.statusColor === 'green'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewDetail(shipment.id)}
                                                className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-purple-600" />
                                            </button>
                                            <button
                                                onClick={() => handleViewTracking(shipment.id)}
                                                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                                                title="Track Shipment"
                                            >
                                                <Truck className="w-4 h-4 text-blue-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    {searchTerm ? 'No shipments found matching your search.' : 'No shipments found.'}
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

export default MyShipments;