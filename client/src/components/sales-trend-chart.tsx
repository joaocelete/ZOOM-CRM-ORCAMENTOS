import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Deal } from "@shared/schema";
import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SalesTrendChartProps {
  deals: Deal[];
}

export function SalesTrendChart({ deals }: SalesTrendChartProps) {
  const wonDeals = deals.filter(d => d.status === "won");

  const months: Date[] = [];
  for (let i = 5; i >= 0; i--) {
    months.push(startOfMonth(subMonths(new Date(), i)));
  }

  const data = months.map(month => {
    const monthStart = month;
    const monthEnd = startOfMonth(subMonths(month, -1));
    
    const monthDeals = wonDeals.filter(d => {
      const dateStr = d.updatedAt || d.createdAt;
      if (!dateStr) return false;
      const dealDate = new Date(dateStr);
      if (isNaN(dealDate.getTime())) return false;
      return dealDate >= monthStart && dealDate < monthEnd;
    });

    const totalValue = monthDeals.reduce((sum, d) => sum + Number(d.value ?? 0), 0);

    return {
      month: format(month, "MMM/yy", { locale: ptBR }),
      deals: monthDeals.length,
      value: totalValue,
    };
  });

  const hasData = data.some(d => d.deals > 0 || d.value > 0);

  return (
    <Card data-testid="card-sales-trend">
      <CardHeader>
        <CardTitle className="text-lg">Tendência de Vendas (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "value") {
                    return [`R$ ${value.toFixed(2)}`, "Valor"];
                  }
                  return [value, "Negócios"];
                }}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="value" 
                stroke="#FFD200" 
                strokeWidth={2}
                name="Valor"
                dot={{ fill: "#FFD200" }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="deals" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Negócios"
                dot={{ fill: "#22c55e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nenhum negócio ganho nos últimos 6 meses
          </div>
        )}
      </CardContent>
    </Card>
  );
}
