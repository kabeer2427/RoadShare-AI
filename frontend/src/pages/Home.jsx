import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Zap, Users, Clock, Navigation, TrendingUp, CheckCircle, Activity, LayoutDashboard, BrainCircuit, Route, Banknote, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-light to-brand-dark opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:flex lg:items-center lg:gap-x-16">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex items-center gap-2 mb-8 bg-brand-50 w-max px-4 py-2 rounded-full border border-brand-100">
              <BrainCircuit className="h-5 w-5 text-brand" />
              <span className="text-sm font-bold text-brand-dark tracking-wide uppercase">For E-Rickshaw & Auto Drivers</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl leading-tight">
              Drive Smarter.<br/>Earn More.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-600">Waste Less.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 font-medium">
              Join India's first AI-driven mobility network that guides you to passenger demand hotspots, dynamically clusters shared riders, and eliminates empty kilometers.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/register" className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-dark hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Navigation className="h-4 w-4" /> Become a Partner
              </Link>
              <Link to="/login" className="text-sm font-bold leading-6 text-gray-900 hover:text-brand transition-colors flex items-center gap-2 group">
                Driver Login <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            {/* Visual Hero Demonstration */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-y-4 -inset-x-4 bg-gradient-to-r from-brand-100 to-blue-50 rounded-[2.5rem] blur-xl opacity-50"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                  <div className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Driver Dashboard
                  </div>
                  <div className="text-xs text-gray-400">Online</div>
                </div>
                
                <div className="p-6 relative h-[320px] bg-[#f8f9fa]">
                  {/* Map Mockup Grid */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
                    {Array.from({length: 36}).map((_, i) => (
                      <div key={i} className="border border-gray-900"></div>
                    ))}
                  </div>
                  
                  {/* Heatmap & Demand Markers */}
                  <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-red-500 blur-3xl opacity-30 animate-pulse"></div>
                  <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-orange-500 blur-3xl opacity-20"></div>
                  
                  <div className="absolute top-[55%] left-[45%] bg-white p-2 rounded-xl shadow-lg border border-brand-200 z-20 flex items-center gap-2">
                    <span className="text-2xl">🛺</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-brand uppercase">Earnings</span>
                      <span className="text-xs font-black text-gray-900">₹850</span>
                    </div>
                  </div>

                  {/* AI Floating Card */}
                  <div className="absolute top-8 right-6 bg-white/95 backdrop-blur rounded-xl shadow-xl border border-gray-100 p-4 w-48 z-30 transform hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit className="w-4 h-4 text-brand" />
                      <span className="text-xs font-bold text-gray-900 uppercase">AI Reposition</span>
                    </div>
                    <div className="font-black text-gray-900 mb-1">Move to MP Nagar</div>
                    <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> HIGH DEMAND
                    </div>
                    <div className="bg-green-50 rounded text-xs font-bold text-green-700 p-1.5 text-center border border-green-100">
                      +45% surge pricing
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-t border-gray-100 p-4 flex justify-between text-center divide-x divide-gray-100">
                  <div className="px-4">
                    <div className="text-2xl font-black text-gray-900">4</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Rides Today</div>
                  </div>
                  <div className="px-4">
                    <div className="text-2xl font-black text-brand">3.8</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Avg Pax</div>
                  </div>
                  <div className="px-4">
                    <div className="text-2xl font-black text-green-600">₹850</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Earnings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="how-it-works" className="py-24 sm:py-32 bg-gray-50 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-bold leading-7 text-brand uppercase tracking-wider">For Drivers</h2>
            <p className="mt-2 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">Your Intelligent Co-Pilot</p>
          </div>
          
          <div className="mt-16 sm:mt-24 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Live Heatmaps', desc: 'See exactly where passengers are requesting rides in real-time.', icon: MapPin },
                { step: '02', title: 'Smart Dispatch', desc: 'Receive continuous ride requests matching your current route.', icon: BrainCircuit },
                { step: '03', title: 'Maximum Occupancy', desc: 'Our AI ensures your auto is always full, maximizing per-trip income.', icon: Users },
                { step: '04', title: 'Instant Earnings', desc: 'Track your daily revenue and completed trips instantly.', icon: Banknote }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="text-5xl font-black text-gray-50 absolute -top-2 -right-2 z-0">{item.step}</div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6 text-brand group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Shared Comparison */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Stop roaming empty. Start earning smarter.</h2>
              <p className="text-lg text-gray-600 mb-8">
                MoveFlow replaces the guesswork of finding passengers. By intelligently grouping commuters and predicting demand, we keep your vehicle full.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold text-xl leading-none">×</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Traditional Driving</h3>
                    <p className="text-gray-500 text-sm mt-1">Driving around aimlessly wasting battery/fuel. Returning empty after a drop-off. Low daily earnings.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">MoveFlow Partner</h3>
                    <p className="text-gray-500 text-sm mt-1">Guided directly to hotspots. Picking up multiple passengers along a single optimized route. Doubling daily earnings.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
               
               <h3 className="text-xl font-bold mb-8">Driver Benefits</h3>
               
               <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                   <div className="text-gray-400 font-medium">Empty kilometers</div>
                   <div className="text-brand-light font-bold text-xl flex items-center gap-2"><TrendingUp className="w-4 h-4 transform rotate-180" /> -40%</div>
                 </div>
                 <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                   <div className="text-gray-400 font-medium">Average Occupancy</div>
                   <div className="text-brand-light font-bold text-xl flex items-center gap-2"><Users className="w-4 h-4" /> 3.8 Pax</div>
                 </div>
                 <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                   <div className="text-gray-400 font-medium">Daily Earnings</div>
                   <div className="text-green-400 font-bold text-xl flex items-center gap-2"><TrendingUp className="w-4 h-4" /> +65%</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
