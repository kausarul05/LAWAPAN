"use client";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LastFreightOffers = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  // Sample data for freight offers
  const offers = [
    {
      id: 1,
      fromPostal: '42000',
      fromCity: 'Saint-Étienne',
      toPostal: '13016',
      toCity: 'Marseille',
      pal: 10,
      weight: '100,00',
      weightKg: '4500kg'
    },
    {
      id: 2,
      fromPostal: '42000',
      fromCity: 'Saint-Étienne',
      toPostal: '13016',
      toCity: 'Marseille',
      pal: 10,
      weight: '100,00',
      weightKg: '4500kg'
    },
    {
      id: 3,
      fromPostal: '42000',
      fromCity: 'Saint-Étienne',
      toPostal: '13016',
      toCity: 'Marseille',
      pal: 10,
      weight: '120,00',
      weightKg: '4500kg'
    },
    {
      id: 4,
      fromPostal: '42000',
      fromCity: 'Saint-Étienne',
      toPostal: '13016',
      toCity: 'Marseille',
      pal: 10,
      weight: '120,00',
      weightKg: '4500kg'
    },
    {
      id: 5,
      fromPostal: '42000',
      fromCity: 'Saint-Étienne',
      toPostal: '13016',
      toCity: 'Marseille',
      pal: 10,
      weight: '120,00',
      weightKg: '4500kg'
    },
    {
      id: 6,
      fromPostal: '42000',
      fromCity: 'Saint-Étienne',
      toPostal: '13016',
      toCity: 'Marseille',
      pal: 10,
      weight: '120,00',
      weightKg: '4500kg'
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2 
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Last Freight Offers
        </h2>
        
        {/* Offers List */}
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-lg transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              {/* Left Section - Locations */}
              <div className="flex items-center gap-3 flex-1">
                {/* From Location */}
                <div 
                  className="flex items-center gap-2"
                  data-aos="fade-right"
                  data-aos-delay={300 + (index * 100)}
                >
                  <div className="w-6 h-8 flex items-center justify-center">
                    <svg className="w-6 h-8" viewBox="0 0 24 32">
                      <rect x="8" y="0" width="8" height="3" fill="#002395"/>
                      <rect x="0" y="0" width="8" height="3" fill="#002395"/>
                      <rect x="16" y="0" width="8" height="3" fill="#ED2939"/>
                      <rect x="8" y="3" width="8" height="26" fill="white"/>
                      <rect x="0" y="3" width="8" height="26" fill="#002395"/>
                      <rect x="16" y="3" width="8" height="26" fill="#ED2939"/>   
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {offer.fromPostal} {offer.fromCity}
                    </div>
                  </div>
                </div>

                {/* Arrow/Separator */}
                <div 
                  className="hidden md:block text-gray-400 px-2"
                  data-aos="fade"
                  data-aos-delay={350 + (index * 100)}
                >
                  →
                </div>
                
                {/* To Location */}
                <div 
                  className="flex items-center gap-2"
                  data-aos="fade-left"
                  data-aos-delay={400 + (index * 100)}
                >
                  <div className="w-6 h-8 flex items-center justify-center">
                    <svg className="w-6 h-8" viewBox="0 0 24 32">
                      <rect x="8" y="0" width="8" height="3" fill="#002395"/>
                      <rect x="0" y="0" width="8" height="3" fill="#002395"/>
                      <rect x="16" y="0" width="8" height="3" fill="#ED2939"/>
                      <rect x="8" y="3" width="8" height="26" fill="white"/>
                      <rect x="0" y="3" width="8" height="26" fill="#002395"/>
                      <rect x="16" y="3" width="8" height="26" fill="#ED2939"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {offer.toPostal} {offer.toCity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section - Details */}
              <div 
                className="flex items-center gap-4 text-sm text-gray-700"
                data-aos="fade-up"
                data-aos-delay={450 + (index * 100)}
              >
                <div className="flex items-center gap-1">
                  <span className="font-medium">{offer.pal} pal</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{offer.weight}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{offer.weightKg}</span>
                </div>
              </div>

              {/* Right Section - Button */}
              <div
                data-aos="zoom-in"
                data-aos-delay={500 + (index * 100)}
              >
                <button className="text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200 text-sm whitespace-nowrap" style={{backgroundColor: '#036BB4'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052a3'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#036BB4'}>
                  257
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastFreightOffers;