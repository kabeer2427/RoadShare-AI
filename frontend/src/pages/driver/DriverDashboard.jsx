import React, { useState, useEffect } from 'react';
import { Power, Map, Users, CheckCircle, Navigation, BrainCircuit, Activity, ChevronRight, DollarSign, Clock } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [routeAccepted, setRouteAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => {
    if (isOnline && !routeAccepted) {
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
  }, [isOnline, routeAccepted]);

  const toggleOnline = async () => {
    setLoading(true);
    try {
      if (isOnline) {
        await apiClient.post('/drivers/offline');
        setIsOnline(false);
        setRoute(null);
        setRouteAccepted(false);
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
              { id: 'A', distance: 0.8, name: 'Aditi', location: 'MP Nagar' },
              { id: 'B', distance: 1.2, name: 'Rahul', location: 'Habibganj' },
              { id: 'C', distance: 1.6, name: 'Sneha', location: 'BHEL' }
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

  const handleAcceptRoute = () => {
    setRouteAccepted(true);
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
          disabled={loading || routeAccepted}
          className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform flex items-center gap-2 ${
            isOnline ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-brand text-white hover:scale-105 active:scale-95'
          } ${(loading || routeAccepted) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Power className="w-4 h-4" />
          {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4">
        
        {activeTab === 'map' && (
          <>
            {/* Earnings Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm font-bold uppercase">Today's Earnings</span>
                <DollarSign className="text-brand w-5 h-5" />
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
                  <div className="text-xl font-bold text-brand">6</div>
                  <div className="text-xs text-gray-400">Shared</div>
                </div>
              </div>
            </div>

            {/* Live Map Area */}
            <div className={`bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 relative transition-all duration-500 ${routeAccepted ? 'h-48' : 'h-64'}`}>
               {/* Mock Map */}
               <div className="absolute inset-0 bg-[#1e293b] flex items-center justify-center">
                 <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10">
                    {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-white/20"></div>)}
                 </div>
                 
                 {/* Driver Position */}
                 <div className="w-4 h-4 bg-brand rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 border-2 border-white"></div>
                 
                 {isOnline && !routeAccepted && (
                   <>
                     <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></div>
                     <div className="absolute top-12 left-14 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                     <div className="absolute top-8 left-12 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                   </>
                 )}

                 {routeAccepted && (
                   <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                     <path d="M 120 160 L 220 190 L 250 250 L 180 300" stroke="#10b981" strokeWidth="4" fill="none" className="animate-[dash_2s_linear_infinite]" strokeDasharray="8,8" />
                   </svg>
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
            {isOnline && route && !routeAccepted && (
              <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 animate-in slide-in-from-bottom-8">
                <div className="flex items-center gap-2 text-brand font-bold text-sm uppercase tracking-wider mb-4">
                  <BrainCircuit className="w-5 h-5" /> AI Route Suggestion
                </div>
                
                <h3 className="text-xl font-bold mb-6">{route.passengers.length} passengers can be grouped.</h3>

                <div className="space-y-3 mb-6">
                  {route.passengers.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-gray-900 p-3 rounded-xl">
                      <div className="font-medium">Passenger {p.id}</div>
                      <div className="text-brand text-sm font-bold flex items-center gap-1">
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
                        <span className="text-brand font-bold">{route.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-brand h-1.5 rounded-full" style={{ width: `${route.confidence}%` }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleAcceptRoute}
                  className="w-full bg-brand text-gray-900 font-black text-lg py-4 rounded-xl hover:bg-brand-light transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  ACCEPT ROUTE
                </button>
              </div>
            )}

            {/* Active Route View */}
            {routeAccepted && route && (
              <div className="bg-brand text-gray-900 rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-center mb-6 border-b border-gray-900/10 pb-4">
                  <h3 className="text-2xl font-black">Active Route</h3>
                  <div className="bg-gray-900 text-brand px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {route.estimated_duration} min
                  </div>
                </div>

                <div className="space-y-4">
                  {route.passengers.map((p, index) => (
                    <div key={p.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        {index < route.passengers.length - 1 && (
                          <div className="w-1 h-12 bg-gray-900/20 mt-2"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-lg">{p.name}</div>
                        <div className="text-gray-900/70 font-medium">📍 {p.location}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setRouteAccepted(false);
                    setRoute(null);
                  }}
                  className="w-full mt-8 bg-gray-900 text-white font-black text-lg py-4 rounded-xl hover:bg-black transition-colors"
                >
                  COMPLETE ALL DROPS
                </button>
              </div>
            )}
          </>
        )}

        {/* Coming Soon Views for other tabs */}
        {activeTab === 'rides' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center h-full flex flex-col items-center justify-center animate-in fade-in">
            <Users className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-black mb-2">My Rides</h2>
            <p className="text-gray-400 mb-6">View your past completed trips, shared groups, and detailed passenger history.</p>
            <div className="bg-brand/10 text-brand border border-brand/20 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm">
              Coming Soon
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center h-full flex flex-col items-center justify-center animate-in fade-in">
            <Activity className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-black mb-2">Earnings Report</h2>
            <p className="text-gray-400 mb-6">Detailed analytics on your daily and weekly payouts, and AI optimization bonuses.</p>
            <div className="bg-brand/10 text-brand border border-brand/20 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm">
              Coming Soon
            </div>
          </div>
        )}

      </div>

      {/* Bottom Mobile Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around p-3 pb-safe z-20">
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-brand' : 'text-gray-500'}`}
        >
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button 
          onClick={() => setActiveTab('rides')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'rides' ? 'text-brand' : 'text-gray-500'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold">Rides</span>
        </button>
        <button 
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'earnings' ? 'text-brand' : 'text-gray-500'}`}
        >
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Earnings</span>
        </button>
      </div>
    </div>
  );
};

export default DriverDashboard;
