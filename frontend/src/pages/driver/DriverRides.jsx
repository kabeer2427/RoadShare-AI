import React, { useState, useEffect } from 'react';
import { History, ChevronRight, Clock, MapPin, Navigation } from 'lucide-react';
import { apiClient } from '../../api/client';

const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/rides/history');
      if (res.data?.success) {
        setRides(res.data.data.rides);
        setError('');
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Unable to load ride history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          Ride History
        </h1>
        <p className="text-sm text-gray-500 font-medium">View your past completed trips.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {loading && rides.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 font-medium">
            Loading ride history...
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <button onClick={fetchHistory} className="px-4 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors">
              Retry
            </button>
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full mt-10">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <History className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Past Rides</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              You haven't completed any rides yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map(ride => (
              <div key={ride.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-brand-200 transition-colors group">
                <div className="flex justify-between items-center mb-3">
                  <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    ride.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {ride.status}
                  </div>
                  <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(ride.requested_at)}
                  </div>
                </div>

                <div className="flex gap-4 items-center mb-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <div className="w-0.5 h-6 bg-gray-200"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between h-14">
                    <p className="text-sm font-medium text-gray-900 truncate">Lat: {ride.pickup_lat.toFixed(4)}, Lng: {ride.pickup_lng.toFixed(4)}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">Lat: {ride.destination_lat.toFixed(4)}, Lng: {ride.destination_lng.toFixed(4)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Navigation size={14} /> {ride.distance || '--'} km</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-gray-900">₹{ride.fare || '--'}</span>
                    <ChevronRight className="text-gray-300 group-hover:text-brand transition-colors w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRides;
