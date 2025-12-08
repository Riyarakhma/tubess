import React from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Notifications({ notifications, onClose }) {
  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={18} />;
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
        return <Bell size={18} />;
      default:
        return <Info size={18} />;
    }
  };
  
  const getColorClass = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${getColorClass(notif.type)} text-white p-4 rounded-lg shadow-lg animate-slide-in`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <p className="text-sm flex-1">{notif.message}</p>
            </div>
            <button
              onClick={() => onClose(notif.id)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Progress bar for auto-dismiss */}
          <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white animate-progress"
              style={{ animationDuration: '5s' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}