import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { packageAPI, bookingAPI, paymentAPI } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

const BookingCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    num_persons: 1,
    package_date_id: '',
    special_requests: '',
    contact_phone: '',
  });

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching package details for:', id);
      
      const response = await packageAPI.getById(id);
      console.log('✓ Full response object:', response);
      console.log('✓ Response.data:', response.data);
      console.log('✓ Response.status:', response.status);
      
      const pkgData = response.data?.data || response.data;
      console.log('✓ Package details loaded:', pkgData);
      
      setPkg(pkgData);

      // Fetch available dates for this package
      try {
        console.log('📅 Fetching available dates for package:', id);
        const datesResponse = await packageAPI.getDates(id);
        console.log('📅 ===== DATES RESPONSE =====');
        console.log('📅 Full response:', datesResponse);
        console.log('📅 typeof response:', typeof datesResponse);
        console.log('📅 isArray response:', Array.isArray(datesResponse));
        console.log('📅 Response.data:', datesResponse.data);
        console.log('📅 typeof response.data:', typeof datesResponse.data);
        console.log('📅 isArray response.data:', Array.isArray(datesResponse.data));
        console.log('📅 Response.status:', datesResponse.status);
        
        let dates = [];
        console.log('📅 Response structure analysis:');
        console.log('  - datesResponse:', typeof datesResponse, Array.isArray(datesResponse) ? 'is array' : 'not array');
        console.log('  - datesResponse.data:', typeof datesResponse.data, Array.isArray(datesResponse.data) ? 'is array' : 'not array');
        console.log('  - datesResponse.data?.data:', typeof datesResponse.data?.data, Array.isArray(datesResponse.data?.data) ? 'is array' : 'not array');
        console.log('  - datesResponse.data?.dates:', typeof datesResponse.data?.dates, Array.isArray(datesResponse.data?.dates) ? 'is array' : 'not array');
        
        if (datesResponse.data?.data && Array.isArray(datesResponse.data.data)) {
          dates = datesResponse.data.data;
          console.log('✓ Extracted from response.data.data');
        } else if (Array.isArray(datesResponse.data)) {
          dates = datesResponse.data;
          console.log('✓ Using response.data directly (backend returns array)');
        } else if (datesResponse.data?.dates && Array.isArray(datesResponse.data.dates)) {
          dates = datesResponse.data.dates;
          console.log('✓ Extracted from response.data.dates');
        } else if (datesResponse.data?.error) {
          console.warn('⚠ Backend returned error:', datesResponse.data.error);
          dates = [];
        } else {
          console.warn('⚠ Could not extract dates from response structure');
          console.log('   Response keys:', Object.keys(datesResponse.data || {}));
        }
        
        console.log('✓ Final dates array:', dates);
        console.log('✓ Dates count:', Array.isArray(dates) ? dates.length : 'NOT AN ARRAY');
        if (Array.isArray(dates) && dates.length > 0) {
          console.log('✓ First date entry:', dates[0]);
        }
        
        // Filter out inactive dates (is_active = 0)
        let activeDates = Array.isArray(dates) ? dates.filter(d => d.is_active !== 0) : [];
        console.log('✓ Active dates count (filtering is_active !== 0):', activeDates.length);
        if (activeDates.length > 0) {
          console.log('✓ First active date entry:', activeDates[0]);
        }
        
        if (Array.isArray(activeDates) && activeDates.length > 0) {
          setAvailableDates(activeDates);
          console.log('✓✓ Successfully set', activeDates.length, 'available active dates');
        } else {
          console.warn('⚠⚠ NO ACTIVE DATES FOUND - Empty or not array');
          setAvailableDates([]);
        }
      } catch (dateErr) {
        console.error('❌ ERROR FETCHING DATES:');
        console.error('❌ Message:', dateErr.message);
        console.error('❌ Status:', dateErr.response?.status);
        console.error('❌ Response data:', dateErr.response?.data);
        console.error('❌ Full error:', dateErr);
        setAvailableDates([]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load package details';
      setError(errorMsg);
      console.error('❌ Error fetching package:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_persons' || name === 'package_date_id' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      console.log('='.repeat(60));
      console.log('📝 BOOKING CREATION STARTED');
      console.log('='.repeat(60));
      console.log('Package ID:', id);
      console.log('User ID:', user.user_id);
      console.log('Form data:', formData);

      // Validate inputs
      if (!id || !user.user_id) {
        throw new Error('Missing package ID or user ID');
      }

      if (!formData.package_date_id) {
        throw new Error('Please select a travel date');
      }

      // Ensure num_persons is a valid number
      let numPersons = formData.num_persons;
      console.log('🔢 RAW num_persons:', numPersons, 'Type:', typeof numPersons);
      
      // Force conversion to number
      numPersons = Number(numPersons);
      console.log('🔢 After Number():', numPersons, 'Type:', typeof numPersons);
      
      if (isNaN(numPersons)) {
        numPersons = 1;
        console.warn('⚠️ num_persons was NaN, defaulting to 1');
      }
      
      // Ensure it's an integer
      numPersons = Math.floor(numPersons);
      console.log('🔢 After Math.floor():', numPersons, 'Type:', typeof numPersons);
      
      if (numPersons < 1 || numPersons > 1000) {
        console.error('❌ Validation failed:', { numPersons, isLessThan1: numPersons < 1, isGreaterThan1000: numPersons > 1000 });
        throw new Error('Number of persons must be between 1 and 1000');
      }

      // Validate contact phone
      if (!formData.contact_phone || formData.contact_phone.trim().length < 5) {
        throw new Error('Contact phone number is required (minimum 5 characters)');
      }

      // Create booking with exact field names the backend expects
      const totalPrice = (pkg.base_price || pkg.price || 0) * numPersons;
      console.log('💰 Total price calculated:', { base_price: pkg.base_price || pkg.price, persons: numPersons, total: totalPrice });
      
      // Get the selected date object for additional info
      const selectedDate = availableDates.find(d => d.package_date_id === formData.package_date_id);
      
      if (!selectedDate) {
        throw new Error('Invalid date selection. Please select a valid date.');
      }

      const bookingData = {
        // Required fields (Backend validation) - MUST use exact backend field names
        package_date_id: parseInt(formData.package_date_id),
        persons: numPersons,  // BACKEND EXPECTS 'persons' NOT 'number_of_persons'
        total_price: parseFloat(totalPrice.toFixed(2)),  // Ensure it's a number with 2 decimals
        contact_phone: formData.contact_phone.trim(),
        notes: formData.special_requests?.trim() || '',
      };

      console.log('📤 FINAL Booking payload:', bookingData);
      console.log('✓ Field validation:');
      console.log('  - package_date_id:', bookingData.package_date_id, 'Type:', typeof bookingData.package_date_id);
      console.log('  - persons:', bookingData.persons, 'Type:', typeof bookingData.persons);
      console.log('  - total_price:', bookingData.total_price, 'Type:', typeof bookingData.total_price);
      console.log('  - contact_phone:', bookingData.contact_phone, 'Length:', bookingData.contact_phone.length);
      console.log('  - notes:', bookingData.notes);

      let bookingResponse;
      let booking;
      let bookingId;

      try {
        bookingResponse = await bookingAPI.create(bookingData);
        console.log('✓ Booking API Response:', JSON.stringify(bookingResponse, null, 2));
        
        // Try multiple ways to extract booking ID from response
        let booking = null;
        let bookingId = null;

        // Try method 1: response.data.data
        if (bookingResponse?.data?.data?.booking_id) {
          booking = bookingResponse.data.data;
          bookingId = booking.booking_id;
          console.log('✓ Found booking ID in response.data.data.booking_id:', bookingId);
        }
        // Try method 2: response.data.booking_id
        else if (bookingResponse?.data?.booking_id) {
          bookingId = bookingResponse.data.booking_id;
          booking = bookingResponse.data;
          console.log('✓ Found booking ID in response.data.booking_id:', bookingId);
        }
        // Try method 3: response.data.data (entire object)
        else if (bookingResponse?.data?.data) {
          booking = bookingResponse.data.data;
          bookingId = booking.booking_id || booking.id;
          console.log('✓ Found booking in response.data.data:', bookingId);
        }
        // Try method 4: response.data (direct)
        else if (bookingResponse?.data) {
          booking = bookingResponse.data;
          bookingId = booking?.booking_id || booking?.id;
          console.log('✓ Found booking in response.data:', bookingId);
        }
        
        console.log('Extracted booking:', booking);
        console.log('Extracted bookingId:', bookingId);
        
        if (!bookingId) {
          console.error('❌ No booking ID found in response. Full response:', bookingResponse);
          console.error('Trying to find any ID-like field...');
          
          // Debug: Log all keys in response
          if (bookingResponse?.data) {
            console.log('Keys in response.data:', Object.keys(bookingResponse.data));
            console.log('Full response.data:', bookingResponse.data);
          }
          
          throw new Error('Booking created but no ID returned from server. Response structure: ' + JSON.stringify(bookingResponse?.data).substring(0, 200));
        }
        
        console.log('✓ Booking created successfully with ID:', bookingId);
      } catch (bookingError) {
        console.error('❌ Booking API Error:', bookingError);
        console.error('Status:', bookingError.response?.status);
        console.error('Error data:', bookingError.response?.data);
        console.error('Error message:', bookingError.message);
        
        const apiErrorMsg = 
          bookingError.response?.data?.error ||
          bookingError.response?.data?.message ||
          bookingError.message ||
          'Failed to create booking';
        
        throw new Error(`Booking creation failed: ${apiErrorMsg}`);
      }

      console.log('Total price calculated:', totalPrice);

      // Create payment
      const paymentData = {
        booking_id: bookingId,
        user_id: user.user_id,
        total_amount: totalPrice,
        payment_method: 'card',
        payment_status: 'pending',
      };

      console.log('📤 Payment payload being sent:', JSON.stringify(paymentData, null, 2));

      try {
        const paymentResponse = await paymentAPI.create(paymentData);
        console.log('✓ Payment API Response:', JSON.stringify(paymentResponse, null, 2));
        
        const payment = paymentResponse?.data?.data || paymentResponse?.data;
        const paymentId = payment?.payment_id || payment?.id;
        
        console.log('✓ Payment created with ID:', paymentId);

        console.log('='.repeat(60));
        console.log('✓✓ BOOKING SUCCESSFUL!');
        console.log('Booking ID:', bookingId);
        console.log('Payment ID:', paymentId);
        console.log('='.repeat(60));

        // Redirect to bookings page with success message
        navigate('/my-bookings', {
          state: {
            success: true,
            bookingId: bookingId,
            paymentId: paymentId,
            message: `Booking created successfully! Total: ₹${totalPrice}`,
          },
        });
      } catch (paymentError) {
        console.warn('⚠ Payment creation failed, but booking was created:', paymentError.message);
        // Still navigate to bookings as the booking was created
        navigate('/my-bookings', {
          state: {
            success: true,
            bookingId: bookingId,
            message: `Booking created! (Payment processing failed, but can be done later)`,
          },
        });
      }
    } catch (err) {
      console.error('='.repeat(60));
      console.error('❌ BOOKING CREATION FAILED');
      console.error('Error:', err);
      console.error('='.repeat(60));
      
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to create booking';
      
      setError(`❌ ${errorMsg}`);
      console.error('Error message set:', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="checkout-container">
          <div className="loading">Loading package details...</div>
        </div>
      </div>
    );
  }

  if (error && !pkg) {
    return (
      <div>
        <Navbar />
        <div className="checkout-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = (pkg?.base_price || pkg?.price || 0) * formData.num_persons;

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <div className="checkout-package-info">
            <h2>{pkg?.title}</h2>
            <div className="package-summary">
              <div className="summary-item">
                <label>Destination:</label>
                <span>{pkg?.destination_name || 'N/A'}</span>
              </div>
              <div className="summary-item">
                <label>Duration:</label>
                <span>{pkg?.duration_days || pkg?.duration} days</span>
              </div>
              <div className="summary-item">
                <label>Price per Person:</label>
                <span>₹{pkg?.price || pkg?.base_price}</span>
              </div>
              <div className="summary-item">
                <label>Max Capacity:</label>
                <span>{pkg?.max_people} people</span>
              </div>
            </div>

            {pkg?.image_url && (
              <img src={pkg.image_url} alt={pkg.title} className="package-image" />
            )}
          </div>

          <div className="checkout-form-wrapper">
            <h3>Complete Your Booking</h3>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="num_persons">Number of Persons *</label>
                <input
                  id="num_persons"
                  type="number"
                  name="num_persons"
                  min="1"
                  max={pkg?.max_people}
                  value={formData.num_persons}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="package_date_id">Travel Date *</label>
                {availableDates.length > 0 ? (
                  <select
                    id="package_date_id"
                    name="package_date_id"
                    value={formData.package_date_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a travel date --</option>
                    {availableDates.map((dateObj) => {
                      // Handle both date_from/date_to and start_date/end_date field names
                      const startDate = dateObj.date_from || dateObj.start_date;
                      const endDate = dateObj.date_to || dateObj.end_date;
                      const seats = dateObj.available_seats || dateObj.seats_total;
                      
                      return (
                        <option key={dateObj.package_date_id} value={dateObj.package_date_id}>
                          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                          {seats !== undefined && ` (${seats} seats available)`}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="error-message" style={{padding: '15px', borderRadius: '5px', backgroundColor: '#ffe6e6', color: '#d32f2f', border: '1px solid #ffcccc'}}>
                    <strong>❌ No dates available for this package</strong>
                    <p style={{margin: '8px 0 0 0', fontSize: '14px'}}>This package hasn't been set up with travel dates yet. Please:</p>
                    <ul style={{margin: '8px 0', paddingLeft: '20px', fontSize: '14px'}}>
                      <li>Try another package</li>
                      <li>Contact the admin to add dates for this package</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contact_phone">Contact Phone Number * (5-30 characters)</label>
                <input
                  id="contact_phone"
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  minLength="5"
                  maxLength="30"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="special_requests">Special Requests</label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  placeholder="Any special requirements or preferences?"
                  rows="4"
                />
              </div>

              <div className="price-summary">
                <div className="summary-row">
                  <span>₹{pkg?.base_price || pkg?.price} × {formData.num_persons} persons</span>
                  <strong>₹{totalPrice}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <strong>₹{totalPrice}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
