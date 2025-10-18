import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Phone, Mail, MapPin, Pencil, Trash2, History } from "lucide-react";
import type { Client } from "@shared/schema";

interface ClientListProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onViewTimeline?: (clientId: string) => void;
}

export function ClientList({ clients, onEdit, onDelete, onAdd, onViewTimeline }: ClientListProps) {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company?.toLowerCase().includes(search.toLowerCase()) ||
      client.city?.toLowerCase().includes(search.toLowerCase())
  );

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${cleanPhone}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, empresa ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-clients"
          />
        </div>
        <Button onClick={onAdd} className="w-full md:w-auto" data-testid="button-add-client">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cidade / Estado</TableHead>
              <TableHead className="w-[220px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} data-testid={`client-card-${client.id}`}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.company || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {client.email ? (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {client.city || "-"}
                      {client.state ? `, ${client.state}` : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openWhatsApp(client.phone)}
                      data-testid={`button-whatsapp-${client.id}`}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewTimeline?.(client.id)}
                      data-testid={`button-timeline-${client.id}`}
                    >
                      <History className="h-4 w-4 mr-2" />
                      Timeline
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit?.(client)}
                      data-testid={`button-edit-${client.id}`}
                      aria-label="Editar cliente"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete?.(client.id)}
                      data-testid={`button-delete-${client.id}`}
                      aria-label="Excluir cliente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
