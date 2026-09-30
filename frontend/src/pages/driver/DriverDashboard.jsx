import React, { useState, useEffect } from 'react';
import { Power, Map, Users, CheckCircle, Navigation, BrainCircuit, Activity, ChevronRight, DollarSign } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (isOnline) {
      // Simulate getting a route after some time online
      const fetchRoute = async () => {
        try {
          const res = await apiClient.get('/drivers/routes/current');
          // Mocking a richer route object for the UI presentation
          setRoute({
            ...res.data.data,
            estimated_distance: 16200,
            detour_distance: 7.8,
            estimated_duration: 24,
            passengers: [
              { id: 'A', distance: 0.8 },
              { id: 'B', distance: 1.2 },
              { id: 'C', distance: 1.6 }
            ],
            confidence: 87
          });
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
        apiClient.post('/drivers/location', { lat: 23.2599, lng: 77.4126 }).catch(console.error);
        
        // Mock getting a route instantly for demo purposes
        setTimeout(() => {
          setRoute({
            id: 'mock-route-123',
            estimated_distance: 16200,
            detour_distance: 7.8,
            estimated_duration: 24,
            passengers: [
              { id: 'A', distance: 0.8 },
              { id: 'B', distance: 1.2 },
              { id: 'C', distance: 1.6 }
            ],
            confidence: 87,
            route_geometry: [
              { type: 'pickup', reqId: 'Passenger A' },
              { type: 'pickup', reqId: 'Passenger B' },
              { type: 'pickup', reqId: 'Passenger C' },
            ]
          });
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white max-w-md mx-auto w-full relative">
      {/* Top Status Bar */}
      <div className="bg-gray-800 p-4 shadow-lg flex items-center justify-between z-10 rounded-b-3xl border-b border-gray-700">
        <div>
          <h2 className="text-sm font-medium text-gray-400">Good afternoon,</h2>
          <h1 className="text-xl font-bold">{user?.name || 'Driver'}</h1>
        </div>
        <button
          onClick={toggleOnline}
          disabled={loading}
          className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
            isOnline ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-brand-DEFAULT text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4">
        
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-sm font-bold uppercase">Today's Earnings</span>
            <DollarSign className="text-brand-DEFAULT w-5 h-5" />
          </div>
          <div className="text-4xl font-black mb-4">₹842</div>
          <div className="grid grid-cols-3 gap-2 border-t border-gray-700 pt-4">
            <div>
              <div className="text-xl font-bold">12</div>
              <div className="text-xs text-gray-400">Rides</div>
            </div>
            <div>
              <div className="text-xl font-bold">27</div>
              <div className="text-xs text-gray-400">Pax</div>
            </div>
            <div>
              <div className="text-xl font-bold text-brand-DEFAULT">6</div>
              <div className="text-xs text-gray-400">Shared</div>
            </div>
          </div>
        </div>

        {/* Live Map Area */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 relative h-64">
           {/* Mock Map */}
           <div className="absolute inset-0 bg-[#1e293b] flex items-center justify-center">
             <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10">
                {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-white/20"></div>)}
             </div>
             <div className="w-4 h-4 bg-brand-DEFAULT rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"></div>
             
             {isOnline && (
               <>
                 <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></div>
                 <div className="absolute top-12 left-14 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                 <div className="absolute top-8 left-12 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
               </>
             )}
           </div>

           {/* Demand Overlay */}
           {isOnline && !route && (
             <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur rounded-xl p-4 border border-gray-700 flex items-center justify-between">
               <div>
                 <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase mb-1">
                   <Activity className="w-3 h-3" /> High demand nearby
                 </div>
                 <div className="text-sm font-medium">8 requests within 1.5 km</div>
               </div>
               <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                 <ChevronRight className="w-5 h-5 text-white" />
               </button>
             </div>
           )}
        </div>

        {/* AI Route Suggestion Bottom Sheet */}
        {isOnline && route && (
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 animate-in slide-in-from-bottom-8">
            <div className="flex items-center gap-2 text-brand-DEFAULT font-bold text-sm uppercase tracking-wider mb-4">
              <BrainCircuit className="w-5 h-5" /> AI Route Suggestion
            </div>
            
            <h3 className="text-xl font-bold mb-6">{route.passengers.length} passengers can be grouped.</h3>

            <div className="space-y-3 mb-6">
              {route.passengers.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-gray-900 p-3 rounded-xl">
                  <div className="font-medium">Passenger {p.id}</div>
                  <div className="text-brand-DEFAULT text-sm font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> {p.distance} km away
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-gray-900 p-3 rounded-xl text-center">
                <div className="text-xs text-gray-400 mb-1">Distance</div>
                <div className="font-bold">{(route.estimated_distance / 1000).toFixed(1)} km</div>
              </div>
              <div className="bg-gray-900 p-3 rounded-xl text-center">
                <div className="text-xs text-gray-400 mb-1">Detour</div>
                <div className="font-bold text-orange-400">+{route.detour_distance}%</div>
              </div>
              <div className="bg-gray-900 p-3 rounded-xl text-center">
                <div className="text-xs text-gray-400 mb-1">Time</div>
                <div className="font-bold">{route.estimated_duration} min</div>
              </div>
            </div>

            {!showExplanation ? (
              <button 
                onClick={() => setShowExplanation(true)}
                className="w-full text-center text-sm text-gray-400 font-medium mb-4 hover:text-white transition-colors"
              >
                Why this group?
              </button>
            ) : (
              <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-700 text-sm space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Match Explanation</div>
                <div className="flex justify-between"><span>Pickup distance</span><span className="font-bold text-green-400">Optimal</span></div>
                <div className="flex justify-between"><span>Destination similarity</span><span className="font-bold">91%</span></div>
                <div className="flex justify-between"><span>Route alignment</span><span className="font-bold">87%</span></div>
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Match Confidence</span>
                    <span className="text-brand-DEFAULT font-bold">{route.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-brand-DEFAULT h-1.5 rounded-full" style={{ width: `${route.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            <button className="w-full bg-brand-DEFAULT text-gray-900 font-black text-lg py-4 rounded-xl hover:bg-brand-light transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              ACCEPT ROUTE
            </button>
          </div>
        )}
      </div>

      {/* Bottom Mobile Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around p-3 pb-safe z-20">
        <button className="flex flex-col items-center gap-1 text-brand-DEFAULT">
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold">Rides</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Earnings</span>
        </button>
      </div>
    </div>
  );
};

export default DriverDashboard;
