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
import { mockOrders, mockStockItems, mockSalesData, mockProductPerformance, mockCampaignData, mockDealerPerformance, mockReports } from '../data/mockData';
import { DealerPerformance, Order } from '../types';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dealers' | 'reports'>('dashboard');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-600 text-white px-4 py-2 rounded font-bold text-lg">
                BELLONA
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bellona E-Ticaret Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7days">Son 7 Gün</option>
                  <option value="30days">Son 30 Gün</option>
                  <option value="90days">Son 3 Ay</option>
                </select>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filtrele</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Ana Dashboard', icon: Package },
              { id: 'dealers', label: 'Bayi Takibi', icon: Users },
              { id: 'reports', label: 'Raporlar', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">Tamamlanan: {completedOrders}</span>
              <span className="text-yellow-600 font-medium ml-4">İşlemde: {inProgressOrders}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-3xl font-bold text-gray-900">{(totalRevenue / 1000000).toFixed(1)}M ₺</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">Ortalama Sipariş: {(averageOrderValue / 1000).toFixed(0)}K ₺</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                <p className="text-3xl font-bold text-gray-900">{mockOrders.length * 15}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Bu ay: +12%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kritik Stok</p>
                <p className="text-3xl font-bold text-gray-900">{criticalStockItems}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">Acil müdahale gerekli</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Order Flow */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Akış Takibi</h2>
              <OrderFlowVisualization order={selectedOrder} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Satış Performansı</h2>
              <SalesChart data={mockSalesData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Ürün Performansı</h2>
              <ProductPerformanceChart data={mockProductPerformance} />
            </div>
          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Siparişler</h2>
              <OrderList 
                orders={mockOrders} 
                selectedOrder={selectedOrder}
                onSelectOrder={setSelectedOrder}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Stok Durumu</h2>
              <StockOverview items={mockStockItems} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kampanya Performansı</h2>
              <CampaignPerformance data={mockCampaignData} />
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'dealers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bayi Puanlandırma Ağırlıkları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {([
                  { key: 'onTimeDeliveryRate', label: 'Zamanında Teslimat (%)' },
                  { key: 'averageDeliveryTime', label: 'Teslimat Süresi (gün)' },
                  { key: 'customerSatisfaction', label: 'Müşteri Memnuniyeti' },
                  { key: 'monthlyRevenue', label: 'Aylık Gelir' },
                  { key: 'completionRate', label: 'Tamamlama Oranı' }
                ] as const).map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-medium text-gray-900">{scoreWeights[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={scoreWeights[key]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setScoreWeights(prev => ({ ...prev, [key]: val }));
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Ağırlıklar göreceli olarak normalize edilir ve toplamlarının 100 olmasına gerek yoktur.</p>
            </div>
            <DealerTracking 
              dealers={recomputedDealers} 
              onSelectDealer={handleSelectDealer}
            />
          </div>
        )}

        {activeTab === 'search' && (
          <AdvancedSearch 
            orders={mockOrders}
            onSearchResults={handleSearchResults}
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