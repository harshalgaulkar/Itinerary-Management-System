import React, { useState, useEffect } from 'react';
import { packageAPI, adminAPI } from '../../services/endpoints';
import '../../styles/AdminForms.css';

const ManagePackageDates = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    seats_total: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      fetchDates(selectedPackage);
    }
  }, [selectedPackage]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching packages for date management...');
      
      const response = await packageAPI.getAll();
      const packagesData = response?.data?.data?.data || response?.data?.data || response?.data || [];
      
      setPackages(Array.isArray(packagesData) ? packagesData : []);
      console.log(`✓ Loaded ${packagesData.length} packages`);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchDates = async (packageId) => {
    try {
      console.log(`📅 Fetching dates for package ${packageId}...`);
      const response = await packageAPI.getDates(packageId);
      const datesData = response?.data?.data || [];
      
      setDates(Array.isArray(datesData) ? datesData : []);
      console.log(`✓ Loaded ${datesData.length} dates for package ${packageId}`);
    } catch (err) {
      console.error('Error fetching dates:', err);
      setDates([]);
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    
    if (!selectedPackage || !formData.start_date || !formData.end_date || !formData.seats_total) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const payload = {
        package_id: selectedPackage,
        start_date: formData.start_date,
        end_date: formData.end_date,
        seats_total: parseInt(formData.seats_total)
      };

      console.log('📝 Adding date with payload:', payload);
      const response = await adminAPI.addPackageDate(payload);
      console.log('✓ Add date response:', response);
      
      setMessage(`✓ Date added successfully!`);
      setFormData({ start_date: '', end_date: '', seats_total: '' });
      
      // Refresh dates
      await fetchDates(selectedPackage);
    } catch (err) {
      console.error('Error adding date:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add date');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (!window.confirm('Are you sure you want to delete this date?')) return;

    try {
      setLoading(true);
      console.log(`🗑️ Deleting date ${dateId}...`);
      
      await adminAPI.deletePackageDate(dateId);
      
      setMessage('✓ Date deleted successfully!');
      
      // Refresh dates
      if (selectedPackage) {
        await fetchDates(selectedPackage);
      }
    } catch (err) {
      console.error('Error deleting date:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete date');
    } finally {
      setLoading(false);
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="admin-form-container">
        <h2>Manage Package Dates</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-form-container">
      <h2>📅 Manage Package Dates</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <label htmlFor="package-select">Select Package *</label>
        <select
          id="package-select"
          value={selectedPackage || ''}
          onChange={(e) => setSelectedPackage(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">-- Select a package --</option>
          {packages.map(pkg => (
            <option key={pkg.package_id} value={pkg.package_id}>
              {pkg.title} (ID: {pkg.package_id})
            </option>
          ))}
        </select>
      </div>

      {selectedPackage && (
        <>
          <form onSubmit={handleAddDate} className="form-section">
            <h3>Add New Travel Date</h3>
            
            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date *</label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="seats_total">Available Seats *</label>
              <input
                type="number"
                id="seats_total"
                value={formData.seats_total}
                onChange={(e) => setFormData({...formData, seats_total: e.target.value})}
                min="1"
                max="100"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Date'}
            </button>
          </form>

          <div className="form-section">
            <h3>Existing Dates ({dates.length})</h3>
            
            {dates.length > 0 ? (
              <div className="dates-list">
                {dates.map(date => {
                  // Handle both field name formats
                  const startDate = date.start_date || date.date_from;
                  const endDate = date.end_date || date.date_to;
                  const seats = date.seats_total || date.available_seats;
                  
                  return (
                    <div key={date.package_date_id} className="date-item">
                      <div className="date-info">
                        <span className="date-range">
                          📅 {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                        </span>
                        <span className="seats">
                          🪑 {seats} seats available
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDate(date.package_date_id)}
                        className="btn btn-danger"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{color: '#666', fontStyle: 'italic'}}>No dates added for this package yet.</p>
            )}
          </div>
        </>
      )}

      {!selectedPackage && packages.length > 0 && (
        <p style={{color: '#666', marginTop: '2rem', textAlign: 'center'}}>
          Select a package above to manage its dates
        </p>
      )}
    </div>
  );
};

export default ManagePackageDates;
