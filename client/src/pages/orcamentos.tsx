import { BudgetCreator } from "@/components/budget-creator";

export default function Orcamentos() {
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
  ];

  const mockProducts = [
    {
      id: "1",
      name: "Painel em ACM",
      description: "Painel em alumínio composto com impressão digital",
      pricePerM2: "150.00",
      fixedPrice: null,
      type: "m2",
      category: "Fachadas",
      productionTime: 5,
    },
    {
      id: "2",
      name: "Letreiro Luminoso",
      description: "Letreiro em acrílico com iluminação LED",
      pricePerM2: null,
      fixedPrice: "2500.00",
      type: "fixed",
      category: "Sinalização",
      productionTime: 7,
    },
    {
      id: "3",
      name: "Banner em Lona",
      description: "Banner em lona com impressão digital",
      pricePerM2: "45.00",
      fixedPrice: null,
      type: "m2",
      category: "Comunicação Visual",
      productionTime: 2,
    },
    {
      id: "4",
      name: "Instalação de Fachada",
      description: "Serviço completo de instalação",
      pricePerM2: null,
      fixedPrice: "500.00",
      type: "service",
      category: "Serviços",
      productionTime: 1,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Novo Orçamento</h1>
        <p className="text-muted-foreground">Crie orçamentos dinâmicos com cálculo automático</p>
      </div>

      <BudgetCreator
        clients={mockClients}
        products={mockProducts}
        onSave={(items, total, client) => console.log("Save budget:", items, total, client)}
        onSendWhatsApp={(items, total, client) => {
          console.log("Send WhatsApp:", items, total, client);
          const message = `Olá ${client.name}! Segue o orçamento:\n\nTotal: R$ ${total.toFixed(2)}\n\nQualquer dúvida fico à disposição!`;
          const phone = client.phone.replace(/\D/g, "");
          window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank");
        }}
      />
    </div>
  );
}
