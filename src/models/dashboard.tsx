export interface DashboardProp {
  totalOrders: number;
  ordersByStatus: OrdersByStatus;
  totalRevenue: string;
  totalProfit: number;
  monthlyStatistics: MonthlyStatistics[];
}

interface OrdersByStatus {
  Paid: number
  UnPaid: number,
  Completed: number,
  Canceled: number,
  Deliver: number
}
interface MonthlyStatistics {
  month: number,
  totalOrders: number,
  totalRevenue: number,
  totalProfit: number
}
