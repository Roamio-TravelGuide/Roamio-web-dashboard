import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

import TourGuideLayout from '../layouts/TourGuideLayout';
import RootLayout from '../components/MainLayout/RootLayout';

import Home from '../pages/Landing/Home';
import About from '../pages/Landing/About';
import LoginPage from '../pages/Auth/SignInPage';
import SignupPage from '../pages/Auth/UnifiedSignup';

import GuideDashboard from '../pages/Guide/Dashboard';
import TourCreate from '../pages/Guide/TourCreate'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout (Navbar + Footer) */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth routes (without layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes - Now protecting the layout too */}
        <Route element={<PrivateRoutes />}>
          <Route element={<TourGuideLayout />}>
            <Route path="/guide" element={<Navigate to="dashboard" replace />} />
            <Route path="/guide/dashboard" element={<GuideDashboard />} />
            <Route path="/guide/tourcreate" element={<TourCreate />} />
          </Route>
        </Route>

        {/* Optional: 404 catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;