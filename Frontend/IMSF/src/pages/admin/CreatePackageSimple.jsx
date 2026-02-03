import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { packageAPI, destinationAPI } from '../../services/endpoints';
import '../../styles/AdminForms.css';

const CreatePackageTest = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    dest_id: '',
    duration_days: '',
    base_price: '',
    max_people: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    const fetchDest = async () => {
      try {
        console.log('Starting to fetch destinations');
        const res = await destinationAPI.getAll(1, 100);
        console.log('Got response:', res);
        
        const data = res.data?.data || [];
        console.log('Setting destinations to:', data);
        setDestinations(data);
      } catch (e) {
        console.error('Error fetching destinations:', e);
        setError('Failed to load destinations');
      }
    };
    
    fetchDest();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.dest_id || !formData.duration_days || !formData.base_price) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const data = {
        title: formData.title,
        dest_id: parseInt(formData.dest_id),
        duration_days: parseInt(formData.duration_days),
        base_price: parseFloat(formData.base_price),
        max_people: parseInt(formData.max_people) || 0,
        description: formData.description || '',
        image_url: formData.image_url || '',
      };
      
      console.log('Creating package with data:', data);
      await packageAPI.create(data);
      setSuccess('Package created successfully!');
      setTimeout(() => navigate('/admin/packages'), 2000);
    } catch (err) {
      console.error('Error creating package:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-form-container">
        <div className="form-card">
          <h1>Create New Package</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Package Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Manali Hill Adventure"
                />
              </div>

              <div className="form-group">
                <label>Destination *</label>
                <select
                  name="dest_id"
                  value={formData.dest_id}
                  onChange={handleChange}
                >
                  <option value="">Select Destination</option>
                  {destinations.length > 0 ? (
                    destinations.map(dest => (
                      <option key={dest.dest_id} value={dest.dest_id}>
                        {dest.name} ({dest.country})
                      </option>
                    ))
                  ) : (
                    <option disabled>No destinations available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (Days) *</label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 5"
                />
              </div>

              <div className="form-group">
                <label>Base Price (₹) *</label>
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 50000"
                />
              </div>

              <div className="form-group">
                <label>Max People</label>
                <input
                  type="number"
                  name="max_people"
                  value={formData.max_people}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 20"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Package details"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Package'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/packages')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePackageTest;
