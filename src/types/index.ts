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
  lastOrderDate: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  recentOrders: Order[];
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