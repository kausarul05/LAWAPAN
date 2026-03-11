 "use client";
import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProfessionalCarriers = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const benefits = [
    {
      id: 1,
      text: 'Track your drivers for free and check out the jobs along the way'
    },
    {
      id: 2,
      text: 'The shippers pay a commission to Lawapantruck, not the carriers'
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title with animation */}
        <h2 
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Free to all professional carriers
        </h2>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Section - Benefits List with staggered animations */}
          <div className="flex-1 space-y-6">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.id} 
                className="flex items-start gap-4"
                data-aos="fade-right"
                data-aos-delay={200 + (index * 100)}
              >
                {/* Check Icon Circle - Changed to blue */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center ring-2 ring-blue-100">
                  <Check className="w-5 h-5 text-blue-600 stroke-[3]" />
                </div>

                {/* Benefit Text */}
                <p className="text-gray-900 text-base font-medium leading-relaxed pt-1">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          {/* Right Section - Laptop Mockup with animation */}
          <div 
            className="flex-1 flex justify-center"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="relative w-full max-w-lg">
              {/* Laptop Screen */}
              <div className="bg-white rounded-t-lg border-8 border-gray-900 p-3 shadow-2xl">
                {/* Browser/App Header */}
                <div className="bg-gray-100 rounded-t-md mb-2 p-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-1.5 bg-gray-300 rounded"></div>
                    <div className="w-16 h-1.5 bg-gray-300 rounded"></div>
                  </div>
                </div>

                {/* Dashboard Content with Map */}
                <div className="bg-white rounded-md overflow-hidden">
                  <div className="flex">
                    {/* Left Sidebar */}
                    <div className="w-1/3 bg-white p-3 space-y-2 border-r border-gray-200">
                      {/* Search/Filter Bar - Changed to blue */}
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-blue-500 rounded"></div>
                        <div className="h-1.5 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-1.5 w-2/3 bg-gray-300 rounded"></div>
                      </div>

                      {/* List Items */}
                      <div className="space-y-3 pt-4">
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-gray-400 rounded"></div>
                          <div className="h-1 w-5/6 bg-gray-300 rounded"></div>
                          <div className="h-1 w-4/6 bg-gray-300 rounded"></div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-gray-400 rounded"></div>
                          <div className="h-1 w-5/6 bg-gray-300 rounded"></div>
                          <div className="h-1 w-4/6 bg-gray-300 rounded"></div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-gray-400 rounded"></div>
                          <div className="h-1 w-5/6 bg-gray-300 rounded"></div>
                          <div className="h-1 w-4/6 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Map */}
                    <div className="w-2/3 bg-gray-50 p-3 relative">
                      {/* Map-like interface */}
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
                        {/* Simulated map lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-30">
                          <line x1="0" y1="20%" x2="100%" y2="25%" stroke="#999" strokeWidth="1"/>
                          <line x1="0" y1="40%" x2="100%" y2="38%" stroke="#999" strokeWidth="1"/>
                          <line x1="0" y1="60%" x2="100%" y2="65%" stroke="#999" strokeWidth="1"/>
                          <line x1="20%" y1="0" x2="18%" y2="100%" stroke="#999" strokeWidth="1"/>
                          <line x1="40%" y1="0" x2="45%" y2="100%" stroke="#999" strokeWidth="1"/>
                          <line x1="60%" y1="0" x2="58%" y2="100%" stroke="#999" strokeWidth="1"/>
                          <line x1="80%" y1="0" x2="82%" y2="100%" stroke="#999" strokeWidth="1"/>
                        </svg>

                        {/* Map markers - Changed to blue shades */}
                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-lg"></div>

                        {/* Route line - Changed to blue */}
                        <svg className="absolute inset-0 w-full h-full">
                          <path 
                            d="M 33% 25% Q 45% 40%, 50% 50% T 67% 67%" 
                            stroke="#3b82f6" 
                            strokeWidth="2" 
                            fill="none"
                            strokeDasharray="4,4"
                          />
                        </svg>
                      </div>

                      {/* Map Controls */}
                      <div className="absolute bottom-6 right-6 flex flex-col gap-1">
                        <div className="w-6 h-6 bg-white rounded shadow border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">+</div>
                        <div className="w-6 h-6 bg-white rounded shadow border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">−</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info Bar - Changed to blue */}
                  <div className="bg-gray-50 border-t border-gray-200 p-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-1.5 w-12 bg-gray-400 rounded"></div>
                      <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                      <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-1.5 w-16 bg-blue-400 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="relative">
                <div className="h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-lg shadow-lg"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-t"></div>
              </div>

              {/* Laptop Stand/Base */}
              <div className="flex justify-center mt-1">
                <div className="w-56 h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-md shadow-md"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfessionalCarriers;