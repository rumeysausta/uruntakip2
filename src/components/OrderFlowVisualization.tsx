import React from 'react';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderFlowVisualizationProps {
  order: Order;
}

const OrderFlowVisualization: React.FC<OrderFlowVisualizationProps> = ({ order }) => {
  const stages = [
    {
      name: 'Sipariş Alındı',
      status: 'completed',
      date: order.orderDate,
      location: 'Web Sitesi',
      responsibleParty: 'Sistem'
    },
    {
      name: 'Bayi İşlemi',
      status: 'completed',
      date: '2024-01-15 10:30',
      location: order.dealer,
      responsibleParty: 'Bayi Personeli'
    },
    {
      name: 'Ana Bayi İşlemi',
      status: 'completed',
      date: '2024-01-15 14:00',
      location: order.mainDealer,
      responsibleParty: 'Ana Bayi Sorumlusu'
    },
    {
      name: 'Merkez İşlemi',
      status: order.status === 'completed' ? 'completed' : 'in-progress',
      date: order.status === 'completed' ? '2024-01-16 09:00' : undefined,
      location: 'Bolu Merkez',
      responsibleParty: 'Üretim Departmanı'
    },
    {
      name: 'Ana Bayiye Dönüş',
      status: order.status === 'completed' ? 'completed' : 'pending',
      date: order.status === 'completed' ? '2024-01-17 11:00' : undefined,
      location: order.mainDealer,
      responsibleParty: 'Ana Bayi Sorumlusu'
    },
    {
      name: 'Bayiye Teslimat',
      status: order.status === 'completed' ? 'completed' : 'pending',
      date: order.status === 'completed' ? '2024-01-17 15:30' : undefined,
      location: order.dealer,
      responsibleParty: 'Bayi Personeli'
    },
    {
      name: 'Müşteri Teslimi',
      status: order.status === 'completed' ? 'completed' : 'pending',
      date: order.status === 'completed' ? '2024-01-18 10:00' : undefined,
      location: 'Müşteri Adresi',
      responsibleParty: 'Kargo/Kurye'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sipariş: {order.id}</h3>
            <p className="text-sm text-gray-600">Müşteri: {order.customerName}</p>
            <p className="text-sm text-gray-600">Toplam Ürün: {order.totalItems} adet</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
            {order.status === 'completed' ? 'Tamamlandı' : 
             order.status === 'in-progress' ? 'İşlemde' : 'Bekliyor'}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative flex items-start pb-8 last:pb-0">
            {/* Timeline line */}
            {index < stages.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            {/* Status icon */}
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 bg-white">
                {getStatusIcon(stage.status)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">{stage.name}</h4>
                {stage.date && (
                  <span className="text-xs text-gray-500">{stage.date}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{stage.location}</span> - {stage.responsibleParty}
              </p>
              {stage.status === 'in-progress' && (
                <p className="text-xs text-blue-600 mt-1">Şu anda işlem görüyor...</p>
              )}
              {stage.status === 'pending' && (
                <p className="text-xs text-gray-500 mt-1">Önceki aşama tamamlanması bekleniyor</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Ürün Detayları</h4>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{item.productName}</h5>
                <span className="text-sm text-gray-600">Miktar: {item.quantity}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Tamamlanan: {item.completedQuantity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Bekleyen: {item.pendingQuantity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Temin Edilecek: {item.toBeSuppliedQuantity}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Tahmini Teslimat: {item.estimatedDelivery}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderFlowVisualization;