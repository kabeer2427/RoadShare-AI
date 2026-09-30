import React from 'react';
import { History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CommuterRides = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          My Rides
        </h1>
        <p className="text-sm text-gray-500 font-medium">View your travel history.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <History className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Past Rides</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          You haven't booked any rides yet. Head to the dashboard to find a ride!
        </p>
      </div>
    </div>
  );
};

export default CommuterRides;
