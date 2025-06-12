import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { images } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm border-t border-slate-200 w-full px-[10%] py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="logo">
              <img 
                src={images.darkLogo} 
                alt="Roamio Logo" 
                className="h-12 w-auto" 
              />
            </div>
            <p className="text-slate-700">
              Making travel planning seamless and enjoyable for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-700 hover:text-[#ef4444] transition-all duration-200">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-slate-700 hover:text-[#ef4444] transition-all duration-200">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-slate-700 hover:text-[#ef4444] transition-all duration-200">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-slate-700 hover:text-[#ef4444] transition-all duration-200">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Explore', 'Create', 'Pricing'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-700 hover:text-[#ef4444] font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-red-50 relative group inline-block"
                  >
                    {item}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#ef4444] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Support</h4>
            <ul className="space-y-3">
              {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-700 hover:text-[#ef4444] font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-red-50 relative group inline-block"
                  >
                    {item}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#ef4444] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Stay Updated</h4>
            <p className="text-slate-700 mb-4">
              Subscribe to get updates on new destinations and offers.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg text-slate-700 w-full focus:outline-none focus:ring-2 focus:ring-[#ef4444] border border-slate-300"
              />
              <button className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] px-4 py-2 rounded-r-lg transition-all duration-300 text-white shadow-sm hover:shadow-md">
                <MdEmail size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Roomio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-slate-600 hover:text-[#ef4444] text-sm font-medium transition-all duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;