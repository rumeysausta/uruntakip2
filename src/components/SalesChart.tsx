import React, { useState } from 'react';
import { SalesData } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SalesChartProps {
  data: SalesData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'sales' | 'revenue' | 'orders'>('revenue');

  const maxValue = Math.max(...data.map(d => d[activeMetric]));
  const minValue = Math.min(...data.map(d => d[activeMetric]));
  const trend = ((data[data.length - 1][activeMetric] - data[0][activeMetric]) / data[0][activeMetric]) * 100;

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'sales': return 'Satış Adedi';
      case 'revenue': return 'Gelir (₺)';
      case 'orders': return 'Sipariş Adedi';
      default: return '';
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric === 'revenue') {
      return `${(value / 1000).toFixed(0)}K ₺`;
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {(['revenue', 'sales', 'orders'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeMetric === metric
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {getMetricLabel(metric)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{formatValue(maxValue, activeMetric)}</span>
          <span>{formatValue((maxValue + minValue) / 2, activeMetric)}</span>
          <span>{formatValue(minValue, activeMetric)}</span>
        </div>
        
        <div className="ml-16 h-full flex items-end justify-between space-x-1">
          {data.map((item, index) => {
            const height = ((item[activeMetric] - minValue) / (maxValue - minValue)) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-700 hover:to-blue-500 relative"
                  style={{ height: `${Math.max(height, 2)}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatValue(item[activeMetric], activeMetric)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Ortalama</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatValue(data.reduce((sum, item) => sum + item[activeMetric], 0) / data.length, activeMetric)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">En Yüksek</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatValue(maxValue, activeMetric)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Toplam</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatValue(data.reduce((sum, item) => sum + item[activeMetric], 0), activeMetric)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;