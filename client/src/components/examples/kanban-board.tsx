import { KanbanBoard } from '../kanban-board'

export default function KanbanBoardExample() {
  const mockDeals = [
    {
      id: "1",
      title: "Painel em ACM",
      clientName: "Clínica Cotia",
      value: 2500.00,
      stage: "contact",
      updatedAt: "Há 2 horas",
    },
    {
      id: "2",
      title: "Fachada completa",
      clientName: "Restaurante Bella",
      value: 8500.00,
      stage: "qualification",
      updatedAt: "Há 1 dia",
    },
    {
      id: "3",
      title: "Letreiro luminoso",
      clientName: "Padaria Central",
      value: 3200.00,
      stage: "sent",
      updatedAt: "Há 3 dias",
    },
    {
      id: "4",
      title: "Adesivo de vitrine",
      clientName: "Loja de Roupas XYZ",
      value: 850.00,
      stage: "followup",
      updatedAt: "Há 5 dias",
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
