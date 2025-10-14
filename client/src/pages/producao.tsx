import { ProductionKanban } from "@/components/production-kanban";

export default function Producao() {
  const mockItems = [
    {
      id: "1",
      clientName: "Clínica Cotia",
      product: "Painel em ACM - 2,35m x 0,94m",
      status: "awaiting",
      assignedTo: "João Silva",
      deadline: "15/10/2025",
    },
    {
      id: "2",
      clientName: "Restaurante Bella",
      product: "Fachada completa - ACM + Luminoso",
      status: "production",
      assignedTo: "Maria Santos",
      deadline: "20/10/2025",
    },
    {
      id: "3",
      clientName: "Padaria Central",
      product: "Letreiro luminoso em acrílico",
      status: "installation",
      assignedTo: "Carlos Eduardo",
      deadline: "12/10/2025",
    },
    {
      id: "4",
      clientName: "Farmácia São João",
      product: "Totem luminoso 3m altura",
      status: "completed",
      assignedTo: "João Silva",
      deadline: "10/10/2025",
    },
    {
      id: "5",
      clientName: "Mercado Silva",
      product: "Banner promocional 4m x 2m",
      status: "production",
      assignedTo: "Ana Paula",
      deadline: "14/10/2025",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Produção</h1>
        <p className="text-muted-foreground">Acompanhe o status de produção e instalação</p>
      </div>

      <ProductionKanban
        items={mockItems}
        onStatusChange={(id, status) =>
          console.log(`Change item ${id} to status ${status}`)
        }
      />
    </div>
  );
}
