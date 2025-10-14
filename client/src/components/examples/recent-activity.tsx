import { RecentActivity } from '../recent-activity'

export default function RecentActivityExample() {
  const activities = [
    {
      id: "1",
      type: "budget" as const,
      client: "Clínica Cotia",
      description: "Orçamento de painel em ACM enviado",
      time: "Há 2 horas",
      status: "sent" as const,
    },
    {
      id: "2",
      type: "deal" as const,
      client: "Restaurante Bella",
      description: "Negócio fechado - Fachada completa",
      time: "Há 4 horas",
      status: "approved" as const,
    },
    {
      id: "3",
      type: "call" as const,
      client: "Loja MultiMarcas",
      description: "Ligação de acompanhamento realizada",
      time: "Ontem",
    },
  ];

  return <RecentActivity activities={activities} />
}
