import { useState } from "react";
import { ProductionKanban } from "@/components/production-kanban";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Production, Deal, Client } from "@shared/schema";

interface ProductionWithDetails {
  id: string;
  clientName: string;
  product: string;
  status: string;
  assignedTo: string;
  deadline: string;
}

export default function Producao() {
  const { data: productions = [], isLoading } = useQuery<Production[]>({
    queryKey: ["/api/production"],
  });

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/production/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
    },
  });

  const formattedItems: ProductionWithDetails[] = productions.map(prod => {
    const deal = deals.find(d => d.id === prod.dealId);
    const client = clients.find(c => c.id === deal?.clientId);
    return {
      id: prod.id,
      clientName: client?.name || "Cliente",
      product: deal?.title || "Produto",
      status: prod.status,
      assignedTo: prod.assignedTo || deal?.assignedTo || "",
      deadline: prod.deadline ? new Date(prod.deadline).toLocaleDateString('pt-BR') : "",
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Produção</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Produção</h1>
          <p className="text-sm md:text-base text-muted-foreground">Acompanhe o status de produção e instalação</p>
        </div>
        <Button className="w-full md:w-auto" data-testid="button-add-production">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <ProductionKanban
        items={formattedItems}
        onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status })}
      />
    </div>
  );
}
