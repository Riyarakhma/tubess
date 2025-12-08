import React from 'react';
import { Bus, Wifi, WifiOff } from 'lucide-react';

export default function Header({ isOnline }) {
  return (
    <div className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bus size={28} className="animate-pulse" />
          <div>
            <h1 className="text-xl font-bold">Bus Kampus Universitas Diponegoro</h1>
            <p className="text-xs text-blue-100">Real-time Tracking System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full">
              <Wifi size={16} />
              <span className="text-xs font-medium">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
              <WifiOff size={16} />
              <span className="text-xs font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
