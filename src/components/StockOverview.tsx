import React from 'react';
import { StockItem } from '../types';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface StockOverviewProps {
  items: StockItem[];
}

const StockOverview: React.FC<StockOverviewProps> = ({ items }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStockPercentage = (current: number, critical: number) => {
    const percentage = (current / (critical * 2)) * 100; // Assuming max stock is 2x critical level
    return Math.min(percentage, 100);
  };

  const sortedItems = [...items].sort((a, b) => {
    const statusOrder = { critical: 0, warning: 1, normal: 2 };
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
  });

  return (
    <div className="space-y-4">
      {/* Stock Status Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-lg font-bold text-green-800">
            {items.filter(item => item.status === 'normal').length}
          </div>
          <div className="text-xs text-green-600">Normal</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="text-lg font-bold text-yellow-800">
            {items.filter(item => item.status === 'warning').length}
          </div>
          <div className="text-xs text-yellow-600">Uyarı</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="text-lg font-bold text-red-800">
            {items.filter(item => item.status === 'critical').length}
          </div>
          <div className="text-xs text-red-600">Kritik</div>
        </div>
      </div>

      {/* Stock Items */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedItems.map((item) => (
          <div key={item.id} className={`p-3 border rounded-lg ${getStatusColor(item.status)}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                <p className="text-xs text-gray-600">{item.category}</p>
              </div>
              {getStatusIcon(item.status)}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Mevcut Stok</span>
                <span className="font-medium">{item.currentStock} adet</span>
              </div>
              
              {/* Stock Level Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.status === 'normal' ? 'bg-green-500' :
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${getStockPercentage(item.currentStock, item.criticalLevel)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Kritik Seviye: {item.criticalLevel}</span>
                <span>Son Stok: {new Date(item.lastRestocked).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            
            {item.status === 'critical' && (
              <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                ⚠️ Acil stok takviyesi gerekli!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockOverview;