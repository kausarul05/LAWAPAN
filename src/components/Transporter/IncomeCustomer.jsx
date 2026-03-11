"use client";
 import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const IncomeCustomer = () => {
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
      text: 'Certified income of up to €2,080 per week per truck'
    },
    {
      id: 2,
      text: 'You are paid within 30 days by bank transfer'
    },
    {
      id: 3,
      text: 'More service for your drivers - inform your customers in real time from pickup to delivery'
    }
  ];

  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title with animation */}
        <h2 
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 leading-tight"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          More income for you and more<br />service for your customer
        </h2>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Section - Laptop Mockup with animation */}
          <div 
            className="flex-1 flex justify-center"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="relative w-full max-w-md">
              {/* Laptop Screen */}
              <div className="bg-gray-100 rounded-t-lg border-4 border-gray-800 p-4 shadow-xl">
                {/* Browser Header */}
                <div className="bg-white rounded-t-md mb-2 p-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-white rounded-md p-4 min-h-[200px]">
                  {/* Simplified Dashboard UI */}
                  <div className="space-y-3">
                    {/* Top Navigation Bar */}
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <div className="h-2 w-16 bg-blue-500 rounded"></div>
                      <div className="h-2 w-12 bg-gray-300 rounded"></div>
                      <div className="h-2 w-12 bg-gray-300 rounded"></div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-6 w-12 bg-blue-50 rounded flex items-center justify-center">
                          <div className="h-1.5 w-6 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-6 w-12 bg-blue-50 rounded flex items-center justify-center">
                          <div className="h-1.5 w-6 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-6 w-12 bg-blue-50 rounded flex items-center justify-center">
                          <div className="h-1.5 w-6 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-6 w-12 bg-blue-50 rounded flex items-center justify-center">
                          <div className="h-1.5 w-6 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="relative">
                <div className="h-4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-t"></div>
              </div>

              {/* Laptop Stand/Base */}
              <div className="flex justify-center mt-1">
                <div className="w-48 h-2 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md"></div>
              </div>
            </div>
          </div>

          {/* Right Section - Benefits List with staggered animations */}
          <div className="flex-1 space-y-6">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.id} 
                className="flex items-start gap-4"
                data-aos="fade-left"
                data-aos-delay={300 + (index * 100)}
              >
                {/* Check Icon Circle - Changed to blue */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center ring-2 ring-blue-100">
                  <Check className="w-5 h-5 text-blue-600 stroke-[3]" />
                </div>

                {/* Benefit Text */}
                <p className="text-gray-700 text-base leading-relaxed pt-1">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncomeCustomer;