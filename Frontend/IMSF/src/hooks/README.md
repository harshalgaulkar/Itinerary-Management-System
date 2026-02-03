# Custom API Hooks Documentation

Custom React hooks for simplifying API calls in components.

## Available Hooks

### 1. useAPI
Hook for executing API calls with manual trigger.

**Parameters:**
- `apiFunction` (function) - The API function to call

**Returns:**
- `data` - Response data (null until executed)
- `loading` - Boolean loading state
- `error` - Error object (null if no error)
- `execute` - Function to trigger the API call
- `reset` - Function to reset state

**Example:**
```javascript
import { useAPI } from '@/hooks/useAPI';
import { packageAPI } from '@/services/endpoints';

function PackageSearch() {
  const { data: packages, loading, error, execute } = useAPI(
    (page, limit) => packageAPI.getAll(page, limit)
  );

  const handleSearch = async () => {
    try {
      await execute(1, 10);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {packages && <div>Found {packages.data.length} packages</div>}
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

---

### 2. useFetch
Hook for automatically fetching data on component mount.

**Parameters:**
- `apiFunction` (function) - The API function to call (must be parameterless or use closure)
- `dependencies` (array) - Dependency array for refetching

**Returns:**
- `data` - Response data
- `loading` - Boolean loading state (true initially)
- `error` - Error object (null if no error)
- `refetch` - Function to refetch data manually

**Example:**
```javascript
import { useFetch } from '@/hooks/useAPI';
import { packageAPI } from '@/services/endpoints';

function PackageList() {
  const { data: packages, loading, error, refetch } = useFetch(
    () => packageAPI.getAll(1, 10),
    [] // Run once on mount
  );

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {packages?.data.map(pkg => (
        <div key={pkg.package_id}>{pkg.title}</div>
      ))}
    </div>
  );
}
```

**With Dependencies (refetch when parameter changes):**
```javascript
function UserBookings({ userId }) {
  const { data: bookings, loading, refetch } = useFetch(
    () => userAPI.getUserBookings(userId),
    [userId] // Refetch when userId changes
  );

  return <div>{/* ... */}</div>;
}
```

---

### 3. useMutation
Hook for POST, PUT, DELETE operations.

**Parameters:**
- `apiFunction` (function) - The mutation API function

**Returns:**
- `mutate` - Function to execute the mutation
- `data` - Response data from last mutation
- `loading` - Boolean loading state
- `error` - Error object (null if no error)
- `reset` - Function to reset state

**Example:**
```javascript
import { useMutation } from '@/hooks/useAPI';
import { bookingAPI } from '@/services/endpoints';

function CreateBooking() {
  const { mutate: createBooking, loading, error, data: newBooking } = useMutation(
    bookingAPI.create
  );

  const handleSubmit = async (formData) => {
    try {
      const result = await createBooking(formData);
      console.log('Booking created:', result);
    } catch (err) {
      console.error('Failed to create booking:', error.message);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.target));
    }}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Booking'}
      </button>
      {error && <div className="error">{error.message}</div>}
      {newBooking && <div>Booking #{newBooking.booking_id} created!</div>}
    </form>
  );
}
```

**Multiple Mutations:**
```javascript
function BookingActions({ bookingId }) {
  const { mutate: confirmBooking, loading: confirming } = useMutation(
    bookingAPI.confirm
  );
  const { mutate: cancelBooking, loading: cancelling } = useMutation(
    bookingAPI.cancel
  );

  return (
    <div>
      <button onClick={() => confirmBooking(bookingId)} disabled={confirming}>
        Confirm
      </button>
      <button onClick={() => cancelBooking(bookingId)} disabled={cancelling}>
        Cancel
      </button>
    </div>
  );
}
```

---

## Complete Example: Package Details Page

```javascript
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch, useMutation } from '@/hooks/useAPI';
import { packageAPI, bookingAPI, reviewAPI } from '@/services/endpoints';

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);

  // Fetch package details
  const { data: pkg, loading: pkgLoading, error: pkgError } = useFetch(
    () => packageAPI.getById(id),
    [id]
  );

  // Fetch itinerary
  const { data: itinerary, loading: itinLoading } = useFetch(
    () => packageAPI.getItineraries(id),
    [id]
  );

  // Fetch reviews
  const { data: reviews, loading: reviewsLoading, refetch: refetchReviews } = useFetch(
    () => reviewAPI.getByPackage(id),
    [id]
  );

  // Create booking mutation
  const { mutate: createBooking, loading: bookingLoading, error: bookingError } = useMutation(
    bookingAPI.create
  );

  // Create review mutation
  const { mutate: createReview, loading: reviewLoading, error: reviewError } = useMutation(
    reviewAPI.create
  );

  const handleBooking = async () => {
    try {
      const booking = await createBooking({
        package_id: id,
        seats,
        travel_date: new Date().toISOString(),
      });
      alert(`Booking #${booking.booking_id} created!`);
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking failed:', bookingError.message);
    }
  };

  const handleReview = async (rating, content) => {
    try {
      await createReview({
        package_id: id,
        rating,
        content,
      });
      await refetchReviews(); // Refresh reviews list
    } catch (err) {
      console.error('Review failed:', reviewError.message);
    }
  };

  if (pkgLoading) return <div>Loading...</div>;
  if (pkgError) return <div>Error: {pkgError.message}</div>;
  if (!pkg) return <div>Package not found</div>;

  return (
    <div className="package-details">
      <h1>{pkg.data.title}</h1>
      <p>Price: ₹{pkg.data.base_price}</p>

      {/* Itinerary Section */}
      <section>
        <h2>Itinerary</h2>
        {itinLoading ? (
          <div>Loading itinerary...</div>
        ) : (
          <div>
            {itinerary?.data.map((day, idx) => (
              <div key={idx}>
                <h3>Day {day.day_number}: {day.title}</h3>
                <p>{day.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Section */}
      <section>
        <h3>Book Now</h3>
        <div>
          <label>
            Number of seats:
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </label>
        </div>
        <button onClick={handleBooking} disabled={bookingLoading}>
          {bookingLoading ? 'Creating booking...' : 'Create Booking'}
        </button>
        {bookingError && <div className="error">{bookingError.message}</div>}
      </section>

      {/* Reviews Section */}
      <section>
        <h2>Reviews ({reviews?.data.length || 0})</h2>
        {reviewsLoading ? (
          <div>Loading reviews...</div>
        ) : (
          <div>
            {reviews?.data.map((review) => (
              <div key={review.review_id} className="review">
                <p>Rating: {'⭐'.repeat(review.rating)}</p>
                <p>{review.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leave Review */}
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleReview(
            Number(formData.get('rating')),
            formData.get('content')
          );
        }}>
          <select name="rating" required>
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n} Stars</option>
            ))}
          </select>
          <textarea name="content" placeholder="Your review..." required />
          <button type="submit" disabled={reviewLoading}>
            {reviewLoading ? 'Posting...' : 'Post Review'}
          </button>
          {reviewError && <div className="error">{reviewError.message}</div>}
        </form>
      </section>
    </div>
  );
}

export default PackageDetails;
```

---

## Best Practices

### 1. Error Handling
Always handle errors gracefully:
```javascript
const { error, data } = useFetch(apiFunction);

if (error) {
  return <div className="alert alert-error">{error.message}</div>;
}
```

### 2. Loading States
Show loading indicators to users:
```javascript
<button disabled={loading}>
  {loading ? 'Please wait...' : 'Submit'}
</button>
```

### 3. Dependency Arrays
Use dependency arrays to control when to refetch:
```javascript
// Refetch only once on mount
const { data } = useFetch(fn, []);

// Refetch when userId changes
const { data } = useFetch(fn, [userId]);

// Refetch every time component renders (not recommended)
const { data } = useFetch(fn);
```

### 4. Avoid Closures in Dependencies
❌ **Don't:**
```javascript
const { data } = useFetch(
  () => packageAPI.search(searchTerm), // searchTerm creates closure
  [] // searchTerm not in dependency array
);
```

✅ **Do:**
```javascript
const { data } = useFetch(
  () => packageAPI.search(searchTerm),
  [searchTerm] // searchTerm in dependency array
);
```

### 5. Reset State Between Operations
```javascript
const { mutate: createBooking, reset } = useMutation(bookingAPI.create);

const handleMultipleBookings = async (bookingsList) => {
  for (const booking of bookingsList) {
    await createBooking(booking);
    reset(); // Clear state before next booking
  }
};
```

---

## Troubleshooting

### Hook shows stale data
- Make sure dependency array includes all dependencies
- Call `refetch()` or `reset()` when needed

### Infinite loading
- Check if `dependencies` is correct
- Verify API function is not recreated every render

### Multiple requests being made
- Check component is not re-rendering unnecessarily
- Verify dependencies array (use `[]` for run-once-on-mount)

---

## See Also
- [API Services Documentation](../services/README.md)
- [API Endpoints Documentation](../API_DOCUMENTATION.md)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)
