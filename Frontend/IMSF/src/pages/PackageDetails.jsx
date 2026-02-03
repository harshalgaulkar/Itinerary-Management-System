import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { packageAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import '../styles/PackageDetails.css';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [pkg, setPkg] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(`📦 Fetching package ${id}...`);
      
      let pkgData = null;
      let itinData = [];
      
      // Try fetching package details
      try {
        const pkgRes = await packageAPI.getById(id);
        console.log('Package response:', pkgRes);
        pkgData = pkgRes.data?.data || pkgRes.data;
      } catch (err) {
        console.warn('⚠ packageAPI.getById failed, trying fallback...');
        try {
          const pkgRes = await fetch(`http://localhost:4000/packages/${id}`).then(r => r.json());
          pkgData = pkgRes.data || pkgRes;
        } catch (err2) {
          console.error('✗ Package fetch failed');
          throw err;
        }
      }
      
      // Try fetching itinerary
      try {
        const itinRes = await packageAPI.getItineraries(id);
        itinData = Array.isArray(itinRes.data?.data) ? itinRes.data.data : Array.isArray(itinRes.data) ? itinRes.data : [];
      } catch (err) {
        console.warn('⚠ Itinerary fetch failed (optional):', err.message);
      }
      
      console.log(`✓ Package details loaded`, pkgData);
      setPkg(pkgData);
      setItinerary(itinData);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load package details';
      setError(errorMsg);
      console.error('Error fetching package details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/packages/${id}/book`);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="package-details-container">
          <div className="loading">Loading package details...</div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div>
        <Navbar />
        <div className="package-details-container">
          <div className="error-message">{error || 'Package not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="package-details-container">
        <button onClick={() => navigate('/packages')} className="back-btn">
          ← Back to Packages
        </button>

        <div className="details-header">
          <div className="details-image">
            <img
              src={pkg.image_url || 'https://via.placeholder.com/500x300?text=Package'}
              alt={pkg.title}
            />
          </div>
          
          <div className="details-info">
            <h1>{pkg.title}</h1>
            <p className="description">{pkg.description}</p>
            
            <div className="details-grid">
              <div className="detail-item">
                <h4>Price</h4>
                <p className="price">₹{pkg.base_price || pkg.price}</p>
              </div>
              <div className="detail-item">
                <h4>Duration</h4>
                <p>{pkg.duration_days || pkg.duration} days</p>
              </div>
              <div className="detail-item">
                <h4>Max People</h4>
                <p>{pkg.max_people}</p>
              </div>
            </div>

            <button className="btn btn-primary btn-large" onClick={handleBooking}>
              {isAuthenticated ? 'Book Now' : 'Login to Book'}
            </button>

            <button className="btn btn-secondary btn-large" onClick={() => navigate(`/packages/${id}/reviews`)}>
              View Reviews
            </button>
          </div>
        </div>

        {itinerary.length > 0 && (
          <div className="itinerary-section">
            <h2>Itinerary</h2>
            <div className="itinerary-list">
              {itinerary.map((item, index) => (
                <div key={item.itinerary_id} className="itinerary-item">
                  <div className="day-number">Day {item.day}</div>
                  <div className="itinerary-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;
