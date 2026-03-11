"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TransporterBanner = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden font-sans">
      {/* --- 1. Background Image Layer --- */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://delmashipping.com/wp-content/uploads/2016/11/The-Different-Modes-of-Transportation-Header-e1645547707423.jpg')",
        }}
      >
        {/* Subtle Overlay for better readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* --- 2. Main Content Overlay --- */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* The Semi-transparent Dark Box (Same as Shipper style) */}
          <div 
            className="bg-[#0000004D] p-8 md:p-12 lg:p-14 rounded-sm max-w-xl lg:max-w-2xl border border-white/10 shadow-2xl"
            data-aos="fade-right"
            data-aos-delay="100"
            data-aos-duration="1200"
          >
            {/* Heading with animation */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Join Us and Increase <br /> Your Revenue!
            </h1>
            
            {/* Paragraph with animation */}
            <p 
              className="text-white/90 text-lg md:text-xl leading-relaxed mb-10 drop-shadow-md max-w-lg"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Connect with businesses across West Africa and grow your transport business.
            </p>

            {/* CTA Button with animation */}
            {/* <Link href="/book">
              <button 
                className="group flex items-center gap-3 px-10 py-4 bg-[#0060ad] text-white font-bold rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <span>Join Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link> */}
          </div>

        </div>
      </div>

      {/* Optional: Bottom Gradient to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>

    </div>
  );
};

export default TransporterBanner;