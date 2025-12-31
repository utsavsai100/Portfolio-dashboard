// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import SectorCard from "./SectorCard";
import PortfolioTable from "./PortfolioTable";
import PortfolioSummary from "./PortfolioSummary";
import Header from "./Header";
import ChartSection from "./chartSection";

import { fetchBatchQuotes } from "../services/marketApi";
import { portfolioData } from "../data/portfolioData";
import { calculateSectorSummaries } from "../data/portfolioData";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);

      const symbols = portfolioData.map(holding => holding.code);

      console.log('Fetching market data for', symbols.length, 'stocks...');

      const marketData = await fetchBatchQuotes(symbols);

      console.log('Received market data for', marketData.length, 'stocks');

      const enrichedStocks = portfolioData.map(holding => {
        const market = marketData.find(m => m.symbol === holding.code);

        if (!market) {
          console.warn(`No market data found for ${holding.code}`);
        }

        return {
          ...holding,
          ...market,
          cmp: market?.cmp || 0,
          name: market?.name || holding.stockName,
        };
      });

      setStocks(enrichedStocks);
      setLastUpdated(new Date().toISOString());
      setError(null);

      console.log('Portfolio data updated successfully at', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPortfolioData();
    }, 15 * 1000);

    return () => clearInterval(interval);
  }, []);

  const totalInvestment = stocks.reduce(
    (sum, s) => sum + s.buyPrice * s.quantity,
    0
  );

  const totalPresentValue = stocks.reduce(
    (sum, s) => sum + (s.cmp || 0) * s.quantity,
    0
  );

  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalReturnPercentage = totalInvestment
    ? (totalGainLoss / totalInvestment) * 100
    : 0;

  const dayChange = stocks.reduce(
    (sum, s) => sum + (Number(s.change) || 0) * s.quantity,
    0
  );
  const dayChangePercentage = totalPresentValue > 0
    ? (dayChange / totalPresentValue) * 100
    : 0;

  const holdingsCount = stocks.length;
  const inProfit = stocks.filter(s => {
    const gain = ((Number(s.cmp) || 0) * s.quantity) - (s.buyPrice * s.quantity);
    return gain > 0;
  }).length;
  const inLoss = holdingsCount - inProfit;

  const sectorSummaries = stocks.length > 0 ? calculateSectorSummaries(stocks) : [];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading && stocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error && stocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Portfolio</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchPortfolioData}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-[1600px] mx-auto p-4 pt-4 sm:pt-8">
        <Header lastUpdated={lastUpdated} />
        <PortfolioSummary
          totalInvestment={totalInvestment}
          totalPresentValue={totalPresentValue}
          totalGainLoss={totalGainLoss}
          totalReturnPercentage={totalReturnPercentage}
          dayChange={dayChange}
          dayChangePercentage={dayChangePercentage}
          holdingsCount={holdingsCount}
          inProfit={inProfit}
          inLoss={inLoss}
        />

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Sector Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sectorSummaries.map(sector => (
              <SectorCard
                key={sector.sector}
                sector={sector}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <ChartSection portfolio={stocks} />
        </div>

        <PortfolioTable stocks={stocks} formatCurrency={formatCurrency} />



        {loading && stocks.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Updating...</span>
          </div>
        )}

        {!loading && stocks.length > 0 && (
          <button
            onClick={fetchPortfolioData}
            className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
            title="Refresh portfolio data"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
