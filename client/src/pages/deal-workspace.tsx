import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Clock,
  FileText,
  ListTodo,
  Activity as ActivityIcon,
  Building2,
  User,
  Calendar,
  DollarSign,
  Package,
  Wrench,
  MessageSquare
} from "lucide-react";
import type { Deal, Client, Activity, Task, DealBudget, Budget } from "@shared/schema";

export default function DealWorkspace() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch deal details
  const { data: deal, isLoading: isDealLoading } = useQuery<Deal>({
    queryKey: ["/api/deals", id],
    queryFn: async () => {
      const deals = await fetch("/api/deals").then((r) => r.json());
      return deals.find((d: Deal) => d.id === id);
    },
  });

  // Fetch client
  const { data: client } = useQuery<Client>({
    queryKey: ["/api/clients", deal?.clientId],
    enabled: !!deal?.clientId,
    queryFn: async () => {
      const response = await fetch(`/api/clients/${deal?.clientId}`);
      return response.json();
    },
  });

  // Fetch activities
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities", "deal", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/activities/deal/${id}`);
      return response.json();
    },
  });

  // Fetch tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${id}`);
      return response.json();
    },
  });

  // Fetch deal budgets
  const { data: dealBudgets = [] } = useQuery<DealBudget[]>({
    queryKey: ["/api/deal-budgets", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/deal-budgets/${id}`);
      return response.json();
    },
  });

  // Create budget from deal mutation
  const createBudgetMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/deals/${id}/create-budget`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deal-budgets", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities", "deal", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
    },
  });

  if (isDealLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Negócio não encontrado</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stageNames: Record<string, string> = {
    contact: "Contato",
    collection: "Coleta",
    qualification: "Qualificação",
    costing: "Custo",
    sent: "Enviado",
    followup: "Follow-up",
    closed: "Fechado",
  };

  const statusColors: Record<string, string> = {
    active: "bg-blue-500",
    won: "bg-green-500",
    lost: "bg-red-500",
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/pipeline")}
              data-testid="button-back-to-pipeline"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold" data-testid="text-deal-title">{deal.title}</h1>
            <Badge 
              className={statusColors[deal.status]}
              data-testid={`badge-status-${deal.status}`}
            >
              {deal.status === 'won' ? 'Ganho' : deal.status === 'lost' ? 'Perdido' : 'Ativo'}
            </Badge>
          </div>
          <p className="text-muted-foreground" data-testid="text-client-name">
            <Building2 className="h-4 w-4 inline mr-2" />
            {client?.company || client?.name || "Cliente"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => createBudgetMutation.mutate()}
            disabled={createBudgetMutation.isPending}
            data-testid="button-create-budget"
          >
            <FileText className="h-4 w-4 mr-2" />
            Criar Orçamento
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-deal-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {Number(deal.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-deal-stage">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estágio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stageNames[deal.stage] || deal.stage}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-deal-tasks">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length} / {tasks.length}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-deal-budgets">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealBudgets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList data-testid="tabs-deal-workspace">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <Package className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="budgets" data-testid="tab-budgets">
            <FileText className="h-4 w-4 mr-2" />
            Orçamentos ({dealBudgets.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" data-testid="tab-tasks">
            <ListTodo className="h-4 w-4 mr-2" />
            Tarefas ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="timeline" data-testid="tab-timeline">
            <ActivityIcon className="h-4 w-4 mr-2" />
            Timeline ({activities.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card data-testid="card-deal-details">
              <CardHeader>
                <CardTitle>Detalhes do Negócio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deal.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">{deal.category}</p>
                  </div>
                )}
                {deal.origin && (
                  <div>
                    <p className="text-sm text-muted-foreground">Origem</p>
                    <p className="font-medium">{deal.origin}</p>
                  </div>
                )}
                {deal.assignedTo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-medium">
                      <User className="h-4 w-4 inline mr-2" />
                      {deal.assignedTo}
                    </p>
                  </div>
                )}
                {deal.createdAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      {new Date(deal.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-service-info">
              <CardHeader>
                <CardTitle>Informações do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deal.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium">{deal.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {deal.quantity && (
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{deal.quantity}</p>
                    </div>
                  )}
                  {deal.dimensions && (
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensões</p>
                      <p className="font-medium">{deal.dimensions}</p>
                    </div>
                  )}
                  {deal.material && (
                    <div>
                      <p className="text-sm text-muted-foreground">Material</p>
                      <p className="font-medium">{deal.material}</p>
                    </div>
                  )}
                  {deal.finishing && (
                    <div>
                      <p className="text-sm text-muted-foreground">Acabamento</p>
                      <p className="font-medium">{deal.finishing}</p>
                    </div>
                  )}
                  {deal.deliveryDeadline && (
                    <div>
                      <p className="text-sm text-muted-foreground">Prazo</p>
                      <p className="font-medium">{deal.deliveryDeadline} dias</p>
                    </div>
                  )}
                  {deal.installationRequired && (
                    <div>
                      <p className="text-sm text-muted-foreground">Instalação</p>
                      <p className="font-medium">
                        {deal.installationRequired === 'yes' ? 'Sim' : 
                         deal.installationRequired === 'no' ? 'Não' : 'A avaliar'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {deal.observations && (
            <Card data-testid="card-observations">
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{deal.observations}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="space-y-4">
          <Card data-testid="card-budgets-list">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Orçamentos Vinculados</CardTitle>
                <Button
                  onClick={() => createBudgetMutation.mutate()}
                  disabled={createBudgetMutation.isPending}
                  data-testid="button-create-budget-tab"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dealBudgets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum orçamento vinculado a este negócio</p>
                  <p className="text-sm mt-2">Clique em "Novo Orçamento" para criar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dealBudgets.map((db) => (
                    <div key={db.id} className="flex items-center justify-between p-4 border rounded-lg hover-elevate" data-testid={`budget-item-${db.budgetId}`}>
                      <div>
                        <p className="font-medium">Orçamento #{db.budgetId.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {db.isPrimary ? <Badge variant="outline">Principal</Badge> : null}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setLocation(`/orcamentos`)} data-testid={`button-view-budget-${db.budgetId}`}>
                        Ver Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card data-testid="card-tasks-list">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tarefas do Negócio</CardTitle>
                <Button data-testid="button-add-task">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma tarefa criada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 border rounded-lg" data-testid={`task-item-${task.id}`}>
                      <div className="mt-1">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card data-testid="card-activities-timeline">
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
              <CardDescription>Todas as interações e mudanças relacionadas a este negócio</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ActivityIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade registrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4" data-testid={`activity-item-${activity.id}`}>
                      <div className="relative">
                        <div className="rounded-full bg-muted p-2">
                          <ActivityIcon className="h-4 w-4" />
                        </div>
                        {index !== activities.length - 1 && (
                          <div className="absolute left-1/2 top-10 -translate-x-1/2 h-full w-px bg-border"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{activity.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {activity.createdAt && new Date(activity.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
