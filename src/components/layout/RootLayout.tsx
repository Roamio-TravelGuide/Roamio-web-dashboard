import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const RootLayout = () => {
  const location = useLocation();
  
  const isAuthPage = location.pathname.startsWith('/signin') || 
                     location.pathname.startsWith('/signup');
  
  const travelerDashboard = location.pathname.startsWith('/create')

  return (
    <div className="app flex flex-col min-h-screen">
      {!isAuthPage && !travelerDashboard && <Navbar />}

      <main className="flex-grow">
        <Outlet /> 
      </main>

      {!isAuthPage &&!travelerDashboard && <Footer />}
    </div>
  );
};

export default RootLayout;