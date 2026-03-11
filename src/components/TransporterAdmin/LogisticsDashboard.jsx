 "use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const ActiveShipmentsDashboard = () => {
  const [selectedShipment, setSelectedShipment] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Sample shipment data
  const shipments = [
    { id: 1, name: 'Trailer 12*32', type: 'Truk', status: 'active' },
    { id: 2, name: 'Trailer 12*32', type: 'Truk', status: 'inactive' },
    { id: 3, name: 'Trailer 12*32', type: 'Truk', status: 'inactive' },
    { id: 4, name: 'Trailer 12*32', type: 'Truk', status: 'inactive' },
    { id: 5, name: 'Trailer 12*32', type: 'Truk', status: 'inactive' },
    { id: 6, name: 'Trailer 12*32', type: 'Truk', status: 'inactive' },
  ];

  // Sample shipment images
  const shipmentImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=500&h=300&fit=crop',
  ];

  const handlePrevSlide = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? shipmentImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === shipmentImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Active Shipments Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Shipments</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevSlide}
              className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center hover:bg-blue-50 transition-all text-blue-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center hover:bg-blue-50 transition-all text-blue-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shipments Slider */}
        <div className="overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {shipments.map((shipment, index) => (
              <div
                key={shipment.id}
                onClick={() => setSelectedShipment(index)}
                className={`flex-shrink-0 w-[200px] bg-white rounded-xl p-4 cursor-pointer transition-all ${
                  index === selectedShipment
                    ? 'border-2 border-orange-500 shadow-lg'
                    : 'border-2 border-transparent hover:border-gray-200'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-orange-500 mb-3" />
                <Image
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&h=120&fit=crop"
                  alt="Truck"
                  width={200}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-sm text-gray-900">{shipment.name}</h3>
                <p className="text-xs text-gray-400">{shipment.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Driver Details & Map */}
        <div className="col-span-7 space-y-6">
          {/* Driver Details Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Driver Details</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-gray-500 text-xs font-semibold mb-2">Name</p>
                <p className="font-bold text-gray-900">Sunan Rahman</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold mb-2">Phone</p>
                <p className="font-bold text-gray-900">01797111139</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold mb-2">Driving Lincence</p>
                <div className="bg-gray-100 p-2 rounded-lg w-fit mt-1">
                  <FileText size={20} className="text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="relative h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              In progress
            </div>
            <Image
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop"
              alt="Map"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
            {/* Map overlay to simulate real map */}
            <div className="absolute inset-0 bg-blue-500/5" />
          </div>
        </div>

        {/* Right Column - Shipment Details */}
        <div className="col-span-5">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipment Details</h2>

              {/* Image Slider */}
              <div className="relative mb-6 group">
              <Image
                  src={shipmentImages[currentImageIndex]}
                  alt="Shipment"
                  width={400}
                  height={224}
                  className="w-full h-56 object-cover rounded-xl"
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {shipmentImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Shipment Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ship 12 Pallets of Rice</h3>
                  <p className="text-gray-500 text-sm mt-1">12 shrink-wrapped pallets, non-fragile</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Pickup Address</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Rue 14.12, Ouagadougou</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Delivery Address</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Rue 14.12, Ouagadougou</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Contact Person</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Sunan Rahman</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold mb-1.5">Contact Person Number</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">01797111139</p>
                  </div>
                </div>
              </div>

              {/* View Full Details Button */}
              <button className="w-full mt-6 py-3 border-2 border-[#036BB4] text-black  rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                View full details
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ActiveShipmentsDashboard;