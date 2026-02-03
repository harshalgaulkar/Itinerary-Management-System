import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Footer from './components/Footer';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import BookingCheckout from './pages/BookingCheckout';
import Bookings from './pages/Bookings';
import Payment from './pages/Payment';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ApiDebugger from './pages/ApiDebugger';
import BookingTester from './pages/BookingTester';
import ResponseStructureDebugger from './pages/ResponseStructureDebugger';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePackages from './pages/admin/ManagePackages';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePackageDates from './pages/admin/ManagePackageDates';
import CreatePackage from './pages/admin/CreatePackage';
import EditPackage from './pages/admin/EditPackage';
import CreateDestination from './pages/admin/CreateDestination';
import EditDestination from './pages/admin/EditDestination';
import CreateUser from './pages/admin/CreateUser';
import BackendDiagnostics from './pages/admin/BackendDiagnostics';
import PackageBookingsReport from './pages/admin/PackageBookingsReport';
import APITester from './pages/admin/APITester';
import ManageBookings from './pages/admin/ManageBookings';
import UserProfiles from './pages/admin/UserProfiles';
import PaymentHistory from './pages/admin/PaymentHistory';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/debug" element={<ApiDebugger />} />
          <Route path="/booking-test" element={<BookingTester />} />
          <Route path="/response-debug" element={<ResponseStructureDebugger />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/packages/:id/reviews" element={<Reviews />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages/:id/book"
            element={
              <ProtectedRoute>
                <BookingCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <AdminRoute>
                <ManagePackages />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/packages/create"
            element={
              <AdminRoute>
                <CreatePackage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/packages/edit/:id"
            element={
              <AdminRoute>
                <EditPackage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/package-dates"
            element={
              <AdminRoute>
                <ManagePackageDates />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations"
            element={
              <AdminRoute>
                <ManageDestinations />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations/create"
            element={
              <AdminRoute>
                <CreateDestination />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations/edit/:id"
            element={
              <AdminRoute>
                <EditDestination />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/create"
            element={
              <AdminRoute>
                <CreateUser />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/diagnostics"
            element={
              <AdminRoute>
                <BackendDiagnostics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings-report"
            element={
              <AdminRoute>
                <PackageBookingsReport />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/api-tester"
            element={
              <AdminRoute>
                <APITester />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <ManageBookings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/user-profiles"
            element={
              <AdminRoute>
                <UserProfiles />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <PaymentHistory />
              </AdminRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;

