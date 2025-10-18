import { useState } from "react";
import { BudgetCreator } from "@/components/budget-creator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client, Product, Budget, BudgetItem, CompanySettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Check, X, FileDown, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateBudgetPDF } from "@/lib/pdf-generator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BudgetWithClient = Budget & {
  client?: Client;
  items?: BudgetItem[];
};

export default function Orcamentos() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [editingBudget, setEditingBudget] = useState<BudgetWithClient | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<string | null>(null);

  const { data: clients = [], isLoading: loadingClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: budgets = [], isLoading: loadingBudgets } = useQuery<BudgetWithClient[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: companySettings } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
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

  const updateBudgetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/budgets/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      setEditingBudget(null);
      setActiveTab("list");
      toast({
        title: "Orçamento atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o orçamento.",
        variant: "destructive",
      });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: async (budgetId: string) => {
      return await apiRequest("DELETE", `/api/budgets/${budgetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      setDeletingBudget(null);
      toast({
        title: "Orçamento excluído!",
        description: "O orçamento foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o orçamento.",
        variant: "destructive",
      });
    },
  });

  const handleGeneratePDF = async (budget: BudgetWithClient, client: Client) => {
    try {
      // Buscar os items do orçamento
      const items = await fetch(`/api/budgets/${budget.id}/items`).then(res => res.json());
      
      // Gerar o PDF com os items
      const budgetWithItems = { ...budget, items };
      const pdf = generateBudgetPDF(budgetWithItems, client, companySettings);
      pdf.save(`Orcamento_${client.name.replace(/\s+/g, "_")}_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.pdf`);
      toast({
        title: "PDF gerado!",
        description: "O orçamento foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF do orçamento.",
        variant: "destructive",
      });
    }
  };

  const handleEditBudget = async (budget: BudgetWithClient) => {
    try {
      // Fetch budget items
      const items = await fetch(`/api/budgets/${budget.id}/items`).then(res => res.json());
      setEditingBudget({
        ...budget,
        items,
      });
      setActiveTab("create");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do orçamento.",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Orçamentos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Gerencie orçamentos e aprovações</p>
      </div>

      <Tabs value={activeTab} onValueChange={(tab) => {
        setActiveTab(tab);
        if (tab === "create" && !editingBudget) {
          // Reset when going to create tab without editing
        } else if (tab === "list") {
          // Reset editing state when returning to list
          setEditingBudget(null);
        }
      }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" data-testid="tab-budget-list" className="text-xs md:text-sm">
            <FileText className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Lista de Orçamentos</span>
            <span className="md:hidden ml-1">Lista</span>
          </TabsTrigger>
          <TabsTrigger value="create" data-testid="tab-budget-create" className="text-xs md:text-sm">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Criar Novo</span>
            <span className="md:hidden ml-1">Novo</span>
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
            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
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
            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
              {filteredBudgets.map((budget) => {
                const client = budget.client || clients.find((c) => c.id === budget.clientId);
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

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBudget(budget)}
                          data-testid={`button-edit-${budget.id}`}
                        >
                          <Pencil className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Editar</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingBudget(budget.id)}
                          data-testid={`button-delete-${budget.id}`}
                        >
                          <Trash2 className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Excluir</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            if (!client) {
                              toast({
                                title: "Erro",
                                description: "Cliente não encontrado para este orçamento.",
                                variant: "destructive",
                              });
                              return;
                            }
                            handleGeneratePDF(budget, client);
                          }}
                          data-testid={`button-pdf-${budget.id}`}
                        >
                          <FileDown className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">PDF</span>
                          <span className="md:hidden">PDF</span>
                        </Button>
                      </div>

                      {budget.status === "draft" && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => approveBudgetMutation.mutate(budget.id)}
                          disabled={approveBudgetMutation.isPending}
                          data-testid={`button-approve-${budget.id}`}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Aprovar Orçamento
                        </Button>
                      )}
                    </div>

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
            existingBudget={editingBudget || undefined}
            budgetId={editingBudget?.id}
            onSave={(items, total, client, config) => {
              const budgetData = {
                clientId: client.id,
                total: total.toString(),
                status: "draft",
                deliveryTime: config.deliveryTime,
                observations: config.observations,
                paymentTerms: config.paymentTerms,
                warranty: config.warranty,
                installationIncluded: config.installationIncluded,
                material: config.material,
                finishing: config.finishing,
                installationDeadline: config.installationDeadline,
                validityDays: config.validityDays,
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
            onUpdate={(budgetId, items, total, client, config) => {
              const budgetData = {
                clientId: client.id,
                total: total.toString(),
                deliveryTime: config.deliveryTime,
                observations: config.observations,
                paymentTerms: config.paymentTerms,
                warranty: config.warranty,
                installationIncluded: config.installationIncluded,
                material: config.material,
                finishing: config.finishing,
                installationDeadline: config.installationDeadline,
                validityDays: config.validityDays,
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
              updateBudgetMutation.mutate({ id: budgetId, data: budgetData });
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

      <AlertDialog open={!!deletingBudget} onOpenChange={() => setDeletingBudget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingBudget && deleteBudgetMutation.mutate(deletingBudget)}
              data-testid="button-confirm-delete"
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
