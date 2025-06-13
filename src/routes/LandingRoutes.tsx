import type { RouteObject } from 'react-router-dom'; 
import Home from '../pages/Landing/Home'; 
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import UserTypeSelection from '../pages/UserTypeSelection';
import About from '../pages/Landing/About';


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
    element: <UserTypeSelection />,
  },
   {
    path: '/signup/:userType',
    element: <SignUpPage />,
  },
];

export default LandingRoutes;
