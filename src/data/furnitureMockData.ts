import { FurnitureOrder, FurnitureProduct, FurnitureProductStage } from '../types/furnitureTypes';

// Mobilya sektörüne özel mock data
export const createFurnitureStages = (productType: string): FurnitureProductStage[] => {
  const baseStages = [
    {
      id: 'stage-1',
      name: 'Tasarım Onayı',
      status: 'completed' as const,
      startDate: '2024-01-15T09:00:00Z',
      completedDate: '2024-01-15T11:00:00Z',
      estimatedDuration: 2,
      actualDuration: 2,
      location: 'Tasarım Departmanı',
      responsibleParty: 'Ahmet Kaya',
      department: 'design' as const,
      notes: 'Müşteri onayı alındı',
      qualityScore: 9
    },
    {
      id: 'stage-2',
      name: 'Malzeme Temini',
      status: 'completed' as const,
      startDate: '2024-01-16T08:00:00Z',
      completedDate: '2024-01-17T17:00:00Z',
      estimatedDuration: 24,
      actualDuration: 33,
      location: 'Depo',
      responsibleParty: 'Mehmet Özkan',
      department: 'production' as const,
      notes: 'Özel kumaş tedarikinde gecikme yaşandı'
    },
    {
      id: 'stage-3',
      name: 'Ahşap İşleme',
      status: 'in-progress' as const,
      startDate: '2024-01-18T08:00:00Z',
      estimatedDuration: productType === 'yatak-odasi' ? 12 : 8,
      location: 'Üretim Atölyesi',
      responsibleParty: 'Ali Demir',
      department: 'production' as const,
      notes: 'CNC tezgahında işleniyor'
    },
    {
      id: 'stage-4',
      name: 'Döşeme/Yüzey İşleme',
      status: 'pending' as const,
      estimatedDuration: productType === 'koltuk-takimi' ? 4 : 16,
      location: 'Döşeme Atölyesi',
      responsibleParty: 'Fatma Yılmaz',
      department: 'production' as const,
      dependencies: ['stage-3']
    },
    {
      id: 'stage-5',
      name: 'Montaj',
      status: 'pending' as const,
      estimatedDuration: 6,
      location: 'Montaj Hattı',
      responsibleParty: 'Hasan Çelik',
      department: 'assembly' as const,
      dependencies: ['stage-4']
    },
    {
      id: 'stage-6',
      name: 'Kalite Kontrolü',
      status: 'pending' as const,
      estimatedDuration: 2,
      location: 'Kalite Lab',
      responsibleParty: 'Ayşe Kara',
      department: 'quality' as const,
      dependencies: ['stage-5']
    },
    {
      id: 'stage-7',
      name: 'Paketleme',
      status: 'pending' as const,
      estimatedDuration: 1,
      location: 'Paketleme Alanı',
      responsibleParty: 'Murat Şahin',
      department: 'logistics' as const,
      dependencies: ['stage-6']
    }
  ];

  return baseStages;
};

export const mockFurnitureProducts: FurnitureProduct[] = [
  {
    id: 'prod-001',
    name: 'Modern Koltuk Takımı - Gri',
    category: 'living-room',
    subcategory: 'Koltuk Takımı',
    sku: 'BLN-KT-001-GRI',
    quantity: 1,
    completedQuantity: 0,
    pendingQuantity: 1,
    delayedQuantity: 0,
    
    components: [
      {
        id: 'comp-001',
        name: 'Ana Koltuk İskeleti',
        type: 'wood',
        material: 'Kayın Ağacı',
        dimensions: { width: 200, height: 85, depth: 90, unit: 'cm' },
        quantity: 1,
        supplier: 'Ahşap A.Ş.',
        cost: 1200,
        leadTime: 5,
        qualityGrade: 'A',
        stockStatus: 'in-stock',
        currentStage: createFurnitureStages('koltuk-takimi')[2],
        stages: createFurnitureStages('koltuk-takimi')
      },
      {
        id: 'comp-002',
        name: 'Gri Kumaş Döşeme',
        type: 'fabric',
        material: 'Chenille Kumaş',
        dimensions: { width: 300, height: 150, depth: 0, unit: 'cm' },
        quantity: 8,
        supplier: 'Tekstil Ltd.',
        cost: 800,
        leadTime: 3,
        qualityGrade: 'A',
        stockStatus: 'in-stock',
        currentStage: createFurnitureStages('koltuk-takimi')[1],
        stages: createFurnitureStages('koltuk-takimi')
      }
    ],
    
    assemblyRequired: true,
    customization: {
      isCustom: true,
      fabricColor: 'Gri',
      woodType: 'Kayın',
      specialRequests: ['Ekstra sert oturma', 'Anti-alerjik kumaş']
    },
    
    productionStages: createFurnitureStages('koltuk-takimi'),
    currentStage: createFurnitureStages('koltuk-takimi')[2],
    
    qualityChecks: [
      {
        id: 'qc-001',
        stage: 'Tasarım Onayı',
        checkDate: '2024-01-15T11:00:00Z',
        inspector: 'Ayşe Kara',
        score: 9,
        issues: [],
        approved: true
      }
    ],
    
    packaging: {
      type: 'special',
      dimensions: { width: 210, height: 95, depth: 100, weight: 85 },
      fragile: false,
      assemblyInstructions: true
    },
    
    estimatedDelivery: '2024-01-25',
    deliveryNotes: 'Asansör erişimi gerekli'
  },
  {
    id: 'prod-002',
    name: 'Yemek Masası Seti - Ceviz',
    category: 'dining-room',
    subcategory: 'Yemek Masası Seti',
    sku: 'BLN-YM-002-CEV',
    quantity: 1,
    completedQuantity: 0,
    pendingQuantity: 1,
    delayedQuantity: 0,
    
    components: [
      {
        id: 'comp-003',
        name: 'Masa Tablası',
        type: 'wood',
        material: 'Ceviz Ağacı',
        dimensions: { width: 160, height: 4, depth: 90, unit: 'cm' },
        quantity: 1,
        supplier: 'Ahşap A.Ş.',
        cost: 800,
        leadTime: 7,
        qualityGrade: 'A',
        stockStatus: 'ordered',
        currentStage: createFurnitureStages('yemek-masasi')[1],
        stages: createFurnitureStages('yemek-masasi')
      }
    ],
    
    assemblyRequired: true,
    customization: {
      isCustom: false
    },
    
    productionStages: createFurnitureStages('yemek-masasi'),
    currentStage: createFurnitureStages('yemek-masasi')[1],
    
    qualityChecks: [],
    
    packaging: {
      type: 'standard',
      dimensions: { width: 170, height: 15, depth: 100, weight: 45 },
      fragile: true,
      assemblyInstructions: true
    },
    
    estimatedDelivery: '2024-01-28'
  }
];

export const mockFurnitureOrders: FurnitureOrder[] = [
  {
    id: 'FRN-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet@email.com',
    customerPhone: '+90 532 123 4567',
    deliveryAddress: {
      street: 'Atatürk Cad. No:123 Daire:5',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      floor: 3,
      apartment: '5',
      specialInstructions: 'Asansör var, dar koridor'
    },
    
    orderDate: '2024-01-15',
    requestedDeliveryDate: '2024-01-25',
    
    products: [mockFurnitureProducts[0]],
    
    status: 'in-production',
    
    specialRequirements: {
      elevatorAccess: true,
      stairAccess: false,
      assemblyService: true,
      installationService: false,
      oldFurnitureRemoval: true
    },
    
    pricing: {
      subtotal: 8500,
      deliveryFee: 200,
      assemblyFee: 300,
      installationFee: 0,
      total: 9000,
      paymentStatus: 'partial',
      paymentMethod: 'installment'
    },
    
    dealer: 'İstanbul Avrupa Bayi',
    mainDealer: 'İstanbul Ana Bayi',
    salesPerson: 'Mehmet Özkan',
    productionManager: 'Ali Demir',
    
    communications: [
      {
        id: 'comm-001',
        date: '2024-01-15T10:00:00Z',
        type: 'call',
        direction: 'outgoing',
        content: 'Sipariş onayı alındı, üretim süreci başlatıldı',
        staff: 'Mehmet Özkan'
      },
      {
        id: 'comm-002',
        date: '2024-01-17T14:30:00Z',
        type: 'whatsapp',
        direction: 'outgoing',
        content: 'Malzeme temini tamamlandı, üretim başlıyor',
        staff: 'Ali Demir'
      }
    ],
    
    notes: [
      'Müşteri acil teslimat istiyor',
      'Özel kumaş seçimi yapıldı',
      'Eski koltuk takımı alınacak'
    ],
    
    priority: 'high'
  },
  {
    id: 'FRN-002',
    customerName: 'Fatma Demir',
    customerEmail: 'fatma@email.com',
    customerPhone: '+90 533 987 6543',
    deliveryAddress: {
      street: 'Cumhuriyet Mah. Barış Sok. No:45',
      city: 'Ankara',
      district: 'Çankaya',
      postalCode: '06100'
    },
    
    orderDate: '2024-01-14',
    requestedDeliveryDate: '2024-01-30',
    
    products: [mockFurnitureProducts[1]],
    
    status: 'in-production',
    
    specialRequirements: {
      elevatorAccess: false,
      stairAccess: true,
      assemblyService: true,
      installationService: false,
      oldFurnitureRemoval: false
    },
    
    pricing: {
      subtotal: 4500,
      deliveryFee: 150,
      assemblyFee: 200,
      installationFee: 0,
      total: 4850,
      paymentStatus: 'paid',
      paymentMethod: 'bank-transfer'
    },
    
    dealer: 'Ankara Merkez Bayi',
    mainDealer: 'Ankara Ana Bayi',
    salesPerson: 'Ayşe Kara',
    productionManager: 'Hasan Çelik',
    
    communications: [
      {
        id: 'comm-003',
        date: '2024-01-14T16:00:00Z',
        type: 'email',
        direction: 'outgoing',
        content: 'Sipariş alındı, ödeme onaylandı',
        staff: 'Ayşe Kara'
      }
    ],
    
    notes: [
      'Standart teslimat',
      'Ödeme tamamlandı'
    ],
    
    priority: 'normal'
  }
];

// Kapasite analizi için mock data
export const mockProductionCapacity = {
  departments: {
    design: { capacity: 160, current: 45, efficiency: 0.85 },
    production: { capacity: 320, current: 280, efficiency: 0.92 },
    quality: { capacity: 80, current: 35, efficiency: 0.88 },
    assembly: { capacity: 200, current: 150, efficiency: 0.90 },
    logistics: { capacity: 120, current: 60, efficiency: 0.95 }
  },
  weeklySchedule: {
    '2024-W3': {
      design: 48,
      production: 285,
      quality: 38,
      assembly: 155,
      logistics: 62
    },
    '2024-W4': {
      design: 52,
      production: 295,
      quality: 42,
      assembly: 160,
      logistics: 68
    }
  }
};
