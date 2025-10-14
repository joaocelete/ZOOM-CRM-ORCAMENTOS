import { ClientList } from '../client-list'

export default function ClientListExample() {
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
      company: null,
      phone: "(11) 91234-5678",
      email: null,
      city: "Barueri",
      state: "SP",
      notes: null,
    },
  ];

  return (
    <ClientList 
      clients={mockClients}
      onEdit={(client) => console.log('Edit client:', client)}
      onDelete={(id) => console.log('Delete client:', id)}
      onAdd={() => console.log('Add new client')}
    />
  )
}
