import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/authContext';

const ModeratorLayout = () => {
    const { authState } = useAuth();
    const location = useLocation();

    if (!authState.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has moderator role
    if (authState.user?.role !== 'moderator') {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check if current path matches '/tour/:id'
    const isTourDetailPage = location.pathname.startsWith('/tour/');

    return (
        <div className="flex flex-col min-h-screen">
            {!isTourDetailPage && (
                <Navbar 
                    userType="moderator"
                    user={{
                        name: authState.user?.name || "Moderator User",
                        role: authState.user?.role || "moderator",
                        avatar: authState.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80",
                    }}
                />
            )}
            
            <main className="flex-grow p-4 md:p-6 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
};

export default ModeratorLayout;