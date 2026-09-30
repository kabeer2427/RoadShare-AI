import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Navigation, Search, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../api/client';

const CommuterDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  
  // For MVP, just hardcode simple coordinates for the request
  const handleBookRide = async () => {
    setLoading(true);
    try {
      // In a real app, these would come from the Map/Search inputs. We will hardcode Bhopal coordinates for MVP.
      const payload = {
        pickup_lat: 23.2599,
        pickup_lng: 77.4126,
        destination_lat: 23.2332,
        destination_lng: 77.4345,
        passenger_count: 1
      };
      
      const res = await apiClient.post('/rides/requests', payload);
      
      if (res.data?.success) {
        setRequested(true);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to request ride.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          Hi, {user?.name?.split(' ')[0] || 'Commuter'}
        </h1>
        <p className="text-sm text-gray-500 font-medium">Where to today?</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {requested ? (
          <div className="bg-green-50 rounded-3xl p-8 border border-green-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ride Requested!</h2>
            <p className="text-gray-600 text-sm mb-6">Searching for nearby drivers...</p>
            <button 
              onClick={() => setRequested(false)}
              className="px-6 py-3 bg-white text-green-600 font-bold border border-green-200 rounded-xl hover:bg-green-50 transition-colors"
            >
              Cancel Request
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm relative">
              <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-100"></div>
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                  <Navigation className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup Location</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900">Current Location</div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                  <MapPin className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1 relative">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                  <input type="text" placeholder="Search destination..." className="w-full bg-gray-50 rounded-xl px-4 py-3 pl-10 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-brand outline-none border-0" />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 bottom-3" />
                </div>
              </div>
            </div>

            <button
              onClick={handleBookRide}
              disabled={loading}
              className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Finding Driver...' : 'Find a Ride'}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default CommuterDashboard;
