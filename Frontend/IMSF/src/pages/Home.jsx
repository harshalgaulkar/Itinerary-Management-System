import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { packageAPI } from '../services/endpoints';
import '../styles/Home.css';

function Home() {
  const { isAuthenticated } = useAuth();
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      const response = await packageAPI.getAll(1, 2);
      
      let packages = [];
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
        packages = response.data.data.data.slice(0, 2);
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        packages = response.data.data.slice(0, 2);
      }
      
      setFeaturedPackages(packages);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setFeaturedPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const getPackageImage = (pkg) => {
    // Map package titles to SVG images
    const imageMap = {
      'Goa Beach Paradise': '/images/goa-beach.svg',
      'Goa Water Sports Extreme': '/images/goa-beach.svg',
      'Goa Luxury Spa Retreat': '/images/goa-beach.svg',
      'Kerala Backwaters': '/images/kerala-backwaters.svg',
      'Kerala Backwaters Cruise': '/images/kerala-backwaters.svg',
      'Kerala Spice Garden Tour': '/images/kerala-backwaters.svg',
      'Kerala Royal Experience': '/images/kerala-backwaters.svg',
      'Rajasthan Desert Tour': '/images/rajasthan-desert.svg',
      'Rajasthan Golden Triangle': '/images/rajasthan-desert.svg',
      'Rajasthan Off-Beat Explorer': '/images/rajasthan-desert.svg',
      'Shimla Hill Station': '/images/shimla-hills.svg',
      'Shimla': '/images/shimla-hills.svg',
      'Manali Adventure': '/images/shimla-hills.svg',
      'Himachal Nature Escape': '/images/shimla-hills.svg',
      'Mumbai City Explorer': '/images/mumbai-city.svg',
      'Mumbai Heritage Walk': '/images/mumbai-city.svg',
    };
    
    if (imageMap[pkg.title]) {
      return imageMap[pkg.title];
    }
    
    // Generate inline SVG for unmapped packages
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8'];
    const hash = pkg.title?.charCodeAt(0) || 0;
    const color = colors[hash % colors.length];
    
    // Use inline SVG as fallback
    const svgString = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#${color}"/>
      <text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${pkg.title || 'Package'}
      </text>
    </svg>`;
    
    return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
  };

  return (
    <div>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1>Explore the World with IMS Travel</h1>
            <p>Discover amazing destinations, book unforgettable experiences</p>
            <div className="hero-buttons">
              <Link to="/packages" className="btn btn-primary">
                Explore All Packages
              </Link>
              {!isAuthenticated && (
                <Link to="/signup" className="btn btn-secondary">
                  Get Started
                </Link>
              )}
            </div>
          </div>
          <div className="hero-image">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              {/* Plane */}
              <g id="plane">
                <ellipse cx="200" cy="80" rx="50" ry="30" fill="#FF6B6B" opacity="0.9"/>
                <polygon points="200,60 180,80 220,80" fill="#FF5252"/>
                <rect x="190" y="100" width="20" height="40" fill="#444"/>
              </g>
              {/* Person with bag 1 */}
              <g id="person1">
                <circle cx="80" cy="140" r="12" fill="#FFD700"/>
                <rect x="72" y="155" width="16" height="30" fill="#FF6B6B"/>
                <circle cx="76" cy="190" r="4" fill="#444"/>
                <circle cx="84" cy="190" r="4" fill="#444"/>
                <rect x="60" y="145" width="25" height="30" fill="#4ECDC4" opacity="0.7"/>
              </g>
              {/* Person with bag 2 */}
              <g id="person2">
                <circle cx="320" cy="140" r="12" fill="#FFD700"/>
                <rect x="312" y="155" width="16" height="30" fill="#45B7D1"/>
                <circle cx="316" cy="190" r="4" fill="#444"/>
                <circle cx="324" cy="190" r="4" fill="#444"/>
                <rect x="300" y="145" width="25" height="30" fill="#FFA07A" opacity="0.7"/>
              </g>
              {/* Mountains in background */}
              <polygon points="0,250 150,100 300,250" fill="#90EE90" opacity="0.3"/>
              <polygon points="100,250 250,120 400,250" fill="#98D8C8" opacity="0.3"/>
            </svg>
          </div>
        </div>

        {/* About Us Section */}
        <div id="about" className="about-section">
          <div className="about-content">
            <h2>About IMS Travel</h2>
            <div className="founder-section">
              <h3>Founder: Harshal Gaulkar</h3>
              <p>
                At IMS Travel, we believe every journey tells a story. Whether you're seeking adventure on 
                mountain peaks, relaxation on pristine beaches, or cultural immersion in vibrant cities, 
                we've got the perfect package for you.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-label">📧 Email:</span>
                  <a href="mailto:harshalgaulkar79@gmail.com">harshalgaulkar79@gmail.com</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">📱 Mobile:</span>
                  <a href="tel:9356452473">9356452473</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">💼 LinkedIn:</span>
                  <a href="https://www.linkedin.com/in/harshal-gaulkar-7a1449230/" target="_blank" rel="noopener noreferrer">
                    Connect with me
                  </a>
                </div>
              </div>
            </div>
            <div className="about-features">
              <div className="about-feature">
                <div className="feature-icon">✈️</div>
                <h4>Expert Planning</h4>
                <p>Curated travel experiences by industry experts</p>
              </div>
              <div className="about-feature">
                <div className="feature-icon">🎒</div>
                <h4>Best Prices</h4>
                <p>Competitive pricing with maximum value</p>
              </div>
              <div className="about-feature">
                <div className="feature-icon">🌍</div>
                <h4>World Destinations</h4>
                <p>Access to exclusive global travel packages</p>
              </div>
              <div className="about-feature">
                <div className="feature-icon">24/7</div>
                <h4>24/7 Support</h4>
                <p>Round-the-clock customer assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Packages Section */}
        <div className="featured-section">
          <h2>Featured Packages</h2>
          <p className="section-subtitle">Handpicked destinations waiting for you</p>
          
          {loading ? (
            <div className="loading">Loading packages...</div>
          ) : featuredPackages.length > 0 ? (
            <div className="featured-packages">
              {featuredPackages.map(pkg => (
                <div key={pkg.package_id} className="featured-card">
                  <div className="featured-image">
                    <img 
                      src={getPackageImage(pkg)} 
                      alt={pkg.title}
                      onError={(e) => {
                        const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8'];
                        const hash = pkg.title?.charCodeAt(0) || 0;
                        const color = colors[hash % colors.length];
                        const svgString = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#${color}"/><text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${pkg.title || 'Package'}</text></svg>`;
                        e.target.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
                      }}
                    />
                  </div>
                  <div className="featured-content">
                    <h3>{pkg.title}</h3>
                    <p className="description">{pkg.description}</p>
                    <div className="package-meta">
                      <span className="duration">📅 {pkg.duration_days || pkg.duration} days</span>
                      <span className="price">₹{pkg.base_price || pkg.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-packages">No packages available</div>
          )}

          <div className="view-more-container">
            <Link to="/packages" className="btn btn-view-more">
              View More Packages →
            </Link>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="features">
          <div className="feature-card">
            <h3>🏆 Best Value</h3>
            <p>Competitive prices without compromising on quality or experience</p>
          </div>
          <div className="feature-card">
            <h3>🛡️ Secure Booking</h3>
            <p>Encrypted payments and guaranteed booking confirmation</p>
          </div>
          <div className="feature-card">
            <h3>🌟 Unique Experiences</h3>
            <p>Exclusive packages and local experiences curated for you</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
