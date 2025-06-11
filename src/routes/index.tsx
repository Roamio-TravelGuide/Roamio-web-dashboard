import type { RouteObject } from 'react-router-dom'; // ✅ correct for TypeScript types only
import LandingRoutes from './LandingRoutes';

const routes: RouteObject[] = [
  ...LandingRoutes
];

export default routes;
