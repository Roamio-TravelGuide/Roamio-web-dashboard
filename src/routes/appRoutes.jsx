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
import TourCreate from '../pages/Guide/TourCreate';
import TourDet from '../pages/Guide/TourDetail';
import TourPackages from '../pages/Guide/TourPackages';
import Complaints from '../pages/Guide/Complaints'

import ModeratorLayout from '../layouts/ModeratorLayout';
import ModeratorDashboard from '../pages/Moderator/ModeratorDashboard ';
import TourDetail from '../pages/Moderator/TourDetail';

import VendorDashboard from '../pages/Vendor/Dashboard';
import VendorLayout from '../layouts/VendorLayout';
import VendorLocation from '../pages/Vendor/Location';
// import VendorPromotions from '../pages/Vendor/Promotions';
import VendorSupport from '../pages/Vendor/Support';
import VendorBilling from '../pages/Vendor/Billing';

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
            <Route path="/guide/tourpackages" element={<TourPackages/>}/>
            <Route path="/guide/tourcreate" element={<TourCreate />} />
            <Route path="/guide/complaints" element={<Complaints />} />
            <Route path="/guide/tours/view" element={<TourDet/>} />
            <Route path="/guide/tour/view/:id" element={<TourDet/>} />
          </Route>

          <Route element={<ModeratorLayout/>}>
            <Route path="/moderator/dashboard" element={<ModeratorDashboard/>} />
            <Route path="/moderator/tour/:id" element={<TourDetail/>} />
          </Route>

          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/location" element={<VendorLocation />} />
            {/* <Route path="/vendor/promotions" element={<VendorPromotions />} /> */}
            <Route path="/vendor/support" element={<VendorSupport />} />
            <Route path="/vendor/billing" element={<VendorBilling />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;