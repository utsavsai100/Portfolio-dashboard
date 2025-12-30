
import React from 'react';
import { LayoutDashboard, Clock, RefreshCcw } from 'lucide-react';

const Header = ({ lastUpdated }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">Portfolio Dashboard</h1>
              <p className="text-blue-100 text-xs sm:text-sm">Equity Portfolio Overview (NSE / BSE)</p>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="bg-green-500/20 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full inline-block mr-2"></span>
              Market Open
            </div>
          </div>
        </div>

        <div className="bg-white/20 px-3 py-2 rounded-lg w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-spin-slow" />
            <div className="flex flex-row sm:flex-col justify-between items-center sm:items-start w-full sm:w-auto">
              <div className="text-xs sm:text-sm">Auto-refresh: 15s</div>
              <div className="text-[10px] sm:text-xs opacity-80 sm:mt-0 ml-4 sm:ml-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated: {formatTime(lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;