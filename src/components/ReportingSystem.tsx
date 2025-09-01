import React, { useState } from 'react';
import { ReportData } from '../types';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Eye,
  Filter,
  BarChart3
} from 'lucide-react';

interface ReportingSystemProps {
  reports: ReportData[];
}

const ReportingSystem: React.FC<ReportingSystemProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'sales' | 'dealer' | 'product' | 'customer'>('all');

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'dealer':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'product':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'customer':
        return <Users className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'sales':
        return 'Satış Raporu';
      case 'dealer':
        return 'Bayi Raporu';
      case 'product':
        return 'Ürün Raporu';
      case 'customer':
        return 'Müşteri Raporu';
      default:
        return 'Genel Rapor';
    }
  };

  const filteredReports = reports.filter(report => 
    filterType === 'all' || report.type === filterType
  );

  const generateNewReport = (type: string) => {
    // Simulate report generation
    alert(`${getReportTypeLabel(type)} oluşturuluyor...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">Raporlama Sistemi</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Tüm Raporlar</option>
            <option value="sales">Satış Raporları</option>
            <option value="dealer">Bayi Raporları</option>
            <option value="product">Ürün Raporları</option>
            <option value="customer">Müşteri Raporları</option>
          </select>
        </div>
      </div>

      {/* Quick Report Generation */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Rapor Oluştur</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => generateNewReport('sales')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Satış Raporu</span>
          </button>
          
          <button
            onClick={() => generateNewReport('dealer')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Bayi Raporu</span>
          </button>
          
          <button
            onClick={() => generateNewReport('product')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            <Package className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">Ürün Raporu</span>
          </button>
          
          <button
            onClick={() => generateNewReport('customer')}
            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
          >
            <Users className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium">Müşteri Raporu</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            {/* Report Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getReportIcon(report.type)}
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600">{getReportTypeLabel(report.type)}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">
                {report.type.toUpperCase()}
              </span>
            </div>

            {/* Report Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Oluşturulma Tarihi</span>
                <span className="font-medium">
                  {new Date(report.generatedDate).toLocaleDateString('tr-TR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dönem</span>
                <span className="font-medium">{report.period}</span>
              </div>
            </div>

            {/* Report Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Özet</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Toplam Sipariş</p>
                  <p className="text-lg font-bold text-gray-900">{report.summary.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Toplam Gelir</p>
                  <p className="text-lg font-bold text-teal-600">
                    {(report.summary.totalRevenue / 1000).toFixed(0)}K ₺
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Ortalama Sipariş</p>
                  <p className="text-sm font-medium text-gray-700">
                    {(report.summary.averageOrderValue / 1000).toFixed(1)}K ₺
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">En İyi Performans</p>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {report.summary.topPerformer}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedReport(report)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Detayları Görüntüle</span>
              </button>
              
              <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getReportIcon(selectedReport.type)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
                  <p className="text-gray-600">{selectedReport.period}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Toplam Sipariş</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedReport.summary.totalOrders}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-green-900">
                        {(selectedReport.summary.totalRevenue / 1000000).toFixed(1)}M ₺
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Ortalama Sipariş</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {(selectedReport.summary.averageOrderValue / 1000).toFixed(0)}K ₺
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">En İyi Performans</p>
                      <p className="text-lg font-bold text-orange-900 truncate">
                        {selectedReport.summary.topPerformer}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Detailed Data */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Detaylı Veriler</h3>
                
                {selectedReport.type === 'dealer' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bayi Adı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Performans Puanı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Toplam Sipariş
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aylık Gelir
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedReport.data.slice(0, 5).map((dealer: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dealer.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dealer.performanceScore}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dealer.totalOrders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(dealer.monthlyRevenue / 1000).toFixed(0)}K ₺
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport.type === 'product' && (
                  <div className="space-y-4">
                    {selectedReport.data.map((product: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Satış:</span>
                            <span className="font-medium ml-1">{product.sales}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Gelir:</span>
                            <span className="font-medium ml-1">{(product.revenue / 1000).toFixed(0)}K ₺</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Büyüme:</span>
                            <span className={`font-medium ml-1 ${
                              product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingSystem;