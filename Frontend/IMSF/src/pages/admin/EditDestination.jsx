import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { destinationAPI } from '../../services/endpoints';
import '../../styles/AdminForms.css';

const EditDestination = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchDestinationData();
  }, [id]);

  const fetchDestinationData = async () => {
    try {
      console.log('Fetching destination:', id);
      setLoading(true);
      setError('');
      
      const res = await destinationAPI.getById(id);
      console.log('Destination response:', res);
      
      const dest = res.data?.data || res.data;
      console.log('Destination data:', dest);
      
      if (dest) {
        setFormData({
          name: dest.name || '',
          country: dest.country || '',
          description: dest.description || '',
          image_url: dest.image_url || '',
        });
      } else {
        setError('Destination not found');
      }
    } catch (e) {
      console.error('Error:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message || 'Failed to load destination';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!formData.name.trim() || !formData.country.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      console.log('Updating destination:', id, formData);
      await destinationAPI.update(id, formData);
      setSuccess('Destination updated successfully!');
      setTimeout(() => {
        navigate('/admin/destinations');
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update destination';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-form-container">
          <div className="form-card">
            <div className="loading">Loading destination data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-form-container">
        <div className="form-card">
          <h1>Edit Destination #{id}</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Destination Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Paris, Tokyo, New York"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., France, Japan, USA"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a detailed description of the destination"
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image_url">Image URL</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Destination'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/destinations')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDestination;
