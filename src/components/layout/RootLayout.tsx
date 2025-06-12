import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const RootLayout = () => {
  const location = useLocation();
  
  const isAuthPage = location.pathname.startsWith('/signin') || 
                     location.pathname.startsWith('/signup');

  return (
    <div className="app flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

      <main className="flex-grow">
        <Outlet /> 
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

export default RootLayout;