import { DashboardMetrics } from "@/components/dashboard-metrics";
import { RecentActivity } from "@/components/recent-activity";

export default function Dashboard() {
  const activities = [
    {
      id: "1",
      type: "budget" as const,
      client: "Clínica Cotia",
      description: "Orçamento de painel em ACM enviado",
      time: "Há 2 horas",
      status: "sent" as const,
    },
    {
      id: "2",
      type: "deal" as const,
      client: "Restaurante Bella",
      description: "Negócio fechado - Fachada completa",
      time: "Há 4 horas",
      status: "approved" as const,
    },
    {
      id: "3",
      type: "call" as const,
      client: "Loja MultiMarcas",
      description: "Ligação de acompanhamento realizada",
      time: "Ontem",
    },
    {
      id: "4",
      type: "followup" as const,
      client: "Padaria Central",
      description: "Follow-up agendado para amanhã",
      time: "Há 2 dias",
      status: "pending" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      <DashboardMetrics
        totalClients={142}
        activeDeals={28}
        budgetsSent={67}
        conversionRate={34}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">Meta Mensal</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Atingido</span>
                <span className="font-medium">R$ 145.000</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-primary" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Meta</span>
                <span className="font-medium">R$ 200.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
