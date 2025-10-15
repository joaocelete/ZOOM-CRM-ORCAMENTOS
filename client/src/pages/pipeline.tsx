import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LayoutGrid } from "lucide-react";

export default function Pipeline() {
  const mockDeals = [
    {
      id: "1",
      title: "Painel em ACM 3x2m",
      clientName: "Clínica Cotia",
      value: 2500.0,
      stage: "contact",
      updatedAt: "2h",
    },
    {
      id: "2",
      title: "Fachada completa + luminoso",
      clientName: "Restaurante Bella",
      value: 8500.0,
      stage: "contact",
      updatedAt: "1d",
    },
    {
      id: "3",
      title: "Letreiro luminoso acrílico",
      clientName: "Padaria Central",
      value: 3200.0,
      stage: "collection",
      updatedAt: "3d",
    },
    {
      id: "4",
      title: "Totem 3m + iluminação",
      clientName: "Farmácia São João",
      value: 4200.0,
      stage: "collection",
      updatedAt: "3h",
    },
    {
      id: "5",
      title: "Banner promocional 4x2m",
      clientName: "Mercado Silva",
      value: 680.0,
      stage: "collection",
      updatedAt: "1d",
    },
    {
      id: "6",
      title: "Adesivo vitrine perfurado",
      clientName: "Loja MultiMarcas",
      value: 850.0,
      stage: "costing",
      updatedAt: "5d",
    },
    {
      id: "7",
      title: "Painel em Lona comunicação visual",
      clientName: "Erick News Gord",
      value: 3837.0,
      stage: "sent",
      updatedAt: "2d",
    },
    {
      id: "8",
      title: "Adesivo recortado BragaSom",
      clientName: "Braga BragaSom",
      value: 450.0,
      stage: "followup",
      updatedAt: "7d",
    },
  ];

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
          deals={mockDeals}
          onDealClick={(deal) => console.log("View deal:", deal)}
          onDeleteDeal={(id) => console.log("Delete deal:", id)}
        />
      </div>
    </div>
  );
}
