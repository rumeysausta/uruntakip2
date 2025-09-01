import React, { useState } from 'react';
import { DealerPerformance } from '../types';
import { 
  Star, 
  Clock, 
  TrendingUp, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

interface DealerTrackingProps {
  dealers: DealerPerformance[];
  onSelectDealer: (dealer: DealerPerformance) => void;
}

const DealerTracking: React.FC<DealerTrackingProps> = ({ dealers, onSelectDealer }) => {
  const [sortBy, setSortBy] = useState<'score' | 'revenue' | 'deliveryTime'>('score');
  const [filterType, setFilterType] = useState<'all' | 'dealer' | 'main-dealer'>('all');
  const [query, setQuery] = useState('');

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return <Award className="h-4 w-4" />;
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const sortedDealers = [...dealers]
    .filter(dealer => filterType === 'all' || dealer.type === filterType)
    .filter(dealer => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        dealer.name.toLowerCase().includes(q) ||
        dealer.city.toLowerCase().includes(q) ||
        dealer.region.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.performanceScore - a.performanceScore;
        case 'revenue':
          return b.monthlyRevenue - a.monthlyRevenue;
        case 'deliveryTime':
          return a.averageDeliveryTime - b.averageDeliveryTime;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bayi Performans Takibi</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bayi, şehir veya bölge ara..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent w-56"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Tüm Bayiler</option>
            <option value="dealer">Bayiler</option>
            <option value="main-dealer">Ana Bayiler</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="score">Performans Puanı</option>
            <option value="revenue">Aylık Gelir</option>
            <option value="deliveryTime">Teslimat Süresi</option>
          </select>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Toplam Bayi</p>
              <p className="text-2xl font-bold text-teal-900">{dealers.length}</p>
            </div>
            <Award className="h-8 w-8 text-teal-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Yüksek Performans</p>
              <p className="text-2xl font-bold text-green-900">
                {dealers.filter(d => d.performanceScore >= 90).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Orta Performans</p>
              <p className="text-2xl font-bold text-yellow-900">
                {dealers.filter(d => d.performanceScore >= 80 && d.performanceScore < 90).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Düşük Performans</p>
              <p className="text-2xl font-bold text-red-900">
                {dealers.filter(d => d.performanceScore < 80).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Dealer Columns: left dealers, right main-dealers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bayiler</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedDealers.filter(d => d.type === 'dealer').map((dealer) => (
              <div
                key={dealer.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => onSelectDealer(dealer)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{dealer.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dealer.type === 'main-dealer' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {dealer.type === 'main-dealer' ? 'Ana Bayi' : 'Bayi'}
                      </span>
                      <span className="text-sm text-gray-600">{dealer.city}</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getPerformanceColor(dealer.performanceScore)}`}>
                    {getPerformanceIcon(dealer.performanceScore)}
                    <span className="text-sm font-medium">{dealer.performanceScore}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Toplam Sipariş</span>
                    <span className="font-medium">{dealer.totalOrders}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tamamlanan</span>
                    <span className="font-medium text-green-600">{dealer.completedOrders}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ortalama Teslimat</span>
                    <span className="font-medium">{dealer.averageDeliveryTime} gün</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Zamanında Teslimat</span>
                    <span className="font-medium text-blue-600">{dealer.onTimeDeliveryRate}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Aylık Gelir</span>
                    <span className="font-medium text-teal-600">
                      {(dealer.monthlyRevenue / 1000).toFixed(0)}K ₺
                    </span>
                  </div>
                </div>

                {/* Customer Satisfaction */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(dealer.customerSatisfaction)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">
                        {dealer.customerSatisfaction.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>Detayları Görüntüle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ana Bayiler</h3>
          <div className="space-y-6">
            {sortedDealers.filter(d => d.type === 'main-dealer').map((dealer) => (
              <div
                key={dealer.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => onSelectDealer(dealer)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{dealer.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dealer.type === 'main-dealer' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {dealer.type === 'main-dealer' ? 'Ana Bayi' : 'Bayi'}
                      </span>
                      <span className="text-sm text-gray-600">{dealer.city}</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getPerformanceColor(dealer.performanceScore)}`}>
                    {getPerformanceIcon(dealer.performanceScore)}
                    <span className="text-sm font-medium">{dealer.performanceScore}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Toplam Sipariş</span>
                    <span className="font-medium">{dealer.totalOrders}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tamamlanan</span>
                    <span className="font-medium text-green-600">{dealer.completedOrders}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ortalama Teslimat</span>
                    <span className="font-medium">{dealer.averageDeliveryTime} gün</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Zamanında Teslimat</span>
                    <span className="font-medium text-blue-600">{dealer.onTimeDeliveryRate}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Aylık Gelir</span>
                    <span className="font-medium text-teal-600">
                      {(dealer.monthlyRevenue / 1000).toFixed(0)}K ₺
                    </span>
                  </div>
                </div>

                {/* Customer Satisfaction */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(dealer.customerSatisfaction)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">
                        {dealer.customerSatisfaction.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>Detayları Görüntüle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerTracking;