import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import type { Deal } from "@shared/schema";

interface WonDealsMetricsProps {
  deals: Deal[];
}

export function WonDealsMetrics({ deals }: WonDealsMetricsProps) {
  const wonDeals = deals.filter(d => d.status === "won");
  const lostDeals = deals.filter(d => d.status === "lost");
  const totalValue = wonDeals.reduce((sum, d) => sum + Number(d.value ?? 0), 0);
  const totalDeals = deals.filter(d => d.status !== "active").length;
  const winRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;

  const metrics = [
    {
      title: "Negócios Ganhos",
      value: wonDeals.length.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      testId: "metric-won-deals",
    },
    {
      title: "Valor Total Ganho",
      value: `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      testId: "metric-won-value",
    },
    {
      title: "Taxa de Conversão",
      value: `${winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      testId: "metric-win-rate",
    },
    {
      title: "Negócios Perdidos",
      value: lostDeals.length.toString(),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
      testId: "metric-lost-deals",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} data-testid={metric.testId}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`${metric.testId}-value`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
