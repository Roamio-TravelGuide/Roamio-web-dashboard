import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

const RootLayout = () => {

  return (
    <div className="flex flex-col min-h-screen app">
      <Header />

      <main className="flex-grow">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;