// src/components/SectorCard.js
import React from 'react';
import { sectorColors, sectorGradients } from '../data/sectorColors';

const SectorCard = ({ sector, formatCurrency }) => {
  if (!sector) return null;

  const gainLoss = sector.gainLoss ?? 0;
  const gainLossPercentage = sector.gainLossPercentage ?? 0;

  const isGain = gainLoss >= 0;

  const color = sectorColors[sector.sector] || '#6B7280';
  const gradient = sectorGradients[sector.sector] || 'from-gray-500 to-gray-600';

  const hasValidPercentage = Number.isFinite(gainLossPercentage);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`bg-gradient-to-r ${gradient} p-4 flex justify-between items-center`}>
        <h3 className="text-white font-semibold">{sector.sector}</h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Investment</p>
            <p className="text-gray-900 font-medium">
              {formatCurrency(sector.totalInvestment || 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Present Value</p>
            <p className="text-gray-900 font-medium">
              {formatCurrency(sector.totalPresentValue || 0)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Gain/Loss</p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${isGain ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
            >
              {Number.isFinite(gainLossPercentage)
                ? `${isGain ? '+' : ''}${gainLossPercentage.toFixed(2)}%`
                : 'N/A'}
            </span>
          </div>

          <p className={`mt-1 font-medium ${isGain ? 'text-green-600' : 'text-red-600'}`}>
            {isGain ? '+' : ''}
            {formatCurrency(gainLoss)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectorCard;
