import React, { useState, useMemo } from 'react';
import { Star, Filter, TrendingUp, Users, Building, ChevronDown, ChevronRight, Search, Crown } from 'lucide-react';
import { DealerPerformance, ScoringCriteria, ScoringWeights, StarRating } from '../types';
import { calculatePerformanceScore, calculateStarRating, getStarRatingLabel, buildDealerHierarchy, filterDealersByStars, sortDealers } from '../utils/scoringSystem';
import DealerDetailModal from './DealerDetailModal';

interface DealerTrackingProps {
  dealers: DealerPerformance[];
  criteria: ScoringCriteria;
  weights: ScoringWeights;
  starSystem: StarRating[];
  onSelectDealer: (dealer: DealerPerformance) => void;
}

const DealerTracking: React.FC<DealerTrackingProps> = ({
  dealers,
  criteria,
  weights,
  starSystem,
  onSelectDealer
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [mainDealerSortBy, setMainDealerSortBy] = useState<'score' | 'revenue' | 'orders' | 'satisfaction'>('score');
  const [subDealerSortBy, setSubDealerSortBy] = useState<'score' | 'revenue' | 'orders' | 'satisfaction'>('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDealers, setExpandedDealers] = useState<Set<string>>(new Set());
  const [selectedDealer, setSelectedDealer] = useState<DealerPerformance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'main-dealers' | 'sub-dealers'>('hierarchy');

  // Calculate scores and build hierarchy
  const processedDealers = useMemo(() => {
    const withScores = dealers.map(dealer => {
      const { totalScore, breakdown } = calculatePerformanceScore(dealer, criteria, weights);
      const starRating = calculateStarRating(totalScore, starSystem);
      
      return {
        ...dealer,
        performanceScore: totalScore,
        starRating,
        ...breakdown
      };
    });

    // Build hierarchy
    const hierarchy = buildDealerHierarchy(withScores);
    
    // Calculate main dealer scores based on sub-dealers
    hierarchy.forEach(mainDealer => {
      if (mainDealer.subDealers && mainDealer.subDealers.length > 0) {
        const avgScore = mainDealer.subDealers.reduce((sum, sub) => sum + sub.performanceScore, 0) / mainDealer.subDealers.length;
        mainDealer.performanceScore = Math.round(avgScore);
        mainDealer.starRating = calculateStarRating(mainDealer.performanceScore, starSystem);
      }
    });

    return hierarchy;
  }, [dealers, criteria, weights, starSystem]);

  // Separate main dealers and sub-dealers
  const mainDealers = useMemo(() => {
    let filtered = processedDealers;
    
    if (selectedStarFilter !== null) {
      filtered = filtered.filter(dealer => dealer.starRating === selectedStarFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(dealer => 
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return sortDealers(filtered, mainDealerSortBy);
  }, [processedDealers, selectedStarFilter, searchTerm, mainDealerSortBy]);

  const allSubDealers = useMemo(() => {
    const subDealers = dealers.filter(d => d.type === 'dealer');
    const withScores = subDealers.map(dealer => {
      const { totalScore, breakdown } = calculatePerformanceScore(dealer, criteria, weights);
      const starRating = calculateStarRating(totalScore, starSystem);
      
      return {
        ...dealer,
        performanceScore: totalScore,
        starRating,
        ...breakdown
      };
    });

    let filtered = withScores;
    
    if (selectedStarFilter !== null) {
      filtered = filtered.filter(dealer => dealer.starRating === selectedStarFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(dealer => 
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return sortDealers(filtered, subDealerSortBy);
  }, [dealers, criteria, weights, starSystem, selectedStarFilter, searchTerm, subDealerSortBy]);

  const toggleExpanded = (dealerId: string) => {
    const newExpanded = new Set(expandedDealers);
    if (newExpanded.has(dealerId)) {
      newExpanded.delete(dealerId);
    } else {
      newExpanded.add(dealerId);
    }
    setExpandedDealers(newExpanded);
  };

  const handleDealerClick = (dealer: DealerPerformance) => {
    setSelectedDealer(dealer);
    setIsModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderMainDealerCard = (dealer: DealerPerformance) => (
    <div
      key={dealer.id}
      className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => handleDealerClick(dealer)}
    >
      <div className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">{dealer.name}</h3>
              <p className="text-blue-700 font-medium">{dealer.city}, {dealer.region}</p>
              <p className="text-sm text-blue-600">Ana Bayi</p>
            </div>
          </div>
          
          {dealer.subDealers && dealer.subDealers.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(dealer.id);
              }}
              className="p-2 hover:bg-blue-200 rounded-full transition-colors"
            >
              {expandedDealers.has(dealer.id) ? (
                <ChevronDown className="h-6 w-6 text-blue-600" />
              ) : (
                <ChevronRight className="h-6 w-6 text-blue-600" />
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 relative z-10">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-medium mb-1">Performans Puanı</p>
            <p className="text-2xl font-bold text-blue-900">{dealer.performanceScore.toFixed(1)}</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-medium mb-1">Yıldız</p>
            <div className="flex items-center justify-center space-x-1 mb-1">
              {renderStars(dealer.starRating)}
            </div>
            <p className="text-xs text-blue-700">
              {getStarRatingLabel(dealer.performanceScore, starSystem)}
            </p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-medium mb-1">Toplam Sipariş</p>
            <p className="text-lg font-bold text-blue-900">{dealer.totalOrders}</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-medium mb-1">Aylık Gelir</p>
            <p className="text-lg font-bold text-blue-900">
              {(dealer.monthlyRevenue / 1000000).toFixed(1)}M ₺
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-medium mb-1">Teslimat Süresi</p>
            <p className="text-sm font-medium text-blue-900">{dealer.averageDeliveryTime.toFixed(1)} gün</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-medium mb-1">Memnuniyet</p>
            <p className="text-sm font-medium text-blue-900">{dealer.customerSatisfaction.toFixed(1)}/5</p>
          </div>
        </div>

        {dealer.subDealers && dealer.subDealers.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium">
              Bayi Sayısı: {dealer.subDealers.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubDealerCard = (dealer: DealerPerformance) => (
    <div
      key={dealer.id}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => handleDealerClick(dealer)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-600 text-white p-1.5 rounded-full">
              <Building className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{dealer.name}</h3>
              <p className="text-sm text-gray-600">{dealer.city}, {dealer.region}</p>
              <p className="text-xs text-gray-500">Bayi</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500">Performans Puanı</p>
            <p className="text-lg font-bold text-gray-900">{dealer.performanceScore}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Yıldız</p>
            <div className="flex items-center space-x-1">
              {renderStars(dealer.starRating)}
              <span className="text-sm text-gray-600 ml-1">
                ({getStarRatingLabel(dealer.performanceScore, starSystem)})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500">Toplam Sipariş</p>
            <p className="text-sm font-medium text-gray-900">{dealer.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Aylık Gelir</p>
            <p className="text-sm font-medium text-gray-900">
              {(dealer.monthlyRevenue / 1000).toFixed(1)}K ₺
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Teslimat Süresi</p>
            <p className="text-sm font-medium text-gray-900">{dealer.averageDeliveryTime.toFixed(1)} gün</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Memnuniyet</p>
            <p className="text-sm font-medium text-gray-900">{dealer.customerSatisfaction.toFixed(1)}/5</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubDealers = (dealer: DealerPerformance) => {
    if (!dealer.subDealers || dealer.subDealers.length === 0) return null;

    return (
      <div className="ml-8 space-y-4 mt-4 border-l-2 border-blue-200 pl-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-3">Bayiler</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dealer.subDealers.map(subDealer => renderSubDealerCard(subDealer))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bayi Performans Takibi</h2>
            <p className="text-sm text-gray-600">Ana bayiler ve bayileri ayrı ayrı takip edin</p>
          </div>
          
          <div className="flex flex-wrap items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'hierarchy', label: 'Hiyerarşi', icon: Building },
                { id: 'main-dealers', label: 'Ana Bayiler', icon: Crown },
                { id: 'sub-dealers', label: 'Bayiler', icon: Users }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Bayi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Star Filter */}
            <select
              value={selectedStarFilter || ''}
              onChange={(e) => setSelectedStarFilter(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Yıldızlar</option>
              {[5, 4, 3, 2, 1].map(stars => (
                <option key={stars} value={stars}>
                  {stars} Yıldız
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Ana Bayi</p>
              <p className="text-lg font-semibold text-gray-900">{mainDealers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Bayi</p>
              <p className="text-lg font-semibold text-gray-900">{allSubDealers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">5 Yıldızlı</p>
              <p className="text-lg font-semibold text-gray-900">
                {mainDealers.filter(d => d.starRating === 5).length + allSubDealers.filter(d => d.starRating === 5).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Ortalama Puan</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round((mainDealers.reduce((sum, d) => sum + d.performanceScore, 0) + 
                            allSubDealers.reduce((sum, d) => sum + d.performanceScore, 0)) / 
                           (mainDealers.length + allSubDealers.length))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-6">
          {/* Main Dealers with Sorting */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ana Bayiler</h3>
              <select
                value={mainDealerSortBy}
                onChange={(e) => setMainDealerSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="score">Puana Göre</option>
                <option value="revenue">Gelire Göre</option>
                <option value="orders">Siparişe Göre</option>
                <option value="satisfaction">Memnuniyete Göre</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {mainDealers.map(dealer => (
                <div key={dealer.id}>
                  {renderMainDealerCard(dealer)}
                  {expandedDealers.has(dealer.id) && renderSubDealers(dealer)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'main-dealers' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ana Bayiler</h3>
            <select
              value={mainDealerSortBy}
              onChange={(e) => setMainDealerSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="score">Puana Göre</option>
              <option value="revenue">Gelire Göre</option>
              <option value="orders">Siparişe Göre</option>
              <option value="satisfaction">Memnuniyete Göre</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mainDealers.map(dealer => renderMainDealerCard(dealer))}
          </div>
        </div>
      )}

      {viewMode === 'sub-dealers' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bayiler</h3>
            <select
              value={subDealerSortBy}
              onChange={(e) => setSubDealerSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="score">Puana Göre</option>
              <option value="revenue">Gelire Göre</option>
              <option value="orders">Siparişe Göre</option>
              <option value="satisfaction">Memnuniyete Göre</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allSubDealers.map(dealer => renderSubDealerCard(dealer))}
          </div>
        </div>
      )}
      
      {mainDealers.length === 0 && allSubDealers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Arama kriterlerinize uygun bayi bulunamadı.</p>
        </div>
      )}

      {/* Dealer Detail Modal */}
      {selectedDealer && (
        <DealerDetailModal
          dealer={selectedDealer}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDealer(null);
          }}
          scoreBreakdown={{
            orderApprovalScore: selectedDealer.orderApprovalScore,
            deliveryScore: selectedDealer.deliveryScore,
            satisfactionScore: selectedDealer.satisfactionScore,
            completionScore: selectedDealer.completionScore
          }}
        />
      )}
    </div>
  );
};

export default DealerTracking;
