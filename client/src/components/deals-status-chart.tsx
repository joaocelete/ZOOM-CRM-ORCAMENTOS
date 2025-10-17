import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Deal } from "@shared/schema";

interface DealsStatusChartProps {
  deals: Deal[];
}

export function DealsStatusChart({ deals }: DealsStatusChartProps) {
  const wonDeals = deals.filter(d => d.status === "won").length;
  const lostDeals = deals.filter(d => d.status === "lost").length;
  const activeDeals = deals.filter(d => d.status === "active").length;

  const data = [
    { name: "Ganhos", value: wonDeals, color: "#22c55e" },
    { name: "Perdidos", value: lostDeals, color: "#ef4444" },
    { name: "Ativos", value: activeDeals, color: "#FFD200" },
  ];

  const total = wonDeals + lostDeals + activeDeals;

  return (
    <Card data-testid="card-deals-status-chart">
      <CardHeader>
        <CardTitle className="text-lg">Status dos Negócios</CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[240px] items-center justify-center text-muted-foreground">
            Nenhum negócio cadastrado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
