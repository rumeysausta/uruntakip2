import React from 'react';
import { CampaignData } from '../types';
import { Calendar, TrendingUp, Target } from 'lucide-react';

interface CampaignPerformanceProps {
  data: CampaignData[];
}

const CampaignPerformance: React.FC<CampaignPerformanceProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Tamamlandı';
      case 'scheduled':
        return 'Planlandı';
      default:
        return status;
    }
  };

  const activeCampaigns = data.filter(campaign => campaign.status === 'active');
  const totalActiveRevenue = activeCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const totalActiveOrders = activeCampaigns.reduce((sum, campaign) => sum + campaign.orders, 0);

  return (
    <div className="space-y-6">
      {/* Campaign Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Aktif Kampanyalar</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Toplam Gelir</p>
            <p className="text-xl font-bold text-purple-800">
              {(totalActiveRevenue / 1000).toFixed(0)}K ₺
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Toplam Sipariş</p>
            <p className="text-xl font-bold text-blue-800">{totalActiveOrders}</p>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {data.map((campaign, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{campaign.name}</h4>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(campaign.startDate).toLocaleDateString('tr-TR')} - {' '}
                    {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                {getStatusText(campaign.status)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{campaign.orders}</p>
                <p className="text-xs text-gray-600">Sipariş</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <span className="text-lg">₺</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {(campaign.revenue / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-600">Gelir</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{campaign.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-600">Dönüşüm</p>
              </div>
            </div>

            {campaign.status === 'active' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Kampanya Performansı</span>
                  <span className="text-green-600 font-medium">Hedefin üzerinde</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((campaign.conversionRate / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignPerformance;