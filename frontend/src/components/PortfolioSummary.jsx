// src/components/PortfolioSummary.js
import React from 'react';
import { Wallet, Banknote, TrendingUp, Activity } from 'lucide-react';

const PortfolioSummary = ({
  totalInvestment,
  totalPresentValue,
  totalGainLoss,
  totalReturnPercentage,
  dayChange,
  dayChangePercentage,
  holdingsCount,
  inProfit,
  inLoss
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Portfolio Summary</h2>
        <div className="text-sm text-gray-600">
          Holdings: {holdingsCount} stocks •{' '}
          <span className="text-green-600">{inProfit} in profit</span> •{' '}
          <span className="text-red-600">{inLoss} in loss</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Investment */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-blue-600 text-xs">Cost Basis</div>
          </div>
          <div className="text-blue-800 font-medium">Total Investment</div>
          <div className="text-blue-900 text-2xl font-bold">{formatCurrency(totalInvestment)}</div>
        </div>

        {/* Present Value */}
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-purple-600 text-xs">Current</div>
          </div>
          <div className="text-purple-800 font-medium">Present Value</div>
          <div className="text-purple-900 text-2xl font-bold">{formatCurrency(totalPresentValue)}</div>
        </div>

        {/* Total Return */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className={`text-green-600 text-xs ${(totalReturnPercentage || 0) >= 0 ? 'bg-green-100 px-2 py-1 rounded-full' : 'bg-red-100 px-2 py-1 rounded-full'}`}>
              {(totalReturnPercentage || 0) >= 0 ? '+' : ''}{(totalReturnPercentage || 0).toFixed(2)}%
            </div>
          </div>
          <div className="text-green-800 font-medium">Total Return</div>
          <div className={`text-green-900 text-2xl font-bold ${totalReturnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalReturnPercentage >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
          </div>
        </div>

        {/* Day's Change */}
        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className={`text-yellow-600 text-xs ${(dayChangePercentage || 0) >= 0 ? 'bg-green-100 px-2 py-1 rounded-full' : 'bg-red-100 px-2 py-1 rounded-full'}`}>
              {(dayChangePercentage || 0) >= 0 ? '+' : ''}{(dayChangePercentage || 0).toFixed(2)}%
            </div>
          </div>
          <div className="text-yellow-800 font-medium">Day's Change</div>
          <div className={`text-yellow-900 text-2xl font-bold ${dayChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {dayChangePercentage >= 0 ? '+' : ''}{formatCurrency(dayChange)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;