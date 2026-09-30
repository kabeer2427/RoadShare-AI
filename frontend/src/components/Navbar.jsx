import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Navigation } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-brand-DEFAULT p-1.5 rounded-lg group-hover:bg-brand-dark transition-colors">
                  <Navigation className="h-6 w-6 text-white transform -rotate-45" />
                </div>
                <span className="font-black text-xl text-gray-900 tracking-tight">MoveFlow</span>
              </Link>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8 items-center">
              <Link to="/#how-it-works" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">How It Works</Link>
              <Link to="/#live-map" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Live Map</Link>
              <Link to="/register?role=driver" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">For Drivers</Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User className="h-4 w-4 text-brand-DEFAULT" />
                  <span className="font-bold">{user.name}</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-gray-500 border border-gray-200">{user.role}</span>
                </div>
                
                <Link to={`/${user.role}`} className="text-sm font-bold text-brand-DEFAULT hover:text-brand-dark transition-colors px-3 py-2">
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-red-600 transition-colors focus:outline-none"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-bold text-sm transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-brand-DEFAULT hover:bg-brand-dark hover:shadow-md hover:-translate-y-0.5 focus:outline-none transition-all">
                  Get Started
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
