import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { MapPin, Navigation, Search, Users, Activity, Plus, Minus, User, History, Bookmark, Bell, CreditCard, BrainCircuit, HelpCircle, Settings, Shield, FileText, LogOut, X, ChevronRight, Map as MapIcon, Clock } from 'lucide-react';

const CommuterDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pax, setPax] = useState(1);
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, found
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('book'); // book, map, rides
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null); // For Ride Details view
  const [rideHistoryTab, setRideHistoryTab] = useState('completed');

  const requestRide = async () => {
    if (!pickup || !destination) return;
    setLoading(true);
    setRideStatus('searching');
    try {
      // Mock API call
      setTimeout(() => {
        setRideStatus('found');
        setLoading(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      setRideStatus('idle');
      setLoading(false);
    }
  };

  const handleRideAgain = (oldPickup, oldDestination) => {
    setPickup(oldPickup);
    setDestination(oldDestination);
    setSelectedRide(null);
    setActiveTab('book');
    setIsMenuOpen(false);
  };

  // MOCK DATA
  const recentRoutes = [
    { from: 'BHEL', to: 'MP Nagar' },
    { from: 'Habibganj', to: 'Board Office' }
  ];

  const savedPlaces = [
    { name: 'Home', address: 'BHEL Sector 1, Bhopal', icon: '🏠' },
    { name: 'Work', address: 'MP Nagar Zone 2, Bhopal', icon: '💼' }
  ];

  const mockHistory = [
    { id: 1, date: '30 Sep 2026', time: '6:42 PM', from: 'BHEL', to: 'MP Nagar', distance: '4.8 km', duration: '22 min', fare: '₹38', driver: 'Rahul K.', vehicle: 'MP04 AB 1234', type: 'Shared E-Rickshaw', status: 'completed' },
    { id: 2, date: '29 Sep 2026', time: '9:15 AM', from: 'MP Nagar', to: 'Habibganj', distance: '2.1 km', duration: '12 min', fare: '₹20', driver: 'Sanjay M.', vehicle: 'MP04 XY 9876', type: 'Shared Auto', status: 'completed' },
    { id: 3, date: '28 Sep 2026', time: '5:30 PM', from: 'Board Office', to: 'BHEL', distance: '5.5 km', duration: '25 min', fare: '₹45', driver: 'Amit', vehicle: 'MP04 ZX 1122', type: 'Direct Auto', status: 'cancelled' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-[calc(100vh-64px)] overflow-hidden">
      
      {/* HEADER WITH AVATAR */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-brand font-black hover:bg-gray-50 transition-colors"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </button>
      </div>

      {/* --- PROFILE DRAWER MENU --- */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="w-[85%] bg-white h-full relative z-10 flex flex-col animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="bg-gray-900 p-6 text-white">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-black mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-xl font-black">{user?.name || 'Commuter'}</h2>
              <div className="text-sm text-gray-400 font-medium">{user?.phone || '+91 98765 43210'}</div>
              <div className="mt-4 bg-white/10 rounded-lg p-2 flex items-center gap-2 text-xs font-bold text-brand">
                <CheckCircle className="w-4 h-4" /> Verified Member
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              {[
                { icon: Navigation, label: 'Current Ride', action: () => { setActiveTab('book'); setIsMenuOpen(false); } },
                { icon: History, label: 'Ride History', action: () => { setActiveTab('rides'); setIsMenuOpen(false); } },
                { icon: Bookmark, label: 'Saved Places' },
                { icon: Bell, label: 'Notifications' },
                { icon: CreditCard, label: 'Payments', badge: 'Coming Soon' },
                { icon: BrainCircuit, label: 'MoveFlow AI', badge: 'Coming Soon' },
                { icon: HelpCircle, label: 'Help & Support' },
                { icon: Settings, label: 'Settings' },
              ].map((item, i) => (
                <button key={i} onClick={item.action} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                  <div className="flex items-center gap-4 text-gray-700">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded-full">{item.badge}</span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button onClick={logout} className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-red-50 py-2 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RIDE DETAILS MODAL --- */}
      {selectedRide && (
        <div className="absolute inset-0 z-40 bg-white flex flex-col animate-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white shadow-sm z-10">
            <button onClick={() => setSelectedRide(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-black text-lg">Ride Details</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
               <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                 <div>
                   <div className="font-black text-xl">{selectedRide.date}</div>
                   <div className="text-sm text-gray-500 font-medium">{selectedRide.time}</div>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedRide.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {selectedRide.status.toUpperCase()}
                 </div>
               </div>

               <div className="relative pl-6 pb-6 border-l-2 border-gray-200 ml-3 mb-2">
                 <div className="absolute w-3 h-3 bg-black rounded-full -left-[7px] top-0 border-2 border-white shadow-sm"></div>
                 <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Pickup</div>
                 <div className="font-bold text-gray-900">{selectedRide.from}</div>
               </div>
               <div className="relative pl-6 ml-3">
                 <div className="absolute w-3 h-3 bg-brand rounded-sm -left-[7px] top-0 shadow-sm"></div>
                 <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Dropoff</div>
                 <div className="font-bold text-gray-900">{selectedRide.to}</div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-xs text-gray-400 font-bold mb-1">Fare</div>
                <div className="font-black text-gray-900">{selectedRide.fare}</div>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-xs text-gray-400 font-bold mb-1">Distance</div>
                <div className="font-black text-gray-900">{selectedRide.distance}</div>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-xs text-gray-400 font-bold mb-1">Duration</div>
                <div className="font-black text-gray-900">{selectedRide.duration}</div>
              </div>
            </div>

            {selectedRide.status === 'completed' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Driver Info</div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">👨‍✈️</div>
                  <div>
                    <div className="font-black text-gray-900">{selectedRide.driver}</div>
                    <div className="text-sm text-gray-500">{selectedRide.type} • {selectedRide.vehicle}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-brand-50 rounded-2xl p-4 border border-brand/20 mb-4 flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-brand-dark mb-1">AI Match Explanation</div>
                <p className="text-sm text-brand-dark/80 font-medium">You were grouped with 2 other passengers. Route detour was minimal (4.2%). Estimated savings: ₹45.</p>
              </div>
            </div>

            <button 
              onClick={() => handleRideAgain(selectedRide.from, selectedRide.to)}
              className="w-full bg-gray-900 text-white font-black text-lg py-4 rounded-xl hover:bg-black transition-colors mb-3"
            >
              RIDE AGAIN
            </button>
            <button className="w-full bg-white text-red-500 font-bold py-4 rounded-xl hover:bg-red-50 transition-colors border border-red-100">
              Report Issue
            </button>
          </div>
        </div>
      )}


      {/* MAIN TABS */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* --- BOOK TAB --- */}
        {activeTab === 'book' && (
          <div className="absolute inset-0 flex flex-col h-full z-10">
            {/* Top Map Background */}
            <div className="absolute inset-x-0 top-0 h-2/3 bg-[#e5e7eb] z-0 overflow-hidden">
               <div className="absolute inset-0 grid grid-cols-4 grid-rows-8 opacity-20">
                  {Array.from({length: 32}).map((_, i) => <div key={i} className="border border-gray-400"></div>)}
               </div>
               
               {rideStatus === 'found' && (
                 <>
                   <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-black shadow-lg z-10 border-2 border-white"></div>
                   <div className="absolute top-1/4 left-1/2 w-4 h-4 rounded-full bg-black shadow-lg z-10 border-2 border-white"></div>
                   <div className="absolute top-3/4 left-3/4 w-4 h-4 rounded-full bg-brand shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 border-2 border-white animate-pulse"></div>
                   <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                      <path d="M 100 300 L 200 150 L 300 450" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="6,6" className="animate-[dash_1s_linear_infinite]" />
                   </svg>
                   <div className="absolute top-[40%] left-[45%] bg-white p-1 rounded shadow text-lg z-20">🚕</div>
                 </>
               )}
            </div>

            {/* Bottom Sheet UI overlay */}
            <div className="relative z-10 flex flex-col h-full justify-end pb-[70px]">
              
              {rideStatus === 'idle' && (
                <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 animate-in slide-in-from-bottom-4">
                  <h2 className="text-2xl font-black text-gray-900 mb-4">Where to?</h2>
                  
                  {/* Smart Booking Predictions */}
                  {(!pickup && !destination) && (
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x">
                      {savedPlaces.map((place, i) => (
                        <button key={i} onClick={() => setDestination(place.address)} className="snap-start shrink-0 bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">{place.icon}</div>
                          <div className="text-left pr-4">
                            <div className="font-bold text-gray-900">{place.name}</div>
                            <div className="text-xs text-gray-500 font-medium truncate w-24">{place.address}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4 relative mb-4">
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-4 h-4 rounded-full bg-black border-2 border-white shadow-sm flex-shrink-0"></div>
                      <input 
                        type="text" 
                        value={pickup} 
                        onChange={(e) => setPickup(e.target.value)} 
                        className="bg-transparent border-none focus:ring-0 text-gray-900 font-bold w-full text-lg p-0 placeholder:text-gray-400"
                        placeholder="Current location"
                      />
                    </div>
                    
                    <div className="border-t border-gray-200 ml-7"></div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-4 h-4 rounded-sm bg-brand flex-shrink-0"></div>
                      <input 
                        type="text" 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                        className="bg-transparent border-none focus:ring-0 text-gray-900 font-bold w-full text-lg p-0 placeholder:text-gray-400"
                        placeholder="Search destination"
                      />
                    </div>
                  </div>

                  {/* Recent Routes - Only show when inputs have text to simulate search, or always below */}
                  {(pickup || destination) && (
                    <>
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-400" />
                          <span className="font-bold text-gray-700">Passengers</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-black text-xl w-4 text-center">{pax}</span>
                          <button onClick={() => setPax(Math.min(4, pax + 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button className="border-2 border-brand bg-brand-50 rounded-2xl p-4 text-left relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                          <div className="text-2xl mb-1">🚕</div>
                          <div className="font-bold text-gray-900">Shared Ride</div>
                          <div className="text-brand font-black text-lg">₹35</div>
                          <div className="text-xs text-gray-500 font-medium">4 min away</div>
                        </button>
                        <button className="border border-gray-200 bg-white hover:bg-gray-50 rounded-2xl p-4 text-left">
                          <div className="text-2xl mb-1">🚖</div>
                          <div className="font-bold text-gray-900">Direct Auto</div>
                          <div className="text-gray-900 font-black text-lg">₹80</div>
                          <div className="text-xs text-gray-500 font-medium">2 min away</div>
                        </button>
                      </div>

                      <button 
                        onClick={requestRide}
                        className="w-full bg-gray-900 text-white font-black text-lg py-4 rounded-xl hover:bg-black transition-colors"
                      >
                        FIND RIDE
                      </button>
                    </>
                  )}
                  
                  {(!pickup && !destination) && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Recent Routes</div>
                      {recentRoutes.map((route, i) => (
                        <button key={i} onClick={() => handleRideAgain(route.from, route.to)} className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><History className="w-4 h-4" /></div>
                          <div>
                            <div className="font-bold text-gray-900">{route.from} <span className="text-gray-400 mx-1">→</span> {route.to}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {rideStatus === 'searching' && (
                <div className="bg-white rounded-t-3xl shadow-2xl p-8 text-center space-y-6">
                   <div className="w-20 h-20 bg-brand-50 rounded-full mx-auto flex items-center justify-center">
                      <Search className="w-8 h-8 text-brand animate-pulse" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-gray-900 mb-2">Clustering with AI...</h2>
                     <p className="text-gray-500 font-medium">Finding nearby passengers heading your way to split the fare.</p>
                   </div>
                   
                   <div className="flex gap-2 justify-center pb-4">
                     <div className="w-2 h-2 rounded-full bg-brand animate-bounce"></div>
                     <div className="w-2 h-2 rounded-full bg-brand animate-bounce delay-100"></div>
                     <div className="w-2 h-2 rounded-full bg-brand animate-bounce delay-200"></div>
                   </div>
                </div>
              )}

              {rideStatus === 'found' && (
                <div className="bg-white rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      🎉 Shared Ride Found
                    </div>
                    <div className="text-gray-500 font-bold">4 min</div>
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-6 text-lg">
                    Your ride has been grouped with <strong className="text-gray-900 font-black">2 other passengers</strong>.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-2xl">
                      👨‍✈️
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">Rahul Kumar</div>
                      <div className="text-sm text-gray-500 font-medium">E-Rickshaw • MP04 AB 1234</div>
                    </div>
                    <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-sm font-bold flex items-center gap-1">
                      ⭐ 4.8
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-6">
                     <div>
                       <div className="text-xs text-gray-400 font-bold uppercase mb-1">Your Fare</div>
                       <div className="text-3xl font-black text-gray-900">₹38</div>
                       <div className="text-xs text-brand font-bold bg-brand-50 px-2 py-0.5 rounded mt-1 inline-block">Saved ₹42</div>
                     </div>
                     <div className="text-right">
                       <div className="text-xs text-gray-400 font-bold uppercase mb-1">Other Pickups</div>
                       <div className="text-sm font-medium text-gray-700">📍 Habibganj</div>
                       <div className="text-sm font-medium text-gray-700">📍 Board Office</div>
                     </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setRideStatus('idle')}
                      className="w-14 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => { setActiveTab('rides'); setRideStatus('idle'); setPickup(''); setDestination(''); }}
                      className="flex-1 bg-brand text-white font-black text-lg py-4 rounded-xl hover:bg-brand-dark transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      CONFIRM & CALL DRIVER
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MAP TAB (Coming Soon) --- */}
        {activeTab === 'map' && (
          <div className="absolute inset-0 bg-[#e5e7eb] flex flex-col items-center justify-center pb-[70px] animate-in fade-in">
             <MapIcon className="w-16 h-16 text-gray-400 mb-4" />
             <h2 className="text-2xl font-black text-gray-900 mb-2">Live Heatmap</h2>
             <p className="text-gray-500 font-medium text-center max-w-[250px] mb-6">See real-time demand and active shared vehicles around you.</p>
             <div className="bg-brand/10 text-brand border border-brand/20 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm">
               Coming Soon
             </div>
          </div>
        )}

        {/* --- RIDES TAB (History & Active) --- */}
        {activeTab === 'rides' && (
          <div className="absolute inset-0 bg-gray-50 flex flex-col pb-[70px] animate-in fade-in">
            <div className="bg-white p-4 pt-6 shadow-sm border-b border-gray-100 z-10">
              <h2 className="text-2xl font-black text-gray-900 mb-4">My Rides</h2>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setRideHistoryTab('completed')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${rideHistoryTab === 'completed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setRideHistoryTab('active')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${rideHistoryTab === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  Active
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {rideHistoryTab === 'active' ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Navigation className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">No active ride</h3>
                  <p className="text-gray-500 font-medium mb-6">Book a shared ride and start travelling.</p>
                  <button onClick={() => setActiveTab('book')} className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors">
                    Book a Ride
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Recent Rides</div>
                  {mockHistory.map(ride => (
                    <button 
                      key={ride.id} 
                      onClick={() => setSelectedRide(ride)}
                      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-brand/30 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{ride.date} • {ride.time}</div>
                        <div className="font-black text-gray-900">{ride.fare}</div>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><MapPin className="w-4 h-4" /></div>
                        <div className="font-bold text-gray-900 truncate">{ride.from}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand shrink-0"><Navigation className="w-4 h-4" /></div>
                        <div className="font-bold text-gray-900 truncate">{ride.to}</div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                        <div className={`text-xs font-bold uppercase ${ride.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>{ride.status}</div>
                        <div className="text-xs text-gray-500 font-medium">{ride.distance} • {ride.type}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* --- BOTTOM NAVIGATION --- */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 pb-safe z-30">
        <button onClick={() => setActiveTab('book')} className={`flex flex-col items-center gap-1 ${activeTab === 'book' ? 'text-gray-900' : 'text-gray-400'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Book</span>
        </button>
        <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-gray-900' : 'text-gray-400'}`}>
          <MapIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button onClick={() => setActiveTab('rides')} className={`flex flex-col items-center gap-1 ${activeTab === 'rides' ? 'text-gray-900' : 'text-gray-400'}`}>
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Rides</span>
        </button>
      </div>
    </div>
  );
};

export default CommuterDashboard;
