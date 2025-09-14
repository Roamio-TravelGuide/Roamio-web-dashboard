import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';

const RecentHiddenGems = () => {
  // Mock data for hidden gems
  const hiddenGems = [
    {
      id: 1,
      name: "Secret Waterfall in Ella",
      location: "Ella",
      description: "A breathtaking hidden waterfall only known to locals, with a natural pool perfect for swimming.",
      imageUrl: "/images/ella-waterfall.jpg",
      addedDate: "2024-03-15",
      rating: 4.9,
      type: "Nature"
    },
    {
      id: 2,
      name: "Ancient Cave Temple",
      location: "Dambulla",
      description: "A lesser-known cave temple with stunning frescoes, away from the main tourist routes.",
      imageUrl: "/images/cave-temple.jpg",
      addedDate: "2024-03-10",
      rating: 4.7,
      type: "Historical"
    },
    {
      id: 3,
      name: "Local Spice Garden",
      location: "Kandy",
      description: "Authentic spice garden run by a local family, offering hands-on experiences with rare spices.",
      imageUrl: "/images/spice-garden.jpg",
      addedDate: "2024-03-05",
      rating: 4.8,
      type: "Cultural"
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Recently Added Hidden Gems</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {hiddenGems.map((gem) => (
          <div key={gem.id} className="overflow-hidden transition-shadow duration-300 border border-gray-200 rounded-lg hover:shadow-lg">
            <div className="h-48 overflow-hidden">
              <img 
                src={gem.imageUrl} 
                alt={gem.name}
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{gem.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {gem.type}
                </span>
              </div>
              
              <p className="mb-4 text-sm text-gray-600 line-clamp-2">{gem.description}</p>
              
              <div className="flex items-center mb-2 text-sm text-gray-500">
                <FaMapMarkerAlt className="mr-1" />
                <span>{gem.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-yellow-500">
                  <FaStar className="mr-1" />
                  <span className="font-medium text-gray-700">{gem.rating}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="mr-1" />
                  <span>{new Date(gem.addedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All Hidden Gems →
        </button>
      </div>
    </div>
  );
};

export default RecentHiddenGems;