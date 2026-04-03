"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    TrendingUp,
    Clock,
    MapPin,
    Truck,
    X,
    Loader
} from "lucide-react";
import { getAvailableBids, getShipmentDetails, placeBid, getTransporterDrivers, getTransporterVehicles } from "@/components/lib/apiClient";

// Helper function to replace localhost URLs with server URL
const replaceImageUrl = (url) => {
  if (!url) return null;
  return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
};

const BidDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [showBidsList, setShowBidsList] = useState(false);
    const [showBidModal, setShowBidModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shipment, setShipment] = useState(null);
    const [availableBids, setAvailableBids] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [driverSearch, setDriverSearch] = useState("");
    const [vehicleSearch, setVehicleSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [loadingVehicles, setLoadingVehicles] = useState(false);

    // Get transporter ID from localStorage
    const getTransporterId = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('transporter_id');
        }
        return null;
    };

    // Fetch shipment details
    const fetchShipmentDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔍 Fetching shipment details for ID:', params.id);
            
            const response = await getShipmentDetails(params.id);
            
            console.log('📦 Shipment details:', response);

            if (response.success && response.data) {
                setShipment(response.data?.shipment || response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch shipment details');
            }
        } catch (err) {
            console.error('Error fetching shipment details:', err);
            setError(err.message);
            
            if (err.message.includes('Session expired') || err.message.includes('401')) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch available bids for sidebar
    const fetchAvailableBids = async () => {
        try {
            const response = await getAvailableBids(1, 10, '');
            if (response.success) {
                setAvailableBids(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching available bids:', err);
        }
    };

    // Fetch real drivers from API
    const fetchDrivers = async () => {
        try {
            setLoadingDrivers(true);
            const transporterId = getTransporterId();
            if (!transporterId) return;

            console.log('👤 Fetching drivers for transporter:', transporterId);
            
            const response = await getTransporterDrivers(transporterId, 1, 100, '');
            
            console.log('📦 Drivers response:', response);

            if (response.success && response.data) {
                const transformedDrivers = response.data.drivers.map(driver => ({
                    id: driver._id,
                    name: driver.driver_name,
                    phone: driver.phone,
                    email: driver.email,
                    profile_picture: driver.profile_picture?.[0] || null,
                    driver_license: driver.driver_license
                }));
                setDrivers(transformedDrivers);
            }
        } catch (err) {
            console.error('Error fetching drivers:', err);
        } finally {
            setLoadingDrivers(false);
        }
    };

    // Fetch real vehicles from API
    const fetchVehicles = async () => {
        try {
            setLoadingVehicles(true);
            const transporterId = getTransporterId();
            if (!transporterId) return;

            console.log('🚛 Fetching vehicles for transporter:', transporterId);
            
            const response = await getTransporterVehicles(transporterId, 1, 100, '');
            
            console.log('📦 Vehicles response:', response);

            if (response.success && response.data) {
                const transformedVehicles = response.data.vehicles.map(vehicle => ({
                    id: vehicle._id,
                    name: `${vehicle.vehicle_type} - ${vehicle.capicity}T`,
                    plate: vehicle.plate_number,
                    vehicle_number: vehicle.vehicle_number,
                    vehicle_type: vehicle.vehicle_type,
                    capacity: vehicle.capicity,
                    year_model: vehicle.year_model,
                    image: vehicle.vehicle_images?.[0] || null
                }));
                setVehicles(transformedVehicles);
            }
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        } finally {
            setLoadingVehicles(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchShipmentDetails();
            fetchAvailableBids();
            fetchDrivers();
            fetchVehicles();
        }
    }, [params.id]);

    const nextImage = () => {
        if (shipment?.shipment_images) {
            setCurrentImageIndex((prev) =>
                prev === shipment.shipment_images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (shipment?.shipment_images) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? shipment.shipment_images.length - 1 : prev - 1
            );
        }
    };

    const handlePlaceBid = () => {
        setShowBidModal(true);
    };

    const handleContinueToAssign = async () => {
        if (!bidAmount) {
            alert('Please enter your bid amount');
            return;
        }
        
        setShowBidModal(false);
        setShowAssignModal(true);
    };

    const handleSubmitAssignment = async () => {
        if (!selectedDriver || !selectedVehicle) {
            alert('Please select both a driver and a vehicle');
            return;
        }
        
        try {
            setSubmitting(true);
            
            const transporterId = getTransporterId();
            if (!transporterId) {
                throw new Error('Transporter ID not found. Please login again.');
            }
            
            const bidData = {
                transporter_id: transporterId,
                shipment_id: shipment._id,
                driver_id: selectedDriver.id,
                vehicle_id: selectedVehicle.id,
                bid_amount: bidAmount
            };
            
            console.log('📦 Submitting bid with payload:', bidData);
            
            const response = await placeBid(bidData);
            
            console.log('✅ Bid response:', response);
            
            if (response.success) {
                alert('Bid placed successfully!');
                setShowAssignModal(false);
                router.push(`/dashboard/Transporter/my-bids`);
            } else {
                throw new Error(response.message || 'Failed to place bid');
            }
        } catch (err) {
            console.error('Error placing bid:', err);
            alert(err.message || 'Failed to place bid. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    const getFirstImage = (images) => {
        if (images && images.length > 0) {
            return images[0];
        }
        return "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg";
    };

    // Filter sidebar bids based on search
    const filteredBids = availableBids.filter(bid =>
        bid.shipment_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.pickup_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter drivers based on search
    const filteredDrivers = drivers.filter(driver =>
        driver.name?.toLowerCase().includes(driverSearch.toLowerCase()) ||
        driver.phone?.includes(driverSearch)
    );

    // Filter vehicles based on search
    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.name?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        vehicle.plate?.toLowerCase().includes(vehicleSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
                    <p className="text-gray-600">Loading shipment details...</p>
                </div>
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center">
                <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                    <div className="text-red-500 mb-4">⚠️</div>
                    <p className="text-gray-800 mb-4">{error || 'Shipment not found'}</p>
                    <button
                        onClick={() => router.push('/dashboard/Transporter/available-bids')}
                        className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Available Bids
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Available Bids</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredBids.map((bid) => (
                        <div
                            key={bid._id}
                            onClick={() => router.push(`/dashboard/Transporter/bids/${bid._id}`)}
                            className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors ${bid._id === params.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}
                        >
                            <div className="relative mb-3">
                                <img
                                    src={replaceImageUrl(getFirstImage(bid.shipment_images))}
                                    alt={bid.shipment_title}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                                    {bid.shipment_title?.length > 30 
                                        ? bid.shipment_title.substring(0, 30) + '...' 
                                        : bid.shipment_title}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>{bid.pickup_address?.split(',')[0]} → {bid.delivery_address?.split(',')[0]}</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                ${formatPrice(bid.price)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Top Search */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                        <button className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Shipment Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Shipment Details</h3>

                        {/* Image Carousel */}
                        {shipment.shipment_images && shipment.shipment_images.length > 0 && (
                            <div className="relative mb-6">
                                <img
                                    src={replaceImageUrl(shipment.shipment_images[currentImageIndex])}
                                    alt="Shipment"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                {shipment.shipment_images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Title and Action */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{shipment.shipment_title}</h2>
                                <p className="text-gray-600">{shipment.discription}</p>
                            </div>
                            {showBidsList ? (
                                <button
                                    onClick={() => setShowBidsList(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowBidsList(true)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Bid
                                </button>
                            )}
                        </div>

                        {/* Conditional Content */}
                        {showBidsList ? (
                            <div>
                                <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Bids</span>
                                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                                            {shipment.bids?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Time Remaining</span>
                                        <span className="text-sm font-semibold text-gray-900">24h 00m</span>
                                    </div>
                                    <button
                                        onClick={handlePlaceBid}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        Place your bid
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                                    <span className="font-medium text-sm">Bidders</span>
                                    <span className="font-medium text-sm">Price</span>
                                </div>

                                <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                                    {shipment.bids && shipment.bids.length > 0 ? (
                                        shipment.bids.map((bid) => (
                                            <div key={bid.id} className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {bid.bidder?.split(' ').map(n => n[0]).join('') || 'U'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{bid.bidder || 'Anonymous'}</p>
                                                        {bid.vehicle && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Truck className="w-3 h-3 text-gray-500" />
                                                                <p className="text-xs text-gray-500">{bid.vehicle}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-base font-semibold text-gray-900">${bid.price}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            No bids yet. Be the first to place a bid!
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Category</label>
                                            <p className="font-medium text-gray-900">{shipment.category}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Weight</label>
                                            <p className="font-medium text-gray-900">{shipment.weight}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Dimensions</label>
                                            <p className="font-medium text-red-600">{shipment.dimensions}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Type of packaging</label>
                                            <p className="font-medium text-gray-900">{shipment.type_of_packaging}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Price</label>
                                            <p className="font-medium text-green-600 font-bold">${formatPrice(shipment.price)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Pickup & Delivery Details</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Pickup Address</label>
                                            <p className="font-medium text-gray-900">{shipment.pickup_address}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Delivery Address</label>
                                            <p className="font-medium text-gray-900">{shipment.delivery_address}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Time Window</label>
                                            <p className="font-medium text-gray-900">{shipment.time_window}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Date Preference</label>
                                            <p className="font-medium text-gray-900">{shipment.date_preference}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Contact Person</label>
                                            <p className="font-medium text-gray-900">{shipment.contact_person}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bid Modal */}
            {showBidModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Place Your Bid</h3>
                            <button
                                onClick={() => setShowBidModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bid Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Enter your bid amount"
                                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Current Price</p>
                                <p className="text-lg font-bold text-gray-900">
                                    ${formatPrice(shipment.price)}
                                </p>
                            </div>

                            <button
                                onClick={handleContinueToAssign}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Continue to Assign Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Vehicle Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Assign Vehicle & Driver</h3>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Driver</label>
                                <input
                                    type="text"
                                    placeholder="Search driver..."
                                    value={driverSearch}
                                    onChange={(e) => setDriverSearch(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                />
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {loadingDrivers ? (
                                        <div className="text-center py-4">
                                            <Loader className="w-6 h-6 animate-spin text-[#036BB4] mx-auto" />
                                            <p className="text-sm text-gray-500 mt-2">Loading drivers...</p>
                                        </div>
                                    ) : filteredDrivers.length > 0 ? (
                                        filteredDrivers.map((driver) => (
                                            <div
                                                key={driver.id}
                                                onClick={() => setSelectedDriver(driver)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                    selectedDriver?.id === driver.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <p className="font-medium text-gray-900">{driver.name}</p>
                                                <p className="text-sm text-gray-600">{driver.phone}</p>
                                                {driver.email && (
                                                    <p className="text-xs text-gray-500 mt-1">{driver.email}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No drivers found</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
                                <input
                                    type="text"
                                    placeholder="Search vehicle..."
                                    value={vehicleSearch}
                                    onChange={(e) => setVehicleSearch(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                />
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {loadingVehicles ? (
                                        <div className="text-center py-4">
                                            <Loader className="w-6 h-6 animate-spin text-[#036BB4] mx-auto" />
                                            <p className="text-sm text-gray-500 mt-2">Loading vehicles...</p>
                                        </div>
                                    ) : filteredVehicles.length > 0 ? (
                                        filteredVehicles.map((vehicle) => (
                                            <div
                                                key={vehicle.id}
                                                onClick={() => setSelectedVehicle(vehicle)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                    selectedVehicle?.id === vehicle.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <p className="font-medium text-gray-900">{vehicle.name}</p>
                                                <p className="text-sm text-gray-600">Plate: {vehicle.plate}</p>
                                                <p className="text-xs text-gray-500">Capacity: {vehicle.capacity} tons</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No vehicles found</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount</label>
                                <input
                                    type="text"
                                    value={`$${bidAmount}`}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                                />
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Selected</p>
                                    {selectedDriver && (
                                        <p className="text-sm text-gray-800">Driver: {selectedDriver.name}</p>
                                    )}
                                    {selectedVehicle && (
                                        <p className="text-sm text-gray-800">Vehicle: {selectedVehicle.name}</p>
                                    )}
                                    {!selectedDriver && !selectedVehicle && (
                                        <p className="text-sm text-gray-500">No selections yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitAssignment}
                            disabled={submitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Place Bid'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BidDetailPage;