 "use client";
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Array definitions for features remain the same as they are correct
const leftFeatures = [
  {
    title: 'No Hidden Fees',
    description: 'All services are completely free for transporters'
  },
  {
    title: 'Flexible Schedule',
    description: 'Accept jobs that fit your availability'
  },
  {
    title: 'Regional Coverage',
    description: 'Access to shipments across West Africa'
  }
];

const rightFeatures = [
  {
    title: 'Verified Shippers',
    description: 'Work only with trusted, verified businesses'
  },
  {
    title: '24/7 Support',
    description: 'Our team is always here to help you'
  },
  {
    title: 'Growth Tools',
    description: 'Analytics and insights to grow your business'
  }
];

// FeatureCard component with animation
const FeatureCard = ({ title, description, index, side }) => (
  <div 
    className="flex gap-3 mb-6 sm:mb-8"
    data-aos={side === 'left' ? 'fade-right' : 'fade-left'}
    data-aos-delay={100 + (index * 100)}
  >
    <div className="flex-shrink-0 mt-1">
      {/* Changed icon color to blue */}
      <CheckCircle className="w-6 h-6" style={{color: '#036BB4'}} /> 
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
        {title}
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm">
        {description}
      </p>
    </div>
  </div>
);

const WhyChooseLawapanTruck = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Title with animation */}
        <h2 
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-900"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Why Choose Lawapan Truck?
        </h2>

        {/* Outer container with relative positioning for the absolute divider */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="flex flex-col justify-start">
            {leftFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                index={index}
                side="left"
              />
            ))}
          </div>

          {/* Divider with animation */}
          <div 
            className="hidden md:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-px"
            style={{backgroundColor: '#036BB4'}}
            data-aos="zoom-y-out"
            data-aos-delay="400"
          ></div>

          {/* Right Column */}
          <div className="flex flex-col justify-start">
            {rightFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                index={index}
                side="right"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseLawapanTruck;