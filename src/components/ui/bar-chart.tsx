
import * as React from "react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 56,
  showLegend = true,
}: BarChartProps) {
  const config = React.useMemo(() => {
    return categories.reduce(
      (acc, category, idx) => ({
        ...acc,
        [category]: {
          label: category,
          color: colors[idx % colors.length],
        },
      }),
      {}
    );
  }, [categories, colors]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            dy={10}
          />
          <YAxis
            width={yAxisWidth}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    {payload.map((item: any, idx: number) => (
                      <div key={`item-${idx}`} className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {item.name}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {valueFormatter ? valueFormatter(item.value) : item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
