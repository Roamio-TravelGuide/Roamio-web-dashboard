// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Roamio</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/moderator">Moderator</Link>
      </div>
    </nav>
  );
};

export default Navbar;