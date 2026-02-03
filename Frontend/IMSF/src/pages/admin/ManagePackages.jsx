import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { packageAPI } from '../../services/endpoints';
import '../../styles/AdminManage.css';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      console.log('Fetching packages...');
      setLoading(true);
      setError('');
      
      const response = await packageAPI.getAll(1, 100);
      console.log('Full response:', response);
      
      let packages = [];
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        packages = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        packages = response.data.data;
      } else if (Array.isArray(response.data)) {
        packages = response.data;
      }
      
      console.log('Extracted packages:', packages);
      setPackages(packages || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        console.log('Deleting package:', id);
        await packageAPI.delete(id);
        setPackages(packages.filter(p => p.package_id !== id));
        alert('Package deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete package';
        alert('Error: ' + errorMsg);
      }
    }
  };

  const handleEdit = (id) => {
    console.log('Editing package:', id);
    navigate(`/admin/packages/edit/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="admin-manage">
        <div className="manage-header">
          <h1>Manage Packages</h1>
          <Link to="/admin/packages/create" className="btn btn-primary">
            Create New Package
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading packages...</div>
        ) : packages.length > 0 ? (
          <div className="table-container">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>Package ID</th>
                  <th>Title</th>
                  <th>Duration (Days)</th>
                  <th>Price</th>
                  <th>Max People</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.package_id}>
                    <td>#{pkg.package_id}</td>
                    <td>{pkg.title}</td>
                    <td>{pkg.duration_days || pkg.duration}</td>
                    <td>₹{pkg.base_price || pkg.price}</td>
                    <td>{pkg.max_people}</td>
                    <td className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(pkg.package_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(pkg.package_id)}
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
            <p>No packages found</p>
            <Link to="/admin/packages/create" className="btn btn-primary">
              Create First Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePackages;
