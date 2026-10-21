import { Link } from 'react-router';
import './Navbar.scss';

function Navbar() {
  return (
    <nav className="app-navbar">
      <Link to="/" className="navbar-brand">
        <img
          src="/Gradient%20Resume%20Orbit%20Logo.png"
          alt="InsightCV Logo"
          className="navbar-logo"
        />
        <span>InsightCV</span>
      </Link>
    </nav>
  );
}

export default Navbar;