import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Zap, Users, Clock, Navigation, TrendingUp, CheckCircle, Activity, LayoutDashboard, BrainCircuit, Route } from 'lucide-react';

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
              <span className="text-sm font-bold text-brand-dark tracking-wide uppercase">AI-Powered Shared Mobility</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl leading-tight">
              Move More.<br/>Wait Less.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-600">Share Smarter.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 font-medium">
              India's first AI-driven mobility network that dynamically clusters nearby commuters and optimizes shared routes for e-rickshaws and autos in real-time.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/register" className="rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Navigation className="h-4 w-4" /> Book a Shared Ride
              </Link>
              <Link to="/register?role=driver" className="text-sm font-bold leading-6 text-gray-900 hover:text-brand transition-colors flex items-center gap-2 group">
                Drive & Earn <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
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
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Live Demand Map
                  </div>
                  <div className="text-xs text-gray-400">Bhopal, MP</div>
                </div>
                
                <div className="p-6 relative h-[320px] bg-[#f8f9fa]">
                  {/* Map Mockup Grid */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
                    {Array.from({length: 36}).map((_, i) => (
                      <div key={i} className="border border-gray-900"></div>
                    ))}
                  </div>
                  
                  {/* Markers & Paths */}
                  <div className="absolute top-12 left-10 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></div>
                  <div className="absolute top-16 left-16 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                  <div className="absolute top-14 left-8 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                  
                  <div className="absolute bottom-20 right-20 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                  
                  <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-green-500 z-10"></div>
                  <div className="absolute top-[60%] left-[60%] w-3 h-3 rounded-full bg-green-500 z-10"></div>
                  
                  {/* Route Line SVG */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                     <path d="M 120 160 L 220 190" stroke="#10b981" strokeWidth="3" strokeDasharray="6,6" fill="none" className="animate-[dash_1s_linear_infinite]" />
                  </svg>
                  
                  <div className="absolute top-[55%] left-[45%] bg-white p-1.5 rounded-lg shadow-lg border border-gray-100 z-20">
                    <span className="text-xl">🛺</span>
                  </div>

                  {/* AI Floating Card */}
                  <div className="absolute top-8 right-6 bg-white/90 backdrop-blur rounded-xl shadow-xl border border-gray-100 p-4 w-48 z-30 transform hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit className="w-4 h-4 text-brand" />
                      <span className="text-xs font-bold text-gray-900 uppercase">AI Prediction</span>
                    </div>
                    <div className="font-black text-gray-900 mb-1">MP Nagar</div>
                    <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> HIGH DEMAND
                    </div>
                    <div className="text-xs text-gray-500 mb-2">12 requests nearby</div>
                    <div className="bg-gray-50 rounded text-xs font-medium text-gray-700 p-1.5 text-center border border-gray-100">
                      Suggested drivers: 4
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-t border-gray-100 p-4 flex justify-between text-center divide-x divide-gray-100">
                  <div className="px-4">
                    <div className="text-2xl font-black text-gray-900">38</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Live Requests</div>
                  </div>
                  <div className="px-4">
                    <div className="text-2xl font-black text-brand">14</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">AI Clusters</div>
                  </div>
                  <div className="px-4">
                    <div className="text-2xl font-black text-blue-600">22</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Drivers Online</div>
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
            <h2 className="text-base font-bold leading-7 text-brand uppercase tracking-wider">System Architecture</h2>
            <p className="mt-2 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">How MoveFlow Works</p>
          </div>
          
          {/* AI Activity Feed / System Intelligence */}
          <div className="mt-16 sm:mt-24 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Request', desc: 'Tell us where you are going. Enter pickup and destination.', icon: Navigation },
                { step: '02', title: 'AI Clustering', desc: 'AI analyzes location, bearing, and destination to find compatible riders instantly.', icon: BrainCircuit },
                { step: '03', title: 'Smart Matching', desc: 'Nearby drivers get an optimized shared pickup sequence via our greedy heuristic.', icon: Users },
                { step: '04', title: 'Dynamic Rerouting', desc: 'Live routes adapt dynamically as new requests appear in real-time.', icon: Route }
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
              <h2 className="text-3xl font-black text-gray-900 mb-6">Why MoveFlow is better than traditional booking</h2>
              <p className="text-lg text-gray-600 mb-8">
                By intelligently grouping passengers heading in the same direction, we reduce empty kilometers and wait times simultaneously.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold text-xl leading-none">×</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Traditional Auto</h3>
                    <p className="text-gray-500 text-sm mt-1">Separate rides for A and B. High fare, more vehicles, extra empty distance for driver returns.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">MoveFlow AI</h3>
                    <p className="text-gray-500 text-sm mt-1">One optimized shared route picking up A, B, and C. Lower fare, higher driver earnings per trip.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
               
               <h3 className="text-xl font-bold mb-8">System Intelligence</h3>
               
               <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                   <div className="text-gray-400 font-medium">Passenger wait</div>
                   <div className="text-brand-light font-bold text-xl flex items-center gap-2"><TrendingUp className="w-4 h-4 transform rotate-180" /> Reduced</div>
                 </div>
                 <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                   <div className="text-gray-400 font-medium">Empty kilometers</div>
                   <div className="text-brand-light font-bold text-xl flex items-center gap-2"><TrendingUp className="w-4 h-4 transform rotate-180" /> -40%</div>
                 </div>
                 <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                   <div className="text-gray-400 font-medium">Driver utilization</div>
                   <div className="text-green-400 font-bold text-xl flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Max 4 pax</div>
                 </div>
                 <div className="flex justify-between items-end pb-2">
                   <div className="text-gray-400 font-medium">Match rate</div>
                   <div className="text-green-400 font-bold text-xl flex items-center gap-2"><Activity className="w-4 h-4" /> 87%</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* WhatsApp Section */}
      <div className="bg-brand-50 border-t border-brand-100 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Don't want to use the app?</h2>
          <p className="text-gray-600 mb-8">Book through our conversational AI on WhatsApp.</p>
          <a href="#" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#20bd5a] hover:shadow-xl transition-all hover:-translate-y-1">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
