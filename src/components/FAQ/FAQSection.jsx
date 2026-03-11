"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const FAQSection = () => {
  const [openQuestionId, setOpenQuestionId] = useState(null);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  const faqData = [
    {
      id: 1,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register). Chronotruck handles your shipments throughout mainland France, excluding Corsica and overseas territories.'
    },
    {
      id: 2,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register). Chronotruck handles your shipments throughout mainland France, excluding Corsica and overseas territories.'
    },
    {
      id: 3,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register).'
    },
    {
      id: 4,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register).'
    },
    {
      id: 5,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register).'
    },
    {
      id: 6,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register).'
    },
    {
      id: 7,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register).'
    },
    {
      id: 8,
      question: 'Are there any condition for registration?',
      answer: 'No conditions apply to shippers: you simply need to be a company registered with the RCS (French Trade and Companies Register).'
    }
  ];

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div 
          className="mb-8"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1" style={{backgroundColor: '#036BB4'}}></div>
        </div>

        {/* Section Title */}
        <div 
          className="mb-6"
          data-aos="fade-right"
          data-aos-delay="150"
        >
          <h3 className="font-medium text-base" style={{color: '#036BB4'}}>
            Shipper FAQ :
          </h3>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className="border-b border-gray-200"
              data-aos="fade-up"
              data-aos-delay={200 + (index * 50)}
            >
              {/* Question */}
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full flex items-center justify-between gap-4 text-left group py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <MessageSquare className="w-5 h-5 flex-shrink-0" style={{color: '#036BB4'}} />
                  <span className="text-gray-900 text-sm font-normal">
                    {item.question}
                  </span>
                </div>
                <div 
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                  style={{backgroundColor: '#036BB4'}}
                  data-aos="zoom-in"
                  data-aos-delay={250 + (index * 50)}
                >
                  {openQuestionId === item.id ? (
                    <ChevronUp className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </button>

              {/* Answer */}
              {openQuestionId === item.id && (
                <div 
                  className="pb-4 pl-11 pr-4 text-gray-600 text-sm leading-relaxed"
                  data-aos="fade-down"
                  data-aos-duration="500"
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;