import { KanbanBoard } from "@/components/kanban-board";
import { DealDialog } from "@/components/deal-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LayoutGrid } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Deal } from "@shared/schema";
import { useState } from "react";
import { useLocation } from "wouter";

interface DealWithClient {
  id: string;
  title: string;
  clientName: string;
  value: number;
  stage: string;
  updatedAt: string;
  isStale?: boolean;
  daysInactive?: number;
}

export default function Pipeline() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

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
      await apiRequest("POST", `/api/deals/${id}/move-stage`, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  // Transform deals for kanban display
  const formattedDeals: DealWithClient[] = deals.map(deal => {
    // Use deal.updatedAt as indicator of last activity
    // When moving stages or creating activities, updatedAt is refreshed
    const lastUpdate = deal.updatedAt ? new Date(deal.updatedAt) : new Date();
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    const isStale = daysDiff > 7 && deal.status === 'active'; // Only show stale for active deals
    
    return {
      id: deal.id,
      title: deal.title,
      clientName: deal.assignedTo || "Cliente",
      value: parseFloat(deal.value as any) || 0,
      stage: deal.stage,
      updatedAt: deal.updatedAt ? new Date(deal.updatedAt).toLocaleDateString('pt-BR') : "Hoje",
      isStale,
      daysInactive: isStale ? daysDiff : undefined,
    };
  });

  const filteredDeals = formattedDeals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedDeal(undefined);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEdit = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDeal(deal);
      setDialogMode("edit");
      setDialogOpen(true);
    }
  };

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
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Pipeline de Vendas</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Gerencie seus negócios através do funil de vendas
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto" data-testid="button-add-deal">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar negócio
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
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

      <div className="rounded-lg border bg-card p-2 md:p-4 overflow-x-auto">
        <KanbanBoard
          deals={filteredDeals}
          onDealClick={(deal) => setLocation(`/deal/${deal.id}`)}
          onDeleteDeal={(id) => deleteMutation.mutate(id)}
          onMoveCard={(dealId: string, newStage: string) => {
            updateStageMutation.mutate({ id: dealId, stage: newStage });
          }}
        />
      </div>

      <DealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={selectedDeal}
        mode={dialogMode}
      />
    </div>
  );
}
