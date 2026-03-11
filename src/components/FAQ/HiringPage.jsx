 "use client";
import React, { useEffect } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HiringPage = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const contactInfo = [
    {
      id: 1,
      icon: MapPin,
      title: 'LAWAPAN',
      description: 'Tour EMBLEM, 92400'
    },
    {
      id: 2,
      icon: Mail,
      title: '@gmail.com',
      description: ''
    },
    {
      id: 3,
      icon: Phone,
      title: '0179711139',
      description: ''
    }
  ];

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title Section with animation */}
        <div 
          className="mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Lawapantruck is hiring
          </h1>
          <div className="w-32 h-1" style={{backgroundColor: '#036BB4'}}></div>
        </div>

        {/* Subtitle with animation */}
        <div 
          className="mb-6"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <h2 className="font-medium text-lg" style={{color: '#036BB4'}}>
            We are currently looking for :
          </h2>
        </div>

        {/* Message Box with animation */}
        <div 
          className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            Thank you for your interest in joining the Lawapantruck team. We do not have any job vacancies at this time, but we encourage you to stay tuned for future openings!
          </p>
        </div>

        {/* Contact Information Cards with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div
                key={contact.id}
                className="bg-gray-50 rounded-lg p-8 flex flex-col items-center text-center hover:bg-gray-100 transition-colors"
                data-aos="zoom-in"
                data-aos-delay={300 + (index * 100)}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#036BB4'}}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-gray-900 font-semibold text-base mb-1">
                  {contact.title}
                </h3>

                {/* Description */}
                {contact.description && (
                  <p className="text-gray-600 text-sm">
                    {contact.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HiringPage;