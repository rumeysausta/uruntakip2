import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, AlertTriangle, TrendingUp, 
  Users, MapPin, Calendar, Star, AlertCircle, Zap, Settings
} from 'lucide-react';
import { FurnitureOrder, FurnitureProduct, FurnitureProductStage } from '../types/furnitureTypes';
import { FurnitureTrackingEngine } from '../utils/furnitureTrackingEngine';

interface DetailedProductTrackingProps {
  order: FurnitureOrder;
  onUpdateOrder?: (order: FurnitureOrder) => void;
}

const DetailedProductTracking: React.FC<DetailedProductTrackingProps> = ({ order, onUpdateOrder }) => {
  const [selectedProduct, setSelectedProduct] = useState<FurnitureProduct | null>(null);
  const [orderProgress, setOrderProgress] = useState<any>(null);
  const [customerUpdate, setCustomerUpdate] = useState<any>(null);

  useEffect(() => {
    const progress = FurnitureTrackingEngine.calculateOrderProgress(order);
    const update = FurnitureTrackingEngine.generateCustomerUpdate(order);
    setOrderProgress(progress);
    setCustomerUpdate(update);
  }, [order]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'delayed':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'quality-check':
        return <Star className="h-5 w-5 text-yellow-600" />;
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
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'quality-check':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'design':
        return <Settings className="h-4 w-4" />;
      case 'production':
        return <Package className="h-4 w-4" />;
      case 'quality':
        return <Star className="h-4 w-4" />;
      case 'assembly':
        return <Zap className="h-4 w-4" />;
      case 'logistics':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDuration = (hours: number): string => {
    if (hours < 24) return `${hours} saat`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days} gün ${remainingHours} saat` : `${days} gün`;
  };

  return (
    <div className="space-y-6">
      {/* Sipariş Özeti */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sipariş: {order.id}</h2>
            <p className="text-gray-600">Müşteri: {order.customerName}</p>
            <p className="text-sm text-gray-500">Sipariş Tarihi: {new Date(order.orderDate).toLocaleDateString('tr-TR')}</p>
          </div>
          <div className="text-right">
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {order.status === 'in-production' ? 'Üretimde' : 
               order.status === 'quality-check' ? 'Kalite Kontrolü' :
               order.status === 'ready-for-delivery' ? 'Teslimat Hazır' : 'Diğer'}
            </div>
            {orderProgress && (
              <div className="mt-2">
                <div className="text-2xl font-bold text-teal-600">{orderProgress.overallProgress}%</div>
                <div className="text-sm text-gray-600">Tamamlandı</div>
              </div>
            )}
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        {orderProgress && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${orderProgress.overallProgress}%` }}
            ></div>
          </div>
        )}

        {/* Kritik Bilgiler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <div>
              <div className="text-sm text-gray-600">Tahmini Teslimat</div>
              <div className="font-semibold">{orderProgress?.estimatedDelivery ? new Date(orderProgress.estimatedDelivery).toLocaleDateString('tr-TR') : 'Hesaplanıyor...'}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Toplam Ürün</div>
              <div className="font-semibold">{order.products.length} kalem</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Toplam Tutar</div>
              <div className="font-semibold">{order.pricing.total.toLocaleString('tr-TR')} ₺</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk ve Uyarılar */}
      {orderProgress?.totalRisks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Risk Uyarıları</h3>
          </div>
          <div className="space-y-2">
            {orderProgress.totalRisks.slice(0, 3).map((risk: any, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  risk.severity === 'critical' ? 'bg-red-600' :
                  risk.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}></div>
                <div className="text-sm">
                  <div className="font-medium text-red-800">{risk.description}</div>
                  <div className="text-red-600">{risk.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Öneriler */}
      {orderProgress?.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Öneriler</h3>
          </div>
          <ul className="space-y-1">
            {orderProgress.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ürün Detayları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ürün Listesi */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Ürün Kalemleri</h3>
          {order.products.map((product) => {
            const productProgress = orderProgress?.productProgress[product.id];
            return (
              <div 
                key={product.id} 
                className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedProduct?.id === product.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(product.currentStage.status)}
                    <span className="text-sm text-gray-600">{product.quantity} adet</span>
                  </div>
                </div>
                
                {productProgress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">İlerleme</span>
                      <span className="font-medium">{productProgress.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${productProgress.overallProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Tahmini Tamamlanma: {new Date(productProgress.estimatedCompletion).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                )}

                {/* Özelleştirme Bilgileri */}
                {product.customization.isCustom && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <div className="font-medium text-yellow-800">Özel Üretim</div>
                    {product.customization.fabricColor && (
                      <div className="text-yellow-700">Kumaş: {product.customization.fabricColor}</div>
                    )}
                    {product.customization.woodType && (
                      <div className="text-yellow-700">Ahşap: {product.customization.woodType}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Seçili Ürün Detayı */}
        <div className="space-y-4">
          {selectedProduct ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ürün Takibi</h3>
                <span className="text-sm text-gray-500">{selectedProduct.name}</span>
              </div>

              {/* Üretim Aşamaları */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Üretim Aşamaları</h4>
                <div className="space-y-4">
                  {selectedProduct.productionStages.map((stage, index) => {
                    const progress = orderProgress?.productProgress[selectedProduct.id]?.stageProgress[stage.id] || 0;
                    return (
                      <div key={stage.id} className="relative">
                        {/* Bağlantı çizgisi */}
                        {index < selectedProduct.productionStages.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-200"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          {/* Durum ikonu */}
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 bg-white">
                              {getStatusIcon(stage.status)}
                            </div>
                          </div>

                          {/* Aşama bilgileri */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="text-sm font-semibold text-gray-900">{stage.name}</h5>
                              <div className="flex items-center space-x-2">
                                {getDepartmentIcon(stage.department)}
                                <span className="text-xs text-gray-500 capitalize">{stage.department}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-4">
                                <span>{stage.location}</span>
                                <span>•</span>
                                <span>{stage.responsibleParty}</span>
                              </div>
                            </div>

                            {/* İlerleme çubuğu */}
                            {stage.status !== 'pending' && (
                              <div className="mb-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-500">İlerleme</span>
                                  <span className="font-medium">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      stage.status === 'completed' ? 'bg-green-500' :
                                      stage.status === 'in-progress' ? 'bg-blue-500' :
                                      stage.status === 'delayed' ? 'bg-red-500' : 'bg-gray-300'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Zaman bilgileri */}
                            <div className="text-xs text-gray-500 space-y-1">
                              <div className="flex items-center justify-between">
                                <span>Tahmini Süre:</span>
                                <span>{formatDuration(stage.estimatedDuration)}</span>
                              </div>
                              {stage.startDate && (
                                <div className="flex items-center justify-between">
                                  <span>Başlangıç:</span>
                                  <span>{new Date(stage.startDate).toLocaleDateString('tr-TR')}</span>
                                </div>
                              )}
                              {stage.completedDate && (
                                <div className="flex items-center justify-between">
                                  <span>Tamamlanma:</span>
                                  <span>{new Date(stage.completedDate).toLocaleDateString('tr-TR')}</span>
                                </div>
                              )}
                            </div>

                            {/* Durum mesajları */}
                            {stage.status === 'in-progress' && (
                              <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                Şu anda işlem görüyor...
                              </div>
                            )}
                            {stage.status === 'delayed' && (
                              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                Gecikme yaşanıyor
                              </div>
                            )}
                            {stage.notes && (
                              <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                {stage.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kalite Kontrol */}
              {selectedProduct.qualityChecks.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Kalite Kontrol</h4>
                  <div className="space-y-3">
                    {selectedProduct.qualityChecks.map((check) => (
                      <div key={check.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{check.stage}</div>
                          <div className="text-xs text-gray-600">{check.inspector} - {new Date(check.checkDate).toLocaleDateString('tr-TR')}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${check.approved ? 'text-green-600' : 'text-red-600'}`}>
                            {check.score}/10
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            check.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {check.approved ? 'Onaylandı' : 'Reddedildi'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Detayları görmek için bir ürün seçin</p>
            </div>
          )}
        </div>
      </div>

      {/* Müşteri Bilgilendirme */}
      {customerUpdate && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold text-teal-800">Müşteri Bilgilendirme</h3>
          </div>
          <div className="text-sm text-teal-700 space-y-2">
            <p>{customerUpdate.message}</p>
            <div className="flex items-center justify-between">
              <span>Sonraki Aşama: <strong>{customerUpdate.nextMilestone}</strong></span>
              <span>Tahmini Teslimat: <strong>{new Date(customerUpdate.estimatedDelivery).toLocaleDateString('tr-TR')}</strong></span>
            </div>
            {customerUpdate.delayReason && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="text-yellow-800 font-medium">Gecikme Nedeni:</div>
                <div className="text-yellow-700">{customerUpdate.delayReason}</div>
                {customerUpdate.compensationOffer && (
                  <div className="text-green-700 mt-1">{customerUpdate.compensationOffer}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedProductTracking;
