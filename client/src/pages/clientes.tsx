import { ClientList } from "@/components/client-list";

export default function Clientes() {
  const mockClients = [
    {
      id: "1",
      name: "João Pedro Silva",
      company: "Clínica Cotia",
      phone: "(11) 97240-1995",
      email: "joao@clinicacotia.com",
      city: "Cotia",
      state: "SP",
      notes: null,
    },
    {
      id: "2",
      name: "Maria Santos",
      company: "Restaurante Bella",
      phone: "(11) 98765-4321",
      email: "maria@bella.com",
      city: "São Paulo",
      state: "SP",
      notes: null,
    },
    {
      id: "3",
      name: "Carlos Eduardo",
      company: "Padaria Central",
      phone: "(11) 91234-5678",
      email: "carlos@padariacentral.com",
      city: "Barueri",
      state: "SP",
      notes: null,
    },
    {
      id: "4",
      name: "Ana Paula",
      company: "Loja MultiMarcas",
      phone: "(11) 99876-5432",
      email: "ana@multimarcas.com",
      city: "Osasco",
      state: "SP",
      notes: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">Gerencie seus clientes e contatos</p>
      </div>

      <ClientList
        clients={mockClients}
        onEdit={(client) => console.log("Edit client:", client)}
        onDelete={(id) => console.log("Delete client:", id)}
        onAdd={() => console.log("Add new client")}
      />
    </div>
  );
}
