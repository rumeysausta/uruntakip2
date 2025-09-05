import React, { useState } from 'react';
import { Save, Edit3, X, RotateCcw } from 'lucide-react';
import { ScoringCriteria, ScoringWeights } from '../types';

interface ScoringSettingsProps {
  criteria: ScoringCriteria;
  weights: ScoringWeights;
  onSave: (criteria: ScoringCriteria, weights: ScoringWeights) => void;
  isAuthorized: boolean;
}

const ScoringSettings: React.FC<ScoringSettingsProps> = ({
  criteria,
  weights,
  onSave,
  isAuthorized
}) => {
  const [localCriteria, setLocalCriteria] = useState<ScoringCriteria>(criteria);
  const [localWeights, setLocalWeights] = useState<ScoringWeights>(weights);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(localCriteria, localWeights);
    setIsEditing(false);
  };

  const handleReset = () => {
    setLocalCriteria(criteria);
    setLocalWeights(weights);
    setIsEditing(false);
  };

  const updateCriteria = (section: keyof ScoringCriteria, field: string, value: number) => {
    setLocalCriteria(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateWeight = (field: keyof ScoringWeights, value: number) => {
    setLocalWeights(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalWeight = Object.values(localWeights).reduce((sum, weight) => sum + weight, 0);

  if (!isAuthorized) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <X className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Yetki Gerekli</h3>
            <p className="text-yellow-700">Puanlandırma ayarlarını değiştirmek için yetkiniz bulunmamaktadır.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Puanlandırma Ayarları</h3>
          <p className="text-sm text-gray-600">Bayi performans kriterlerini ve ağırlıklarını yapılandırın</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Kaydet</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>İptal</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Düzenle</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scoring Criteria */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Puanlandırma Kriterleri</h4>
          
          {/* Order Approval */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Sipariş Onay Süresi</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">1. Gün</label>
                <input
                  type="number"
                  value={localCriteria.orderApproval.day1}
                  onChange={(e) => updateCriteria('orderApproval', 'day1', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">2. Gün</label>
                <input
                  type="number"
                  value={localCriteria.orderApproval.day2}
                  onChange={(e) => updateCriteria('orderApproval', 'day2', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">3. Gün</label>
                <input
                  type="number"
                  value={localCriteria.orderApproval.day3}
                  onChange={(e) => updateCriteria('orderApproval', 'day3', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">4. Gün</label>
                <input
                  type="number"
                  value={localCriteria.orderApproval.day4}
                  onChange={(e) => updateCriteria('orderApproval', 'day4', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">5+ Gün</label>
                <input
                  type="number"
                  value={localCriteria.orderApproval.day5Plus}
                  onChange={(e) => updateCriteria('orderApproval', 'day5Plus', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Teslimat Süresi</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">1-2 Gün</label>
                <input
                  type="number"
                  value={localCriteria.delivery.day1to2}
                  onChange={(e) => updateCriteria('delivery', 'day1to2', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">3-4 Gün</label>
                <input
                  type="number"
                  value={localCriteria.delivery.day3to4}
                  onChange={(e) => updateCriteria('delivery', 'day3to4', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">5-7 Gün</label>
                <input
                  type="number"
                  value={localCriteria.delivery.day5to7}
                  onChange={(e) => updateCriteria('delivery', 'day5to7', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">8-10 Gün</label>
                <input
                  type="number"
                  value={localCriteria.delivery.day8to10}
                  onChange={(e) => updateCriteria('delivery', 'day8to10', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">10+ Gün</label>
                <input
                  type="number"
                  value={localCriteria.delivery.day10Plus}
                  onChange={(e) => updateCriteria('delivery', 'day10Plus', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Satisfaction */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Müşteri Memnuniyeti</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">5 Yıldız</label>
                <input
                  type="number"
                  value={localCriteria.satisfaction.star5}
                  onChange={(e) => updateCriteria('satisfaction', 'star5', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">4 Yıldız</label>
                <input
                  type="number"
                  value={localCriteria.satisfaction.star4}
                  onChange={(e) => updateCriteria('satisfaction', 'star4', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">3 Yıldız</label>
                <input
                  type="number"
                  value={localCriteria.satisfaction.star3}
                  onChange={(e) => updateCriteria('satisfaction', 'star3', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">2 Yıldız</label>
                <input
                  type="number"
                  value={localCriteria.satisfaction.star2}
                  onChange={(e) => updateCriteria('satisfaction', 'star2', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">1 Yıldız</label>
                <input
                  type="number"
                  value={localCriteria.satisfaction.star1}
                  onChange={(e) => updateCriteria('satisfaction', 'star1', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Completion */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Sipariş Tamamlama Oranı</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">%95-100</label>
                <input
                  type="number"
                  value={localCriteria.completion.percent95to100}
                  onChange={(e) => updateCriteria('completion', 'percent95to100', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">%90-94</label>
                <input
                  type="number"
                  value={localCriteria.completion.percent90to94}
                  onChange={(e) => updateCriteria('completion', 'percent90to94', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">%85-89</label>
                <input
                  type="number"
                  value={localCriteria.completion.percent85to89}
                  onChange={(e) => updateCriteria('completion', 'percent85to89', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">%80-84</label>
                <input
                  type="number"
                  value={localCriteria.completion.percent80to84}
                  onChange={(e) => updateCriteria('completion', 'percent80to84', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">%80 Altı</label>
                <input
                  type="number"
                  value={localCriteria.completion.percentUnder80}
                  onChange={(e) => updateCriteria('completion', 'percentUnder80', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Weights */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Ağırlık Yüzdeleri</h4>
          
          <div className="space-y-6">
            {/* Order Approval Weight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Sipariş Onay Süresi</label>
                <span className="text-sm font-semibold text-blue-600">{localWeights.orderApproval}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.orderApproval}
                onChange={(e) => updateWeight('orderApproval', Number(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Delivery Weight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Teslimat Süresi</label>
                <span className="text-sm font-semibold text-green-600">{localWeights.delivery}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.delivery}
                onChange={(e) => updateWeight('delivery', Number(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Satisfaction Weight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Müşteri Memnuniyeti</label>
                <span className="text-sm font-semibold text-yellow-600">{localWeights.satisfaction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.satisfaction}
                onChange={(e) => updateWeight('satisfaction', Number(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Completion Weight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Sipariş Tamamlama</label>
                <span className="text-sm font-semibold text-purple-600">{localWeights.completion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localWeights.completion}
                onChange={(e) => updateWeight('completion', Number(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Total Weight Display */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Toplam Ağırlık</span>
                <span className={`text-lg font-bold ${
                  totalWeight === 100 ? 'text-green-600' : 
                  totalWeight > 100 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {totalWeight}%
                </span>
              </div>
              {totalWeight !== 100 && (
                <p className={`text-sm mt-1 ${
                  totalWeight > 100 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {totalWeight > 100 ? 'Ağırlık toplamı 100% olmalıdır' : 'Ağırlık toplamı 100% olmalıdır'}
                </p>
              )}
            </div>

            {/* Star Rating Preview */}
            <div className="pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Yıldız Sistemi Önizleme</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">5 Yıldız (Mükemmel)</span>
                  <span className="font-medium">85-100 puan</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">4 Yıldız (İyi)</span>
                  <span className="font-medium">70-84 puan</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">3 Yıldız (Orta)</span>
                  <span className="font-medium">55-69 puan</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">2 Yıldız (Zayıf)</span>
                  <span className="font-medium">40-54 puan</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">1 Yıldız (Kritik)</span>
                  <span className="font-medium">0-39 puan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringSettings;
