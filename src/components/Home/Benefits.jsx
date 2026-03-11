"use client";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BenefitsSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  const businessBenefits = [
    { text: <><strong>Save time–</strong> ship in just 3 clicks</> },
    { text: <><strong>Reliable Trucks–</strong> Lawapan finds a reliable truck in real time</> },
    { text: <><strong>Track Everything–</strong> Track every step online, from quote to delivery</> },
    { text: <><strong>Insured Shipments–</strong> Cargo insurance up to 10,000,000 FCFA</> }
  ];

  const transporterBenefits = [

    { text: <><strong>Free Geolocation–</strong> Geolocate your drivers for free</> },
    { text: <><strong>Free Freight Offers–</strong> Receive offers around you at no cost</> },
    { text: <><strong>Quick Payment–</strong> Get paid quickly after delivery</> },
    { text: <><strong>More Opportunities–</strong> Maximize your fleet's productivity</> }
    
  ];

  return (
    <div className="w-full bg-gray-50 py-16 md:py-20 lg:py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Matches HowItWorks Font Sizes */}
        <div 
          className="text-center mb-12 md:mb-16"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Benefits of Using Lawapan Truck
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Discover the simplicity and reliability of renting our quality trucks through our streamlined process. 
            Effortlessly book and confirm your selected vehicle online for a smooth and dependable experience.
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* For Businesses Card */}
          <div 
            className="group bg-white rounded-[2rem] border border-blue-200 shadow-sm p-8 hover:shadow-2xl transition-all duration-300"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="w-full h-56 mb-8 bg-blue-50 rounded-2xl overflow-hidden shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop" 
                alt="Business professionals"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
              For Businesses
            </h3>

            <ul className="space-y-4">
              {businessBenefits.map((item, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-500 ease-out"
                >
                  {/* Bullet size matched to HowItWorks (w-1.5 h-1.5) */}
                  <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                  {/* Font size matched to HowItWorks (text-sm) */}
                  <span className="text-gray-700 text-sm leading-relaxed">
                     
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* For Transporters Card */}
       
          <div 
            className="group bg-white rounded-[2rem] border border-blue-200 shadow-sm p-8 hover:shadow-2xl transition-all duration-300"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="w-full h-56 mb-8 bg-blue-50 rounded-2xl overflow-hidden shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop" 
                alt="Delivery truck and workers"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
              For Transporters
            </h3>

            <ul className="space-y-4">
              {transporterBenefits.map((item, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-500 ease-out"
                >
                  <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;