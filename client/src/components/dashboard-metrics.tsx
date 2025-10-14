import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, CheckCircle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  testId: string;
}

function MetricCard({ title, value, change, trend, icon, testId }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={testId}>{value}</div>
        {change && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-chart-3" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={trend === "up" ? "text-chart-3" : "text-destructive"}>{change}</span>
            <span>vs mês anterior</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardMetricsProps {
  totalClients: number;
  activeDeals: number;
  budgetsSent: number;
  conversionRate: number;
}

export function DashboardMetrics({ totalClients, activeDeals, budgetsSent, conversionRate }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total de Clientes"
        value={totalClients.toString()}
        change="+12%"
        trend="up"
        icon={<Users className="h-5 w-5 text-primary" />}
        testId="metric-total-clients"
      />
      <MetricCard
        title="Negócios Ativos"
        value={activeDeals.toString()}
        change="+8%"
        trend="up"
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        testId="metric-active-deals"
      />
      <MetricCard
        title="Orçamentos Enviados"
        value={budgetsSent.toString()}
        change="+23%"
        trend="up"
        icon={<FileText className="h-5 w-5 text-primary" />}
        testId="metric-budgets-sent"
      />
      <MetricCard
        title="Taxa de Conversão"
        value={`${conversionRate}%`}
        change="-2%"
        trend="down"
        icon={<CheckCircle className="h-5 w-5 text-primary" />}
        testId="metric-conversion-rate"
      />
    </div>
  );
}
