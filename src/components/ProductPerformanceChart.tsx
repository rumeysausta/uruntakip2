import React from 'react';
import { ProductPerformance } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProductPerformanceChartProps {
  data: ProductPerformance[];
}

const ProductPerformanceChart: React.FC<ProductPerformanceChartProps> = ({ data }) => {
  const maxSales = Math.max(...data.map(p => p.sales));
  const maxRevenue = Math.max(...data.map(p => p.revenue));

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="space-y-4">
        {data.map((product, index) => (
          <div key={product.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {product.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${
                    product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Sales Bar */}
              <div className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600">Satış</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(product.sales / maxSales) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-xs text-gray-900 text-right">{product.sales}</div>
              </div>
              
              {/* Revenue Bar */}
              <div className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600">Gelir</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-xs text-gray-900 text-right">
                  {(product.revenue / 1000).toFixed(0)}K ₺
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">En İyi Performans</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">En Çok Satan</p>
            <p className="font-medium text-blue-800">
              {data.sort((a, b) => b.sales - a.sales)[0]?.name}
            </p>
            <p className="text-xs text-gray-500">
              {data.sort((a, b) => b.sales - a.sales)[0]?.sales} adet
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">En Yüksek Gelir</p>
            <p className="font-medium text-green-800">
              {data.sort((a, b) => b.revenue - a.revenue)[0]?.name}
            </p>
            <p className="text-xs text-gray-500">
              {(data.sort((a, b) => b.revenue - a.revenue)[0]?.revenue / 1000).toFixed(0)}K ₺
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPerformanceChart;