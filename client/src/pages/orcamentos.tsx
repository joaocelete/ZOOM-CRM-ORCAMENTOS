import { BudgetCreator } from "@/components/budget-creator";

export default function Orcamentos() {
  const mockClient = {
    id: "1",
    name: "João Pedro Silva",
    company: "Clínica Cotia",
    phone: "(11) 97240-1995",
    email: "joao@clinicacotia.com",
    city: "Cotia",
    state: "SP",
    notes: null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Novo Orçamento</h1>
        <p className="text-muted-foreground">Crie orçamentos dinâmicos com cálculo automático</p>
      </div>

      <BudgetCreator
        client={mockClient}
        onSave={(items, total) => console.log("Save budget:", items, total)}
        onSendWhatsApp={(items, total) => {
          console.log("Send WhatsApp:", items, total);
          const message = `Olá ${mockClient.name}! Segue o orçamento:\n\nTotal: R$ ${total.toFixed(2)}\n\nQualquer dúvida fico à disposição!`;
          const phone = mockClient.phone.replace(/\D/g, "");
          window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank");
        }}
      />
    </div>
  );
}
