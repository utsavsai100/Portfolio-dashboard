// src/components/ChartSection.js
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Line
} from 'recharts';
import { sectorColors } from '../data/sectorColors';

const ChartSection = ({ portfolio }) => {
  // Calculate sector-wise data
  const sectorData = Object.entries(
    portfolio.reduce((acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = {
          sector: stock.sector,
          investment: 0,
          presentValue: 0,
          gainLoss: 0,
        };
      }
      const investment = stock.buyPrice * stock.quantity;
      const presentValue = stock.cmp * stock.quantity;
      acc[stock.sector].investment += investment;
      acc[stock.sector].presentValue += presentValue;
      acc[stock.sector].gainLoss = acc[stock.sector].presentValue - acc[stock.sector].investment;
      return acc;
    }, {})
  ).map(([_, data]) => data);

  // Pie chart data for allocation (using Present Value)
  const allocationData = sectorData.map(s => ({
    name: s.sector,
    value: s.presentValue,
  }));

  // Bar chart data for performance
  const performanceData = sectorData.map(s => ({
    sector: s.sector.replace(' Sector', '').replace(' ', '\n'),
    Investment: s.investment / 100000,
    'Present Value': s.presentValue / 100000,
  }));

  // Simulated portfolio trend data
  const trendData = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 88 },
    { month: 'Mar', value: 86 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 94 },
    { month: 'Jun', value: 96 },
    { month: 'Jul', value: 98 },
    { month: 'Aug', value: 95 },
    { month: 'Sep', value: 99 },
    { month: 'Oct', value: 102 },
    { month: 'Nov', value: 105 },
    { month: 'Dec', value: 108 },
  ];

  const formatCurrency = (value) => {
    return `₹${(Number(value) || 0).toFixed(1)}L`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm text-gray-900">{payload[0].payload.sector || payload[0].payload.month}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 ? formatCurrency(entry.value) : `₹${(Number(entry.value) || 0).toFixed(2)}L`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            ₹{((Number(payload[0].value) || 0) / 100000).toFixed(2)}L
          </p>
          <p className="text-xs text-gray-500">
            {(((Number(payload[0].value) || 0) / (allocationData.reduce((sum, d) => sum + d.value, 0) || 1)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* Portfolio Allocation Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-gray-900 mb-4">Portfolio Allocation</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name.split(' ')[0]} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={sectorColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {allocationData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sectorColors[entry.name] }}
                />
                <span className="text-gray-700">{entry.name.replace(' Sector', '')}</span>
              </div>
              <span className="text-gray-600">
                {(((Number(entry.value) || 0) / (allocationData.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 1)) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Performance Bar Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-gray-900 mb-4">Sector Performance</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="sector"
              tick={{ fontSize: 11, fill: '#666' }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#666' }}
              label={{ value: '₹ in Lakhs', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Investment" fill="#818cf8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Present Value" fill="#34d399" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Portfolio Trend Area Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-gray-900 mb-4">Portfolio Growth Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#666' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#666' }}
              label={{ value: '₹ in Lakhs', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-500">YTD Growth</p>
            <p className="text-green-600">+26.47%</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">12M High</p>
            <p className="text-gray-900">₹108L</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;