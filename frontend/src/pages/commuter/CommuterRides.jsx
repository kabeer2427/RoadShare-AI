import React, { useState, useEffect } from 'react';
import { History, MapPin, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

const CommuterRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await apiClient.get('/rides/history');
      if (res.data?.success) {
        setRides(res.data.data.rides || []);
      }
    } catch (error) {
      console.error('Failed to load rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          My Rides
        </h1>
        <p className="text-sm text-gray-500 font-medium">View your travel history.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <History className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Past Rides</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              You haven't booked any rides yet. Head to the dashboard to find a ride!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map(ride => (
              <div key={ride.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Calendar className="w-4 h-4" />
                    {new Date(ride.requested_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                    {getStatusIcon(ride.status)}
                    <span className={ride.status === 'completed' ? 'text-green-600' : ride.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}>
                      {ride.status}
                    </span>
                  </div>
                </div>
                
                <div className="relative pl-6 mb-4">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  <div className="mb-4 relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-blue-500 bg-white"></div>
                    <p className="text-sm font-medium text-gray-900 truncate">{ride.pickup_address || `${ride.pickup_lat.toFixed(4)}, ${ride.pickup_lng.toFixed(4)}`}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-brand bg-white"></div>
                    <p className="text-sm font-medium text-gray-900 truncate">{ride.destination_address || `${ride.destination_lat.toFixed(4)}, ${ride.destination_lng.toFixed(4)}`}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <div className="text-sm font-medium text-gray-600">
                     {ride.ride_type === 'shared' ? 'Shared Auto' : 'Direct Auto'} • {ride.passenger_count} Seat(s)
                   </div>
                   <div className="font-black text-brand text-lg">
                     ₹{ride.fare || ride.estimated_fare || 0}
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

export default CommuterRides;
