import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section">
          <h3 className="footer-brand">IMS <span>Travel</span></h3>
          <p className="footer-tagline">Explore the world with confidence</p>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:harshalgaulkar79@gmail.com">harshalgaulkar79@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <a href="tel:9356452473">9356452473</a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/#about">About Us</a></li>
            <li><Link to="/packages">Packages</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a href="/#about">Expert Planning</a></li>
            <li><a href="/#about">Best Prices</a></li>
            <li><a href="/#about">World Destinations</a></li>
            <li><a href="/#about">24/7 Support</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/harshal-gaulkar-7a1449230/" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
              💼 LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link github">
              🐙 GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
              𝕏 Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
              📘 Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} IMS Travel. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">|</span>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
