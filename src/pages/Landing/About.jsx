import React from 'react';
import { images } from '../../assets/assets';
import { FaCompass, FaHeadphones, FaMapMarkedAlt, FaUsers, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section with Navbar Overlay */}
      <div 
        className="relative flex items-center justify-center h-screen text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${images.Waterfall})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="relative flex flex-row items-center justify-between w-full max-w-7xl px-6 py-4 mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={images.darkLogo} alt="Roamio" className="h-24 w-24" />
            </div>

            {/* Navigation Menu */}
            <div className="items-center hidden px-6 py-3 border rounded-full md:flex bg-white backdrop-blur-xl border-slate-200/60 shadow-lg">
              <nav className="flex items-center gap-8 ">
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
        <div className="relative z-10 text-center px-4 max-w-4xl mt-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Story</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-slate-200">
            Revolutionizing travel through immersive audio experiences that connect you to places in ways you've never imagined.
          </p>
          <div>
            <Link 
              to="/tours" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-lg font-semibold rounded-2xl hover:from-teal-400 hover:to-blue-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Explore Our Tours
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce z-10">
          <div className="w-px h-12 bg-gradient-to-b from-teal-400 to-transparent"></div>
        </div>
      </div>

      {/* Rest of the About page content remains the same */}
      {/* Mission Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 mb-6">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-teal-700">Our Mission</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Transforming How You <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Experience Travel</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            At Roamio, we believe every place has a story to tell. Our mission is to transform how people experience locations by creating deeply engaging audio journeys that bring destinations to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Why We Started</h3>
            <p className="text-slate-600 leading-relaxed">
              Founded by a team of travel enthusiasts and audio engineers, Roamio was born from a simple observation: most travel apps focus on logistics, but none truly capture the soul of a place.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We set out to change that by combining rich storytelling with precise location technology, creating experiences that feel like having a knowledgeable local guide in your ear.
            </p>
            <div className="pt-4">
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">50K+</div>
                  <div>Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">200+</div>
                  <div>Audio Tours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">4.9</div>
                  <div>Rating</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: `url(${images.Train})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                aspectRatio: '4/3'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Our Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Core <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Principles</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we create at Roamio
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaCompass className="w-8 h-8" />,
                title: "Discovery",
                description: "We believe travel should be about uncovering hidden gems and unexpected stories.",
                color: "teal"
              },
              {
                icon: <FaHeadphones className="w-8 h-8" />,
                title: "Immersion",
                description: "Our audio experiences are designed to fully transport you to another place.",
                color: "blue"
              },
              {
                icon: <FaMapMarkedAlt className="w-8 h-8" />,
                title: "Accuracy",
                description: "Every location pin and audio cue is meticulously researched and tested.",
                color: "teal"
              },
              {
                icon: <FaUsers className="w-8 h-8" />,
                title: "Community",
                description: "We collaborate with local storytellers to create authentic experiences.",
                color: "blue"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${value.color}-500 to-${value.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-teal-700 transition-colors duration-300">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 mb-6">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-teal-700">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Voices From Our <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Community</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hear what our users and partners say about their Roamio experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Roamio transformed how I experience cities. It's like having a local friend in every destination.",
                author: "Sarah K., Travel Blogger",
                rating: 5
              },
              {
                quote: "As a history teacher, I use Roamio to bring historical sites to life for my students. Incredible educational tool!",
                author: "Michael T., Educator",
                rating: 5
              },
              {
                quote: "The production quality is outstanding. I feel completely immersed in each location's story.",
                author: "David L., Audio Enthusiast",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-slate-600 italic mb-6 leading-relaxed text-sm">"{testimonial.quote}"</div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.author.split(' ')[0][0]}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 text-sm">{testimonial.author}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Travel Differently</span>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-slate-300">
            Download Roamio today and discover the world through immersive audio journeys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-lg font-semibold rounded-2xl hover:from-teal-400 hover:to-blue-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Explore Tours
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-semibold rounded-2xl hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              Download App
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;