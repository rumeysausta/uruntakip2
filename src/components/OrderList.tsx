import React from 'react';
import { Order } from '../types';
import { Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  selectedOrder: Order;
  onSelectOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, selectedOrder, onSelectOrder }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'in-progress':
        return 'İşlemde';
      case 'pending':
        return 'Bekliyor';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelectOrder(order)}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
            selectedOrder.id === order.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm truncate">{order.id}</h4>
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate">{order.customerName}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Sipariş Tarihi</span>
              <span className="font-medium">
                {new Date(order.orderDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Toplam Ürün</span>
              <span className="font-medium">{order.totalItems} adet</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Bayi</span>
              <span className="font-medium text-right truncate max-w-24">{order.dealer}</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          {selectedOrder.id === order.id && (
            <div className="mt-3 pt-3 border-t border-blue-200 bg-blue-25">
              <p className="text-xs text-blue-700 font-medium">
                Seçili sipariş - Detayları sol panelde görüntüleniyor
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderList;