import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { images } from '../assets/assets';

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
          {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
            <a key={index} href="#" className="text-slate-700 hover:text-teal-600 transition-all duration-200">
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800">Quick Links</h4>
        <ul className="space-y-3">
          {['About', 'Explore', 'Create', 'Pricing'].map((item) => (
            <li key={item}>
              <a 
                href="#" 
                className="text-slate-700 hover:text-teal-600 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-teal-50 relative group inline-block"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-teal-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800">Support</h4>
        <ul className="space-y-3">
          {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms'].map((item) => (
            <li key={item}>
              <a 
                href="#" 
                className="text-slate-700 hover:text-teal-600 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-teal-50 relative group inline-block"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-teal-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800">Stay Updated</h4>
        <p className="text-slate-700 mb-4">
          Subscribe to get updates on new destinations and offers.
        </p>
        <div className="flex">
          <input 
            type="email" 
            placeholder="Your email" 
            className="px-4 py-2 rounded-l-lg text-slate-700 w-full focus:outline-none focus:ring-2 focus:ring-teal-600 border border-slate-300"
          />
          <button className="bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 px-4 py-2 rounded-r-lg transition-all duration-300 text-white shadow-sm hover:shadow-md">
            <MdEmail size={20} />
          </button>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-slate-600 text-sm">
        © {new Date().getFullYear()} Roamio. All rights reserved.
      </p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        {['Privacy', 'Terms', 'Cookies'].map((item) => (
          <a 
            key={item} 
            href="#" 
            className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-all duration-200"
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