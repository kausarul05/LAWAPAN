"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, User, MessageSquare } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

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
      title: 'alzinan314@gmail.com',
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
          className="mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Contact Us
          </h1>
          <div className="w-24 h-1" style={{backgroundColor: '#036BB4'}}></div>
        </div>

        {/* Subtitle with animation */}
        <div 
          className="mb-8"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <p className="font-medium text-base" style={{color: '#036BB4'}}>
            Have a question? Contact Us! We respond to all inquiries.
          </p>
        </div>

        {/* Contact Form with animations */}
        <div className="mb-12">
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div 
              className="relative"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-200 outline-none transition-colors text-sm text-gray-900 placeholder-gray-400"
                style={{}}
                onFocus={(e) => e.target.style.borderBottomColor = '#036BB4'}
                onBlur={(e) => e.target.style.borderBottomColor = 'rgb(229, 231, 235)'}
              />
            </div>
            <div 
              className="relative"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-200 outline-none transition-colors text-sm text-gray-900 placeholder-gray-400"
                style={{}}
                onFocus={(e) => e.target.style.borderBottomColor = '#036BB4'}
                onBlur={(e) => e.target.style.borderBottomColor = 'rgb(229, 231, 235)'}
              />
            </div>
          </div>

          {/* Row 2: Phone and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div 
              className="relative"
              data-aos="fade-right"
              data-aos-delay="250"
            >
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-200 outline-none transition-colors text-sm text-gray-900 placeholder-gray-400"
                style={{}}
                onFocus={(e) => e.target.style.borderBottomColor = '#036BB4'}
                onBlur={(e) => e.target.style.borderBottomColor = 'rgb(229, 231, 235)'}
              />
            </div>
            <div 
              className="relative"
              data-aos="fade-left"
              data-aos-delay="250"
            >
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-200 outline-none transition-colors text-sm text-gray-900 placeholder-gray-400"
                style={{}}
                onFocus={(e) => e.target.style.borderBottomColor = '#036BB4'}
                onBlur={(e) => e.target.style.borderBottomColor = 'rgb(229, 231, 235)'}
              />
            </div>
          </div>
          {/* Row 3: Message with animation */}
          <div 
            className="relative mb-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              rows="4"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-200 outline-none transition-colors text-sm text-gray-900 placeholder-gray-400 resize-none"
              style={{}}
              onFocus={(e) => e.target.style.borderBottomColor = '#036BB4'}
              onBlur={(e) => e.target.style.borderBottomColor = 'rgb(229, 231, 235)'}
            ></textarea>
          </div>
          {/* Submit Button with animation */}
          <div
            data-aos="zoom-in"
            data-aos-delay="350"
          >
            <button
              onClick={handleSubmit}
              className="w-full text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200"
              style={{backgroundColor: '#036BB4'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0052a3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#036BB4'}
            >
              Send
            </button>
          </div>
        </div>
        {/* Contact Information Cards with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div
                key={contact.id}
                className="bg-gray-50 rounded-lg p-8 flex flex-col items-center text-center hover:bg-gray-100 transition-colors hover:shadow-md transform hover:-translate-y-1 transition-transform duration-200"
                data-aos="zoom-in"
                data-aos-delay={400 + (index * 100)}
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

export default ContactUs;