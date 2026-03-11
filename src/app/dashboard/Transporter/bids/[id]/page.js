"use client";
import React, { useState } from "react";
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
  X
} from "lucide-react";

// Mock data
const getBidData = (id) => ({
  id: parseInt(id),
  title: "Ship 12 Pallets of Rice",
  description: "12 shrink-wrapped pallets, non-fragile",
  images: [
    "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg",
    "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg",
    "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg",
  ],
  location: {
    from: "Abidjan",
    to: "Ouagadougou"
  },
  priceRange: {
    min: 1200,
    max: 1300
  },
  category: "Furniture",
  weight: "2,300 Kg",
  dimensions: {
    length: 120,
    width: 100,
    height: 160,
    unit: "cm"
  },
  packaging: "Wooden Crates",
  pickup: {
    address: "Rue 14.12, Ouagadougou",
    time: "12:00 am"
  },
  delivery: {
    address: "Rue 14.12, Ouagadougou",
    datePreference: "Flexible within 2 days"
  },
  bids: [
    { id: 1, bidder: "John Smith", price: 150.00, vehicle: "Mercedes Actros - 20T", verified: true },
    { id: 2, bidder: "Sarah Johnson", price: 150.00, vehicle: null, verified: false },
    { id: 3, bidder: "Mike Wilson", price: 150.00, vehicle: null, verified: false },
    { id: 4, bidder: "Truck Lagbe", price: 150.00, vehicle: "Truck Lagbe", verified: true },
    { id: 5, bidder: "Emma Davis", price: 150.00, vehicle: null, verified: false },
    { id: 6, bidder: "Chris Brown", price: 150.00, vehicle: null, verified: false },
    { id: 7, bidder: "Lisa Anderson", price: 150.00, vehicle: null, verified: false },
    { id: 8, bidder: "David Lee", price: 150.00, vehicle: null, verified: false },
    { id: 9, bidder: "Rachel Green", price: 150.00, vehicle: null, verified: false },
    { id: 10, bidder: "Tom Harris", price: 150.00, vehicle: null, verified: false },
  ],
  timeRemaining: "5m 24s"
});

const mockAvailableBids = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: "Ship 12 Pallets of Rice",
  from: "Abidjan",
  to: "Ouagadougou",
  minPrice: 1200,
  maxPrice: 1300,
  image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg"
}));

const BidDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBidsList, setShowBidsList] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const bidData = getBidData(params.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === bidData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? bidData.images.length - 1 : prev - 1
    );
  };

  const handlePlaceBid = () => {
    setShowBidModal(true);
  };

  const handleContinueToAssign = () => {
    setShowBidModal(false);
    setShowAssignModal(true);
  };

  const BidCard = ({ bid }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {bid.bidder.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{bid.bidder}</p>
          {bid.vehicle && (
            <div className="flex items-center gap-1 mt-1">
              <Truck className="w-3 h-3 text-gray-500" />
              <p className="text-xs text-gray-500">{bid.vehicle}</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-semibold text-gray-900">€{bid.price.toFixed(2)}</p>
      </div>
    </div>
  );

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
          {mockAvailableBids.map((bid) => (
            <div
              key={bid.id}
              onClick={() => router.push(`/dashboard/Transporter/bids/${bid.id}`)}
              className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                bid.id === parseInt(params.id) ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="relative mb-3">
                <img
                  src={bid.image}
                  alt={bid.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {bid.title}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{bid.from} → {bid.to}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${bid.minPrice.toLocaleString()} - ${bid.maxPrice.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  page === 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-gray-400">...</span>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50">
              30
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
            <div className="relative mb-6">
              <img
                src={bidData.images[currentImageIndex]}
                alt="Shipment"
                className="w-full h-64 object-cover rounded-lg"
              />
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
            </div>

            {/* Title and Action */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{bidData.title}</h2>
                <p className="text-gray-600">{bidData.description}</p>
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
                      {bidData.bids.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Time Remaining</span>
                    <span className="text-sm font-semibold text-gray-900">{bidData.timeRemaining}</span>
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
                  {bidData.bids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Category</label>
                      <p className="font-medium text-gray-900">{bidData.category}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Weight</label>
                      <p className="font-medium text-gray-900">{bidData.weight}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        Dimensions (L/W/H {bidData.dimensions.unit})
                      </label>
                      <p className="font-medium text-red-600">
                        {bidData.dimensions.length} cm / {bidData.dimensions.width} cm / {bidData.dimensions.height} cm
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Type of packaging</label>
                      <p className="font-medium text-gray-900">{bidData.packaging}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Pickup & Delivery Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Pickup Address</label>
                      <p className="font-medium text-gray-900">{bidData.pickup.address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Delivery Address</label>
                      <p className="font-medium text-gray-900">{bidData.delivery.address}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Time Window</label>
                      <p className="font-medium text-gray-900">{bidData.pickup.time}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Date Preference</label>
                      <p className="font-medium text-gray-900">{bidData.delivery.datePreference}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  page === 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-gray-400">...</span>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-sm font-medium hover:bg-gray-50">
              30
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <ChevronRight className="w-5 h-5" />
            </button>
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
                  Bid Amount (€)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Price Range</p>
                <p className="text-lg font-bold text-gray-900">
                  ${bidData.priceRange.min.toLocaleString()} - ${bidData.priceRange.max.toLocaleString()}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Search driver</label>
                <input
                  type="text"
                  placeholder="Search driver"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">John Katla</p>
                  <p className="text-sm text-gray-600">+250 78 23 14 99</p>
                  <button className="mt-2 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search vehicle</label>
                <input
                  type="text"
                  placeholder="Search vehicle"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-3 p-4 border border-gray-200 rounded-lg">
                  <img src="/api/placeholder/100/60" alt="Truck" className="w-full mb-2 rounded" />
                  <p className="font-medium text-gray-900 text-sm">Mercedes Actros - 20T</p>
                  <p className="text-xs text-gray-600">Plate: AB-1422U</p>
                  <button className="mt-2 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Place your Price</label>
                <input
                  type="text"
                  placeholder="Place your Price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidDetailPage;