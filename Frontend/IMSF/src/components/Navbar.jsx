import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          IMS <span>Travel</span>
        </Link>
        
        <div className="navbar-menu">
          <a href="/#about" className="navbar-link">
            About Us
          </a>
          <Link to="/packages" className="navbar-link">
            Packages
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <>
                  <div className="navbar-dropdown" onMouseEnter={() => setShowAdminMenu(true)} onMouseLeave={() => setShowAdminMenu(false)}>
                    <Link to="/admin/dashboard" className="navbar-link admin-link">
                      Admin Panel ▼
                    </Link>
                    {showAdminMenu && (
                      <div className="dropdown-menu">
                        <Link to="/admin/dashboard" className="dropdown-link">Dashboard</Link>
                        <Link to="/admin/packages" className="dropdown-link">Manage Packages</Link>
                        <Link to="/admin/destinations" className="dropdown-link">Manage Destinations</Link>
                        <Link to="/admin/users" className="dropdown-link">Manage Users</Link>
                        <Link to="/admin/diagnostics" className="dropdown-link">Diagnostics</Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                  <Link to="/my-bookings" className="navbar-link">
                    My Bookings
                  </Link>
                </>
              )}
              <Link to="/profile" className="navbar-link">
                <span className="user-name">{user?.full_name || user?.email}</span>
              </Link>
              <button className="navbar-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/signup" className="navbar-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
