"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Box, Phone, Mail } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroBanner = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
   const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [merchandise, setMerchandise] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Searching for: " + pickupLocation);
    }, 1000);
  };

  // Array of hero images - replace with your actual image URLs
  const heroImages = [
    {
      id: 1,
      url: './Branded Lawapan Truck Image.jpeg',
      title: "A simple, fast, and reliable transport solution",
      description: "Simplify your logistics with Lawapan Truck. Track your shipment in real time, get secure payments, and connect with trusted transporters."
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: "Nationwide Coverage",
      description: "Connect with transporters across the country for seamless delivery solutions."
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: "Real-Time Tracking",
      description: "Monitor your shipments live with our advanced tracking technology."
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: "Secure & Reliable",
      description: "Your goods are protected with our secure payment and insurance solutions."
    }
  ];

  return (
    <div className="relative w-full bg-white font-sans">
      
      {/* --- 1. Swiper Hero Image Section --- */}
      <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1000}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="w-full h-full"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={image.id}>
              <div 
                className="relative w-full h-full bg-cover bg-center flex items-center"
                style={{ 
                  backgroundImage: `url('${image.url}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
                  <div 
                    className="max-w-2xl bg-[#0000004D]  p-8 md:p-12 rounded-sm"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-once="false"
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                      {image.title}
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-lg">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


     {/* --- 2. Search Bar Section --- */}
           <div className="relative z-20 -mt-20 md:-mt-24 pb-20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div 
                 className="bg-white rounded-[20px] shadow-2xl p-6 md:p-8 border border-gray-100"
                 data-aos="fade-up"
                 data-aos-delay="200"
               >
                 <h3 
                   className="text-gray-500 font-medium mb-6 text-sm uppercase tracking-wider"
                   data-aos="fade-down"
                   data-aos-delay="250"
                 >
                   Find a transporter in one click
                 </h3>
                 
                 {/* UPDATED GRID: changed to lg:grid-cols-5 to fit the extra field */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                   
                   {/* Pickup */}
                   <div 
                     className="space-y-2"
                     data-aos="fade-up"
                     data-aos-delay="300"
                   >
                     <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                       Pickup (postal code or city)
                     </label>
                     <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                         <MapPin size={20} />
                       </div>
                       <input
                         type="text"
                         value={pickupLocation}
                         onChange={(e) => setPickupLocation(e.target.value)}
                         placeholder="Martyrs' Memorial, Algeria"
                         className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     </div>
                   </div>
     
                   {/* Delivery */}
                   <div 
                     className="space-y-2"
                     data-aos="fade-up"
                     data-aos-delay="350"
                   >
                     <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                       Delivery (postal code or city)
                     </label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                         <MapPin size={20} />
                       </div>
                       <input
                         type="text"
                         value={deliveryLocation}
                         onChange={(e) => setDeliveryLocation(e.target.value)}
                         placeholder="Martyrs' Memorial, Algeria"
                         className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     </div>
                   </div>
     
                   {/* Email Address (New) */}
                   <div 
                     className="space-y-2"
                     data-aos="fade-up"
                     data-aos-delay="400"
                   >
                     <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                       Email address
                     </label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                         <Mail size={20} />
                       </div>
                       <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="@gmail.com"
                         className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     </div>
                   </div>
     
                   {/* Phone Number (New) */}
                   <div 
                     className="space-y-2"
                     data-aos="fade-up"
                     data-aos-delay="450"
                   >
                     <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                       Phone number
                     </label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: '#036BB4'}}>
                         <Phone size={20} />
                       </div>
                       <input
                         type="tel"
                         value={phoneNumber}
                         onChange={(e) => setPhoneNumber(e.target.value)}
                         placeholder="0000000"
                         className="w-full bg-[#f3f4f6] pl-12 pr-4 py-4 text-sm font-medium text-gray-700 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     </div>
                   </div>
     
                   {/* Search Button */}
                   <div
                     data-aos="zoom-in"
                     data-aos-delay="500"
                   >
                     <button
                       onClick={handleSearch}
                       disabled={isLoading}
                       className="w-full bg-[#036BB4] text-white py-4 px-8 rounded-full font-bold text-sm hover:bg-[#0052a3] transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isLoading ? '...' : 'Direct Rate'}
                     </button>
                   </div>
     
                 </div>
               </div>
             </div>
           </div>

      {/* --- 2. Search Bar Section (Overlapping) --- */}
        

    </div>
  );
};

export default HeroBanner;