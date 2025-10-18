import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  History,
  MailPlus,
  MoreVertical,
  MessagesSquare,
} from "lucide-react";
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
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [contactFilter, setContactFilter] = useState<string>("all");

  const states = Array.from(
    new Set(clients.map((client) => client.state).filter((value): value is string => Boolean(value)))
  ).sort();

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

  const handleEmail = (client: Client) => {
    if (client.email) {
      window.location.href = `mailto:${client.email}`;
    }
  };

  const filteredAndSortedClients = filteredClients.filter((client) => {
    const matchesState = stateFilter === "all" || client.state === stateFilter;
    const matchesContact =
      contactFilter === "all" ||
      (contactFilter === "withEmail" && Boolean(client.email)) ||
      (contactFilter === "withoutEmail" && !client.email);
    return matchesState && matchesContact;
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, empresa ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-clients"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger data-testid="select-state-filter">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={contactFilter} onValueChange={setContactFilter}>
          <SelectTrigger data-testid="select-contact-filter">
            <SelectValue placeholder="Contato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os contatos</SelectItem>
            <SelectItem value="withEmail">Com e-mail</SelectItem>
            <SelectItem value="withoutEmail">Sem e-mail</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAdd} className="w-full md:w-auto" data-testid="button-add-client">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Cliente</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cidade / Estado</TableHead>
              <TableHead className="w-[180px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedClients.map((client) => (
              <TableRow
                key={client.id}
                data-testid={`client-card-${client.id}`}
                className="cursor-pointer hover:bg-muted/70"
                onClick={() => onEdit?.(client)}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{client.name}</span>
                    {client.notes && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {client.notes}
                      </span>
                    )}
                  </div>
                </TableCell>
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
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(event) => event.stopPropagation()}
                        aria-label="Opções do cliente"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit?.(client);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onViewTimeline?.(client.id);
                        }}
                      >
                        <History className="mr-2 h-4 w-4" />
                        Ver timeline
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          openWhatsApp(client.phone);
                        }}
                      >
                        <MessagesSquare className="mr-2 h-4 w-4" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!client.email}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEmail(client);
                        }}
                      >
                        <MailPlus className="mr-2 h-4 w-4" />
                        Enviar e-mail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete?.(client.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {filteredAndSortedClients.length === 0 && (
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
