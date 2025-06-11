// src/routes/LandingRoutes.ts
import type { RouteObject } from 'react-router-dom'; // ✅ correct for TypeScript types only
import Home from '../pages/Landing/Home'; // adjust the path if needed

const LandingRoutes: RouteObject[] = [
  {
    path: '',
    element: <Home />,
  },
  // add more routes like guide, admin, etc. here
];

export default LandingRoutes;
