import React from 'react';
import { DealerPerformance } from '../types';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Package, 
  Clock, 
  TrendingUp,
  Star,
  Award
} from 'lucide-react';

interface DealerDetailModalProps {
  dealer: DealerPerformance | null;
  isOpen: boolean;
  onClose: () => void;
  scoreBreakdown?: { [key: string]: number };
}

const DealerDetailModal: React.FC<DealerDetailModalProps> = ({ dealer, isOpen, onClose, scoreBreakdown }) => {
  if (!isOpen || !dealer) return null;

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dealer.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                dealer.type === 'main-dealer' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {dealer.type === 'main-dealer' ? 'Ana Bayi' : 'Bayi'}
              </span>
              <span className="text-gray-600">{dealer.city} • {dealer.region}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-700">Performans Puanı</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(dealer.performanceScore)}`}>
                    {dealer.performanceScore}
                  </p>
                </div>
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              {scoreBreakdown && (
                <div className="mt-3 text-xs text-gray-700 space-y-1">
                  {Object.entries(scoreBreakdown).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="capitalize">
                        {k === 'onTimeDeliveryRate' ? 'Zamanında Teslimat' :
                         k === 'averageDeliveryTime' ? 'Teslimat Süresi' :
                         k === 'customerSatisfaction' ? 'Müşteri Memnuniyeti' :
                         k === 'monthlyRevenue' ? 'Aylık Gelir' :
                         k === 'completionRate' ? 'Tamamlama Oranı' : k}
                      </span>
                      <span className="font-medium">{v.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Toplam Sipariş</p>
                  <p className="text-2xl font-bold text-blue-900">{dealer.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Tamamlanan</p>
                  <p className="text-2xl font-bold text-green-900">{dealer.completedOrders}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Aylık Gelir</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {(dealer.monthlyRevenue / 1000).toFixed(0)}K ₺
                  </p>
                </div>
                <span className="text-2xl">₺</span>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Metrics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Performans Metrikleri</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Ortalama Teslimat Süresi</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{dealer.averageDeliveryTime} gün</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Zamanında Teslimat Oranı</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{dealer.onTimeDeliveryRate}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Müşteri Memnuniyeti</span>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {dealer.customerSatisfaction.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <p className="text-gray-600">{dealer.contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">E-posta</p>
                    <p className="text-gray-600">{dealer.contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Adres</p>
                    <p className="text-gray-600">{dealer.contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Son Sipariş</p>
                    <p className="text-gray-600">
                      {new Date(dealer.lastOrderDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
            <div className="space-y-3">
              {dealer.recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{order.id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Tamamlandı' :
                       order.status === 'in-progress' ? 'İşlemde' : 'Bekliyor'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Müşteri:</span> {order.customerName}
                    </div>
                    <div>
                      <span className="font-medium">Tarih:</span> {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                    </div>
                    <div>
                      <span className="font-medium">Ürün Sayısı:</span> {order.totalItems}
                    </div>
                    <div>
                      <span className="font-medium">Durum:</span> {order.currentStage.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDetailModal;