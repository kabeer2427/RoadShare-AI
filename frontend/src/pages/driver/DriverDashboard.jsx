import React, { useState, useEffect } from 'react';
import { Power, Map, Users, CheckCircle, Navigation } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (isOnline) {
      // Simulate getting a route after some time online
      const fetchRoute = async () => {
        try {
          const res = await apiClient.get('/drivers/routes/current');
          setRoute(res.data.data);
        } catch (e) {
          // No route assigned yet
          setRoute(null);
        }
      };
      
      const interval = setInterval(fetchRoute, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const toggleOnline = async () => {
    setLoading(true);
    try {
      if (isOnline) {
        await apiClient.post('/drivers/offline');
        setIsOnline(false);
        setRoute(null);
      } else {
        await apiClient.post('/drivers/online');
        setIsOnline(true);
        // Start sending location
        apiClient.post('/drivers/location', { lat: 23.2599, lng: 77.4126 }).catch(console.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Top Status Bar */}
      <div className="bg-white p-4 shadow flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="font-bold text-lg">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        <button
          onClick={toggleOnline}
          disabled={loading}
          className={`p-3 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
            isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-DEFAULT hover:bg-brand-dark'
          }`}
        >
          <Power className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Placeholder for map */}
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Live Map Integration</p>
            {isOnline && !route && <p className="text-sm mt-2 animate-pulse text-brand-dark">Searching for shared riders...</p>}
          </div>
        </div>

        {/* Bottom Sheet for Route */}
        {isOnline && route && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 transition-transform transform translate-y-0">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">New Shared Route</h3>
                <div className="text-3xl font-black text-gray-900">{route.detour_distance}% Detour</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Est. Distance</div>
                <div className="text-2xl font-bold text-brand-DEFAULT">{(route.estimated_distance / 1000).toFixed(1)} km</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {route.route_geometry?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.type === 'pickup' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {step.type === 'pickup' ? <Users className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold capitalize">{step.type}</div>
                    <div className="text-sm text-gray-500">Passenger {step.reqId.substring(0,6)}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-brand-DEFAULT text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-brand-DEFAULT/30 hover:bg-brand-dark transition-colors flex items-center justify-center gap-3">
              <Navigation className="w-6 h-6" />
              START ROUTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
