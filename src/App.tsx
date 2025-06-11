// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import routes from './routes/index'; // Your existing route config

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: routes,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;