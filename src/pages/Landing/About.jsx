import React from 'react';
import { images } from '../../assets/assets';
import { FaCompass, FaHeadphones, FaMapMarkedAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen">
      <div 
        className="relative flex items-center justify-center h-screen bg-gray-900 text-white overflow-hidden"
        style={{
          backgroundImage: `url(${images.waterfall})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Our <span className="text-teal-400">Story</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed animate-fadeIn delay-100">
            Revolutionizing travel through immersive audio experiences that connect you to places in ways you've never imagined.
          </p>
          <div className="animate-fadeIn delay-200">
            <Link 
              to="/tours" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-700 text-white rounded-lg hover:from-teal-700 hover:to-blue-800 font-medium transition-all duration-300 shadow-md hover:shadow-lg text-lg"
            >
              Explore Our Tours
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            <span className="relative inline-block">
              Our Mission
              <span className="absolute bottom-0 left-0 right-0 h-2 bg-teal-400/30 -z-10 transform translate-y-2"></span>
            </span>
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Roamio, we believe every place has a story to tell. Our mission is to transform how people experience locations by creating deeply engaging audio journeys that bring destinations to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why We Started</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2025 by a team of travel enthusiasts and audio engineers, Roamio was born from a simple observation: most travel apps focus on logistics, but none truly capture the soul of a place.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We set out to change that by combining rich storytelling with precise location technology, creating experiences that feel like having a knowledgeable local guide in your ear.
            </p>
            <div className="pt-4">
              <Link 
                to="/team" 
                className="inline-block px-6 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-600/10 transition-colors duration-300"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-teal-600 rounded-xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500 -z-10"></div>
            <img 
              src={images.team} 
              alt="Team meeting" 
              className="w-full h-auto object-cover rounded-xl shadow-xl transform group-hover:-translate-y-1 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-teal-600">Core Values</span>
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we create at Roamio
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaCompass className="text-4xl mb-4 text-teal-600" />,
                title: "Discovery",
                description: "We believe travel should be about uncovering hidden gems and unexpected stories."
              },
              {
                icon: <FaHeadphones className="text-4xl mb-4 text-teal-600" />,
                title: "Immersion",
                description: "Our audio experiences are designed to fully transport you to another place."
              },
              {
                icon: <FaMapMarkedAlt className="text-4xl mb-4 text-teal-600" />,
                title: "Accuracy",
                description: "Every location pin and audio cue is meticulously researched and tested."
              },
              {
                icon: <FaUsers className="text-4xl mb-4 text-teal-600" />,
                title: "Community",
                description: "We collaborate with local storytellers to create authentic experiences."
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-teal-100 flex flex-col items-center text-center"
              >
                <div className="bg-teal-50 p-4 rounded-full mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Voices From Our <span className="text-teal-600">Community</span>
            </h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear what our users and partners say about their Roamio experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Roamio transformed how I experience cities. It's like having a local friend in every destination.",
                author: "Sarah K., Travel Blogger",
                avatar: images.sarah,
                rating: 5
              },
              {
                quote: "As a history teacher, I use Roamio to bring historical sites to life for my students. Incredible educational tool!",
                author: "Michael T., Educator",
                avatar: images.kyler,
                rating: 5
              },
              {
                quote: "The production quality is outstanding. I feel completely immersed in each location's story.",
                author: "David L., Audio Enthusiast",
                avatar: images.jhon,
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-100 group"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-gray-600 italic mb-6 leading-relaxed">"{testimonial.quote}"</div>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow-sm group-hover:border-teal-200 transition-colors"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">{testimonial.author}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-teal-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')" }}></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience <span className="text-teal-200">Travel Differently</span>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Download Roamio today and discover the world through immersive audio journeys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Get the App
            </a>
            <Link 
              to="/tours" 
              className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;