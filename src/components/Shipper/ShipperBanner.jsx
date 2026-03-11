"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ShipperBanner = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    // Your search logic here
    console.log({ pickupLocation, deliveryLocation, email, phoneNumber });
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="relative w-full bg-white font-sans">
      
      {/* --- 1. Background Image Layer --- */}
      <div 
        className="relative w-full h-[600px] md:h-[700px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80')",
        }}
      >
        {/* --- 2. Main Text Overlay --- */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div 
              className="bg-[#0000004D] p-8 md:p-12 rounded-sm max-w-xl lg:max-w-2xl"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-md">
                A simple, fast, and <br /> reliable transport solution
              </h1>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-sm">
                Simplify your logistics with Lawapan Truck. Track your shipment in real time, 
                get secure payments, and connect with trusted transporters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. Search Bar Section --- */}
      <div className="relative z-20 -mt-20 md:-mt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-white rounded-[20px] shadow-2xl p-6 md:p-8 border border-gray-100"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 
              className="text-gray-500 font-medium mb-6 text-sm uppercase tracking-wider"
              data-aos="fade-down"
              data-aos-delay="250"
            >
              Find a transporter in one click
            </h3>
            
            {/* UPDATED GRID: changed to lg:grid-cols-5 to fit the extra field */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              
              {/* Pickup */}
              <div 
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                  Pickup (postal code or city)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                    <MapPin size={20} />
                  </div>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Martyrs' Memorial, Algeria"
                    className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Delivery */}
              <div 
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="350"
              >
                <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                  Delivery (postal code or city)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                    <MapPin size={20} />
                  </div>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Martyrs' Memorial, Algeria"
                    className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Address (New) */}
              <div 
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="@gmail.com"
                    className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number (New) */}
              <div 
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="450"
              >
                <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                  Phone number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0000000"
                    className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div
                data-aos="zoom-in"
                data-aos-delay="500"
              >
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-[#036BB4] text-white py-4 px-8 rounded-full font-bold text-sm hover:bg-[#0052a3] transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '...' : 'Direct Rate'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ShipperBanner;