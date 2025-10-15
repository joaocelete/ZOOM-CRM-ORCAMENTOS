import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileText, Send, Search, Pencil } from "lucide-react";
import type { Client, Product } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BudgetItem {
  id: string;
  productName: string;
  type: "m2" | "fixed" | "service";
  width?: number;
  height?: number;
  pricePerM2?: number;
  fixedPrice?: number;
  subtotal: number;
}

interface BudgetCreatorProps {
  clients?: Client[];
  products?: Product[];
  onSave?: (items: BudgetItem[], total: number, client: Client) => void;
  onSendWhatsApp?: (items: BudgetItem[], total: number, client: Client) => void;
}

export function BudgetCreator({ clients = [], products = [], onSave, onSendWhatsApp }: BudgetCreatorProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [clientData, setClientData] = useState<Partial<Client>>({
    name: "",
    company: "",
    phone: "",
    email: "",
    city: "",
    state: "",
  });

  const [items, setItems] = useState<BudgetItem[]>([
    {
      id: "1",
      productName: "",
      type: "m2",
      width: 0,
      height: 0,
      pricePerM2: 0,
      subtotal: 0,
    },
  ]);

  const handleSelectClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setClientData(client);
      setEditMode(false);
    }
  };

  const handleSelectProduct = (itemId: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateItem(itemId, {
        productName: product.name,
        type: product.type as "m2" | "fixed" | "service",
        pricePerM2: product.pricePerM2 ? parseFloat(product.pricePerM2) : 0,
        fixedPrice: product.fixedPrice ? parseFloat(product.fixedPrice) : 0,
      });
    }
  };

  const calculateSubtotal = (item: BudgetItem): number => {
    if (item.type === "m2" && item.width && item.height && item.pricePerM2) {
      return item.width * item.height * item.pricePerM2;
    }
    if (item.type === "fixed" || item.type === "service") {
      return item.fixedPrice || 0;
    }
    return 0;
  };

  const updateItem = (id: string, updates: Partial<BudgetItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.subtotal = calculateSubtotal(updated);
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      productName: "",
      type: "m2",
      width: 0,
      height: 0,
      pricePerM2: 0,
      subtotal: 0,
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const currentClient = selectedClient || (clientData as Client);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif">Informações do Cliente</CardTitle>
            {selectedClient && !editMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(true)}
                data-testid="button-edit-client"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!selectedClient ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Selecionar Cliente Existente</Label>
                <Select onValueChange={handleSelectClient}>
                  <SelectTrigger data-testid="select-client">
                    <SelectValue placeholder="Buscar cliente cadastrado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.company && `- ${client.company}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou criar novo</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    placeholder="Nome do cliente"
                    data-testid="input-client-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Input
                    value={clientData.company || ""}
                    onChange={(e) => setClientData({ ...clientData, company: e.target.value })}
                    placeholder="Nome da empresa"
                    data-testid="input-client-company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    data-testid="input-client-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={clientData.email || ""}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    data-testid="input-client-email"
                  />
                </div>
              </div>
            </div>
          ) : editMode ? (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    data-testid="input-edit-client-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Input
                    value={clientData.company || ""}
                    onChange={(e) => setClientData({ ...clientData, company: e.target.value })}
                    data-testid="input-edit-client-company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    data-testid="input-edit-client-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={clientData.email || ""}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    data-testid="input-edit-client-email"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setEditMode(false)}>
                  Salvar Alterações
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setClientData(selectedClient);
                    setEditMode(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">
                  Cliente: <span className="font-normal text-muted-foreground">{selectedClient.name}</span>
                </p>
                {selectedClient.company && (
                  <p className="text-sm font-medium">
                    Empresa: <span className="font-normal text-muted-foreground">{selectedClient.company}</span>
                  </p>
                )}
              </div>
              <p className="text-sm font-medium">
                Telefone: <span className="font-normal text-muted-foreground">{selectedClient.phone}</span>
              </p>
              {selectedClient.email && (
                <p className="text-sm font-medium">
                  Email: <span className="font-normal text-muted-foreground">{selectedClient.email}</span>
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedClient(null);
                  setClientData({
                    name: "",
                    company: "",
                    phone: "",
                    email: "",
                    city: "",
                    state: "",
                  });
                }}
                data-testid="button-change-client"
              >
                <Search className="h-4 w-4 mr-2" />
                Trocar Cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={item.id} data-testid={`budget-item-${item.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Item {index + 1}</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  data-testid={`button-remove-item-${item.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => handleSelectProduct(item.id, value)}>
                      <SelectTrigger className="flex-1" data-testid={`select-product-${item.id}`}>
                        <SelectValue placeholder="Selecionar produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Ou digite o nome"
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, { productName: e.target.value })}
                    data-testid={`input-product-${item.id}`}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={item.type}
                    onValueChange={(value: "m2" | "fixed" | "service") => updateItem(item.id, { type: value })}
                  >
                    <SelectTrigger data-testid={`select-type-${item.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m2">M²</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                      <SelectItem value="service">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {item.type === "m2" && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Largura (m)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.width || ""}
                      onChange={(e) => updateItem(item.id, { width: parseFloat(e.target.value) || 0 })}
                      data-testid={`input-width-${item.id}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Altura (m)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.height || ""}
                      onChange={(e) => updateItem(item.id, { height: parseFloat(e.target.value) || 0 })}
                      data-testid={`input-height-${item.id}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor/m²</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.pricePerM2 || ""}
                      onChange={(e) => updateItem(item.id, { pricePerM2: parseFloat(e.target.value) || 0 })}
                      data-testid={`input-price-m2-${item.id}`}
                    />
                  </div>
                </div>
              )}

              {(item.type === "fixed" || item.type === "service") && (
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.fixedPrice || ""}
                    onChange={(e) => updateItem(item.id, { fixedPrice: parseFloat(e.target.value) || 0 })}
                    data-testid={`input-fixed-price-${item.id}`}
                  />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <p className="text-lg font-semibold">
                  Subtotal: <span data-testid={`subtotal-${item.id}`}>R$ {item.subtotal.toFixed(2)}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addItem}
          className="w-full border-dashed"
          data-testid="button-add-item"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold font-serif">Total Geral:</p>
            <p className="text-2xl font-bold text-primary" data-testid="budget-total">
              R$ {total.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => onSave?.(items, total, currentClient)} 
            data-testid="button-save-budget"
            disabled={!clientData.name || !clientData.phone}
          >
            <FileText className="h-4 w-4 mr-2" />
            Salvar Orçamento
          </Button>
          <Button 
            onClick={() => onSendWhatsApp?.(items, total, currentClient)} 
            data-testid="button-send-whatsapp"
            disabled={!clientData.name || !clientData.phone}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar via WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
