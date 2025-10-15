import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LayoutGrid } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Deal } from "@shared/schema";
import { useState } from "react";

interface DealWithClient {
  id: string;
  title: string;
  clientName: string;
  value: number;
  stage: string;
  updatedAt: string;
}

export default function Pipeline() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: deals = [], isLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/deals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      await apiRequest("PATCH", `/api/deals/${id}`, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
    },
  });

  // Transform deals for kanban display
  const formattedDeals: DealWithClient[] = deals.map(deal => ({
    id: deal.id,
    title: deal.title,
    clientName: deal.assignedTo || "Cliente",
    value: parseFloat(deal.value as any) || 0,
    stage: deal.stage,
    updatedAt: deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('pt-BR') : "Hoje",
  }));

  const filteredDeals = formattedDeals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Pipeline de Vendas</h1>
          <p className="text-sm text-muted-foreground mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Pipeline de Vendas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus negócios através do funil de vendas
          </p>
        </div>
        <Button data-testid="button-add-deal">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar negócio
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar negócios..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-deals"
          />
        </div>
        <Button variant="outline" size="icon" data-testid="button-filter">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" data-testid="button-view">
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <KanbanBoard
          deals={filteredDeals}
          onDealClick={(deal) => console.log("View deal:", deal)}
          onDeleteDeal={(id) => deleteMutation.mutate(id)}
          onMoveCard={(dealId: string, newStage: string) => {
            updateStageMutation.mutate({ id: dealId, stage: newStage });
          }}
        />
      </div>
    </div>
  );
}
