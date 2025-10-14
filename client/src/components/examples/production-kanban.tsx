import { ProductionKanban } from '../production-kanban'

export default function ProductionKanbanExample() {
  const mockItems = [
    {
      id: "1",
      clientName: "Clínica Cotia",
      product: "Painel em ACM",
      status: "awaiting",
      assignedTo: "João Silva",
      deadline: "15/10/2025",
    },
    {
      id: "2",
      clientName: "Restaurante Bella",
      product: "Fachada completa",
      status: "production",
      assignedTo: "Maria Santos",
      deadline: "20/10/2025",
    },
    {
      id: "3",
      clientName: "Padaria Central",
      product: "Letreiro luminoso",
      status: "installation",
      assignedTo: "Carlos Eduardo",
      deadline: "12/10/2025",
    },
  ];

  return (
    <ProductionKanban 
      items={mockItems}
      onStatusChange={(id, status) => console.log(`Change item ${id} to status ${status}`)}
    />
  )
}
