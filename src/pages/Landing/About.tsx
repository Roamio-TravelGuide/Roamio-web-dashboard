import React from 'react';
import { images } from '../../assets/assets';
import { FaCompass, FaHeadphones, FaMapMarkedAlt, FaUsers } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative flex items-center justify-center h-[80vh] bg-gray-900 text-white overflow-hidden"
        style={{
          backgroundImage: `url(${images.waterfall})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl mb-8">
            Revolutionizing travel through immersive audio experiences that connect you to places in ways you've never imagined.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Roamio, we believe every place has a story to tell. Our mission is to transform how people experience locations by creating deeply engaging audio journeys that bring destinations to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why We Started</h3>
            <p className="text-gray-600 mb-6">
              Founded in 2025 by a team of travel enthusiasts and audio engineers, Roamio was born from a simple observation: most travel apps focus on logistics, but none truly capture the soul of a place.
            </p>
            <p className="text-gray-600">
              We set out to change that by combining rich storytelling with precise location technology, creating experiences that feel like having a knowledgeable local guide in your ear.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src={images.team} 
              alt="Team meeting" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
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
              <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center">
                <div>{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
    <div className="w-24 h-1 bg-teal-600 mx-auto mb-12"></div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          quote: "Roamio transformed how I experience cities. It's like having a local friend in every destination.",
          author: "Sarah K., Travel Blogger",
          avatar: images.sarah
        },
        {
          quote: "As a history teacher, I use Roamio to bring historical sites to life for my students. Incredible educational tool!",
          author: "Michael T., Educator",
          avatar: images.kyler
        },
        {
          quote: "The production quality is outstanding. I feel completely immersed in each location's story.",
          author: "David L., Audio Enthusiast",
          avatar: images.jhon
        }
      ].map((testimonial, index) => (
        <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-gray-600 italic mb-6">"{testimonial.quote}"</div>
          <div className="flex items-center justify-center">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.author} 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div className="text-left">
              <div className="font-semibold">{testimonial.author}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Travel Differently?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Download Roamio today and discover the world through immersive audio journeys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300">
              Get the App
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-600 hover:bg-opacity-10 transition-colors duration-300">
              Explore Tours
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;