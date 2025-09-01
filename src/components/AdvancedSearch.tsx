import React, { useState } from 'react';
import { Search, Filter, Calendar, Package, User, MapPin, X } from 'lucide-react';
import { SearchFilters, Order } from '../types';

interface AdvancedSearchProps {
  orders: Order[];
  onSearchResults: (results: Order[]) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ orders, onSearchResults }) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<Order[]>([]);

  const handleSearch = () => {
    let results = [...orders];

    // Apply filters
    if (filters.orderId) {
      results = results.filter(order => 
        order.id.toLowerCase().includes(filters.orderId!.toLowerCase())
      );
    }

    if (filters.customerName) {
      results = results.filter(order => 
        order.customerName.toLowerCase().includes(filters.customerName!.toLowerCase())
      );
    }

    if (filters.productName) {
      results = results.filter(order => 
        order.items.some(item => 
          item.productName.toLowerCase().includes(filters.productName!.toLowerCase())
        )
      );
    }

    if (filters.dealerName) {
      results = results.filter(order => 
        order.dealer.toLowerCase().includes(filters.dealerName!.toLowerCase()) ||
        order.mainDealer.toLowerCase().includes(filters.dealerName!.toLowerCase())
      );
    }

    if (filters.status) {
      results = results.filter(order => order.status === filters.status);
    }

    if (filters.dateFrom) {
      results = results.filter(order => 
        new Date(order.orderDate) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      results = results.filter(order => 
        new Date(order.orderDate) <= new Date(filters.dateTo!)
      );
    }

    setSearchResults(results);
    onSearchResults(results);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchResults([]);
    onSearchResults(orders);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Search className="h-6 w-6 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">Arama</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">
              {activeFiltersCount} filtre aktif
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>{isExpanded ? 'Daralt' : 'Genişlet'}</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Sipariş ID, müşteri adı veya ürün ara..."
            value={filters.orderId || ''}
            onChange={(e) => updateFilter('orderId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Ara
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Müşteri Adı
            </label>
            <input
              type="text"
              placeholder="Müşteri adı..."
              value={filters.customerName || ''}
              onChange={(e) => updateFilter('customerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-1" />
              Ürün Adı
            </label>
            <input
              type="text"
              placeholder="Ürün adı..."
              value={filters.productName || ''}
              onChange={(e) => updateFilter('productName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Bayi Adı
            </label>
            <input
              type="text"
              placeholder="Bayi adı..."
              value={filters.dealerName || ''}
              onChange={(e) => updateFilter('dealerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sipariş Durumu
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="completed">Tamamlandı</option>
              <option value="in-progress">İşlemde</option>
              <option value="pending">Bekliyor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Arama Sonuçları ({searchResults.length} sipariş)
            </h4>
            <button
              onClick={() => {
                setSearchResults([]);
                onSearchResults(orders);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{order.id}</h5>
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
                    <span className="font-medium">Bayi:</span> {order.dealer}
                  </div>
                  <div>
                    <span className="font-medium">Ürün Sayısı:</span> {order.totalItems}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Ürünler:</span> {order.items.map(item => item.productName).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;