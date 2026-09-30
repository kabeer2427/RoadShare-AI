import React, { useState, useEffect } from 'react';
import { Power, Activity, DollarSign, BrainCircuit, Users, ChevronRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demandZones, setDemandZones] = useState([]);

  useEffect(() => {
    let watchId;
    
    if (isOnline) {
      // Mocking AI demand zones fetching
      const mockZones = [
        { name: 'MP Nagar Zone II', multiplier: 1.4, requests: 12 },
        { name: 'Habibganj Station', multiplier: 1.8, requests: 24 },
        { name: 'BHEL Sector A', multiplier: 1.2, requests: 8 },
      ];
      setDemandZones(mockZones);

      // Start geolocation tracking
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Send to backend
            apiClient.post('/drivers/location', { lat: latitude, lng: longitude })
              .catch(err => console.error('Failed to update location:', err));
          },
          (error) => {
            console.error('Geolocation error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
      }
    } else {
      setDemandZones([]);
    }

    return () => {
      if (watchId !== undefined && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline]);

  const toggleOnline = async () => {
    setLoading(true);
    try {
      if (isOnline) {
        await apiClient.post('/drivers/offline');
        setIsOnline(false);
      } else {
        await apiClient.post('/drivers/online');
        setIsOnline(true);
        // We no longer manually post location here, the watchPosition handles it
      }
    } catch (e) {
      console.error(e);
      // Fallback for UI if backend is not fully hooked up
      setIsOnline(!isOnline);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 text-gray-900 w-full relative h-full">
      
      {/* Header Profile Summary */}
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              {user?.name || 'Partner'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider font-bold text-[10px] border border-green-200">
                <ShieldCheck size={12} /> VERIFIED
              </span>
              <span>ID: {user?.id?.substring(0,6).toUpperCase() || 'DRV-1X8'}</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-2xl font-black text-brand-dark">
              {user?.name?.charAt(0) || 'D'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {/* Toggle Online / Offline Status Card */}
        <div className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 ${
          isOnline ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Current Status</h2>
              <div className="text-2xl font-black flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-gray-400'}`}></span>
                {isOnline ? 'ONLINE & READY' : 'OFFLINE'}
              </div>
            </div>
            <button
              onClick={toggleOnline}
              disabled={loading}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isOnline 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600' 
                  : 'bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-dark'
              } disabled:opacity-50`}
            >
              <Power className="w-8 h-8" />
            </button>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-4 flex gap-4 text-sm font-medium">
             <BrainCircuit className={isOnline ? "text-brand w-5 h-5 flex-shrink-0" : "text-gray-400 w-5 h-5 flex-shrink-0"} />
             <p className={isOnline ? "text-gray-200" : "text-gray-500"}>
               {isOnline 
                 ? "AI dispatch is active. We are matching you with optimal routes." 
                 : "Go online to start receiving AI-optimized ride requests."}
             </p>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-gradient-to-br from-brand to-blue-600 p-6 rounded-3xl border border-brand-light shadow-xl shadow-brand/10 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-brand-50 text-sm font-bold uppercase tracking-wider">Today's Revenue</span>
            <DollarSign className="text-white w-5 h-5 opacity-70" />
          </div>
          <div className="text-5xl font-black mb-6">₹842</div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-brand-100 font-medium">Trips</div>
            </div>
            <div>
              <div className="text-2xl font-bold">27</div>
              <div className="text-xs text-brand-100 font-medium">Pax</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.2</div>
              <div className="text-xs text-brand-100 font-medium">Avg/Trip</div>
            </div>
          </div>
        </div>

        {/* AI Demand Insights */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand" /> Demand Insights
          </h2>
          
          {isOnline ? (
            <div className="space-y-3">
              {demandZones.map((zone, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-200 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900">{zone.name}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">{zone.requests} active requests</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-sm font-bold border border-red-100">
                      {zone.multiplier}x
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center text-gray-500">
               <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <p className="font-medium text-sm">Go online to see live demand hotspots and surge pricing zones.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DriverDashboard;
