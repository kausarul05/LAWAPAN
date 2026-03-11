"use client";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUs = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  const features = [
    'Wide Selection of Hotels: From boutique stays to 5-star resorts.',
    'User-Friendly Interface: Simple navigation and hassle-free booking.',
    'Best Price Guarantee: Competitive rates with transparent pricing.',
    '24/7 Support: Dedicated customer service to assist you anytime.',
    'Exclusive Deals: Get access to discounts and special offers.'
  ];

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div 
          className="mb-8"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            About Us
          </h2>
          <div className="w-24 h-1" style={{backgroundColor: '#036BB4'}}></div>
        </div>

        {/* Who We Are Section */}
        <div 
          className="mb-8"
          data-aos="fade-right"
          data-aos-delay="150"
        >
          <h3 className="font-semibold text-lg mb-3" style={{color: '#036BB4'}}>
            Who We Are :
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Welcome to [Your Website Name], your trusted partner in finding the perfect stay. We specialize in connecting travelers with top-rated hotels, offering a seamless booking experience tailored to your needs. Whether it's a luxurious getaway, a business trip, or a family vacation, we make finding the right accommodation easy and reliable.
          </p>
        </div>

        {/* Our Purpose Section */}
        <div 
          className="mb-8"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <h3 className="font-semibold text-lg mb-3" style={{color: '#036BB4'}}>
            Our Purpose:
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our mission is to simplify the travel experience by providing a platform where quality, convenience, and affordability meet. We are committed to offering a wide range of hotel options, ensuring every traveler finds their ideal stay, no matter their budget or destination.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div
          data-aos="fade-up"
          data-aos-delay="250"
        >
          <h3 className="font-semibold text-lg mb-4" style={{color: '#036BB4'}}>
            Why Choose Us?
          </h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-gray-600 text-sm"
                data-aos="fade-up"
                data-aos-delay={300 + (index * 50)}
              >
                <span style={{color: '#036BB4'}} className="mt-1">•</span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;