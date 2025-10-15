import { BudgetCreator } from '../budget-creator'

export default function BudgetCreatorExample() {
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
  ];

  const mockProducts = [
    {
      id: "1",
      name: "Painel em ACM",
      description: "Painel em alumínio composto",
      pricePerM2: "150.00",
      fixedPrice: null,
      type: "m2",
      category: "Fachadas",
      productionTime: 5,
    },
    {
      id: "2",
      name: "Letreiro Luminoso",
      description: "Letreiro em acrílico com LED",
      pricePerM2: null,
      fixedPrice: "2500.00",
      type: "fixed",
      category: "Sinalização",
      productionTime: 7,
    },
  ];

  return (
    <BudgetCreator 
      clients={mockClients}
      products={mockProducts}
      onSave={(items, total, client) => console.log('Save budget:', items, total, client)}
      onSendWhatsApp={(items, total, client) => console.log('Send WhatsApp:', items, total, client)}
    />
  )
}
