export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  completedQuantity: number;
  pendingQuantity: number;
  toBeSuppliedQuantity: number;
  currentStage: OrderStage;
  estimatedDelivery: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalItems: number;
  status: 'completed' | 'in-progress' | 'pending';
  items: OrderItem[];
  currentStage: OrderStage;
  dealer: string;
  mainDealer: string;
}

export interface OrderStage {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  date?: string;
  location: string;
  responsibleParty: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  criticalLevel: number;
  status: 'normal' | 'warning' | 'critical';
  lastRestocked: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface CampaignData {
  name: string;
  startDate: string;
  endDate: string;
  orders: number;
  revenue: number;
  conversionRate: number;
  status: 'active' | 'completed' | 'scheduled';
}

export interface DealerPerformance {
  id: string;
  name: string;
  type: 'dealer' | 'main-dealer';
  city: string;
  region: string;
  totalOrders: number;
  completedOrders: number;
  averageDeliveryTime: number; // in days
  onTimeDeliveryRate: number; // percentage
  customerSatisfaction: number; // 1-5 scale
  monthlyRevenue: number;
  performanceScore: number; // calculated score
  starRating: number; // 1-5 stars
  lastOrderDate: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  recentOrders: Order[];
  // New fields for hierarchy
  parentDealerId?: string; // for sub-dealers
  subDealers?: DealerPerformance[]; // for main dealers
  // New scoring fields
  orderApprovalScore: number;
  deliveryScore: number;
  satisfactionScore: number;
  completionScore: number;
}

// New interfaces for scoring system
export interface ScoringCriteria {
  orderApproval: {
    day1: number;
    day2: number;
    day3: number;
    day4: number;
    day5Plus: number;
  };
  delivery: {
    day1to2: number;
    day3to4: number;
    day5to7: number;
    day8to10: number;
    day10Plus: number;
  };
  satisfaction: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
  completion: {
    percent95to100: number;
    percent90to94: number;
    percent85to89: number;
    percent80to84: number;
    percentUnder80: number;
  };
}

export interface ScoringWeights {
  orderApproval: number;
  delivery: number;
  satisfaction: number;
  completion: number;
}

export interface StarRating {
  minScore: number;
  maxScore: number;
  stars: number;
  label: string;
}

export interface SearchFilters {
  orderId?: string;
  customerName?: string;
  productName?: string;
  dealerName?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
}

export interface ReportData {
  id: string;
  title: string;
  type: 'sales' | 'dealer' | 'product' | 'customer';
  generatedDate: string;
  period: string;
  data: any;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topPerformer: string;
  };
}