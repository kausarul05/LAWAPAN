"use client";
import React, { useEffect } from 'react';
import { Edit3, Truck, MapPin } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HowItWorks = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  const steps = [
    {
      icon: <Edit3 className="w-7 h-7 text-blue-500" />,
      title: "ENTER DETAILS",
      points: [
        "Provide your shipment details, pickup and delivery location",
        "Describe the goods, add photos, and set your preferred dates.",
        "Tell us what you want to ship, where it's going, and when."
      ]
    },
    {
      icon: <Truck className="w-7 h-7 text-blue-500" />,
      title: "Get a Truck",
      points: [
        "Receive instant bids from trusted transport providers.",
        "We match your request with verified transporters in real time.",
        "Choose the best offer based on price, rating, and delivery time."
      ]
    },
    {
      icon: <MapPin className="w-7 h-7 text-blue-500" />,
      title: "Track Delivery",
      points: [
        "Track your shipment live until it reaches your destination.",
        "Stay updated at every step with real-time notifications.",
        "Monitor your delivery from pickup to drop-off, all in one place."
      ]
    }
  ];

  return (
    <div className="w-full bg-white py-16 md:py-20 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div 
          className="text-center mb-12 md:mb-16"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            How it works
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Discover the simplicity and reliability of renting our quality trucks through our streamlined process. 
            Effortlessly book and confirm your selected vehicle online for a smooth and dependable experience
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl border border-blue-200 overflow-hidden  transition-all duration-300 transform "
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              {/* Animated Wave Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg 
                  className="absolute transition-transform duration-700 group-hover:scale-110"
                  style={{
                    width: '335px',
                    height: '239px',
                    top: '-171px',
                    left: '89px',
                    transform: 'rotate(-165deg)',
                    opacity: 1
                  }}
                  viewBox="0 0 335 239"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 119.5C0 119.5 83.75 0 167.5 0C251.25 0 335 119.5 335 119.5C335 119.5 251.25 239 167.5 239C83.75 239 0 119.5 0 119.5Z"
                    fill="url(#blueGradient)"
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="335" y2="239">
                      <stop offset="0%" stopColor="#036BB4" />
                      <stop offset="50%" stopColor="##036BB4" />
                      <stop offset="100%" stopColor="#036BB4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-8">
                {/* Icon Container */}
                <div 
                  className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300"
                  data-aos="zoom-in"
                  data-aos-delay={300 + (index * 100)}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-bold text-gray-900 mb-6 tracking-wide"
                  data-aos="fade-up"
                  data-aos-delay={350 + (index * 100)}
                >
                  {step.title}
                </h3>

                {/* Points List */}
                <ul className="space-y-4">
                  {step.points.map((point, pointIndex) => (
                    <li 
                      key={pointIndex} 
                      className="flex items-start gap-3"
                      data-aos="fade-up"
                      data-aos-delay={400 + (index * 100) + (pointIndex * 50)}
                    >
                      <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remove the inline styles since we're using AOS */}
    </div>
  );
};

export default HowItWorks;