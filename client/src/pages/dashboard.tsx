import { useQuery } from "@tanstack/react-query";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { WonDealsMetrics } from "@/components/won-deals-metrics";
import { DealsStatusChart } from "@/components/deals-status-chart";
import { DealsValueByStageChart } from "@/components/deals-value-by-stage-chart";
import { SalesTrendChart } from "@/components/sales-trend-chart";
import type { Deal, Client, Budget } from "@shared/schema";

export default function Dashboard() {
  const { data: deals = [], isLoading: dealsLoading, error: dealsError } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: budgets = [], isLoading: budgetsLoading, error: budgetsError } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const isLoading = dealsLoading || clientsLoading || budgetsLoading;
  const hasError = dealsError || clientsError || budgetsError;

  const activeDeals = deals.filter(d => d.status === "active").length;
  const wonDeals = deals.filter(d => d.status === "won");
  const totalDealsCompleted = deals.filter(d => d.status !== "active").length;
  const conversionRate = totalDealsCompleted > 0 
    ? (wonDeals.length / totalDealsCompleted) * 100 
    : 0;

  const monthlyGoal = 200000;
  const monthlyRevenue = wonDeals
    .filter(d => {
      const dateStr = d.updatedAt || d.createdAt;
      if (!dateStr) return false;
      const dealDate = new Date(dateStr);
      if (isNaN(dealDate.getTime())) return false;
      const now = new Date();
      return dealDate.getMonth() === now.getMonth() && 
             dealDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + Number(d.value ?? 0), 0);
  const goalProgress = monthlyRevenue > 0 ? (monthlyRevenue / monthlyGoal) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-muted-foreground">Carregando dashboard...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-destructive font-semibold">Erro ao carregar dados do dashboard</div>
          <div className="text-sm text-muted-foreground">
            Tente recarregar a página ou entre em contato com o suporte
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      <DashboardMetrics
        totalClients={clients.length}
        activeDeals={activeDeals}
        budgetsSent={budgets.length}
        conversionRate={Math.round(conversionRate)}
      />

      <WonDealsMetrics deals={deals} />

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <DealsStatusChart deals={deals} />
        <DealsValueByStageChart deals={deals} />
      </div>

      <SalesTrendChart deals={deals} />

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-4 md:p-6">
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">Resumo do Pipeline</h3>
            <div className="space-y-3">
              {[
                { stage: "Contato", count: deals.filter(d => d.stage === "contact" && d.status === "active").length },
                { stage: "Coleta", count: deals.filter(d => d.stage === "collection" && d.status === "active").length },
                { stage: "Qualificação", count: deals.filter(d => d.stage === "qualification" && d.status === "active").length },
                { stage: "Custo", count: deals.filter(d => d.stage === "costing" && d.status === "active").length },
                { stage: "Enviado", count: deals.filter(d => d.stage === "sent" && d.status === "active").length },
                { stage: "Follow-up", count: deals.filter(d => d.stage === "followup" && d.status === "active").length },
                { stage: "Fechado", count: deals.filter(d => d.stage === "closed" && d.status === "active").length },
                { 
                  stage: "Sem estágio", 
                  count: deals.filter(d => {
                    if (d.status !== "active") return false;
                    return !d.stage || !["contact", "collection", "qualification", "costing", "sent", "followup", "closed"].includes(d.stage);
                  }).length 
                },
              ].filter(item => item.count > 0).map((item) => (
                <div key={item.stage} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.stage}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 md:p-6">
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">Meta Mensal</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Atingido</span>
                <span className="font-medium">
                  R$ {monthlyRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-primary transition-all" 
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Meta</span>
                <span className="font-medium">R$ 200.000,00</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-semibold text-primary">
                    {goalProgress.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
