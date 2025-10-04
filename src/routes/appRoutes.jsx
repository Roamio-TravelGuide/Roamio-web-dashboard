import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

import TourGuideLayout from '../layouts/TourGuideLayout';
import RootLayout from '../components/MainLayout/RootLayout';

import Home from '../pages/Landing/Home';
import About from '../pages/Landing/About';
import LoginPage from '../pages/Auth/SignInPage';
import SignupPage from '../pages/Auth/UnifiedSignup';
import ResetPassword from '../pages/Auth/ResetPassword';
import ResetPasswordForm from '../pages/Auth/ResetPasswordForm';

import GuideDashboard from '../pages/Guide/Dashboard';
import TourCreate from '../pages/Guide/TourCreate';
import TourDet from '../pages/Guide/TourDetail';
import TourPackages from '../pages/Guide/TourPackages';
import Support from '../pages/Guide/Support';
import TourEarnings from '../pages/Guide/TourEarnings';
import TourSettings from '../pages/Guide/GuideSettings';
import TourEditPage from '../pages/Guide/TourEdit';


import ModeratorLayout from '../layouts/ModeratorLayout';     
import ModeratorDashboard from '../pages/Moderator/ModeratorDashboard ';
import TourDetail from '../pages/Moderator/TourDetail';

import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/Admin/Dashboard'
import Users from '../pages/Admin/Users'
import Complaints from '../pages/Admin/Complaint';
import Tourpackage from '../pages/Admin/Tourpackage';


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
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-form" element={<ResetPasswordForm />} />
        

        {/* Protected Routes - Now protecting the layout too */}
        <Route element={<PrivateRoutes />}>
          <Route element={<TourGuideLayout />}>
            <Route path="/guide" element={<Navigate to="dashboard" replace />} />
            <Route path="/guide/dashboard" element={<GuideDashboard />} />
            <Route path="/guide/tourpackages" element={<TourPackages/>}/>
            <Route path="/guide/tourcreate" element={<TourCreate />} />
            <Route path="/guide/support" element={<Support />} />
            <Route path="/guide/tours/view" element={<TourDet/>} />
            <Route path="/guide/tour/view/:id" element={<TourDet/>} />
            <Route path="/guide/tour/edit/:id" element={<TourEditPage/>} />
            <Route path="/guide/earnings" element={<TourEarnings/>} />
            <Route path="/guide/settings" element={<TourSettings/>} />
          </Route>

          <Route element={<ModeratorLayout/>}>
              <Route path="/moderator/dashboard" element={<ModeratorDashboard/>} />
              {/* <Route path = "/tour/:id" element={<TourDetail/>}> </Route> */}
          </Route>

          <Route element={<AdminLayout/>}>
              <Route path="/admin/dashboard" element={<Dashboard/>} />
              <Route path="/admin/users" element={<Users/>} />
              <Route path="/admin/complaints" element={<Complaints/>} />
              <Route path="/admin/tourpackage" element={<Tourpackage/>} />
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