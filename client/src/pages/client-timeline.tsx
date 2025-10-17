import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  FileText,
  Package,
  Wrench,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import type { Deal, Client, Budget, Production, Activity } from "@shared/schema";

interface TimelineEvent {
  id: string;
  type: 'deal' | 'budget' | 'production' | 'activity';
  title: string;
  description?: string;
  date: Date;
  icon: any;
  iconColor: string;
  data: any;
}

export default function ClientTimeline() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  // Fetch client
  const { data: client, isLoading: isClientLoading } = useQuery<Client>({
    queryKey: ["/api/clients", id],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${id}`);
      return response.json();
    },
  });

  // Fetch client's deals
  const { data: allDeals = [] } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const clientDeals = allDeals.filter(d => d.clientId === id);

  // Fetch all budgets
  const { data: allBudgets = [] } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const clientBudgets = allBudgets.filter(b => b.clientId === id);

  // Fetch all productions
  const { data: allProductions = [] } = useQuery<Production[]>({
    queryKey: ["/api/production"],
  });

  // Filter productions for this client's deals
  const clientProductions = allProductions.filter(p => 
    clientDeals.some(d => d.id === p.dealId)
  );

  // Fetch activities for client
  const { data: clientActivities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities", "client", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/activities/client/${id}`);
      return response.json();
    },
  });

  // Combine all events into timeline
  const timelineEvents: TimelineEvent[] = [
    ...clientDeals.map(deal => ({
      id: deal.id,
      type: 'deal' as const,
      title: deal.title,
      description: `Negócio ${deal.status === 'won' ? 'ganho' : deal.status === 'lost' ? 'perdido' : 'ativo'} - R$ ${Number(deal.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      date: new Date(deal.createdAt || new Date()),
      icon: TrendingUp,
      iconColor: deal.status === 'won' ? 'text-green-500' : deal.status === 'lost' ? 'text-red-500' : 'text-blue-500',
      data: deal,
    })),
    ...clientBudgets.map(budget => ({
      id: budget.id,
      type: 'budget' as const,
      title: `Orçamento #${budget.id.slice(0, 8)}`,
      description: `Status: ${budget.status} - Total: R$ ${Number(budget.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      date: new Date(budget.createdAt || new Date()),
      icon: FileText,
      iconColor: budget.status === 'approved' ? 'text-green-500' : budget.status === 'rejected' ? 'text-red-500' : 'text-yellow-500',
      data: budget,
    })),
    ...clientProductions.map(prod => ({
      id: prod.id,
      type: 'production' as const,
      title: 'Produção',
      description: `Status: ${prod.status}`,
      date: new Date(prod.createdAt || new Date()),
      icon: Wrench,
      iconColor: prod.status === 'completed' ? 'text-green-500' : 'text-blue-500',
      data: prod,
    })),
    ...clientActivities.map(activity => ({
      id: activity.id,
      type: 'activity' as const,
      title: activity.title,
      description: activity.description ?? undefined,
      date: new Date(activity.createdAt || new Date()),
      icon: activity.type === 'call' ? Phone : activity.type === 'email' ? Mail : MessageSquare,
      iconColor: 'text-gray-500',
      data: activity,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first

  if (isClientLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Cliente não encontrado</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalDeals = clientDeals.length;
  const wonDeals = clientDeals.filter(d => d.status === 'won').length;
  const activeDeals = clientDeals.filter(d => d.status === 'active').length;
  const totalValue = clientDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  const wonValue = clientDeals.filter(d => d.status === 'won').reduce((sum, d) => sum + Number(d.value || 0), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/clientes")}
              data-testid="button-back-to-clients"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold" data-testid="text-client-name">{client.company || client.name}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
            {client.email && (
              <span data-testid="text-client-email">
                <Mail className="h-4 w-4 inline mr-1" />
                {client.email}
              </span>
            )}
            {client.phone && (
              <span data-testid="text-client-phone">
                <Phone className="h-4 w-4 inline mr-1" />
                {client.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card data-testid="card-total-deals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Negócios</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-won-deals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Ganhos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDeals}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-active-deals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Ativos</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-won-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Ganho</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {wonValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card data-testid="card-client-timeline">
        <CardHeader>
          <CardTitle>Histórico Completo</CardTitle>
          <CardDescription>
            Todos os negócios, orçamentos, produções e atividades relacionados a este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timelineEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade registrada</p>
            </div>
          ) : (
            <div className="space-y-6">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="flex gap-4" data-testid={`timeline-event-${event.type}-${event.id}`}>
                    <div className="relative">
                      <div className={`rounded-full bg-muted p-2 ${event.iconColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {index !== timelineEvents.length - 1 && (
                        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-full w-px bg-border"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{event.title}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.type}
                          </Badge>
                        </div>
                        {event.type === 'deal' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/deal/${event.id}`)}
                            data-testid={`button-view-deal-${event.id}`}
                          >
                            Ver Detalhes
                          </Button>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {event.date.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
