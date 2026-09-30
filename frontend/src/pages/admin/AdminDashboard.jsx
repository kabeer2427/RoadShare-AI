import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Activity, Users, Car, Map, Shield, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRides: 0,
    activeDrivers: 0,
    activeClusters: 0
  });

  useEffect(() => {
    // In a real app, this would fetch from /api/heatmap/stats
    // Using mock data for the hackathon MVP Command Center presentation
    setStats({
      totalRides: 38,
      activeDrivers: 24,
      activeClusters: 12,
      sharedRides: 19
    });
  }, []);

  return (
    <div className="flex-1 bg-[#0f172a] text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">MOVEFLOW AI COMMAND CENTER</h1>
              <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">System Overview & Live Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#1e293b] px-4 py-2 rounded-full border border-[#334155]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-300 tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Drivers', value: stats.activeDrivers, icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Requests', value: stats.totalRides, icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
            { label: 'Clusters', value: stats.activeClusters, icon: Map, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Shared Rides', value: stats.sharedRides, icon: Activity, color: 'text-brand', bg: 'bg-brand/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#1e293b] rounded-2xl p-6 border border-[#334155]">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Live Heatmap Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0f172a]/50">
                <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Map className="w-4 h-4 text-brand" /> Live Demand Heatmap
                </h3>
                <div className="flex gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Med</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Low</div>
                </div>
              </div>
              
              <div className="flex-1 relative bg-[#0f172a] p-4">
                 <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-5">
                    {Array.from({length: 100}).map((_, i) => <div key={i} className="border border-white"></div>)}
                 </div>
                 
                 {/* Heatmap Nodes */}
                 <div className="absolute top-[20%] left-[30%] w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                 <div className="absolute top-[25%] left-[33%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                 <div className="absolute top-[22%] left-[35%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                 
                 <div className="absolute top-[50%] left-[60%] w-32 h-32 bg-orange-500/20 rounded-full blur-xl"></div>
                 <div className="absolute top-[55%] left-[65%] w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"></div>
                 
                 <div className="absolute top-[70%] left-[20%] w-16 h-16 bg-green-500/20 rounded-full blur-xl"></div>
                 <div className="absolute top-[72%] left-[22%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_green]"></div>

                 {/* Simulated Vehicles */}
                 <div className="absolute top-[40%] left-[40%] bg-white text-black text-xs p-1 rounded font-bold z-10 shadow-lg">🚕 #24</div>
                 <div className="absolute top-[60%] left-[25%] bg-white text-black text-xs p-1 rounded font-bold z-10 shadow-lg">🚕 #88</div>
                 
                 {/* Route Line */}
                 <svg className="absolute inset-0 w-full h-full">
                    <path d="M 250 150 L 320 220 L 450 300" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" fill="none" className="animate-[dash_1s_linear_infinite]" />
                 </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6">
                 <h3 className="font-bold uppercase tracking-wider text-sm mb-4 text-gray-400">System Metrics</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-end border-b border-[#334155] pb-2">
                     <div className="text-gray-300 font-medium">Avg wait time</div>
                     <div className="text-brand-light font-bold text-xl">4.2 min</div>
                   </div>
                   <div className="flex justify-between items-end border-b border-[#334155] pb-2">
                     <div className="text-gray-300 font-medium">Avg detour</div>
                     <div className="text-brand-light font-bold text-xl">8.1%</div>
                   </div>
                   <div className="flex justify-between items-end pb-2">
                     <div className="text-gray-300 font-medium">Match rate</div>
                     <div className="text-green-400 font-bold text-xl">74%</div>
                   </div>
                 </div>
               </div>
               
               <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6">
                 <h3 className="font-bold uppercase tracking-wider text-sm mb-4 text-gray-400">Active Clusters</h3>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                     <div className="font-bold text-sm">Cluster #102</div>
                     <div className="text-xs bg-brand text-white px-2 py-1 rounded font-bold">4 riders</div>
                   </div>
                   <div className="flex justify-between items-center bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                     <div className="font-bold text-sm">Cluster #103</div>
                     <div className="text-xs bg-brand text-white px-2 py-1 rounded font-bold">3 riders</div>
                   </div>
                   <div className="flex justify-between items-center bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                     <div className="font-bold text-sm">Cluster #104</div>
                     <div className="text-xs bg-brand text-white px-2 py-1 rounded font-bold">2 riders</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* AI Activity Feed */}
          <div className="bg-[#1e293b] rounded-2xl border border-[#334155] flex flex-col h-[750px]">
             <div className="p-4 border-b border-[#334155] bg-[#0f172a]/50">
                <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand" /> Live AI Activity Feed
                </h3>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {[
                  { time: '15:42:31', text: '3 riders clustered near MP Nagar', color: 'bg-green-500' },
                  { time: '15:42:28', text: 'Driver #24 entered high-demand zone', color: 'bg-orange-500' },
                  { time: '15:42:21', text: 'New ride request received', color: 'bg-blue-500' },
                  { time: '15:42:18', text: 'Route optimized — 8.4% detour', color: 'bg-purple-500' },
                  { time: '15:42:12', text: 'Cluster #108 completed', color: 'bg-green-500' },
                  { time: '15:41:05', text: 'Dynamic reroute triggered for Driver #88', color: 'bg-brand' },
                  { time: '15:40:55', text: '2 riders clustered near BHEL', color: 'bg-green-500' },
                  { time: '15:39:20', text: 'Driver #12 went offline', color: 'bg-gray-500' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${log.color}`}></div>
                      {i !== 7 && <div className="w-0.5 h-full bg-[#334155] mt-1"></div>}
                    </div>
                    <div className="pb-4">
                      <div className="text-xs font-bold text-gray-500 mb-0.5">{log.time}</div>
                      <div className="text-sm text-gray-200 font-medium">{log.text}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
