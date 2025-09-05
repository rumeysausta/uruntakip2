import React, { useMemo, useState } from 'react';
import { Calendar, Filter, TrendingUp, Package, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import OrderFlowVisualization from './OrderFlowVisualization';
import SalesChart from './SalesChart';
import ProductPerformanceChart from './ProductPerformanceChart';
import StockOverview from './StockOverview';
import CampaignPerformance from './CampaignPerformance';
import OrderList from './OrderList';
import DealerTracking from './DealerTracking';
import DealerDetailModal from './DealerDetailModal';
import AdvancedSearch from './AdvancedSearch';
import ReportingSystem from './ReportingSystem';
import ScoringSettings from './ScoringSettings';
import { mockOrders, mockStockItems, mockSalesData, mockProductPerformance, mockCampaignData, mockDealerPerformance, mockReports, defaultScoringCriteria, defaultScoringWeights, starRatingSystem } from '../data/mockData';
import { DealerPerformance, Order } from '../types';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dealers' | 'reports' | 'search' | 'scoring'>('dashboard');
  const [selectedDealer, setSelectedDealer] = useState<DealerPerformance | null>(null);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Order[]>(mockOrders);
  const [scoreWeights, setScoreWeights] = useState({
    onTimeDeliveryRate: 35,
    averageDeliveryTime: 25,
    customerSatisfaction: 20,
    monthlyRevenue: 15,
    completionRate: 5
  });
  const [selectedDealerBreakdown, setSelectedDealerBreakdown] = useState<{
    [k: string]: number;
  } | null>(null);
  
  // Puanlandırma sistemi state'leri
  const [scoringCriteria, setScoringCriteria] = useState(defaultScoringCriteria);
  const [scoringWeights, setScoringWeights] = useState(defaultScoringWeights);

  const totalOrders = mockOrders.length;
  const completedOrders = mockOrders.filter(order => order.status === 'completed').length;
  const inProgressOrders = mockOrders.filter(order => order.status === 'in-progress').length;
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;

  const totalRevenue = mockSalesData.reduce((sum, day) => sum + day.revenue, 0);
  const averageOrderValue = totalRevenue / mockSalesData.reduce((sum, day) => sum + day.orders, 0);

  const criticalStockItems = mockStockItems.filter(item => item.status === 'critical').length;

  const handleSelectDealer = (dealer: DealerPerformance) => {
    setSelectedDealer(dealer);
    const { breakdown } = computeDealerScore(dealer, scoreWeights);
    setSelectedDealerBreakdown(breakdown);
    setIsDealerModalOpen(true);
  };

  const handleSearchResults = (results: Order[]) => {
    setSearchResults(results);
  };

  const handleScoringUpdate = (newCriteria: typeof scoringCriteria, newWeights: typeof scoringWeights) => {
    setScoringCriteria(newCriteria);
    setScoringWeights(newWeights);
  };

  const computeDealerScore = (
    dealer: DealerPerformance,
    weights: typeof scoreWeights
  ) => {
    // Normalize metrics to 0-100
    const completionRate = dealer.totalOrders > 0 ? (dealer.completedOrders / dealer.totalOrders) * 100 : 0;
    const onTime = Math.max(0, Math.min(100, dealer.onTimeDeliveryRate));
    const customerSat = Math.max(0, Math.min(100, (dealer.customerSatisfaction / 5) * 100));
    // Assume 2 days is excellent (100), 10+ days poor (~0)
    const delivery = dealer.averageDeliveryTime;
    const deliveryNormalized = Math.max(0, Math.min(100, ((10 - delivery) / 8) * 100));
    // Revenue normalization against max in dataset
    const maxRevenue = Math.max(...mockDealerPerformance.map(d => d.monthlyRevenue));
    const revenueNormalized = maxRevenue > 0 ? (dealer.monthlyRevenue / maxRevenue) * 100 : 0;

    const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
    const normWeights = {
      onTimeDeliveryRate: weights.onTimeDeliveryRate / sumWeights,
      averageDeliveryTime: weights.averageDeliveryTime / sumWeights,
      customerSatisfaction: weights.customerSatisfaction / sumWeights,
      monthlyRevenue: weights.monthlyRevenue / sumWeights,
      completionRate: weights.completionRate / sumWeights
    };

    const breakdown = {
      onTimeDeliveryRate: onTime * normWeights.onTimeDeliveryRate,
      averageDeliveryTime: deliveryNormalized * normWeights.averageDeliveryTime,
      customerSatisfaction: customerSat * normWeights.customerSatisfaction,
      monthlyRevenue: revenueNormalized * normWeights.monthlyRevenue,
      completionRate: completionRate * normWeights.completionRate
    };

    const score = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { score: Math.round(score), breakdown };
  };

  const recomputedDealers: DealerPerformance[] = useMemo(() => {
    return mockDealerPerformance.map(d => {
      const { score } = computeDealerScore(d, scoreWeights);
      return { ...d, performanceScore: score };
    });
  }, [scoreWeights]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src="/image.png?v=1" alt="Bellona" className="h-10 w-auto object-contain" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-800 to-teal-600 bg-clip-text text-transparent">
                Bellona E-Ticaret Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm border border-gray-300/50 rounded-lg px-4 py-2 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                >
                  <option value="7days">Son 7 Gün</option>
                  <option value="30days">Son 30 Gün</option>
                  <option value="90days">Son 3 Ay</option>
                </select>
              </div>
              <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Filter className="h-4 w-4" />
                <span>Filtrele</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Ana Dashboard', icon: Package },
              { id: 'dealers', label: 'Bayi Takibi', icon: Users },
              { id: 'scoring', label: 'Puanlandırma Ayarları', icon: TrendingUp },
              { id: 'reports', label: 'Raporlar', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg ${
                  activeTab === id
                    ? 'border-gradient-to-r from-teal-500 to-blue-500 text-teal-600 bg-gradient-to-t from-teal-50/50 to-transparent shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Search Module */}
            <div className="mb-8">
              <AdvancedSearch 
                orders={mockOrders}
                onSearchResults={handleSearchResults}
              />
            </div>
            {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center shadow-md">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">Tamamlanan: {completedOrders}</span>
              <span className="text-yellow-600 font-medium ml-2 bg-yellow-50 px-2 py-1 rounded-md">İşlemde: {inProgressOrders}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{(totalRevenue / 1000000).toFixed(1)}M ₺</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg">Ortalama Sipariş: {(averageOrderValue / 1000).toFixed(0)}K ₺</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{mockOrders.length * 15}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-md">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-lg">Bu ay: +12%</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kritik Stok</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{criticalStockItems}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-red-100 to-orange-200 rounded-xl flex items-center justify-center shadow-md">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium bg-red-50 px-3 py-1 rounded-lg animate-pulse">Acil müdahale gerekli</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Order Flow */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Sipariş Akış Takibi</h2>
              <OrderFlowVisualization order={selectedOrder} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Satış Performansı</h2>
              <SalesChart data={mockSalesData} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Ürün Performansı</h2>
              <ProductPerformanceChart data={mockProductPerformance} />
            </div>
          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Siparişler</h2>
              <OrderList 
                orders={mockOrders} 
                selectedOrder={selectedOrder}
                onSelectOrder={setSelectedOrder}
              />
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Stok Durumu</h2>
              <StockOverview items={mockStockItems} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Kampanya Performansı</h2>
              <CampaignPerformance data={mockCampaignData} />
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'dealers' && (
          <DealerTracking 
            dealers={recomputedDealers} 
            criteria={scoringCriteria}
            weights={scoringWeights}
            starSystem={starRatingSystem}
            onSelectDealer={handleSelectDealer}
          />
        )}

        {activeTab === 'search' && (
          <AdvancedSearch 
            orders={mockOrders}
            onSearchResults={handleSearchResults}
          />
        )}

        {activeTab === 'scoring' && (
          <ScoringSettings
            criteria={scoringCriteria}
            weights={scoringWeights}
            onSave={handleScoringUpdate}
            isAuthorized={true}
          />
        )}

        {activeTab === 'reports' && (
          <ReportingSystem reports={mockReports} />
        )}
      </div>

      {/* Dealer Detail Modal */}
      <DealerDetailModal 
        dealer={selectedDealer}
        isOpen={isDealerModalOpen}
        onClose={() => {
          setIsDealerModalOpen(false);
          setSelectedDealer(null);
        }}
        scoreBreakdown={selectedDealerBreakdown || undefined}
      />
    </div>
  );
};

export default Dashboard;