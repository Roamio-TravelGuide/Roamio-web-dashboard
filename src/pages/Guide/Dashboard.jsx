import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/guide_dashboard/DashboardHeader';
import StatsCards from '../../components/guide_dashboard/StatsCards';
import SriLankaMap from '../../components/guide_dashboard/SrilankaMap';
import TopPerformingTours from '../../components/guide_dashboard/TopPerformingTours';
import RecentToursTable from '../../components/guide_dashboard/RecentToursTable';
import RecentHiddenGems from '../../components/guide_dashboard/RecentHiddenGems';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
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

  useEffect(() => {
  setStats({
    totalTours: 15,
    publishedTours: 12,
    hiddenPlaces: 8,
    totalEarnings: 25489.50,
    averageRating: 4.7,
    tours: [
      {
        id: 1,
        title: "Sigiriya Rock Fortress",
        status: "published",
        bookings: 87,
        revenue: 3520,
        rating: 4.8,
        type: "Historical",
        location: { lat: 7.9579, lng: 80.7607 },
        cover_image: { 
          url: "/images/sigiriya.jpg",
          width: 800,
          height: 600 
        },
        created_at: "2024-03-10T14:30:00Z",
        duration_minutes: 240,
        price: 7500,
        guide: {
          id: 101,
          user: {
            id: 1001,
            name: "John Doe",
            profile_picture_url: "/avatars/john.jpg",
            email: "john@example.com"
          },
          years_of_experience: 5,
          languages_spoken: ["English", "Sinhala"]
        },
        tour_stops: [
          {
            id: 1001,
            stop_name: "Lion's Paw Entrance",
            sequence_no: 1,
            description: "The iconic lion paw entrance to the rock fortress"
          },
          {
            id: 1002,
            stop_name: "Fresco Wall",
            sequence_no: 2,
            description: "Ancient Sigiriya maidens paintings"
          }
        ],
        rejection_reason: null
      },
      {
        id: 2,
        title: "Kandy Temple Walk",
        status: "published",
        bookings: 42,
        revenue: 1250,
        rating: 4.6,
        type: "Cultural",
        location: { lat: 7.2906, lng: 80.6337 },
        cover_image: { 
          url: "/images/kandy.jpg",
          width: 800,
          height: 600 
        },
        created_at: "2024-03-08T10:15:00Z",
        duration_minutes: 180,
        price: 5000,
        guide: {
          id: 102,
          user: {
            id: 1002,
            name: "Jane Smith",
            profile_picture_url: "/avatars/jane.jpg",
            email: "jane@example.com"
          },
          years_of_experience: 3,
          languages_spoken: ["English", "Tamil"]
        },
        tour_stops: [
          {
            id: 2001,
            stop_name: "Temple of the Tooth",
            sequence_no: 1,
            description: "Sacred Buddhist temple housing the tooth relic"
          }
        ],
        rejection_reason: null
      },
      {
        id: 3,
        title: "Colombo City Explorer",
        status: "pending_approval",
        bookings: 0,
        revenue: 0,
        rating: null,
        type: "Urban",
        location: { lat: 6.9271, lng: 79.8612 },
        cover_image: { 
          url: "/images/colombo.jpg",
          width: 800,
          height: 600 
        },
        created_at: "2024-03-15T09:00:00Z",
        duration_minutes: 300,
        price: 6500,
        guide: {
          id: 103,
          user: {
            id: 1003,
            name: "Alex Wong",
            profile_picture_url: "/avatars/alex.jpg",
            email: "alex@example.com"
          },
          years_of_experience: 2,
          languages_spoken: ["English", "Chinese"]
        },
        tour_stops: [
          {
            id: 3001,
            stop_name: "Galle Face Green",
            sequence_no: 1,
            description: "Oceanfront urban park"
          },
          {
            id: 3002,
            stop_name: "Pettah Market",
            sequence_no: 2,
            description: "Bustling local market district"
          }
        ],
        rejection_reason: null
      },
      {
        id: 4,
        title: "Galle Fort Walk",
        status: "pending_approval",
        bookings: 0,
        revenue: 0,
        rating: null,
        type: "Historical",
        location: { lat: 6.0535, lng: 80.2210 },
        cover_image: { 
          url: "/images/galle.jpg",
          width: 800,
          height: 600 
        },
        created_at: "2024-03-18T11:20:00Z",
        duration_minutes: 210,
        price: 5500,
        guide: {
          id: 104,
          user: {
            id: 1004,
            name: "Maria Garcia",
            profile_picture_url: "/avatars/maria.jpg",
            email: "maria@example.com"
          },
          years_of_experience: 4,
          languages_spoken: ["English", "Spanish"]
        },
        tour_stops: [
          {
            id: 4001,
            stop_name: "Galle Lighthouse",
            sequence_no: 1,
            description: "Iconic lighthouse within the fort"
          }
        ],
        rejection_reason: null
      },
      {
        id: 5,
        title: "Nuwara Eliya Tea Trails",
        status: "pending_approval",
        bookings: 0,
        revenue: 0,
        rating: null,
        type: "Nature",
        location: { lat: 6.9497, lng: 80.7829 },
        cover_image: { 
          url: "/images/tea.jpg",
          width: 800,
          height: 600 
        },
        created_at: "2024-03-20T08:45:00Z",
        duration_minutes: 360,
        price: 8500,
        guide: {
          id: 105,
          user: {
            id: 1005,
            name: "David Brown",
            profile_picture_url: "/avatars/david.jpg",
            email: "david@example.com"
          },
          years_of_experience: 6,
          languages_spoken: ["English", "Sinhala", "Tamil"]
        },
        tour_stops: [
          {
            id: 5001,
            stop_name: "Pedro Tea Estate",
            sequence_no: 1,
            description: "Historic tea plantation with factory tour"
          }
        ],
        rejection_reason: null
      }
    ],
    reviews: [
      {
        id: 1,
        traveler: {
          id: 2001,
          name: "Sarah Johnson",
          profile_picture_url: "/avatars/sarah.jpg"
        },
        rating: 5,
        comment: "Amazing tour! Our guide was incredibly knowledgeable about Sigiriya's history.",
        date: '2024-03-12',
        tourId: 1
      },
      {
        id: 2,
        traveler: {
          id: 2002,
          name: "Michael Chen",
          profile_picture_url: "/avatars/michael.jpg"
        },
        rating: 4,
        comment: "Good experience, but the tour ran a bit longer than expected.",
        date: '2024-03-08',
        tourId: 2
      }
    ]
  });
}, [timeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pb-12 mt-5">
        <div className="mx-auto sm:px-6 lg:px-12">
          <DashboardHeader 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
          
          <div className="space-y-8">
            <StatsCards stats={stats} />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <SriLankaMap tours={stats.tours} />
              <TopPerformingTours tours={stats.tours} />
            </div>

            {/* RecentToursTable now takes full width */}
            <RecentToursTable tours={stats.tours} />

            <RecentHiddenGems />

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;