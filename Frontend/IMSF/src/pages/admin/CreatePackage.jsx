import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { packageAPI, destinationAPI, packageMasterAPI } from '../../services/endpoints';
import '../../styles/AdminForms.css';

const CreatePackage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [packageDates, setPackageDates] = useState([
    { date_from: '', date_to: '', available_seats: '' }
  ]);

  useEffect(() => {
    fetchDest();
  }, []);

  const fetchDest = async () => {
    try {
      setDestLoading(true);
      setDestError('');
      console.log('Fetching destinations...');
      const res = await destinationAPI.getAll(1, 100);
      console.log('Full response:', res);
      console.log('res.data:', res.data);
      console.log('res.data.data:', res.data?.data);
      
      let data = [];
      
      // Try multiple extraction paths
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
      console.log('Total destinations:', data.length);
      
      if (data.length === 0) {
        console.warn('No destinations found in response');
      }
      
      setDestinations(data);
    } catch (e) {
      console.error('Full error:', e);
      console.error('Error message:', e.message);
      console.error('Error response:', e.response?.data);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message || 'Failed to load destinations';
      setDestError(errorMsg);
    } finally {
      setDestLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleDateChange = (index, field, value) => {
    const updatedDates = [...packageDates];
    updatedDates[index][field] = value;
    setPackageDates(updatedDates);
  };

  const addDateRow = () => {
    setPackageDates([...packageDates, { date_from: '', date_to: '', available_seats: '' }]);
  };

  const removeDateRow = (index) => {
    if (packageDates.length > 1) {
      setPackageDates(packageDates.filter((_, i) => i !== index));
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

    // Validate at least one date is provided
    const validDates = packageDates.filter(d => d.date_from && d.date_to);
    if (validDates.length === 0) {
      setError('Please add at least one travel date for the package');
      return;
    }

    try {
      setLoading(true);
      const packageData = {
        title: formData.title,
        dest_id: parseInt(formData.dest_id),
        duration_days: parseInt(formData.duration_days),
        base_price: parseFloat(formData.base_price),
        max_people: parseInt(formData.max_people) || 0,
        description: formData.description || '',
        image_url: formData.image_url || '',
      };
      
      console.log('📦 Creating package:', packageData);
      const packageResponse = await packageAPI.create(packageData);
      
      // Extract package ID from response
      let packageId = null;
      if (packageResponse?.data?.data?.package_id) {
        packageId = packageResponse.data.data.package_id;
      } else if (packageResponse?.data?.package_id) {
        packageId = packageResponse.data.package_id;
      } else if (packageResponse?.data?.data?.id) {
        packageId = packageResponse.data.data.id;
      } else if (packageResponse?.data?.id) {
        packageId = packageResponse.data.id;
      }

      console.log('✓ Package created with ID:', packageId);

      // Create package dates
      if (packageId) {
        console.log('📅 Creating package dates...');
        let successfulDates = 0;

        for (const date of validDates) {
          try {
            const dateData = {
              date_from: date.date_from,
              date_to: date.date_to,
              available_seats: parseInt(date.available_seats) || formData.max_people || 50,
            };
            
            console.log(`Creating date: ${date.date_from} to ${date.date_to}`);
            await packageAPI.addDate(packageId, dateData);
            successfulDates++;
          } catch (dateErr) {
            console.warn(`Failed to create date ${date.date_from}:`, dateErr.message);
          }
        }

        console.log(`✓ Created ${successfulDates}/${validDates.length} dates`);
      }

      setSuccess('Package created successfully with dates!');
      setTimeout(() => navigate('/admin/packages'), 2000);
    } catch (err) {
      console.error('Error:', err);
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
                />
              </div>

              <div className="form-group">
                <label>Destination * {destLoading && <span style={{color: '#ff6b6b'}}>Loading...</span>}</label>
                <select
                  name="dest_id"
                  value={formData.dest_id}
                  onChange={handleChange}
                  disabled={destLoading}
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

            {/* Package Dates Section */}
            <div className="form-group" style={{marginTop: '30px', borderTop: '2px solid #ddd', paddingTop: '20px'}}>
              <h3 style={{marginBottom: '15px'}}>Travel Dates *</h3>
              <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>Add at least one date range for this package</p>
              
              {packageDates.map((dateRow, index) => (
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
                    <label style={{fontSize: '0.9rem'}}>From Date *</label>
                    <input
                      type="date"
                      value={dateRow.date_from}
                      onChange={(e) => handleDateChange(index, 'date_from', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label style={{fontSize: '0.9rem'}}>To Date *</label>
                    <input
                      type="date"
                      value={dateRow.date_to}
                      onChange={(e) => handleDateChange(index, 'date_to', e.target.value)}
                      min={dateRow.date_from || new Date().toISOString().split('T')[0]}
                      required
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
                    disabled={packageDates.length === 1}
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

export default CreatePackage;
