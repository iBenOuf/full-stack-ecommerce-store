export interface IReportSummary {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface ISalesTrend {
  _id: string;
  dailySales: number;
  orderCount: number;
}

export interface ITopProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface ICategoryStat {
  name: string;
  revenue: number;
  count: number;
}

export interface IRecentOrder {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface ILowStockProduct {
  _id: string;
  name: string;
  stockQuantity: number;
  price: number;
}

export interface IReportResponse {
  message: string;
  data: {
    summary: IReportSummary;
    salesTrends: ISalesTrend[];
    topProducts: ITopProduct[];
    recentOrders: IRecentOrder[];
    lowStockProducts: ILowStockProduct[];
    categoryDistribution: ICategoryStat[];
  };
}
