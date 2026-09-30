import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CommuterDashboard from './pages/commuter/CommuterDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import LiveMap from './pages/LiveMap';
import MoveFlowAssistant from './components/ai/MoveFlowAssistant';

// Placeholders for modular development
// const CommuterDashboard = () => <div>Commuter Dashboard</div>;
// const DriverDashboard = () => <div>Driver Dashboard</div>;
// const AdminDashboard = () => <div>Admin Dashboard</div>;

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

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live-map" element={<LiveMap />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/commuter/*" element={
              <ProtectedRoute allowedRoles={['commuter']}>
                <CommuterDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/driver/*" element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          <AssistantWrapper />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
