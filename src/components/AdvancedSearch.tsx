import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, Package, User, MapPin, X, Clock, Zap } from 'lucide-react';
import { SearchFilters, Order } from '../types';
import { SearchEngine, SearchHistory } from '../utils/searchEngine';

interface AdvancedSearchProps {
  orders: Order[];
  onSearchResults: (results: Order[]) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ orders, onSearchResults }) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [quickSearch, setQuickSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-complete functionality
  useEffect(() => {
    if (quickSearch.length > 1) {
      const newSuggestions = SearchEngine.getAutoCompleteSuggestions(orders, quickSearch, 8);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [quickSearch, orders]);

  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      setSearchResults([]);
      onSearchResults(orders);
      return;
    }

    // Use advanced search engine
    const searchResults = SearchEngine.searchOrders(orders, quickSearch, {
      fuzzyThreshold: 0.5,
      maxResults: 100,
      sortByRelevance: true
    });

    const results = searchResults.map(r => r.order);
    setSearchResults(results);
    onSearchResults(results);
    
    // Add to search history
    SearchHistory.addToHistory(quickSearch);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    // Combine quick search with filters
    const combinedResults = SearchEngine.combineFilters(orders, {
      query: quickSearch,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      dealer: filters.dealerName
    });

    setSearchResults(combinedResults);
    onSearchResults(combinedResults);
    
    if (quickSearch.trim()) {
      SearchHistory.addToHistory(quickSearch);
    }
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
        <div className="flex-1 relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Bayi adı, sipariş ID, müşteri adı veya ürün ara..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
            onFocus={() => quickSearch.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          
          {/* Auto-complete suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuickSearch(suggestion);
                    setShowSuggestions(false);
                    setTimeout(() => handleQuickSearch(), 100);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleQuickSearch}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Hızlı Ara</span>
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtreli Ara</span>
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