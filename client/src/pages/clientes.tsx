import { ClientList } from "@/components/client-list";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client } from "@shared/schema";

export default function Clientes() {
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
        onEdit={(client) => console.log("Edit client:", client)}
        onDelete={(id) => deleteMutation.mutate(id)}
        onAdd={() => console.log("Add new client")}
      />
    </div>
  );
}
