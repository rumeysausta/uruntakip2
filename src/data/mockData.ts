import { Order, StockItem, SalesData, ProductPerformance, CampaignData, OrderStage, DealerPerformance, ScoringCriteria, ScoringWeights, StarRating, ReportData } from '../types';

export const createOrderStages = (): OrderStage[] => [
  {
    name: 'Sipariş Alındı',
    status: 'completed',
    date: '2024-01-15T09:00:00Z',
    location: 'Online',
    responsibleParty: 'Müşteri'
  },
  {
    name: 'Onay Bekleniyor',
    status: 'in-progress',
    date: '2024-01-15T10:00:00Z',
    location: 'Merkez Ofis',
    responsibleParty: 'Satış Ekibi'
  },
  {
    name: 'Üretim Planlandı',
    status: 'pending',
    location: 'Üretim Merkezi',
    responsibleParty: 'Üretim Planlayıcı'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet@email.com',
    orderDate: '2024-01-15',
    totalItems: 3,
    status: 'completed',
    items: [
      {
        id: 'item-001',
        productName: 'Modern Koltuk Takımı',
        quantity: 1,
        completedQuantity: 1,
        pendingQuantity: 0,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[0],
        estimatedDelivery: '2024-01-20'
      }
    ],
    currentStage: createOrderStages()[0],
    dealer: 'İstanbul Avrupa Bayi',
    mainDealer: 'İstanbul Ana Bayi'
  },
  {
    id: 'ORD-002',
    customerName: 'Fatma Demir',
    customerEmail: 'fatma@email.com',
    orderDate: '2024-01-14',
    totalItems: 2,
    status: 'in-progress',
    items: [
      {
        id: 'item-002',
        productName: 'Yemek Masası Seti',
        quantity: 1,
        completedQuantity: 0,
        pendingQuantity: 1,
        toBeSuppliedQuantity: 0,
        currentStage: createOrderStages()[1],
        estimatedDelivery: '2024-01-25'
      }
    ],
    currentStage: createOrderStages()[1],
    dealer: 'Ankara Merkez Bayi',
    mainDealer: 'Ankara Ana Bayi'
  }
];

export const mockStockItems: StockItem[] = [
  {
    id: 'STK-001',
    name: 'Modern Koltuk Takımı',
    category: 'Oturma Grubu',
    currentStock: 15,
    criticalLevel: 5,
    status: 'normal',
    lastRestocked: '2024-01-10'
  },
  {
    id: 'STK-002',
    name: 'Yemek Masası Seti',
    category: 'Yemek Odası',
    currentStock: 3,
    criticalLevel: 5,
    status: 'critical',
    lastRestocked: '2024-01-05'
  }
];

export const mockSalesData: SalesData[] = [
  { date: '2024-01-15', sales: 25, orders: 15, revenue: 125000 },
  { date: '2024-01-14', sales: 30, orders: 18, revenue: 150000 },
  { date: '2024-01-13', sales: 20, orders: 12, revenue: 100000 }
];

export const mockProductPerformance: ProductPerformance[] = [
  { name: 'Modern Koltuk Takımı', sales: 45, revenue: 225000, growth: 12 },
  { name: 'Yemek Masası Seti', sales: 30, revenue: 150000, growth: 8 }
];

export const mockCampaignData: CampaignData[] = [
  {
    name: 'Yeni Yıl İndirimi',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    orders: 150,
    revenue: 750000,
    conversionRate: 15,
    status: 'active'
  }
];

// Ana Bayiler ve Bayiler
export const mockDealerPerformance: DealerPerformance[] = [
  // Ana Bayiler
  {
    id: 'main-1',
    name: 'İstanbul Ana Bayi',
    type: 'main-dealer',
    city: 'İstanbul',
    region: 'Marmara',
    totalOrders: 1500,
    completedOrders: 1420,
    averageDeliveryTime: 2.5,
    onTimeDeliveryRate: 95,
    customerSatisfaction: 4.8,
    monthlyRevenue: 25000000,
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-15',
    contactInfo: {
      phone: '+90 212 555 0101',
      email: 'istanbul@bellona.com',
      address: 'Bağdat Caddesi No:123, Kadıköy/İstanbul'
    },
    recentOrders: mockOrders.slice(0, 2),
    subDealers: [],
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  },
  {
    id: 'main-2',
    name: 'Ankara Ana Bayi',
    type: 'main-dealer',
    city: 'Ankara',
    region: 'İç Anadolu',
    totalOrders: 1200,
    completedOrders: 1150,
    averageDeliveryTime: 3.2,
    onTimeDeliveryRate: 92,
    customerSatisfaction: 4.6,
    monthlyRevenue: 18000000,
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-14',
    contactInfo: {
      phone: '+90 312 555 0202',
      email: 'ankara@bellona.com',
      address: 'Kızılay Meydanı No:45, Çankaya/Ankara'
    },
    recentOrders: mockOrders.slice(0, 2),
    subDealers: [],
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  },
  {
    id: 'main-3',
    name: 'İzmir Ana Bayi',
    type: 'main-dealer',
    city: 'İzmir',
    region: 'Ege',
    totalOrders: 950,
    completedOrders: 880,
    averageDeliveryTime: 2.8,
    onTimeDeliveryRate: 89,
    customerSatisfaction: 4.4,
    monthlyRevenue: 14000000,
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-13',
    contactInfo: {
      phone: '+90 232 555 0303',
      email: 'izmir@bellona.com',
      address: 'Alsancak Mahallesi No:67, Konak/İzmir'
    },
    recentOrders: mockOrders.slice(0, 2),
    subDealers: [],
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  },
  {
    id: 'main-4',
    name: 'Antalya Ana Bayi',
    type: 'main-dealer',
    city: 'Antalya',
    region: 'Akdeniz',
    totalOrders: 800,
    completedOrders: 750,
    averageDeliveryTime: 3.5,
    onTimeDeliveryRate: 87,
    customerSatisfaction: 4.3,
    monthlyRevenue: 12000000,
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-12',
    contactInfo: {
      phone: '+90 242 555 0404',
      email: 'antalya@bellona.com',
      address: 'Muratpaşa Mahallesi No:89, Muratpaşa/Antalya'
    },
    recentOrders: mockOrders.slice(0, 2),
    subDealers: [],
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  },
  {
    id: 'main-5',
    name: 'Bursa Ana Bayi',
    type: 'main-dealer',
    city: 'Bursa',
    region: 'Marmara',
    totalOrders: 750,
    completedOrders: 700,
    averageDeliveryTime: 2.9,
    onTimeDeliveryRate: 90,
    customerSatisfaction: 4.5,
    monthlyRevenue: 11000000,
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-11',
    contactInfo: {
      phone: '+90 224 555 0505',
      email: 'bursa@bellona.com',
      address: 'Nilüfer Mahallesi No:90, Nilüfer/Bursa'
    },
    recentOrders: mockOrders.slice(0, 2),
    subDealers: [],
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  },

  // Bayiler (Ana Bayi 1 altında)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `dealer-istanbul-${i + 1}`,
    name: `İstanbul Bayi ${i + 1}`,
    type: 'dealer' as const,
    city: 'İstanbul',
    region: 'Marmara',
    totalOrders: 80 + Math.floor(Math.random() * 40),
    completedOrders: 70 + Math.floor(Math.random() * 30),
    averageDeliveryTime: 2.0 + Math.random() * 2,
    onTimeDeliveryRate: 85 + Math.floor(Math.random() * 15),
    customerSatisfaction: 4.0 + Math.random() * 1,
    monthlyRevenue: 400000 + Math.floor(Math.random() * 300000),
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-15',
    contactInfo: {
      phone: `+90 216 555 ${(1000 + i).toString().padStart(4, '0')}`,
      email: `istanbul-dealer-${i + 1}@bellona.com`,
      address: `İstanbul Bayi ${i + 1} Adresi, İstanbul`
    },
    recentOrders: mockOrders.slice(0, 1),
    parentDealerId: 'main-1',
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  })),

  // Bayiler (Ana Bayi 2 altında)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `dealer-ankara-${i + 1}`,
    name: `Ankara Bayi ${i + 1}`,
    type: 'dealer' as const,
    city: 'Ankara',
    region: 'İç Anadolu',
    totalOrders: 70 + Math.floor(Math.random() * 30),
    completedOrders: 60 + Math.floor(Math.random() * 25),
    averageDeliveryTime: 2.5 + Math.random() * 2.5,
    onTimeDeliveryRate: 80 + Math.floor(Math.random() * 20),
    customerSatisfaction: 3.8 + Math.random() * 1.2,
    monthlyRevenue: 350000 + Math.floor(Math.random() * 250000),
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-14',
    contactInfo: {
      phone: `+90 312 555 ${(2000 + i).toString().padStart(4, '0')}`,
      email: `ankara-dealer-${i + 1}@bellona.com`,
      address: `Ankara Bayi ${i + 1} Adresi, Ankara`
    },
    recentOrders: mockOrders.slice(0, 1),
    parentDealerId: 'main-2',
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  })),

  // Bayiler (Ana Bayi 3 altında)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `dealer-izmir-${i + 1}`,
    name: `İzmir Bayi ${i + 1}`,
    type: 'dealer' as const,
    city: 'İzmir',
    region: 'Ege',
    totalOrders: 60 + Math.floor(Math.random() * 25),
    completedOrders: 50 + Math.floor(Math.random() * 20),
    averageDeliveryTime: 2.2 + Math.random() * 2.2,
    onTimeDeliveryRate: 82 + Math.floor(Math.random() * 18),
    customerSatisfaction: 3.9 + Math.random() * 1.1,
    monthlyRevenue: 300000 + Math.floor(Math.random() * 200000),
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-13',
    contactInfo: {
      phone: `+90 232 555 ${(3000 + i).toString().padStart(4, '0')}`,
      email: `izmir-dealer-${i + 1}@bellona.com`,
      address: `İzmir Bayi ${i + 1} Adresi, İzmir`
    },
    recentOrders: mockOrders.slice(0, 1),
    parentDealerId: 'main-3',
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  })),

  // Bayiler (Ana Bayi 4 altında)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `dealer-antalya-${i + 1}`,
    name: `Antalya Bayi ${i + 1}`,
    type: 'dealer' as const,
    city: 'Antalya',
    region: 'Akdeniz',
    totalOrders: 50 + Math.floor(Math.random() * 20),
    completedOrders: 45 + Math.floor(Math.random() * 15),
    averageDeliveryTime: 3.0 + Math.random() * 2.0,
    onTimeDeliveryRate: 78 + Math.floor(Math.random() * 22),
    customerSatisfaction: 3.7 + Math.random() * 1.3,
    monthlyRevenue: 250000 + Math.floor(Math.random() * 150000),
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-12',
    contactInfo: {
      phone: `+90 242 555 ${(4000 + i).toString().padStart(4, '0')}`,
      email: `antalya-dealer-${i + 1}@bellona.com`,
      address: `Antalya Bayi ${i + 1} Adresi, Antalya`
    },
    recentOrders: mockOrders.slice(0, 1),
    parentDealerId: 'main-4',
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  })),

  // Bayiler (Ana Bayi 5 altında)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `dealer-bursa-${i + 1}`,
    name: `Bursa Bayi ${i + 1}`,
    type: 'dealer' as const,
    city: 'Bursa',
    region: 'Marmara',
    totalOrders: 48 + Math.floor(Math.random() * 17),
    completedOrders: 43 + Math.floor(Math.random() * 13),
    averageDeliveryTime: 2.6 + Math.random() * 2.0,
    onTimeDeliveryRate: 81 + Math.floor(Math.random() * 19),
    customerSatisfaction: 3.9 + Math.random() * 1.1,
    monthlyRevenue: 220000 + Math.floor(Math.random() * 130000),
    performanceScore: 0,
    starRating: 0,
    lastOrderDate: '2024-01-11',
    contactInfo: {
      phone: `+90 224 555 ${(5000 + i).toString().padStart(4, '0')}`,
      email: `bursa-dealer-${i + 1}@bellona.com`,
      address: `Bursa Bayi ${i + 1} Adresi, Bursa`
    },
    recentOrders: mockOrders.slice(0, 1),
    parentDealerId: 'main-5',
    orderApprovalScore: 0,
    deliveryScore: 0,
    satisfactionScore: 0,
    completionScore: 0
  }))
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

// Puanlandırma kriterleri
export const defaultScoringCriteria: ScoringCriteria = {
  orderApproval: {
    day1: 100,
    day2: 90,
    day3: 80,
    day4: 70,
    day5Plus: 60
  },
  delivery: {
    day1to2: 100,
    day3to4: 85,
    day5to7: 70,
    day8to10: 55,
    day10Plus: 40
  },
  satisfaction: {
    star5: 100,
    star4: 80,
    star3: 60,
    star2: 40,
    star1: 20
  },
  completion: {
    percent95to100: 100,
    percent90to94: 85,
    percent85to89: 70,
    percent80to84: 55,
    percentUnder80: 40
  }
};

export const defaultScoringWeights: ScoringWeights = {
  orderApproval: 25,
  delivery: 30,
  satisfaction: 25,
  completion: 20
};

export const starRatingSystem: StarRating[] = [
  { minScore: 85, maxScore: 100, stars: 5, label: 'Mükemmel' },
  { minScore: 70, maxScore: 84, stars: 4, label: 'İyi' },
  { minScore: 55, maxScore: 69, stars: 3, label: 'Orta' },
  { minScore: 40, maxScore: 54, stars: 2, label: 'Zayıf' },
  { minScore: 0, maxScore: 39, stars: 1, label: 'Kritik' }
];