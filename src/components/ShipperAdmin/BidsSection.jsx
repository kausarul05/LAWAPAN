"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Check, 
  MinusCircle,
  Search,
  Truck,
  ShieldCheck,
  Globe
} from 'lucide-react';

const BidsSection = () => {
  const shipments = Array(5).fill({
    title: "Ship 12 Pallets of Rice",
    status: "Open",
    image: "/shipment-sample.jpg" 
  });

  const bids = Array(8).fill({
    bidder: "Truck Lagbe",
    price: "€150.00",
    logo: "/truck-logo.png"
  });

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Live Bids & Assigned transporter</h2>
        <div className="flex gap-2">
          
          <button className="p-1 rounded-full border transition-colors" style={{borderColor: '#036BB4', color: '#036BB4'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 rounded-full border transition-colors" style={{borderColor: '#036BB4', color: '#036BB4'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      {/* 2. Horizontal Shipment Cards Slider */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {shipments.map((ship, idx) => (
          <div key={idx} className="relative min-w-[220px] h-[130px] rounded-xl overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gray-600">
                <div className="w-full h-full opacity-60 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400')] bg-cover bg-center" />
            </div>
            
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-700 transition-colors">
                <MinusCircle size={10} /> Remove
              </span>
              <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Open
              </span>
            </div>
            
            <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
              {ship.title}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3. Bids Table Section */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg">Bids</h3>
            
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#036BB4] text-white text-sm">
                  <th className="py-3 px-6 font-semibold">Bidders</th>
                  <th className="py-3 px-6 font-semibold">Price</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bids.map((bid, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">              
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border border-gray-100" style={{backgroundColor: '#f0f7ff'}}>
                           <span className="text-[10px] font-bold" style={{color: '#036BB4'}}>TL</span>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{bid.bidder}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600 font-semibold">{bid.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. RE-DESIGNED: Assigned Transporter Placeholder Section */}
        <div className="relative border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl bg-gradient-to-b from-white to-blue-50/30 overflow-hidden min-h-[400px]">
          
          {/* Animated Background Radar Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-64 h-64 bg-blue-100 rounded-full animate-ping opacity-20" />
            <div className="absolute w-48 h-48 bg-blue-200 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative mb-8">
            {/* Main Center Icon */}
            <div className="relative z-10 w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border shadow-2xl" style={{color: '#036BB4', borderColor: '#f0f7ff'}}>
              <Search size={40} className="animate-bounce" />
            </div>

            {/* Orbiting Icons */}
            <div className="absolute -top-4 -left-12 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg animate-float" style={{backgroundColor: '#036BB4'}}>
              <Truck size={18} />
            </div>
            <div className="absolute -bottom-2 -right-10 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-float-delayed">
              <ShieldCheck size={22} />
            </div>
            <div className="absolute top-10 -right-14 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white shadow-lg animate-float">
              <Globe size={16} />
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Finding the Best Match <br /> 
              <span style={{color: '#036BB4'}}>for Your Shipment</span>
            </h3>
            <p className="text-gray-500 text-base max-w-xs mx-auto leading-relaxed">
              Our AI is analyzing live bids and transporter ratings to secure the most reliable partner for you.
            </p>
            
            {/* Animated Loading Dots */}
            <div className="flex gap-1.5 justify-center mt-6">
               <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{backgroundColor: '#036BB4'}} />
               <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{backgroundColor: '#036BB4'}} />
               <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#036BB4'}} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default BidsSection;