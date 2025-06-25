// src/layouts/TourGuideLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useAuth } from '../contexts/authContext';

const TourGuideLayout = () => {
  const [isCreatingTour, setIsCreatingTour] = useState(false);
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
        onActionButtonClick={() => setIsCreatingTour(true)}
      />
      
      <main className="flex-grow p-4 md:p-6 bg-gray-50">
        <Outlet />
      </main>

      {/* Tour creation modal would be rendered here */}
      {isCreatingTour && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Your tour creation form */}
        </div>
      )}
    </div>
  );
};

export default TourGuideLayout;