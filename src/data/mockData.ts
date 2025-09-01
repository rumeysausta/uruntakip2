import { Order, StockItem, SalesData, ProductPerformance, CampaignData, OrderStage } from '../types';
import { DealerPerformance, ReportData } from '../types';

export const createOrderStages = (): OrderStage[] => [
  {
    name: 'Sipariş Alındı',
    status: 'completed',
    date: '2024-01-15 09:00',
    location: 'Web Sitesi',
    responsibleParty: 'Sistem'
  },
  {
    name: 'Bayi İşlemi',
    status: 'completed',
    date: '2024-01-15 10:30',
    location: 'İstanbul Bayi',
    responsibleParty: 'Bayi Personeli'
  },
  {
    name: 'Ana Bayi İşlemi',
    status: 'completed',
    date: '2024-01-15 14:00',
    location: 'İstanbul Ana Bayi',
    responsibleParty: 'Ana Bayi Sorumlusu'
  },
  {
    name: 'Merkez İşlemi',
    status: 'in-progress',
    location: 'Bolu Merkez',
    responsibleParty: 'Üretim Departmanı'
  },
  {
    name: 'Ana Bayiye Dönüş',
    status: 'pending',
    location: 'İstanbul Ana Bayi',
    responsibleParty: 'Ana Bayi Sorumlusu'
  },
  {
    name: 'Bayiye Teslimat',
    status: 'pending',
    location: 'İstanbul Bayi',
    responsibleParty: 'Bayi Personeli'
  },
  {
    name: 'Müşteri Teslimi',
    status: 'pending',
    location: 'Müşteri Adresi',
    responsibleParty: 'Kargo/Kurye'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'BLN-2024-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet.yilmaz@email.com',
    orderDate: '2024-01-15',
    totalItems: 12,
    status: 'in-progress',
    currentStage: createOrderStages()[3],
    dealer: 'İstanbul Avrupa Bayi',
    mainDealer: 'İstanbul Ana Bayi',
    items: [
      {
        id: 'item-1',
        productName: 'Bellona Modern Koltuk Takımı',
        quantity: 1,
        completedQuantity: 0,
        pendingQuantity: 0,
        toBeSuppliedQuantity: 1,
        currentStage: createOrderStages()[3],
        estimatedDelivery: '2024-01-25'
      },
      {
        id: 'item-2',
        productName: 'Yatak Odası Takımı',
        quantity: 1,
        completedQuantity: 1,
        pendingQuantity: 0,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[2],
        estimatedDelivery: '2024-01-20'
      },
      {
        id: 'item-3',
        productName: 'Yemek Masası Takımı',
        quantity: 1,
        completedQuantity: 0,
        pendingQuantity: 1,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[2],
        estimatedDelivery: '2024-01-22'
      }
    ]
  },
  {
    id: 'BLN-2024-002',
    customerName: 'Fatma Demir',
    customerEmail: 'fatma.demir@email.com',
    orderDate: '2024-01-16',
    totalItems: 8,
    status: 'completed',
    currentStage: createOrderStages()[6],
    dealer: 'Ankara Merkez Bayi',
    mainDealer: 'Ankara Ana Bayi',
    items: [
      {
        id: 'item-4',
        productName: 'TV Ünitesi',
        quantity: 1,
        completedQuantity: 1,
        pendingQuantity: 0,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[6],
        estimatedDelivery: '2024-01-18'
      },
      {
        id: 'item-5',
        productName: 'Berjer Koltuk',
        quantity: 2,
        completedQuantity: 2,
        pendingQuantity: 0,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[6],
        estimatedDelivery: '2024-01-18'
      }
    ]
  },
  {
    id: 'BLN-2024-003',
    customerName: 'Mehmet Kaya',
    customerEmail: 'mehmet.kaya@email.com',
    orderDate: '2024-01-17',
    totalItems: 15,
    status: 'pending',
    currentStage: createOrderStages()[1],
    dealer: 'İzmir Konak Bayi',
    mainDealer: 'İzmir Ana Bayi',
    items: [
      {
        id: 'item-6',
        productName: 'Köşe Koltuk Takımı',
        quantity: 1,
        completedQuantity: 0,
        pendingQuantity: 1,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[1],
        estimatedDelivery: '2024-01-28'
      }
    ]
  }
];

export const mockStockItems: StockItem[] = [
  {
    id: 'stock-1',
    name: 'Modern Koltuk Takımı',
    category: 'Oturma Grubu',
    currentStock: 5,
    criticalLevel: 10,
    status: 'critical',
    lastRestocked: '2024-01-10'
  },
  {
    id: 'stock-2',
    name: 'Yatak Odası Takımı',
    category: 'Yatak Odası',
    currentStock: 15,
    criticalLevel: 8,
    status: 'normal',
    lastRestocked: '2024-01-14'
  },
  {
    id: 'stock-3',
    name: 'Yemek Masası Takımı',
    category: 'Yemek Odası',
    currentStock: 8,
    criticalLevel: 12,
    status: 'warning',
    lastRestocked: '2024-01-12'
  },
  {
    id: 'stock-4',
    name: 'TV Ünitesi',
    category: 'Salon',
    currentStock: 25,
    criticalLevel: 15,
    status: 'normal',
    lastRestocked: '2024-01-16'
  },
  {
    id: 'stock-5',
    name: 'Berjer Koltuk',
    category: 'Oturma Grubu',
    currentStock: 3,
    criticalLevel: 8,
    status: 'critical',
    lastRestocked: '2024-01-08'
  }
];

export const mockSalesData: SalesData[] = [
  { date: '2024-01-01', sales: 45, orders: 12, revenue: 125000 },
  { date: '2024-01-02', sales: 52, orders: 15, revenue: 145000 },
  { date: '2024-01-03', sales: 38, orders: 9, revenue: 98000 },
  { date: '2024-01-04', sales: 65, orders: 18, revenue: 178000 },
  { date: '2024-01-05', sales: 48, orders: 13, revenue: 132000 },
  { date: '2024-01-06', sales: 71, orders: 21, revenue: 195000 },
  { date: '2024-01-07', sales: 58, orders: 16, revenue: 162000 },
  { date: '2024-01-08', sales: 43, orders: 11, revenue: 118000 },
  { date: '2024-01-09', sales: 61, orders: 17, revenue: 168000 },
  { date: '2024-01-10', sales: 55, orders: 14, revenue: 152000 },
  { date: '2024-01-11', sales: 67, orders: 19, revenue: 185000 },
  { date: '2024-01-12', sales: 49, orders: 13, revenue: 135000 },
  { date: '2024-01-13', sales: 73, orders: 22, revenue: 201000 },
  { date: '2024-01-14', sales: 56, orders: 15, revenue: 155000 }
];

export const mockProductPerformance: ProductPerformance[] = [
  {
    name: 'Modern Koltuk Takımı',
    sales: 145,
    revenue: 425000,
    growth: 12.5
  },
  {
    name: 'Yatak Odası Takımı',
    sales: 132,
    revenue: 385000,
    growth: 8.3
  },
  {
    name: 'Yemek Masası Takımı',
    sales: 98,
    revenue: 285000,
    growth: -2.1
  },
  {
    name: 'TV Ünitesi',
    sales: 89,
    revenue: 165000,
    growth: 15.8
  },
  {
    name: 'Berjer Koltuk',
    sales: 76,
    revenue: 145000,
    growth: 6.2
  }
];

export const mockCampaignData: CampaignData[] = [
  {
    name: 'Yılbaşı Mega İndirim',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    orders: 156,
    revenue: 485000,
    conversionRate: 8.5,
    status: 'completed'
  },
  {
    name: 'Kış Koleksiyonu',
    startDate: '2024-01-10',
    endDate: '2024-01-31',
    orders: 89,
    revenue: 275000,
    conversionRate: 6.2,
    status: 'active'
  },
  {
    name: 'Sevgililer Günü Özel',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    orders: 0,
    revenue: 0,
    conversionRate: 0,
    status: 'scheduled'
  }
];

export const mockDealerPerformance: DealerPerformance[] = [
  {
    id: 'dealer-001',
    name: 'İstanbul Avrupa Bayi',
    type: 'dealer',
    city: 'İstanbul',
    region: 'Marmara',
    totalOrders: 156,
    completedOrders: 142,
    averageDeliveryTime: 3.2,
    onTimeDeliveryRate: 91.0,
    customerSatisfaction: 4.6,
    monthlyRevenue: 485000,
    performanceScore: 92,
    lastOrderDate: '2024-01-17',
    contactInfo: {
      phone: '+90 212 555 0101',
      email: 'istanbul.avrupa@bellona.com.tr',
      address: 'Beylikdüzü, İstanbul'
    },
    recentOrders: mockOrders.slice(0, 2)
  },
  {
    id: 'main-dealer-001',
    name: 'İstanbul Ana Bayi',
    type: 'main-dealer',
    city: 'İstanbul',
    region: 'Marmara',
    totalOrders: 324,
    completedOrders: 298,
    averageDeliveryTime: 2.8,
    onTimeDeliveryRate: 94.5,
    customerSatisfaction: 4.8,
    monthlyRevenue: 1250000,
    performanceScore: 96,
    lastOrderDate: '2024-01-17',
    contactInfo: {
      phone: '+90 212 555 0001',
      email: 'istanbul.ana@bellona.com.tr',
      address: 'Şişli, İstanbul'
    },
    recentOrders: mockOrders.slice(0, 3)
  },
  {
    id: 'dealer-002',
    name: 'Ankara Merkez Bayi',
    type: 'dealer',
    city: 'Ankara',
    region: 'İç Anadolu',
    totalOrders: 89,
    completedOrders: 78,
    averageDeliveryTime: 4.1,
    onTimeDeliveryRate: 87.6,
    customerSatisfaction: 4.3,
    monthlyRevenue: 285000,
    performanceScore: 85,
    lastOrderDate: '2024-01-16',
    contactInfo: {
      phone: '+90 312 555 0201',
      email: 'ankara.merkez@bellona.com.tr',
      address: 'Çankaya, Ankara'
    },
    recentOrders: mockOrders.slice(1, 2)
  },
  {
    id: 'main-dealer-002',
    name: 'Ankara Ana Bayi',
    type: 'main-dealer',
    city: 'Ankara',
    region: 'İç Anadolu',
    totalOrders: 198,
    completedOrders: 185,
    averageDeliveryTime: 3.5,
    onTimeDeliveryRate: 93.4,
    customerSatisfaction: 4.7,
    monthlyRevenue: 675000,
    performanceScore: 94,
    lastOrderDate: '2024-01-17',
    contactInfo: {
      phone: '+90 312 555 0001',
      email: 'ankara.ana@bellona.com.tr',
      address: 'Kızılay, Ankara'
    },
    recentOrders: mockOrders.slice(1, 3)
  },
  {
    id: 'dealer-003',
    name: 'İzmir Konak Bayi',
    type: 'dealer',
    city: 'İzmir',
    region: 'Ege',
    totalOrders: 67,
    completedOrders: 58,
    averageDeliveryTime: 5.2,
    onTimeDeliveryRate: 82.1,
    customerSatisfaction: 4.1,
    monthlyRevenue: 195000,
    performanceScore: 78,
    lastOrderDate: '2024-01-15',
    contactInfo: {
      phone: '+90 232 555 0301',
      email: 'izmir.konak@bellona.com.tr',
      address: 'Konak, İzmir'
    },
    recentOrders: mockOrders.slice(2, 3)
  }
];

export const mockReports: ReportData[] = [
  {
    id: 'report-001',
    title: 'Ocak 2024 Bayi Performans Raporu',
    type: 'dealer',
    generatedDate: '2024-01-17',
    period: '01.01.2024 - 17.01.2024',
    data: mockDealerPerformance,
    summary: {
      totalOrders: 834,
      totalRevenue: 2890000,
      averageOrderValue: 3465,
      topPerformer: 'İstanbul Ana Bayi'
    }
  },
  {
    id: 'report-002',
    title: 'Haftalık Satış Performans Raporu',
    type: 'sales',
    generatedDate: '2024-01-17',
    period: '10.01.2024 - 17.01.2024',
    data: mockSalesData.slice(-7),
    summary: {
      totalOrders: 119,
      totalRevenue: 1125000,
      averageOrderValue: 9454,
      topPerformer: 'Modern Koltuk Takımı'
    }
  },
  {
    id: 'report-003',
    title: 'Ürün Bazlı Satış Analizi',
    type: 'product',
    generatedDate: '2024-01-17',
    period: '01.01.2024 - 17.01.2024',
    data: mockProductPerformance,
    summary: {
      totalOrders: 540,
      totalRevenue: 1405000,
      averageOrderValue: 2602,
      topPerformer: 'Modern Koltuk Takımı'
    }
  }
];