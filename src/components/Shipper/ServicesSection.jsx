import React from 'react';
import { Truck, Shield, MapPin, Zap } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Truck className="w-8 h-8 text-blue-500" />,
      title: "Full Transport Service",
      description: "Door-to-door transport from origin warehouse to final destination with professional handling"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Cargo Insurance",
      description: "Comprehensive insurance coverage up to 10,000,000 FCFA per trip in partnership with Colis Assurances"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "GPS Truck Tracking",
      description: "Real-time location tracking of your shipment from pickup to delivery"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Fast & Reliable",
      description: "Quick response times and reliable service to keep your business running smoothly"
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-16 md:py-20 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Lawapan Truck Services
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover the simplicity and reliability of renting our quality trucks through our streamlined process. 
            Effortlessly book and confirm your selected vehicle online for a smooth and dependable experience
          </p>
        </div> 
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border-2 border-blue-200 p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                {service.icon}
              </div>
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              {/* Description */}
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div> 
  );
};

export default ServicesSection;