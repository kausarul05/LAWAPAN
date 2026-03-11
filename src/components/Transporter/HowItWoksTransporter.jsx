"use client";
import React, { useEffect } from 'react';
import { Truck, Bell, CreditCard } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HowItWorksTransporter = () => {
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
      id: 1,
      icon: Truck,
      title: '1. Register My Truck',
      description: 'Create an account and add your trucks to the platform'
    },
    {
      id: 2,
      icon: Bell,
      title: '2. Receive Freight Offers',
      description: 'Get notified of shipping requests matching your trucks'
    },
    {
      id: 3,
      icon: CreditCard,
      title: '3. Transport & Get Paid',
      description: 'Complete the delivery and receive payment quickly'
    }
  ];

  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div 
          className="text-center mb-12"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            How it works
          </h2>
          <p className="text-gray-600 text-base">
            Three simple steps to start earning
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-8 transition-colors duration-300 hover:shadow-lg"
                style={{}}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#036BB4'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgb(229, 231, 235)'}
                data-aos="fade-up"
                data-aos-delay={200 + (index * 100)}
              >
                {/* Icon */}
                <div 
                  className="flex justify-center mb-6"
                  data-aos="zoom-in"
                  data-aos-delay={300 + (index * 100)}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(3, 107, 180, 0.05)'}}>
                    <IconComponent className="w-8 h-8" style={{color: '#036BB4'}} />
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-lg font-bold text-gray-900 text-center mb-3"
                  data-aos="fade-up"
                  data-aos-delay={350 + (index * 100)}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-gray-600 text-sm text-center leading-relaxed"
                  data-aos="fade-up"
                  data-aos-delay={400 + (index * 100)}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div 
          className="flex justify-center"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <button className="px-8 py-3 font-semibold rounded-full border-2 transition-colors duration-300 shadow-sm text-white" style={{backgroundColor: '#036BB4', borderColor: '#036BB4'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(3, 107, 180, 0.05)'; e.currentTarget.style.color = '#036BB4';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#036BB4'; e.currentTarget.style.color = 'white';}}>
            Register my truck now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksTransporter;