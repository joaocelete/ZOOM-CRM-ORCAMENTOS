import { useState } from "react";
import { ClientList } from "@/components/client-list";
import { ClientDialog } from "@/components/client-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Client } from "@shared/schema";

export default function Clientes() {
  const [, setLocation] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
  });

  const handleAdd = () => {
    setSelectedClient(undefined);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">Gerencie seus clientes e contatos</p>
      </div>

      <ClientList
        clients={clients}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        onAdd={handleAdd}
        onViewTimeline={(id) => setLocation(`/client/${id}/timeline`)}
      />

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={selectedClient}
        mode={dialogMode}
      />
    </div>
  );
}
