"use client";

import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';


const ActiveShipmentDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // This would typically come from an API call using the id
  const [shipment] = useState({
    id: id || '#####',
    title: 'Ship 12 Pallets of Rice',
    status: 'In progress',
    description: '12 shrink-wrapped pallets, non-fragile',
    weight: '2,300',
    packagingType: 'Wooden Crates',
    category: 'Furniture',
    dimensions: '120 cm / 100 cm / 160 cm',
    pickupAddress: 'Rue 14.12, Ouagadougou',
    deliveryAddress: 'Rue 14.12, Ouagadougou',
    datePreference: 'Flexible within 2 days',
    timeWindow: '12:00 am',
    contactPerson: 'Susan Rahman',
    price: '200,000',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=400&fit=crop',
    ],
  });

  const handleBack = () => {
    router.push('/dashboard/Transporter/active-shipments');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === shipment.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? shipment.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h1 className="text-xl font-semibold text-black">Shipment Detail</h1>
      </div>

      <div className="flex items-center mb-6">
        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
          {shipment.status}
        </span>
      </div>

      {/* Image Carousel */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="relative w-[500px] ">
          <img
            src={shipment.images[currentImageIndex]}
            alt="Shipment"
            className=" h-64 object-cover rounded-lg"
          />
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipment title</p>
            <p className="text-black font-medium">{shipment.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="text-black font-medium">{shipment.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-black font-medium">{shipment.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Dimensions (L/W/H)</p>
            <p className="text-black font-medium">{shipment.dimensions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Weight</p>
            <p className="text-black font-medium">{shipment.weight}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Type of packaging</p>
            <p className="text-black font-medium">{shipment.packagingType}</p>
          </div>
        </div>
      </div>

      {/* Pickup & Delivery Details */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">Pickup & Delivery Details</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
            <p className="text-black font-medium">{shipment.pickupAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Time Window</p>
            <p className="text-black font-medium">{shipment.timeWindow}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p className="text-black font-medium">{shipment.deliveryAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Contact Person</p>
            <p className="text-black font-medium">{shipment.contactPerson}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Date Preference</p>
            <p className="text-black font-medium">{shipment.datePreference}</p>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Amount</h2>
        <div>
          <p className="text-sm text-gray-500 mb-1">Price</p>
          <p className="text-2xl font-bold text-black">{shipment.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveShipmentDetail;