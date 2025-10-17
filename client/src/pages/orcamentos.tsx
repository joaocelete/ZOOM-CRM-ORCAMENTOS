import { useState } from "react";
import { BudgetCreator } from "@/components/budget-creator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client, Product, Budget, BudgetItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BudgetWithClient = Budget & {
  client?: Client;
  items?: BudgetItem[];
};

export default function Orcamentos() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("list");

  const { data: clients = [], isLoading: loadingClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: budgets = [], isLoading: loadingBudgets } = useQuery<BudgetWithClient[]>({
    queryKey: ["/api/budgets"],
  });

  const saveBudgetMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/budgets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      setActiveTab("list");
      toast({
        title: "Orçamento salvo!",
        description: "O orçamento foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o orçamento.",
        variant: "destructive",
      });
    },
  });

  const approveBudgetMutation = useMutation({
    mutationFn: async (budgetId: string) => {
      return await apiRequest("POST", `/api/budgets/${budgetId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
      toast({
        title: "Orçamento aprovado!",
        description: "Produção criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o orçamento.",
        variant: "destructive",
      });
    },
  });

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { text: "Rascunho", variant: "secondary" },
      sent: { text: "Enviado", variant: "outline" },
      approved: { text: "Aprovado", variant: "default" },
      rejected: { text: "Rejeitado", variant: "destructive" },
    };
    return labels[status] || { text: status, variant: "outline" };
  };

  const filteredBudgets = budgets.filter((budget) => {
    const clientName = clients.find((c) => c.id === budget.clientId)?.name || "";
    return (
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      budget.total.toString().includes(search)
    );
  });

  if (loadingClients || loadingProducts) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Orçamentos</h1>
        <p className="text-muted-foreground">Gerencie orçamentos e aprovações</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list" data-testid="tab-budget-list">
            <FileText className="h-4 w-4 mr-2" />
            Lista de Orçamentos
          </TabsTrigger>
          <TabsTrigger value="create" data-testid="tab-budget-create">
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou valor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-budgets"
            />
          </div>

          {loadingBudgets ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-muted animate-pulse rounded mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-full bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBudgets.map((budget) => {
                const client = clients.find((c) => c.id === budget.clientId);
                const statusInfo = getStatusLabel(budget.status);

                return (
                  <Card key={budget.id} className="hover-elevate" data-testid={`budget-card-${budget.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold">
                          {client?.name || "Cliente não encontrado"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(budget.createdAt!).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-semibold text-lg" data-testid={`budget-total-${budget.id}`}>
                        R$ {parseFloat(budget.total).toFixed(2)}
                      </span>
                    </div>

                    {budget.status === "draft" && (
                      <Button
                        className="w-full"
                        onClick={() => approveBudgetMutation.mutate(budget.id)}
                        disabled={approveBudgetMutation.isPending}
                        data-testid={`button-approve-${budget.id}`}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprovar Orçamento
                      </Button>
                    )}

                    {budget.status === "approved" && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Aprovado - Produção criada
                      </div>
                    )}
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}

          {!loadingBudgets && filteredBudgets.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum orçamento encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <BudgetCreator
            clients={clients}
            products={products}
            onSave={(items, total, client) => {
              const budgetData = {
                clientId: client.id,
                total: total.toString(),
                status: "draft",
                items: items.map((item) => ({
                  productName: item.productName,
                  type: item.type,
                  width: item.width?.toString(),
                  height: item.height?.toString(),
                  pricePerM2: item.pricePerM2?.toString(),
                  fixedPrice: item.fixedPrice?.toString(),
                  subtotal: item.subtotal.toString(),
                })),
              };
              saveBudgetMutation.mutate(budgetData);
            }}
            onSendWhatsApp={(items, total, client) => {
              const message = `Olá ${client.name}! Segue o orçamento:\n\nTotal: R$ ${total.toFixed(
                2
              )}\n\nQualquer dúvida fico à disposição!`;
              const phone = client.phone.replace(/\D/g, "");
              window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
