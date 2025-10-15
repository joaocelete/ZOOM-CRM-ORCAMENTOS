import { KanbanBoard } from '../kanban-board'

export default function KanbanBoardExample() {
  const mockDeals = [
    {
      id: "1",
      title: "Painel em ACM 3x2m",
      clientName: "Clínica Cotia",
      value: 2500.00,
      stage: "contact",
      updatedAt: "2h",
    },
    {
      id: "2",
      title: "Fachada completa + luminoso",
      clientName: "Restaurante Bella",
      value: 8500.00,
      stage: "contact",
      updatedAt: "1d",
    },
    {
      id: "3",
      title: "Letreiro luminoso acrílico",
      clientName: "Padaria Central",
      value: 3200.00,
      stage: "collection",
      updatedAt: "3d",
    },
    {
      id: "4",
      title: "Totem 3m + iluminação",
      clientName: "Farmácia São João",
      value: 4200.00,
      stage: "collection",
      updatedAt: "3h",
    },
  ];

  return (
    <KanbanBoard 
      deals={mockDeals}
      onDealClick={(deal) => console.log('View deal:', deal)}
      onDeleteDeal={(id) => console.log('Delete deal:', id)}
    />
  )
}
