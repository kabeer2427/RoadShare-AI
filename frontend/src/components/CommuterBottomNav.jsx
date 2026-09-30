import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, History, User } from 'lucide-react';

const CommuterBottomNav = () => {
  const navItems = [
    { name: 'Book', path: '/commuter', icon: LayoutDashboard },
    { name: 'Map', path: '/live-map', icon: Map },
    { name: 'Rides', path: '/commuter/rides', icon: History },
    { name: 'Profile', path: '/commuter/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 pb-safe">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/commuter'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-brand' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CommuterBottomNav;
