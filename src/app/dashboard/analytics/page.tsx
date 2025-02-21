export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  getTotalUsers,
  getTotalProducts,
  getTotalOrders,
  getTotalRevenue,
  getRecentOrders,
  getSalesData,
  getProductPerformance,
} from "@/app/actions/analytics";
import { AnalyticsCharts } from "../components/analytics-compoent/analytics-charts";
import { AnalyticsTable } from "../components/analytics-compoent/analytics-table";
import {
  orderColumns,
  productColumns,
} from "../components/analytics-compoent/column";
import { StatementDownload } from "../components/analytics-compoent/statement-download";

export default async function AnalyticsPage() {
  const [
    usersData,
    productsData,
    ordersData,
    revenueData,
    recentOrders,
    salesData,
    productPerformance,
  ] = await Promise.all([
    getTotalUsers(),
    getTotalProducts(),
    getTotalOrders(),
    getTotalRevenue(),
    getRecentOrders(),
    getSalesData(),
    getProductPerformance(),
  ]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersData.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(usersData.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsData.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(productsData.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersData.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(ordersData.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(revenueData.amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(revenueData.change)} from last month
              </p>
            </CardContent>
          </Card>
          <StatementDownload />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AnalyticsCharts
              salesData={salesData}
              productPerformance={productPerformance}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summery </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsTable
              title="Product Performance"
              columns={productColumns}
              data={productPerformance}
            />

            <AnalyticsTable
              title="Recent Orders"
              columns={orderColumns}
              data={recentOrders}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
