// src/components/PortfolioTable.js
import React from 'react';
import { sectorColors } from '../data/sectorColors';

const PortfolioTable = ({ stocks, formatCurrency }) => {
  // Calculate total portfolio value (Present Value)
  const totalPortfolioValue = stocks.reduce(
    (sum, stock) => sum + (stock.cmp || 0) * stock.quantity,
    0
  );

  // Group stocks by sector
  const groupedBySector = stocks.reduce((acc, stock) => {
    if (!acc[stock.sector]) {
      acc[stock.sector] = [];
    }
    acc[stock.sector].push(stock);
    return acc;
  }, {});

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (!num) return '-';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="text-gray-900">Stock Holdings</h2>
        <p className="text-sm text-gray-600 mt-1">Detailed view of all equity positions</p>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[1200px]">
          <TableHeader />
          <tbody className="divide-y divide-gray-100">
            {Object.entries(groupedBySector).map(([sector, stocks]) => (
              <SectorGroup
                key={sector}
                sector={sector}
                stocks={stocks}
                totalPortfolioValue={totalPortfolioValue}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader = () => (
  <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0">
    <tr>
      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
        Stock Name
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Qty
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Buy Price
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Investment
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Portfolio %
      </th>
      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
        NSE/BSE Code
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        CMP
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Present Value
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Gain/Loss
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Market Cap
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        P/E (TTM)
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        Revenue (TTM)
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        EBITDA
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        PAT
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        D/E
      </th>
      <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
        BV
      </th>
      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
        Stage-2
      </th>
      <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
        Action
      </th>
    </tr>
  </thead>
);

const SectorGroup = ({ sector, stocks, totalPortfolioValue, formatCurrency, formatNumber }) => {
  const sectorColor = sectorColors[sector] || '#6B7280';

  return (
    <>
      <tr className="bg-gradient-to-r from-gray-50 to-white border-l-4" style={{ borderLeftColor: sectorColor }}>
        <td colSpan={18} className="px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: sectorColor }} />
            <span className="text-sm sm:text-base font-semibold text-gray-800">{sector}</span>
          </div>
        </td>
      </tr>
      {stocks.map((stock, index) => (
        <StockRow
          key={stock.stockName}
          stock={stock}
          index={index}
          totalPortfolioValue={totalPortfolioValue}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
      ))}
    </>
  );
};

const StockRow = ({ stock, index, totalPortfolioValue, formatCurrency, formatNumber }) => {
  const investment = stock.buyPrice * stock.quantity;
  const presentValue = stock.cmp * stock.quantity;
  const gainLoss = presentValue - investment;
  const gainLossPercentage = investment > 0 ? (gainLoss / investment) * 100 : 0;
  const portfolioPercentage = totalPortfolioValue > 0 ? (presentValue / totalPortfolioValue) * 100 : 0;
  const sectorColor = sectorColors[stock.sector] || '#6B7280';
  const isGain = gainLoss >= 0;

  return (
    <tr
      key={stock.stockName}
      className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
        }`}
    >
      <td className="px-4 py-3 text-gray-900">{stock.stockName}</td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.quantity.toLocaleString('en-IN')}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {formatCurrency(stock.buyPrice)}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {formatCurrency(investment)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="bg-gray-200 rounded-full h-1.5 w-16 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(portfolioPercentage * 5, 100)}%`,
                backgroundColor: sectorColor
              }}
            />
          </div>
          <span className="text-gray-700 w-12 text-right">
            {formatNumber(portfolioPercentage)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {stock.code}
        </span>
      </td>
      <td className="px-4 py-3 text-right text-gray-900">
        {formatCurrency(stock.cmp)}
      </td>
      <td className="px-4 py-3 text-right text-gray-900">
        {formatCurrency(presentValue)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className={isGain ? 'text-green-600' : 'text-red-600'}>
          <div>{formatCurrency(gainLoss)}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${isGain ? 'bg-green-50' : 'bg-red-50'
            }`}>
            {isGain ? '+' : ''}
            {formatNumber(gainLossPercentage)}%
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.marketCap ? formatLargeNumber(stock.marketCap) : '-'}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.peRatio ? formatNumber(stock.peRatio) : '-'}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.revenue ? formatLargeNumber(stock.revenue) : '-'}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.ebitda ? formatLargeNumber(stock.ebitda) : '-'}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.pat ? formatLargeNumber(stock.pat) : '-'}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.debtToEquity ?? '-'}
      </td>
      <td className="px-4 py-3 text-right text-gray-700">
        {stock.bookValue ?? '-'}
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs ${stock.stage2 === 'Yes' ? 'bg-green-100 text-green-700' :
          stock.stage2 === 'No' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
          {stock.stage2 || 'NA'}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-red-600 font-medium">
        {stock.salePrice || ''}
      </td>
    </tr>
  );
};

export default PortfolioTable;