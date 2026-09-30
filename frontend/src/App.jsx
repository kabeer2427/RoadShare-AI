import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import DriverBottomNav from './components/DriverBottomNav';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverProfile from './pages/driver/DriverProfile';
import DriverRequests from './pages/driver/DriverRequests';
import DriverRides from './pages/driver/DriverRides';
import CommuterDashboard from './pages/commuter/CommuterDashboard';
import CommuterRides from './pages/commuter/CommuterRides';
import CommuterProfile from './pages/commuter/CommuterProfile';
import CommuterBottomNav from './components/CommuterBottomNav';
import AdminDashboard from './pages/admin/AdminDashboard';
import LiveMap from './pages/LiveMap';
import MoveFlowAssistant from './components/ai/MoveFlowAssistant';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AssistantWrapper = () => {
  const { user } = useAuth();
  // Only render the AI assistant if the user is authenticated
  if (!user) return null;
  return <MoveFlowAssistant />;
};

const LayoutWrapper = ({ children }) => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className={`flex-1 flex flex-col relative ${user ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>
      {user && user.role === 'driver' && <DriverBottomNav />}
      {user && (user.role === 'commuter' || user.role === 'passenger') && <CommuterBottomNav />}
      <AssistantWrapper />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live-map" element={<LiveMap />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/driver" element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/driver/profile" element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverProfile />
                </ProtectedRoute>
              } />

              <Route path="/driver/requests" element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverRequests />
                </ProtectedRoute>
              } />

              <Route path="/driver/rides" element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverRides />
                </ProtectedRoute>
              } />

              <Route path="/commuter" element={
                <ProtectedRoute allowedRoles={['commuter', 'passenger']}>
                  <CommuterDashboard />
                </ProtectedRoute>
              } />

              <Route path="/commuter/rides" element={
                <ProtectedRoute allowedRoles={['commuter', 'passenger']}>
                  <CommuterRides />
                </ProtectedRoute>
              } />

              <Route path="/commuter/profile" element={
                <ProtectedRoute allowedRoles={['commuter', 'passenger']}>
                  <CommuterProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </LayoutWrapper>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
