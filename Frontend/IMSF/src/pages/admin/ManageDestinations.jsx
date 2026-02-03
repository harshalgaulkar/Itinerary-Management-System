import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { destinationAPI } from '../../services/endpoints';
import '../../styles/AdminManage.css';

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // Refetch data every time component mounts (when returning from create page)
  }, []);

  const loadData = async () => {
    try {
      console.log('Fetching destinations...');
      setLoading(true);
      setError('');
      
      const response = await destinationAPI.getAll(1, 100);
      console.log('Full axios response:', response);
      console.log('response.data:', response.data);
      console.log('response.data.data:', response.data?.data);
      console.log('response.data.data.data:', response.data?.data?.data);
      
      // Axios wraps the API response in response.data
      // API returns: {status, data: {page, limit, data: [...]}}
      // So response.data = {status, data: {page, limit, data: [...]}}
      let destinations = [];
      
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        console.log('✓ Using response.data.data.data');
        destinations = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        console.log('✓ Using response.data.data');
        destinations = response.data.data;
      } else if (Array.isArray(response.data)) {
        console.log('✓ Using response.data');
        destinations = response.data;
      }
      
      console.log('Final destinations array:', destinations);
      console.log('Destinations count:', destinations.length);
      setDestinations(destinations || []);
      setLoading(false);
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      setError('Failed to load destinations: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        console.log('Deleting destination:', id);
        await destinationAPI.delete(id);
        setDestinations(destinations.filter(d => d.dest_id !== id));
        alert('Destination deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete destination';
        alert('Error: ' + errorMsg);
      }
    }
  };

  const handleEdit = (id) => {
    console.log('Editing destination:', id);
    navigate(`/admin/destinations/edit/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="admin-manage">
        <div className="manage-header">
          <h1>Manage Destinations</h1>
          <Link to="/admin/destinations/create" className="btn btn-primary">
            Create New Destination
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading destinations...</div>
        ) : destinations && destinations.length > 0 ? (
          <div className="table-container">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map(dest => (
                  <tr key={dest.dest_id}>
                    <td>{dest.dest_id}</td>
                    <td>{dest.name}</td>
                    <td>{dest.country}</td>
                    <td>{dest.description?.substring(0, 50)}...</td>
                    <td className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(dest.dest_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(dest.dest_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No destinations found</p>
            <Link to="/admin/destinations/create" className="btn btn-primary">
              Create First Destination
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDestinations;
