import React, { useState } from 'react';
import { images } from '../../assets/assets';
import { FaHeadphones, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section with Navbar Overlay */}
      <section className="relative py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="relative flex flex-row items-center justify-between w-full max-w-7xl px-6 py-4 mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={images.darkLogo} alt="Roamio" className="h-24 w-24" />
            </div>

            {/* Navigation Menu */}
          <div className="items-center hidden px-6 py-3 border rounded-full md:flex bg-white backdrop-blur-xl border-slate-200/60 shadow-lg">
              <nav className="flex items-center gap-8">
                {[
                  { path: "/", label: "Home" },
                  { path: "/tours", label: "Tours" },
                  { path: "/about", label: "About Us" },
                  { path: "/contact", label: "Contact" },
                ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-slate-700 transition-all duration-300 hover:text-teal-500 hover:scale-110"
                >
                  {item.label}
                </Link>
                ))}
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center justify-center gap-3 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 hover:shadow-2xl shadow-lg transform hover:-translate-y-1"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 text-center pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 backdrop-blur-sm rounded-full border border-teal-400/20 mb-6">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-teal-300">Get In Touch</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Let's Start Your Next
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Audio Adventure
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about our audio tours? Ready to create a custom experience? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Get in <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We're here to help you plan your perfect audio adventure. Whether you need technical support, 
                have questions about our tours, or want to collaborate, our team is ready to assist you.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaMapMarkerAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Visit Our Office</h3>
                  <p className="text-slate-600 text-sm">
                    123 Audio Lane<br />
                    Colombo 00100<br />
                    Sri Lanka
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaPhone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Call Us</h3>
                  <p className="text-slate-600 text-sm">
                    +94 11 234 5678<br />
                    Mon - Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaEnvelope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Email Us</h3>
                  <p className="text-slate-600 text-sm">
                    hello@roamio.com<br />
                    support@roamio.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
                  <p className="text-slate-600 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-6">
              <h3 className="font-semibold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {[
                  { icon: <FaWhatsapp className="w-5 h-5" />, color: 'bg-green-500 hover:bg-green-600', label: 'WhatsApp' },
                  { icon: <FaInstagram className="w-5 h-5" />, color: 'bg-pink-500 hover:bg-pink-600', label: 'Instagram' },
                  { icon: <FaTwitter className="w-5 h-5" />, color: 'bg-blue-400 hover:bg-blue-500', label: 'Twitter' },
                  { icon: <FaLinkedin className="w-5 h-5" />, color: 'bg-blue-600 hover:bg-blue-700', label: 'LinkedIn' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-12 h-12 rounded-xl ${social.color} text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
              <p className="text-slate-600">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="custom">Custom Tour Request</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="Tell us about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-teal-400 hover:to-blue-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <FaPaperPlane className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions about Roamio and our audio tours.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How do I download and use Roamio audio tours?",
                answer: "Download the Roamio app from the App Store or Google Play. Create an account, browse our tour library, and download your chosen tours for offline use. The app will guide you through the experience with GPS-triggered audio."
              },
              {
                question: "Do I need internet connection during the tour?",
                answer: "No! Once you download a tour, it works completely offline. The GPS functionality works without data, and all audio content is stored on your device."
              },
              {
                question: "Can I create custom audio tours for my group?",
                answer: "Absolutely! We offer custom tour creation services. Contact us with your requirements, and our team will work with you to create a personalized audio experience."
              },
              {
                question: "What devices are supported?",
                answer: "Roamio works on all modern smartphones (iOS 12+ and Android 8+). We recommend using headphones for the best immersive experience."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <h3 className="font-semibold text-slate-900 mb-3 text-lg">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;