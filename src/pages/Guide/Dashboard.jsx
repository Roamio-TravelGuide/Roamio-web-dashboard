import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/guide_dashboard/DashboardHeader';
import StatsCards from '../../components/guide_dashboard/StatsCards';
import SriLankaMap from '../../components/guide_dashboard/SrilankaMap';
import TopPerformingTours from '../../components/guide_dashboard/TopPerformingTours';
import RecentToursTable from '../../components/guide_dashboard/RecentToursTable';
import RecentHiddenGems from '../../components/guide_dashboard/RecentHiddenGems';
import { getTourPackagesByGuideId , getHiddenGemByGuideId } from "../../api/guide/dashboardApi";
import { useAuth } from '../../contexts/authContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    publishedTours: 0,
    hiddenPlaces: 0,
    totalEarnings: 0,
    averageRating: 0,
    tours: [],
    reviews: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiddenGems, setHiddenGems] = useState([]);
  const { authState } = useAuth();

  const determineTourType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('historical') || lowerTitle.includes('ancient') || lowerTitle.includes('fortress') || lowerTitle.includes('rock')) {
      return "Historical";
    } else if (lowerTitle.includes('cultural') || lowerTitle.includes('temple') || lowerTitle.includes('sacred')) {
      return "Cultural";
    } else if (lowerTitle.includes('city') || lowerTitle.includes('urban') || lowerTitle.includes('street')) {
      return "Urban";
    } else if (lowerTitle.includes('nature') || lowerTitle.includes('wildlife') || lowerTitle.includes('beach') || lowerTitle.includes('tea')) {
      return "Nature";
    } else if (lowerTitle.includes('food') || lowerTitle.includes('culinary') || lowerTitle.includes('market')) {
      return "Food";
    } else if (lowerTitle.includes('adventure') || lowerTitle.includes('hiking') || lowerTitle.includes('trekking')) {
      return "Adventure";
    }
    return "General";
  };

  // Helper function to get location coordinates based on tour title or stops
  const getTourLocation = (tour) => {
    if (tour.tour_stops && tour.tour_stops.length > 0 && tour.tour_stops[0].location && tour.tour_stops[0].location.city) {
      const city = tour.tour_stops[0].location.city.toLowerCase();
      const cityCoordinates = {
        'colombo': { lat: 6.9271, lng: 79.8612 },
        'kandy': { lat: 7.2906, lng: 80.6337 },
        'galle': { lat: 6.0535, lng: 80.2210 },
        'sigiriya': { lat: 7.9579, lng: 80.7607 },
        'nuwara eliya': { lat: 6.9497, lng: 80.7829 },
        'negombo': { lat: 7.2099, lng: 79.8370 },
        'anuradhapura': { lat: 8.3114, lng: 80.4037 },
        'polonnaruwa': { lat: 7.9329, lng: 81.0088 },
        'trincomalee': { lat: 8.5874, lng: 81.2155 },
        'jaffna': { lat: 9.6615, lng: 80.0255 }
      };
      
      return cityCoordinates[city] || { lat: 7.8731, lng: 80.7718 };
    }

    const lowerTitle = tour.title.toLowerCase();
    if (lowerTitle.includes('colombo')) return { lat: 6.9271, lng: 79.8612 };
    if (lowerTitle.includes('kandy')) return { lat: 7.2906, lng: 80.6337 };
    if (lowerTitle.includes('galle')) return { lat: 6.0535, lng: 80.2210 };
    if (lowerTitle.includes('sigiriya')) return { lat: 7.9579, lng: 80.7607 };
    if (lowerTitle.includes('nuwara') || lowerTitle.includes('eliya')) return { lat: 6.9497, lng: 80.7829 };
    if (lowerTitle.includes('negombo')) return { lat: 7.2099, lng: 79.8370 };
    
    return { lat: 7.8731, lng: 80.7718 }; // Default Sri Lanka coordinates
  };

  const fetchTourPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authState.user?.id) {
        throw new Error('User not authenticated');
      }

      const response = await getTourPackagesByGuideId(authState.user.id);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      // Transform API response to match your component expectations
      const transformedTours = response.data.map(tour => ({
        ...tour,
        bookings: tour._count?.downloads || 0,
        revenue: (tour._count?.downloads || 0) * tour.price,
        rating: calculateTourRating(tour),
        type: determineTourType(tour.title),
        location: getTourLocation(tour)
      }));

      // Calculate stats from the API data
      const totalTours = response.data.length;
      const publishedTours = response.data.filter(tour => tour.status === 'published').length;
      const totalDownloads = response.data.reduce((sum, tour) => sum + (tour._count?.downloads || 0), 0);
      const totalRevenue = response.data.reduce((sum, tour) => sum + ((tour._count?.downloads || 0) * tour.price), 0);
      
      // Calculate average rating (placeholder - you'll need actual rating data)
      const averageRating = transformedTours.filter(tour => tour.rating).length > 0 
        ? transformedTours.reduce((sum, tour) => sum + (tour.rating || 0), 0) / transformedTours.filter(tour => tour.rating).length
        : 4.7;

      setStats(prevStats => ({
        ...prevStats,
        totalTours,
        publishedTours,
        totalEarnings: totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        tours: transformedTours,
        reviews: getSampleReviews(transformedTours),
        recentActivities: generateRecentActivities(transformedTours)
      }));

    } catch (err) {
      setError('Failed to load tours. Please try again.');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHiddenGems = async () => {
    try {
      if (!authState.user?.id) return;
      
      const response = await getHiddenGemByGuideId(authState.user.id);

      // console.log(response);
      
      if (response.data && Array.isArray(response.data)) {
        setHiddenGems(response.data);

        setStats(prevStats => ({
          ...prevStats,
          hiddenPlaces: response.data.length
        }));
        
      }
    } catch (err) {
      console.error('Error fetching hidden gems:', err);
    }
  };

  // Placeholder function for tour rating calculation
  const calculateTourRating = (tour) => {
    // You'll need to implement actual rating calculation
    // For now, return a placeholder based on downloads or random
    if (tour._count?.downloads > 10) return 4.8;
    if (tour._count?.downloads > 5) return 4.5;
    if (tour._count?.downloads > 0) return 4.2;
    return null;
  };

  // Generate sample reviews based on tours
  const getSampleReviews = (tours) => {
    const publishedTours = tours.filter(tour => tour.status === 'published' && tour._count?.downloads > 0);
    if (publishedTours.length === 0) return [];

    return [
      {
        id: 1,
        traveler: {
          id: 2001,
          name: "Sarah Johnson",
          profile_picture_url: "/avatars/sarah.jpg"
        },
        rating: 5,
        comment: "Amazing tour! Our guide was incredibly knowledgeable.",
        date: '2024-03-12',
        tourId: publishedTours[0]?.id || 1
      },
      {
        id: 2,
        traveler: {
          id: 2002,
          name: "Michael Chen",
          profile_picture_url: "/avatars/michael.jpg"
        },
        rating: 4,
        comment: "Good experience, would recommend to others.",
        date: '2024-03-08',
        tourId: publishedTours[0]?.id || 1
      }
    ];
  };

  // Generate recent activities based on tours
  const generateRecentActivities = (tours) => {
    const activities = [];
    
    tours.forEach(tour => {
      if (tour.created_at) {
        activities.push({
          id: activities.length + 1,
          type: 'package_create',
          description: `Created tour: ${tour.title}`,
          date: tour.created_at,
          tourId: tour.id
        });
      }

      if (tour.status === 'published' && tour._count?.downloads > 0) {
        activities.push({
          id: activities.length + 1,
          type: 'package_download',
          description: `${tour._count.downloads} downloads for ${tour.title}`,
          date: new Date().toISOString(),
          tourId: tour.id
        });
      }
    });

    return activities.slice(0, 5); // Return only 5 most recent activities
  };

  useEffect(() => {
    if (authState.user?.id) {
      fetchTourPackages();
      fetchHiddenGems();

    }
  }, [authState.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <LoadingSpinner size={48} className="text-indigo-600 mx-auto mb-4" />
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-lg text-red-500">{error}</div>
        <button 
          onClick={fetchTourPackages}
          className="px-4 py-2 ml-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          <DashboardHeader/>
          
          <div className="space-y-8">
            <StatsCards stats={stats} />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <SriLankaMap tours={stats.tours} />
              <TopPerformingTours tours={stats.tours} />
            </div>

            <RecentToursTable tours={stats.tours} />
            <RecentHiddenGems hiddenGems={hiddenGems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;