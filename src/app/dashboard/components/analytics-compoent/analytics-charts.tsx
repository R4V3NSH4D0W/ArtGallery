"use client";
import { AreaChart, BarChart } from "@tremor/react";
import { formatCurrency } from "@/lib/utils";

interface ChartProps {
  salesData: Array<{ date: string; sales: number }>;
  productPerformance: Array<{
    short_name: string;
    name: string;
    sales: number;
    price: number;
  }>;
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
          valueFormatter={formatCurrency}
          yAxisWidth={60}
        />
      </div>

      <div className="col-span-3">
        <BarChart
          className="h-80"
          data={productPerformance}
          index="short_name"
          categories={["sales"]}
          colors={colors}
          valueFormatter={formatCurrency}
          yAxisWidth={60}
          customTooltip={({ payload }) => {
            if (!payload || payload.length === 0 || !payload[0]?.value)
              return null;

            const dataPoint = payload[0]?.payload;

            return (
              <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md text-sm">
                <p className="font-semibold">{dataPoint.name}</p>
                <p>Sales: {formatCurrency(dataPoint.sales)}</p>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
