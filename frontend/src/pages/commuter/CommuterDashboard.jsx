import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Navigation } from 'lucide-react';
import { apiClient } from '../../api/client';

const BookRide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickup_lat: 23.2599, // Bhopal demo coords
    pickup_lng: 77.4126,
    destination_lat: 23.2332,
    destination_lng: 77.4343,
    passenger_count: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/rides', formData);
      setSuccess(true);
      setTimeout(() => navigate(`/commuter/ride/${res.data.data.id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to request ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand-DEFAULT p-6 text-white">
          <h2 className="text-2xl font-bold">Where to?</h2>
          <p className="text-brand-light mt-1 text-sm">Find a shared ride instantly.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">Ride requested! Finding matches...</div>}

          <div className="space-y-4 relative">
            {/* Simple decorative line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Navigation className="h-5 w-5 text-blue-500 transform rotate-180" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pickup Location</label>
                <input 
                  type="text" 
                  value={`${formData.pickup_lat}, ${formData.pickup_lng}`}
                  readOnly
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-lg font-medium cursor-pointer"
                  onClick={() => alert('Map picker integration goes here!')}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 border border-brand-100">
                <MapPin className="h-5 w-5 text-brand-DEFAULT" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Destination</label>
                <input 
                  type="text" 
                  value={`${formData.destination_lat}, ${formData.destination_lng}`}
                  readOnly
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-lg font-medium cursor-pointer"
                  onClick={() => alert('Map picker integration goes here!')}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center justify-between text-sm font-medium text-gray-900">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                Passengers
              </span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button type="button" onClick={() => setFormData(p => ({...p, passenger_count: Math.max(1, p.passenger_count - 1)}))} className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold">-</button>
                <span className="px-4 py-1 border-x border-gray-200 font-semibold">{formData.passenger_count}</span>
                <button type="button" onClick={() => setFormData(p => ({...p, passenger_count: Math.min(4, p.passenger_count + 1)}))} className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold">+</button>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-50"
          >
            {loading ? 'Requesting...' : 'Find Shared Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ActiveRide = () => {
  return (
    <div className="p-8 text-center text-gray-500 mt-20">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin className="h-12 w-12 text-brand-DEFAULT mb-4" />
        <p className="text-xl font-medium">Looking for matches...</p>
        <p className="text-sm mt-2">Realtime tracking UI will appear here.</p>
      </div>
    </div>
  );
};

const CommuterDashboard = () => {
  return (
    <div className="bg-gray-50 flex-1 flex flex-col">
      <Routes>
        <Route path="/" element={<BookRide />} />
        <Route path="/ride/:id" element={<ActiveRide />} />
      </Routes>
    </div>
  );
};

export default CommuterDashboard;
