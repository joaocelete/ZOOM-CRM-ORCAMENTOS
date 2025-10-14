import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Client } from "@shared/schema";

interface ClientListProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export function ClientList({ clients, onEdit, onDelete, onAdd }: ClientListProps) {
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
      <div className="flex gap-3">
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
        <Button onClick={onAdd} data-testid="button-add-client">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover-elevate" data-testid={`client-card-${client.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
                  {client.company && (
                    <p className="text-sm text-muted-foreground mt-1">{client.company}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit?.(client)}
                    data-testid={`button-edit-${client.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete?.(client.id)}
                    data-testid={`button-delete-${client.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{client.phone}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openWhatsApp(client.phone)}
                  data-testid={`button-whatsapp-${client.id}`}
                  className="text-xs"
                >
                  WhatsApp
                </Button>
              </div>
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
              )}
              {client.city && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {client.city}
                    {client.state && `, ${client.state}`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
