import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { packageAPI, destinationAPI } from '../../services/endpoints';
import '../../styles/AdminForms.css';

const EditPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destLoading, setDestLoading] = useState(true);
  const [error, setError] = useState('');
  const [destError, setDestError] = useState('');
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

  // Package dates state
  const [packageDates, setPackageDates] = useState([]);
  const [newDates, setNewDates] = useState([{ date_from: '', date_to: '', available_seats: '' }]);

  useEffect(() => {
    fetchPackageData();
    fetchDestinations();
    fetchPackageDates();
  }, [id]);

  const fetchPackageData = async () => {
    try {
      console.log('Fetching package:', id);
      setLoading(true);
      setError('');
      
      const res = await packageAPI.getById(id);
      console.log('Package response:', res);
      
      const pkg = res.data?.data || res.data;
      console.log('Package data:', pkg);
      
      if (pkg) {
        setFormData({
          title: pkg.title || '',
          dest_id: pkg.dest_id || '',
          duration_days: pkg.duration_days || pkg.duration || '',
          base_price: pkg.base_price || pkg.price || '',
          max_people: pkg.max_people || '',
          description: pkg.description || '',
          image_url: pkg.image_url || '',
        });
      } else {
        setError('Package not found');
      }
    } catch (e) {
      console.error('Error:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message || 'Failed to load package';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      setDestLoading(true);
      setDestError('');
      console.log('Fetching destinations...');
      const res = await destinationAPI.getAll(1, 100);
      console.log('Destinations response:', res);
      
      let data = [];
      
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        console.log('✓ Using res.data.data.data');
        data = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        console.log('✓ Using res.data.data');
        data = res.data.data;
      } else if (res.data?.destinations && Array.isArray(res.data.destinations)) {
        console.log('✓ Using res.data.destinations');
        data = res.data.destinations;
      } else if (res.data?.result && Array.isArray(res.data.result)) {
        console.log('✓ Using res.data.result');
        data = res.data.result;
      } else if (Array.isArray(res.data)) {
        console.log('✓ Using res.data directly');
        data = res.data;
      }
      
      console.log('Final destinations:', data);
      setDestinations(data);
    } catch (e) {
      console.error('Error:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message || 'Failed to load destinations';
      setDestError(errorMsg);
    } finally {
      setDestLoading(false);
    }
  };

  const fetchPackageDates = async () => {
    try {
      console.log('Fetching package dates:', id);
      const res = await packageAPI.getDates(id);
      console.log('Package dates response:', res);
      
      const dates = res.data?.data || res.data || [];
      setPackageDates(Array.isArray(dates) ? dates : []);
    } catch (e) {
      console.warn('⚠ Failed to fetch dates:', e.message);
      setPackageDates([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleDateChange = (index, field, value) => {
    const updatedDates = [...newDates];
    updatedDates[index][field] = value;
    setNewDates(updatedDates);
  };

  const addDateRow = () => {
    setNewDates([...newDates, { date_from: '', date_to: '', available_seats: '' }]);
  };

  const removeDateRow = (index) => {
    if (newDates.length > 1) {
      setNewDates(newDates.filter((_, i) => i !== index));
    }
  };

  const deleteExistingDate = async (packageDateId) => {
    if (window.confirm('Are you sure you want to delete this date?')) {
      try {
        await packageAPI.deleteDate(id, packageDateId);
        setSuccess('Date deleted successfully');
        fetchPackageDates();
      } catch (err) {
        setError('Failed to delete date: ' + err.message);
      }
    }
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
      
      console.log('📦 Updating package:', id, data);
      await packageAPI.update(id, data);

      // Add new dates if any
      const validNewDates = newDates.filter(d => d.date_from && d.date_to);
      if (validNewDates.length > 0) {
        console.log('📅 Adding new package dates...');
        for (const date of validNewDates) {
          try {
            const dateData = {
              date_from: date.date_from,
              date_to: date.date_to,
              available_seats: parseInt(date.available_seats) || formData.max_people || 50,
            };
            console.log(`Creating date: ${date.date_from} to ${date.date_to}`);
            await packageAPI.addDate(id, dateData);
          } catch (dateErr) {
            console.warn(`Failed to create date ${date.date_from}:`, dateErr.message);
          }
        }
        setNewDates([{ date_from: '', date_to: '', available_seats: '' }]);
      }

      setSuccess('Package updated successfully!');
      setTimeout(() => navigate('/admin/packages'), 2000);
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update package';
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
            <div className="loading">Loading package data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-form-container">
        <div className="form-card">
          <h1>Edit Package #{id}</h1>
          
          {error && <div className="error-message">{error}</div>}
          {destError && <div className="error-message" style={{marginBottom: '15px'}}>Destinations Error: {destError}</div>}
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
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination * {destLoading && <span style={{color: '#ff6b6b'}}>Loading...</span>}</label>
                <select
                  name="dest_id"
                  value={formData.dest_id}
                  onChange={handleChange}
                  disabled={destLoading}
                  required
                >
                  <option value="">{destLoading ? 'Loading destinations...' : 'Select Destination'}</option>
                  {destinations.length > 0 ? (
                    destinations.map(dest => (
                      <option key={dest.dest_id} value={dest.dest_id}>
                        {dest.name} ({dest.country})
                      </option>
                    ))
                  ) : (
                    !destLoading && <option disabled>No destinations available</option>
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
                  required
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
                  required
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

            {/* Existing Package Dates Section */}
            {packageDates.length > 0 && (
              <div className="form-group" style={{marginTop: '30px', borderTop: '2px solid #ddd', paddingTop: '20px'}}>
                <h3 style={{marginBottom: '15px'}}>Existing Travel Dates</h3>
                {packageDates.map((dateObj) => (
                  <div key={dateObj.package_date_id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '10px',
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '5px',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{new Date(dateObj.date_from).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <strong>{new Date(dateObj.date_to).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      Seats: <strong>{dateObj.available_seats || 'N/A'}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteExistingDate(dateObj.package_date_id)}
                      className="btn btn-danger"
                      style={{padding: '6px 10px', fontSize: '0.9rem'}}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Package Dates Section */}
            <div className="form-group" style={{marginTop: '30px', borderTop: '2px solid #ddd', paddingTop: '20px'}}>
              <h3 style={{marginBottom: '15px'}}>Add New Travel Dates</h3>
              <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>Add new dates for this package</p>
              
              {newDates.map((dateRow, index) => (
                <div key={index} className="date-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: '10px',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '5px',
                  alignItems: 'end'
                }}>
                  <div>
                    <label style={{fontSize: '0.9rem'}}>From Date</label>
                    <input
                      type="date"
                      value={dateRow.date_from}
                      onChange={(e) => handleDateChange(index, 'date_from', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label style={{fontSize: '0.9rem'}}>To Date</label>
                    <input
                      type="date"
                      value={dateRow.date_to}
                      onChange={(e) => handleDateChange(index, 'date_to', e.target.value)}
                      min={dateRow.date_from || new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label style={{fontSize: '0.9rem'}}>Available Seats</label>
                    <input
                      type="number"
                      value={dateRow.available_seats}
                      onChange={(e) => handleDateChange(index, 'available_seats', e.target.value)}
                      min="1"
                      placeholder={formData.max_people || '50'}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDateRow(index)}
                    className="btn btn-danger"
                    disabled={newDates.length === 1}
                    style={{padding: '8px 12px', fontSize: '0.9rem'}}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDateRow}
                className="btn btn-secondary"
                style={{marginTop: '10px', marginBottom: '20px'}}
              >
                + Add Another Date
              </button>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Package'}
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

export default EditPackage;
