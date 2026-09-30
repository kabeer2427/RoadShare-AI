import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Navigation } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={user ? "/driver" : "/"} className="flex items-center gap-2 group">
                <div className="bg-brand p-1.5 rounded-lg group-hover:bg-brand-dark transition-colors">
                  <Navigation className="h-6 w-6 text-white transform -rotate-45" />
                </div>
                <span className="font-black text-xl text-gray-900 tracking-tight">MoveFlow</span>
              </Link>
            </div>
            
            {/* Desktop Navigation for Drivers */}
            {user && (
              <div className="hidden md:ml-10 md:flex md:space-x-8 items-center">
                <Link to="/driver" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/live-map" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span> Live Map</Link>
                <Link to="/driver/requests" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Requests</Link>
                <Link to="/driver/rides" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Rides</Link>
              </div>
            )}
            
            {/* Desktop Navigation for Unauthenticated */}
            {!user && (
              <div className="hidden md:ml-10 md:flex md:space-x-8 items-center">
                <Link to="/#how-it-works" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">How It Works</Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User className="h-4 w-4 text-brand" />
                  <Link to="/driver/profile" className="font-bold hover:text-brand transition-colors">{user.name}</Link>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-gray-500 border border-gray-200">Driver</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-red-600 transition-colors focus:outline-none"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-bold text-sm transition-colors">
                  Driver Login
                </Link>
                <Link to="/register" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-brand hover:bg-brand-dark hover:shadow-md hover:-translate-y-0.5 focus:outline-none transition-all">
                  Drive & Earn
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
