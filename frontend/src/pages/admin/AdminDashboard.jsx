import React, { useEffect, useState } from 'react';
import { Activity, Users, Truck, Route } from 'lucide-react';
import { apiClient } from '../../api/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeDrivers: 24,
    pendingRequests: 31,
    activeSharedRides: 14,
    passengersMatched: 52,
    emptyKmReduced: '18%',
    averageWait: '4.2 min'
  });

  return (
    <div className="flex-1 bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard title="Active Drivers" value={stats.activeDrivers} icon={Truck} color="blue" />
          <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Users} color="orange" />
          <StatCard title="Active Shared Rides" value={stats.activeSharedRides} icon={Route} color="green" />
          <StatCard title="Passengers Matched" value={stats.passengersMatched} icon={Users} color="purple" />
          <StatCard title="Empty KM Reduced" value={stats.emptyKmReduced} icon={Activity} color="brand" />
          <StatCard title="Average Wait Time" value={stats.averageWait} icon={Activity} color="yellow" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Live Demand Heatmap</h2>
          <div className="aspect-[21/9] bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
             {/* Map Placeholder */}
             <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
                {Array.from({length: 72}).map((_, i) => (
                  <div key={i} className={`border border-gray-400 ${i % 7 === 0 ? 'bg-red-500 opacity-50' : i % 5 === 0 ? 'bg-orange-500 opacity-30' : ''}`}></div>
                ))}
             </div>
             <div className="relative z-10 bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold text-gray-700 shadow-sm border border-gray-200">
               Interactive Map Component Loads Here
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    brand: 'bg-brand-50 text-brand-DEFAULT',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
