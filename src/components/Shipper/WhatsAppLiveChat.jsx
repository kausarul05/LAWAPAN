"use client"
import React, { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const WhatsAppLiveChat = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    })
  }, [])

  return (
    <div className="bg-gradient-to-br from-green-50 via-[#EBF7DE] to-[#ffff] flex items-center justify-center p-4 py-9">
      {/* Main Container */}
      <div className="w-full max-w-2xl">
        {/* Content Wrapper */}
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* WhatsApp Icon */}
          <div 
            className="relative"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="absolute inset-0 bg-[#8DD800] rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-[#8DD800] p-6 rounded-full shadow-2xl">
              <MessageCircle size={56} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Heading */}
          <div 
            className="text-center space-y-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              
            </h1>
            <p className="text-gray-500 text-lg font-light">
              Connect with us instantly
            </p>
          </div>  
          
          <div
            data-aos="fade-up"
            data-aos-delay="250"
          >
            <h1 className='text-black text-4xl font-bold'>WhatsApp Live Chat</h1>
          </div>
          
          {/* CTA Button */}
          <button 
            onClick={() => window.open('https://wa.me', '_blank')}
            className="group relative px-8 py-4 bg-[#8DD800] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-[#8DD800] rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>        
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-2">
              <MessageCircle size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              <span>Join Chat</span>
            </div>
          </button>
          
          {/* Decorative Elements */}
          <div 
            className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"
            data-aos="fade-right"
            data-aos-delay="100"
            data-aos-duration="1000"
          ></div>
          <div 
            className="absolute bottom-10 right-10 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"
            data-aos="fade-left"
            data-aos-delay="100"
            data-aos-duration="1000"
          ></div>
        </div>
      </div>
      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }     
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }  
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default WhatsAppLiveChat