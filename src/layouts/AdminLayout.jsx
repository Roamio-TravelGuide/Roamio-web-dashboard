// src/layouts/AdminLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/authContext';

const AdminLayout = () => {
  const { authState } = useAuth();

  // Redirect to login if not authenticated
  // if (!authState.isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // Redirect away if user isn't an admin
  // if (authState.user?.role !== 'admin') {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar 
        userType="admin"
        user={{
          name: authState.user?.name || "Admin",
          role: authState.user?.role || "Admin",
          avatar: authState.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80"
        }}
      />
      
      <div className="flex flex-1">
        {/* Admin sidebar - you'll want to create this component */}
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* This renders the admin routes */}
          </div>
        </main>
      </div>

      {/* Admin footer if needed */}
    </div>
  );
};

export default AdminLayout;