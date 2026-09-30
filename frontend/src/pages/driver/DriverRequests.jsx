import React, { useState, useEffect } from 'react';
import { List, MapPin, Navigation, Clock, Users, X, Check } from 'lucide-react';
import { apiClient } from '../../api/client';

const DriverRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/rides/requests');
      if (res.data?.success) {
        setRequests(res.data.data);
        setError('');
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError('Unable to load ride requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Simulate real-time for now with polling, as MVP real-time usually requires setting up Supabase websocket
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await apiClient.post(`/rides/requests/${id}/accept`);
      if (res.data?.success) {
        // Remove from list or refresh
        fetchRequests();
      }
    } catch (err) {
      alert('Failed to accept request or already taken');
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await apiClient.post(`/rides/requests/${id}/decline`);
      if (res.data?.success) {
        fetchRequests();
      }
    } catch (err) {
      alert('Failed to decline request');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          Ride Requests
        </h1>
        <p className="text-sm text-gray-500 font-medium">Manage incoming AI dispatches.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {loading && requests.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 font-medium">
            Loading ride requests...
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <button onClick={fetchRequests} className="px-4 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors">
              Retry
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full mt-10">
            <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <List className="w-10 h-10 text-brand" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Requests</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              You are currently online. Compatible ride requests will appear here when the dispatch system matches them to your route.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-2xl border shadow-sm border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-brand bg-brand-50 px-2 py-1 rounded">
                    NEW RIDE REQUEST
                  </div>
                  <div className="text-sm font-black text-gray-900">₹{req.fare || '--'}</div>
                </div>

                <div className="space-y-3 mb-6 relative">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0 mt-0.5 border-2 border-white shadow-sm"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Pickup</p>
                      <p className="text-sm font-medium text-gray-900">Lat: {req.pickup_lat.toFixed(4)}, Lng: {req.pickup_lng.toFixed(4)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-brand flex-shrink-0 mt-0.5 border-2 border-white shadow-sm"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Destination</p>
                      <p className="text-sm font-medium text-gray-900">Lat: {req.destination_lat.toFixed(4)}, Lng: {req.destination_lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                      <Navigation size={12}/> Distance
                    </p>
                    <p className="text-sm font-bold text-gray-900">{req.distance || '--'} km</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                      <Users size={12}/> Capacity
                    </p>
                    <p className="text-sm font-bold text-gray-900">{req.passenger_count || 1} Seats</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleDecline(req.id)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <X size={18} /> DECLINE
                  </button>
                  <button onClick={() => handleAccept(req.id)} className="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all">
                    <Check size={18} /> ACCEPT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRequests;
