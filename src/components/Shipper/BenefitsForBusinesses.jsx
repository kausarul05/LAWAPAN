"use client";
import React, { useEffect } from 'react';
import { Clock, Truck, BarChart3, Shield } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BenefitsForBusinesses = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" style={{color: '#036BB4'}} />,
      title: "Save Time",
      description: "Ship in just 3 clicks"
    },
    {
      icon: <Truck className="w-6 h-6" style={{color: '#036BB4'}} />,
      title: "Reliable Trucks",
      description: "Verified transporters only"
    },
    {
      icon: <BarChart3 className="w-6 h-6" style={{color: '#036BB4'}} />,
      title: "Track Online",
      description: "Monitor every step"
    },
    {
      icon: <Shield className="w-6 h-6" style={{color: '#036BB4'}} />,
      title: "Insured",
      description: "Full cargo protection"
    }
  ];

  return (
    <div className="w-full bg-white py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-10 md:mb-12"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Benefits for Businesses
          </h2>
        </div>
 
        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              {/* Icon Container */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300"
                style={{backgroundColor: 'rgba(3, 107, 180, 0.05)'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(3, 107, 180, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(3, 107, 180, 0.05)'}
                data-aos="zoom-in"
                data-aos-delay={300 + (index * 100)}
              >
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 
                className="text-base md:text-lg font-bold text-gray-900 mb-2"
                data-aos="fade-up"
                data-aos-delay={350 + (index * 100)}
              >
                {benefit.title}
              </h3>

              {/* Description */}
              <p 
                className="text-xs md:text-sm text-gray-600"
                data-aos="fade-up"
                data-aos-delay={400 + (index * 100)}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsForBusinesses;