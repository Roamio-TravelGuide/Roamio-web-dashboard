import type { RouteObject } from 'react-router-dom'; 
import Home from '../pages/Landing/Home'; 
import SignInPage from '../pages/Auth/SignInPage';
// import SignUpPage from '../pages/Auth/SignUpPage';
// import UserTypeSelection from '../pages/Auth/UserTypeSelection';
import About from '../pages/Landing/About';
import Dashboard from '../pages/Guide/Dashboard'
import UnifiedSignup from '../pages/Auth/UnifiedSignup';

const LandingRoutes: RouteObject[] = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'about',
    element: <About/>
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/signup',
    element: <UnifiedSignup />,
  },

  {
    path: '/create',
    element: <Dashboard />,
  },

];

export default LandingRoutes;
