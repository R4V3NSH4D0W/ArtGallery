"use client";
import { AreaChart, BarChart } from "@tremor/react";
import { formatCurrency } from "@/lib/utils";

interface ChartProps {
  salesData: Array<{ date: string; sales: number }>;
  productPerformance: Array<{ name: string; sales: number }>;
}

const colors = [
  "blue",
  "teal",
  "amber",
  "rose",
  "indigo",
  "emerald",
  "cyan",
  "lime",
  "pink",
  "violet",
];

export function AnalyticsCharts({ salesData, productPerformance }: ChartProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <AreaChart
          className="h-80"
          data={salesData}
          index="date"
          categories={["sales"]}
          // colors={["cyan"]}
          valueFormatter={formatCurrency}
          yAxisWidth={60}
        />
      </div>

      <div className="col-span-3">
        <BarChart
          className="h-80"
          data={productPerformance}
          index="name"
          categories={["sales"]}
          colors={colors}
          valueFormatter={formatCurrency}
          yAxisWidth={60}
        />
      </div>
    </div>
  );
}
