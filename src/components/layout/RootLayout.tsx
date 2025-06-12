// src/components/layout/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Create if needed

const RootLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Outlet /> {/* Renders child routes */}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;