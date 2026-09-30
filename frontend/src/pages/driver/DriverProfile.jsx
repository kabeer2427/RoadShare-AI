import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Car, ShieldCheck, FileCheck, Phone, Mail, Award, Clock } from 'lucide-react';

const DriverProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 max-w-md mx-auto w-full relative h-full">
      {/* Header Profile Summary */}
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              {user?.name || 'Partner'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider font-bold text-[10px] border border-green-200">
                <ShieldCheck size={12} /> VERIFIED
              </span>
              <span>ID: {user?.id?.substring(0,6).toUpperCase() || 'DRV-1X8'}</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-2xl font-black text-brand-dark">
              {user?.name?.charAt(0) || 'D'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {/* Contact Information */}
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

        {/* Vehicle Information */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 ml-2">Vehicle Information</h2>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <Car className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 uppercase">MP04 Auto</p>
                  <p className="text-sm text-gray-500 font-medium">Auto-Rickshaw</p>
                </div>
              </div>
              <div className="bg-brand-100 text-brand-dark px-3 py-1 rounded-xl text-xs font-bold">
                Capacity: 4
              </div>
            </div>
            
            <div className="p-4 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <FileCheck className="w-4 h-4 text-green-500" />
                License Verified
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <FileCheck className="w-4 h-4 text-green-500" />
                RC Verified
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">4.9</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Rating</p>
           </div>
           
           <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">1.2k</p>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Rides</p>
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

export default DriverProfile;
