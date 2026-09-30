import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { MapPin, Navigation, Search, Users, Activity, Plus, Minus } from 'lucide-react';

const CommuterDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState('BHEL Sector 1');
  const [destination, setDestination] = useState('MP Nagar');
  const [pax, setPax] = useState(1);
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, found

  const requestRide = async () => {
    setLoading(true);
    setRideStatus('searching');
    try {
      await apiClient.post('/rides/request', {
        pickup_lat: 23.2500,
        pickup_lng: 77.4000,
        drop_lat: 23.2333,
        drop_lng: 77.4333,
        pax
      });
      
      // Simulate finding a shared ride after 3 seconds
      setTimeout(() => {
        setRideStatus('found');
      }, 3000);
    } catch (e) {
      console.error(e);
      setRideStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-[calc(100vh-64px)]">
      
      {/* Top Map Background */}
      <div className="absolute inset-x-0 top-0 h-2/3 bg-[#e5e7eb] z-0 overflow-hidden">
         <div className="absolute inset-0 grid grid-cols-4 grid-rows-8 opacity-20">
            {Array.from({length: 32}).map((_, i) => <div key={i} className="border border-gray-400"></div>)}
         </div>
         {/* If a ride is found, show the route line */}
         {rideStatus === 'found' && (
           <>
             <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-black shadow-lg z-10 border-2 border-white"></div>
             <div className="absolute top-1/4 left-1/2 w-4 h-4 rounded-full bg-black shadow-lg z-10 border-2 border-white"></div>
             <div className="absolute top-3/4 left-3/4 w-4 h-4 rounded-full bg-brand shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 border-2 border-white animate-pulse"></div>
             <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <path d="M 100 300 L 200 150 L 300 450" stroke="#10b981" strokeWidth="4" fill="none" />
             </svg>
             <div className="absolute top-[40%] left-[45%] bg-white p-1 rounded shadow text-lg z-20">🚕</div>
           </>
         )}
      </div>

      {/* Main UI overlay */}
      <div className="relative z-10 flex flex-col h-full justify-end pb-20">
        
        {rideStatus === 'idle' && (
          <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Where are you going?</h2>
            
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4 relative">
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

            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="font-bold text-gray-700">Passengers</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPax(Math.max(1, pax - 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-xl w-4 text-center">{pax}</span>
                <button 
                  onClick={() => setPax(Math.min(4, pax + 1))}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">Rahul Kumar</div>
                <div className="text-sm text-gray-500 font-medium">E-Rickshaw • MP04 AB 1234</div>
              </div>
              <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-sm font-bold">
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

            <button 
              onClick={() => setRideStatus('idle')}
              className="w-full bg-brand text-white font-black text-lg py-4 rounded-xl hover:bg-brand-dark transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              CALL DRIVER
            </button>
          </div>
        )}

      </div>
      
      {/* Bottom Mobile Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 pb-safe z-20">
        <button className="flex flex-col items-center gap-1 text-gray-900">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Book</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <MapPin className="w-6 h-6" />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Rides</span>
        </button>
      </div>
    </div>
  );
};

export default CommuterDashboard;
