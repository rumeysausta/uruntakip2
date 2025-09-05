// Mobilya sektörüne özel tip tanımlamaları
export interface FurnitureProductStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed' | 'quality-check';
  startDate?: string;
  completedDate?: string;
  estimatedDuration: number; // saat cinsinden
  actualDuration?: number;
  location: string;
  responsibleParty: string;
  department: 'design' | 'production' | 'quality' | 'logistics' | 'assembly';
  notes?: string;
  qualityScore?: number; // 1-10 arası
  dependencies?: string[]; // bağımlı olduğu aşama ID'leri
}

export interface FurnitureComponent {
  id: string;
  name: string;
  type: 'wood' | 'metal' | 'fabric' | 'glass' | 'hardware' | 'foam' | 'other';
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'mm';
  };
  quantity: number;
  supplier: string;
  cost: number;
  leadTime: number; // gün cinsinden
  qualityGrade: 'A' | 'B' | 'C';
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'ordered';
  currentStage: FurnitureProductStage;
  stages: FurnitureProductStage[];
}

export interface FurnitureProduct {
  id: string;
  name: string;
  category: 'living-room' | 'bedroom' | 'dining-room' | 'office' | 'kitchen' | 'bathroom' | 'outdoor';
  subcategory: string; // Koltuk Takımı, Yatak Odası Takımı, vs.
  sku: string;
  quantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  delayedQuantity: number;
  
  // Mobilya özel alanları
  components: FurnitureComponent[];
  assemblyRequired: boolean;
  customization: {
    isCustom: boolean;
    fabricColor?: string;
    woodType?: string;
    dimensions?: {
      width: number;
      height: number;
      depth: number;
    };
    specialRequests?: string[];
  };
  
  // Üretim takibi
  productionStages: FurnitureProductStage[];
  currentStage: FurnitureProductStage;
  
  // Kalite kontrolü
  qualityChecks: {
    id: string;
    stage: string;
    checkDate: string;
    inspector: string;
    score: number;
    issues: string[];
    approved: boolean;
  }[];
  
  // Teslimat bilgileri
  packaging: {
    type: 'standard' | 'special' | 'white-glove';
    dimensions: { width: number; height: number; depth: number; weight: number };
    fragile: boolean;
    assemblyInstructions: boolean;
  };
  
  estimatedDelivery: string;
  actualDelivery?: string;
  deliveryNotes?: string;
}

export interface FurnitureOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    floor?: number;
    apartment?: string;
    specialInstructions?: string;
  };
  
  orderDate: string;
  requestedDeliveryDate?: string;
  
  products: FurnitureProduct[];
  
  // Sipariş durumu
  status: 'received' | 'confirmed' | 'in-production' | 'quality-check' | 'ready-for-delivery' | 'in-transit' | 'delivered' | 'cancelled';
  
  // Özel gereksinimler
  specialRequirements: {
    elevatorAccess: boolean;
    stairAccess: boolean;
    assemblyService: boolean;
    installationService: boolean;
    oldFurnitureRemoval: boolean;
  };
  
  // Finansal bilgiler
  pricing: {
    subtotal: number;
    deliveryFee: number;
    assemblyFee: number;
    installationFee: number;
    total: number;
    paymentStatus: 'pending' | 'partial' | 'paid';
    paymentMethod: 'cash' | 'card' | 'installment' | 'bank-transfer';
  };
  
  // Takip bilgileri
  dealer: string;
  mainDealer: string;
  salesPerson: string;
  productionManager?: string;
  deliveryTeam?: string;
  
  // İletişim geçmişi
  communications: {
    id: string;
    date: string;
    type: 'call' | 'email' | 'sms' | 'whatsapp';
    direction: 'incoming' | 'outgoing';
    content: string;
    staff: string;
  }[];
  
  // Notlar ve özel durumlar
  notes: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Müşteri memnuniyeti
  feedback?: {
    rating: number; // 1-5
    comments: string;
    date: string;
    wouldRecommend: boolean;
  };
}

// Mobilya üretim aşamaları şablonları
export const FURNITURE_PRODUCTION_STAGES = {
  'living-room': {
    'koltuk-takimi': [
      { name: 'Tasarım Onayı', department: 'design', estimatedDuration: 2 },
      { name: 'Malzeme Temini', department: 'production', estimatedDuration: 24 },
      { name: 'Ahşap İşleme', department: 'production', estimatedDuration: 8 },
      { name: 'Döşeme Hazırlığı', department: 'production', estimatedDuration: 4 },
      { name: 'Montaj', department: 'assembly', estimatedDuration: 6 },
      { name: 'Kalite Kontrolü', department: 'quality', estimatedDuration: 2 },
      { name: 'Paketleme', department: 'logistics', estimatedDuration: 1 },
      { name: 'Sevkiyat Hazırlığı', department: 'logistics', estimatedDuration: 1 }
    ]
  },
  'bedroom': {
    'yatak-odasi-takimi': [
      { name: 'Tasarım Onayı', department: 'design', estimatedDuration: 3 },
      { name: 'Malzeme Temini', department: 'production', estimatedDuration: 48 },
      { name: 'Ahşap Kesim', department: 'production', estimatedDuration: 12 },
      { name: 'Yüzey İşleme', department: 'production', estimatedDuration: 16 },
      { name: 'Montaj Hazırlığı', department: 'production', estimatedDuration: 4 },
      { name: 'Kalite Kontrolü', department: 'quality', estimatedDuration: 3 },
      { name: 'Paketleme', department: 'logistics', estimatedDuration: 2 },
      { name: 'Sevkiyat Hazırlığı', department: 'logistics', estimatedDuration: 1 }
    ]
  },
  'dining-room': {
    'yemek-masasi-seti': [
      { name: 'Tasarım Onayı', department: 'design', estimatedDuration: 2 },
      { name: 'Malzeme Temini', department: 'production', estimatedDuration: 36 },
      { name: 'Ahşap İşleme', department: 'production', estimatedDuration: 10 },
      { name: 'Yüzey Kaplama', department: 'production', estimatedDuration: 8 },
      { name: 'Montaj', department: 'assembly', estimatedDuration: 4 },
      { name: 'Kalite Kontrolü', department: 'quality', estimatedDuration: 2 },
      { name: 'Paketleme', department: 'logistics', estimatedDuration: 1 },
      { name: 'Sevkiyat Hazırlığı', department: 'logistics', estimatedDuration: 1 }
    ]
  }
};

// Kalite kontrol kriterleri
export const QUALITY_CRITERIA = {
  structural: {
    name: 'Yapısal Dayanıklılık',
    weight: 30,
    checks: ['Bağlantı noktaları', 'Malzeme kalitesi', 'Stabilite']
  },
  finish: {
    name: 'Yüzey Kalitesi',
    weight: 25,
    checks: ['Boyama/Vernik', 'Pürüzsüzlük', 'Renk uyumu']
  },
  assembly: {
    name: 'Montaj Kalitesi',
    weight: 20,
    checks: ['Parça uyumu', 'Hizalama', 'Sıkılık']
  },
  functionality: {
    name: 'Fonksiyonellik',
    weight: 15,
    checks: ['Hareket parçaları', 'Kapak/Çekmece', 'Mekanizmalar']
  },
  aesthetics: {
    name: 'Estetik',
    weight: 10,
    checks: ['Görsel uyum', 'Temizlik', 'Genel görünüm']
  }
};

// Risk faktörleri
export interface ProductionRisk {
  id: string;
  type: 'material-delay' | 'quality-issue' | 'capacity-shortage' | 'supplier-problem' | 'custom-complexity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1 arası
  impact: number; // gecikme gün sayısı
  description: string;
  mitigation: string;
  assignedTo: string;
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
}
