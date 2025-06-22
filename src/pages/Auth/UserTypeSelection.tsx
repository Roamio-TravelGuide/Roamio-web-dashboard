import { Link } from 'react-router-dom';
import { Compass, MapPin, Users, ChefHat, ArrowRight } from 'lucide-react';

const UserTypeSelection = () => {
  const userTypes = [
    {
      id: 'explorer',
      title: 'I want to explore',
      description: 'Discover amazing destinations, book tours, and create unforgettable memories.',
      icon: MapPin,
      gradient: 'from-blue-500 to-teal-600',
    },
    {
      id: 'guide',
      title: 'I want to create tours',
      description: 'Share your local expertise and create guided experiences for travelers.',
      icon: Users,
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      id: 'restaurant',
      title: 'I have a restaurant',
      description: 'Showcase your culinary offerings and attract food enthusiasts.',
      icon: ChefHat,
      gradient: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow border border-gray-200">
              <Compass className="h-12 w-12 text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">Join Roamio</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose your path and start your journey with us.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.id}
                to={`/signup/${type.id}`}
                className="group"
              >
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 text-center flex-grow">
                    {type.description}
                  </p>
                  <div
                    className={`mt-6 text-center text-sm font-medium bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent group-hover:underline`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 inline-block h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      
      </div>
    </div>
  );
};

export default UserTypeSelection;
