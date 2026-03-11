import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = 2025;

  const footerLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy and security', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  const regionalLinks = [
    { name: "Lawapan Truck Côte d'Ivoire", href: '/ci' },
    { name: 'Lawapan Truck Mali', href: '/mali' },
    { name: 'Lawapan Truck Senegal', href: '/senegal' },
  ];

  const socialLinks = [

    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com' },
    
  ];

  return (
    <footer className="w-full bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          
          {/* Logo Section */}
          <div className="flex items-start">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-15 h-15  rounded-full flex items-center justify-center shrink-0 relative">
                <Image src="/web-logo.png" alt="Logo" fill className=" p-1" />
              </div>
              <span className="text-lg font-bold uppercase">
                LAWAPAN TRUCK
              </span>
            </Link>
          </div>

          {/* Footer Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Regional links</h3>
            <ul className="space-y-3">
              {regionalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Social media links</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:border-white hover:scale-110 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Lawapan Truck. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;