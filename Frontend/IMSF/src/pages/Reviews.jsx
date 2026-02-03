import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { reviewAPI, packageAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

const Reviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pkgRes, reviewsRes] = await Promise.all([
        packageAPI.getById(id),
        reviewAPI.getByPackage(id),
      ]);

      const pkgData = pkgRes.data?.data || pkgRes.data;
      setPkg(pkgData);

      const reviewsData = Array.isArray(reviewsRes.data?.data)
        ? reviewsRes.data.data
        : Array.isArray(reviewsRes.data)
        ? reviewsRes.data
        : [];
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const reviewData = {
        package_id: id,
        user_id: user.user_id,
        rating: formData.rating,
        comment: formData.comment,
        review_date: new Date().toISOString().split('T')[0],
      };

      await reviewAPI.create(reviewData);
      setSuccess('Review submitted successfully!');
      setFormData({ rating: 5, comment: '' });
      // Refresh reviews
      fetchData();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to submit review';
      setError(errorMsg);
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.delete(reviewId);
        setReviews(reviews.filter(r => r.review_id !== reviewId));
        setSuccess('Review deleted successfully!');
      } catch (err) {
        setError('Failed to delete review');
        console.error('Error deleting review:', err);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="reviews-container">
          <div className="loading">Loading reviews...</div>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div>
      <Navbar />
      <div className="reviews-container">
        <button onClick={() => navigate(`/packages/${id}`)} className="btn btn-secondary">
          Back to Package
        </button>

        <h1>{pkg?.title} - Reviews & Ratings</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="reviews-wrapper">
          {/* Add Review Section */}
          <div className="add-review-section">
            <h3>Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label htmlFor="rating">Rating *</label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Very Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review *</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Share your experience with this package..."
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="reviews-list-section">
            <h3>Reviews ({reviews.length})</h3>
            <div className="average-rating">
              <strong>Average Rating: {averageRating} ⭐</strong>
            </div>

            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.review_id || review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>{review.user_name || 'Anonymous'}</strong>
                        <span className="review-date">
                          {new Date(review.review_date).toLocaleDateString()}
                        </span>
                      </div>
                      {user?.user_id === review.user_id && (
                        <button
                          onClick={() => handleDeleteReview(review.review_id || review.id)}
                          className="btn btn-danger btn-small"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </div>

                    <div className="review-comment">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
