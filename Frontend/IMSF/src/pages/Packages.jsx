import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { packageAPI } from '../services/endpoints';
import '../styles/Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [packagesWithDates, setPackagesWithDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📦 Fetching packages...');
      
      let packagesData = [];
      
      // Try primary endpoint
      try {
        console.log('Trying GET /packages...');
        const response = await packageAPI.getAll();
        console.log('✓ Response received:', response);
        
        // Backend returns: { status: "success", data: { page: 1, limit: 10, data: [...] } }
        // So we need to access response.data.data.data
        if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
          packagesData = response.data.data.data;
          console.log(`✓✓ SUCCESS! Got ${packagesData.length} packages from response.data.data.data`);
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          packagesData = response.data.data;
          console.log(`✓✓ SUCCESS! Got ${packagesData.length} packages from response.data.data`);
        } else if (response?.data && Array.isArray(response.data)) {
          packagesData = response.data;
          console.log(`✓✓ SUCCESS! Got ${packagesData.length} packages from response.data`);
        } else {
          console.warn('⚠ Unexpected response structure:', response?.data);
        }
        
        if (packagesData.length > 0) {
          setPackages(packagesData);
          // Now check dates for each package
          await checkPackageDates(packagesData);
          setLoading(false);
          return;
        }
      } catch (err1) {
        console.warn('⚠ packageAPI.getAll failed:', err1.message);
      }
      
      // Fallback: Try direct fetch to /packages
      try {
        console.log('Fallback: Direct fetch to /packages...');
        const response = await fetch('http://localhost:4000/packages');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log('✓ Direct fetch response:', data);
        
        // Extract packages from the response
        if (data?.data?.data && Array.isArray(data.data.data)) {
          packagesData = data.data.data;
          console.log(`✓✓ SUCCESS! Got ${packagesData.length} packages from direct fetch`);
        } else if (data?.data && Array.isArray(data.data)) {
          packagesData = data.data;
          console.log(`✓✓ SUCCESS! Got ${packagesData.length} packages from direct fetch`);
        }
        
        if (packagesData.length > 0) {
          setPackages(packagesData);
          // Now check dates for each package
          await checkPackageDates(packagesData);
          setLoading(false);
          return;
        }
      } catch (err2) {
        console.warn('⚠ Direct fetch failed:', err2.message);
      }
      
      // If we get here with no data, show error
      console.error('❌ All fetch attempts failed or returned no packages');
      setError('Unable to load packages. Please check backend connection.');
      setPackages([]);
    } catch (err) {
      console.error('Error in fetchPackages:', err);
      setError(err.message || 'Failed to load packages');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const checkPackageDates = async (packagesData) => {
    const datesMap = {};
    for (const pkg of packagesData) {
      try {
        const datesResponse = await packageAPI.getDates(pkg.package_id);
        console.log(`📅 Date response for package ${pkg.package_id}:`, datesResponse);
        
        let dates = [];
        // Try multiple extraction paths
        if (datesResponse?.data?.data && Array.isArray(datesResponse.data.data)) {
          dates = datesResponse.data.data;
          console.log(`✓ Extracted from response.data.data: ${dates.length} dates`);
        } else if (datesResponse?.data && Array.isArray(datesResponse.data)) {
          dates = datesResponse.data;
          console.log(`✓ Extracted from response.data: ${dates.length} dates`);
        } else if (Array.isArray(datesResponse)) {
          dates = datesResponse;
          console.log(`✓ Extracted from response directly: ${dates.length} dates`);
        }
        
        // Filter active dates only
        const activeDates = dates.filter(d => d.is_active !== 0);
        const hasActiveDates = activeDates.length > 0;
        datesMap[pkg.package_id] = hasActiveDates;
        console.log(`✓ Package ${pkg.package_id}: ${dates.length} total dates, ${activeDates.length} active dates`);
      } catch (err) {
        console.warn(`⚠ Could not fetch dates for package ${pkg.package_id}:`, err.message);
        datesMap[pkg.package_id] = false;
      }
    }
    setPackagesWithDates(datesMap);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // For now, just reload all packages (search can be added later)
    fetchPackages();
  };

  const getPackageImage = (pkg) => {
    // Try multiple image sources in order of preference
    if (pkg.image_url) return pkg.image_url;
    if (pkg.image) return pkg.image;
    if (pkg.destination_image) return pkg.destination_image;
    
    // Map package titles to SVG images - use correct public path for Vite
    const imageMap = {
      'Goa Beach Paradise': '/images/goa-beach.svg',
      'Kerala Backwaters': '/images/kerala-backwaters.svg',
      'Rajasthan Desert Tour': '/images/rajasthan-desert.svg',
      'Shimla Hill Station': '/images/shimla-hills.svg',
      'Mumbai City Explorer': '/images/mumbai-city.svg',
      'Goa': '/images/goa-beach.svg',
      'Manali Hills': '/images/shimla-hills.svg',
      'Manali': '/images/shimla-hills.svg',
      'Manali Adventure': '/images/shimla-hills.svg',
      'Goa Adventure': '/images/goa-beach.svg',
    };
    
    // Check if we have a mapped image for this package
    if (imageMap[pkg.title]) {
      return imageMap[pkg.title];
    }
    
    // If no image, generate a colored placeholder SVG inline
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

  if (loading && packages.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="packages-container">
          <div className="loading">Loading packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="packages-container">
        <div className="packages-header">
          <h1>Travel Packages</h1>
          <p>Discover and book amazing travel experiences</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search packages..."
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button 
              type="button"
              onClick={fetchPackages}
              className="btn btn-secondary"
              style={{ marginLeft: '10px' }}
            >
              🔄 Refresh
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <br />
            <small>Please check your browser console for detailed debug information.</small>
          </div>
        )}

        <div className="packages-grid">
          {packages.length > 0 ? (
            packages.map(pkg => (
              <div key={pkg.package_id} className="package-card">
                <div className="package-image">
                  <img
                    src={getPackageImage(pkg)}
                    alt={pkg.title}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=${encodeURIComponent(pkg.title || 'Package')}`;
                    }}
                  />
                  {packagesWithDates[pkg.package_id] ? (
                    <span className="badge badge-available">✓ Dates Available</span>
                  ) : (
                    <span className="badge badge-unavailable">⚠ No Dates</span>
                  )}
                </div>
                <div className="package-content">
                  <h3>{pkg.title}</h3>
                  <p className="description">{pkg.description}</p>
                  <div className="package-info">
                    <span className="duration">📅 {pkg.duration_days || pkg.duration} days</span>
                    <span className="price">₹{pkg.base_price || pkg.price}</span>
                  </div>
                  <Link
                    to={`/packages/${pkg.package_id}`}
                    className="btn btn-primary"
                    style={{ opacity: packagesWithDates[pkg.package_id] ? 1 : 0.6, pointerEvents: packagesWithDates[pkg.package_id] ? 'auto' : 'none' }}
                  >
                    {packagesWithDates[pkg.package_id] ? 'Book Now' : 'No Dates Available'}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-packages">
              <p>No packages found.</p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Try clicking the Refresh button or check the browser console for error details.
              </p>
            </div>
          )}
        </div>

        {packages.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => fetchPackages()}
              className="btn"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
