// src/layouts/TourGuideLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/authContext';

const TourGuideLayout = () => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        userType="travel_guide"
        user={{
          name: authState.user?.name || "Tour Guide",
          role: authState.user?.role || "Tour Guide",
          avatar: authState.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80"
        }}
      />
      
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default TourGuideLayout;