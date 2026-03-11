"use client"
import React, { useEffect } from 'react'
import { Shield, Check } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const InsuranceProtection = () => {
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
    <div className="relative w-full py-9 flex items-center justify-center p-4 overflow-hidden" style={{background: `linear-gradient(to bottom, #036BB4, #0052a3, #002d5f)`}}>
      {/* Subtle background blur elements */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-20 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{backgroundColor: '#0052a3'}}
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="1000"
        ></div>
        <div 
          className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{backgroundColor: '#036BB4'}}
          data-aos="fade-left"
          data-aos-delay="100"
          data-aos-duration="1000"
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        
        {/* Shield Icon Container */}
        <div 
          className="flex justify-center mb-8"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <div className="relative">
            {/* Icon Box with glassmorphism */}
            <div className="backdrop-blur-md border p-8 rounded-2xl shadow-xl" style={{backgroundColor: 'rgba(3, 107, 180, 0.2)', borderColor: 'rgba(3, 107, 180, 0.4)'}}>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Shield size={50} className="text-white/50 absolute" strokeWidth={1} />
                <Check size={28} className="text-white drop-shadow-lg relative" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 
          className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Insurance Protection
        </h1>
        
        {/* Description */}
        <p 
          className="text-base md:text-lg text-blue-50 max-w-lg mx-auto leading-relaxed drop-shadow-md font-light"
          data-aos="fade-up"
          data-aos-delay="350"
        >
          Lawaap Truck insures your goods for up to 10,000,000 FCFA per trip in partnership with Corts Assurances
        </p>

        {/* CTA Button */}
        <div 
          className="pt-6"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <button className="group relative inline-flex items-center gap-2 px-7 py-3 bg-transparent text-white font-semibold rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl" style={{border: '2px solid rgba(255, 255, 255, 0.6)'}} onMouseEnter={(e) => {e.currentTarget.style.border = '2px solid white'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';}} onMouseLeave={(e) => {e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.6)'; e.currentTarget.style.backgroundColor = 'transparent';}}>
            <span>Get started today</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  )
}

export default InsuranceProtection