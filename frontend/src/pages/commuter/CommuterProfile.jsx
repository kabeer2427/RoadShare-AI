import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, Mail, Phone } from 'lucide-react';

const CommuterProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              {user?.name || 'Commuter'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider font-bold text-[10px] border border-green-200">
                <ShieldCheck size={12} /> VERIFIED
              </span>
              <span>ID: {user?.id?.substring(0,6).toUpperCase() || 'USR-1X8'}</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-2xl font-black text-blue-600">
              {user?.name?.charAt(0) || 'C'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 ml-2">Contact Details</h2>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full bg-white text-red-500 border border-red-200 font-bold text-lg py-4 rounded-2xl hover:bg-red-50 transition-colors shadow-sm mt-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default CommuterProfile;
