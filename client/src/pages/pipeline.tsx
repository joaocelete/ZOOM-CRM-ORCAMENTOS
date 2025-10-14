import { KanbanBoard } from "@/components/kanban-board";

export default function Pipeline() {
  const mockDeals = [
    {
      id: "1",
      title: "Painel em ACM",
      clientName: "Clínica Cotia",
      value: 2500.0,
      stage: "contact",
      updatedAt: "Há 2 horas",
    },
    {
      id: "2",
      title: "Fachada completa",
      clientName: "Restaurante Bella",
      value: 8500.0,
      stage: "qualification",
      updatedAt: "Há 1 dia",
    },
    {
      id: "3",
      title: "Letreiro luminoso",
      clientName: "Padaria Central",
      value: 3200.0,
      stage: "sent",
      updatedAt: "Há 3 dias",
    },
    {
      id: "4",
      title: "Adesivo de vitrine",
      clientName: "Loja MultiMarcas",
      value: 850.0,
      stage: "followup",
      updatedAt: "Há 5 dias",
    },
    {
      id: "5",
      title: "Luminoso de fachada",
      clientName: "Farmácia São João",
      value: 4200.0,
      stage: "collection",
      updatedAt: "Há 3 horas",
    },
    {
      id: "6",
      title: "Banner promocional",
      clientName: "Mercado Silva",
      value: 680.0,
      stage: "costing",
      updatedAt: "Há 1 dia",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Pipeline de Vendas</h1>
        <p className="text-muted-foreground">
          Acompanhe seus negócios através do funil de vendas
        </p>
      </div>

      <KanbanBoard
        deals={mockDeals}
        onDealClick={(deal) => console.log("View deal:", deal)}
        onDeleteDeal={(id) => console.log("Delete deal:", id)}
      />
    </div>
  );
}
