import { BudgetCreator } from '../budget-creator'

export default function BudgetCreatorExample() {
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
    <BudgetCreator 
      client={mockClient}
      onSave={(items, total) => console.log('Save budget:', items, total)}
      onSendWhatsApp={(items, total) => console.log('Send WhatsApp:', items, total)}
    />
  )
}
