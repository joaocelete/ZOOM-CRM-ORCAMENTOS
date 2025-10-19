import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, Trash2, FileText, Send, Search, Pencil, ChevronDown, Settings, Check, ChevronsUpDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client, Product, Budget, BudgetItem as BudgetItemType } from "@shared/schema";
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

interface BudgetConfig {
  deliveryTime: string;
  observations: string;
  paymentTerms: string;
  warranty: string;
  installationIncluded: string;
  material: string;
  finishing: string;
  installationDeadline: string;
  validityDays: number;
}

interface BudgetCreatorProps {
  clients?: Client[];
  products?: Product[];
  existingBudget?: Budget & { items?: BudgetItemType[]; client?: Client };
  budgetId?: string;
  onSave?: (items: BudgetItem[], total: number, client: Client, config: BudgetConfig) => void;
  onUpdate?: (budgetId: string, items: BudgetItem[], total: number, client: Client, config: BudgetConfig) => void;
  onSendWhatsApp?: (items: BudgetItem[], total: number, client: Client) => void;
}

export function BudgetCreator({ clients = [], products = [], existingBudget, budgetId, onSave, onUpdate, onSendWhatsApp }: BudgetCreatorProps) {
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

  // Budget configuration fields
  const [deliveryTime, setDeliveryTime] = useState("5-7");
  const [observations, setObservations] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("50% entrada + 50% entrega");
  const [warranty, setWarranty] = useState("6 meses");
  const [installationIncluded, setInstallationIncluded] = useState("no");
  const [material, setMaterial] = useState("");
  const [finishing, setFinishing] = useState("");
  const [installationDeadline, setInstallationDeadline] = useState("");
  const [validityDays, setValidityDays] = useState(7);

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

  // State for product search popovers
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

  // Load existing budget data when editing
  useEffect(() => {
    if (existingBudget) {
      // Load client
      if (existingBudget.client) {
        setSelectedClient(existingBudget.client);
        setClientData(existingBudget.client);
      } else if (existingBudget.clientId) {
        const client = clients.find(c => c.id === existingBudget.clientId);
        if (client) {
          setSelectedClient(client);
          setClientData(client);
        }
      }
      
      // Load budget configuration
      if (existingBudget.deliveryTime) setDeliveryTime(existingBudget.deliveryTime);
      if (existingBudget.observations) setObservations(existingBudget.observations);
      if (existingBudget.paymentTerms) setPaymentTerms(existingBudget.paymentTerms);
      if (existingBudget.warranty) setWarranty(existingBudget.warranty);
      if (existingBudget.installationIncluded) setInstallationIncluded(existingBudget.installationIncluded);
      if (existingBudget.material) setMaterial(existingBudget.material);
      if (existingBudget.finishing) setFinishing(existingBudget.finishing);
      if (existingBudget.installationDeadline) setInstallationDeadline(existingBudget.installationDeadline);
      if (existingBudget.validityDays) setValidityDays(existingBudget.validityDays);
      
      // Load items
      if (existingBudget.items && existingBudget.items.length > 0) {
        const loadedItems: BudgetItem[] = existingBudget.items.map((item, index) => ({
          id: item.id || `${Date.now()}-${index}`,
          productName: item.productName,
          type: item.type as "m2" | "fixed" | "service",
          width: item.width ? parseFloat(item.width) : undefined,
          height: item.height ? parseFloat(item.height) : undefined,
          pricePerM2: item.pricePerM2 ? parseFloat(item.pricePerM2) : undefined,
          fixedPrice: item.fixedPrice ? parseFloat(item.fixedPrice) : undefined,
          subtotal: parseFloat(item.subtotal),
        }));
        setItems(loadedItems);
      }
    }
  }, [existingBudget, clients]);

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
      // Close the popover using functional update
      setOpenPopovers(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const getTypeLabel = (type: "m2" | "fixed" | "service") => {
    switch (type) {
      case "m2": return "M²";
      case "fixed": return "Valor Fixo";
      case "service": return "Serviço";
    }
  };

  const calculateSubtotal = (item: BudgetItem): number => {
    if (item.type === "m2") {
      const width = item.width ?? 0;
      const height = item.height ?? 0;
      const pricePerM2 = item.pricePerM2 ?? 0;
      if (width > 0 && height > 0 && pricePerM2 > 0) {
        return width * height * pricePerM2;
      }
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

  const getCurrentClient = (): Client | null => {
    if (selectedClient) return selectedClient;
    if (clientData.name && clientData.phone) {
      return clientData as Client;
    }
    return null;
  };

  const currentClient = getCurrentClient();

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
                  <Popover 
                    open={openPopovers[item.id] || false} 
                    onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [item.id]: open }))}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openPopovers[item.id] || false}
                        className="w-full justify-between"
                        data-testid={`select-product-${item.id}`}
                      >
                        {item.productName || "Buscar produto..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar produto..." />
                        <CommandList>
                          <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                          <CommandGroup>
                            {[...products]
                              .sort((a, b) => {
                                // Favoritos sempre primeiro
                                if (a.isFavorite && !b.isFavorite) return -1;
                                if (!a.isFavorite && b.isFavorite) return 1;
                                return a.name.localeCompare(b.name);
                              })
                              .map((product) => (
                              <CommandItem
                                key={product.id}
                                value={`${product.isFavorite ? '⭐ ' : ''}${product.name}`}
                                keywords={[product.name, product.category || '', product.isFavorite ? 'favorito' : '']}
                                onSelect={() => handleSelectProduct(item.id, product.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    item.productName === product.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex items-center gap-2 flex-1">
                                  {product.isFavorite && (
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                                  )}
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="truncate">{product.name}</span>
                                    {product.category && (
                                      <span className="text-xs text-muted-foreground truncate">{product.category}</span>
                                    )}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Input
                    value={getTypeLabel(item.type)}
                    readOnly
                    disabled
                    className="bg-muted"
                    data-testid={`input-type-${item.id}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    O tipo vem do produto selecionado
                  </p>
                </div>
              </div>

              {item.type === "m2" && (
                <div className="grid gap-3 sm:grid-cols-2">
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

      {/* Configurações Adicionais */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle className="font-serif text-base">Configurações Adicionais</CardTitle>
                </div>
                <ChevronDown className="h-5 w-5 transition-transform" />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prazo de Entrega (dias úteis)</Label>
                  <Input
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="5-7"
                    data-testid="input-delivery-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Validade do Orçamento (dias)</Label>
                  <Input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 7)}
                    data-testid="input-validity-days"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger data-testid="select-material">
                      <SelectValue placeholder="Selecione o material..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lona">Lona</SelectItem>
                      <SelectItem value="vinil">Vinil</SelectItem>
                      <SelectItem value="acm">ACM (Alumínio Composto)</SelectItem>
                      <SelectItem value="acrilico">Acrílico</SelectItem>
                      <SelectItem value="mdf">MDF</SelectItem>
                      <SelectItem value="pvc">PVC</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Acabamento</Label>
                  <Select value={finishing} onValueChange={setFinishing}>
                    <SelectTrigger data-testid="select-finishing">
                      <SelectValue placeholder="Selecione o acabamento..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ilhoses">Ilhoses</SelectItem>
                      <SelectItem value="laminacao">Laminação</SelectItem>
                      <SelectItem value="bastao">Bastão</SelectItem>
                      <SelectItem value="moldura">Moldura</SelectItem>
                      <SelectItem value="recorte">Recorte Especial</SelectItem>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Instalação Incluída?</Label>
                  <Select value={installationIncluded} onValueChange={setInstallationIncluded}>
                    <SelectTrigger data-testid="select-installation">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="no">Não</SelectItem>
                      <SelectItem value="optional">Opcional (cotação separada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prazo de Instalação</Label>
                  <Input
                    value={installationDeadline}
                    onChange={(e) => setInstallationDeadline(e.target.value)}
                    placeholder="Ex: 2-3 dias após entrega"
                    data-testid="input-installation-deadline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Condições de Pagamento</Label>
                <Input
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="Ex: 50% entrada + 50% entrega"
                  data-testid="input-payment-terms"
                />
              </div>

              <div className="space-y-2">
                <Label>Garantia</Label>
                <Input
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="Ex: 6 meses contra defeitos de fabricação"
                  data-testid="input-warranty"
                />
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Informações adicionais importantes para este orçamento..."
                  rows={4}
                  data-testid="input-observations"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

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
            onClick={() => {
              if (!currentClient) return;
              const config: BudgetConfig = {
                deliveryTime,
                observations,
                paymentTerms,
                warranty,
                installationIncluded,
                material,
                finishing,
                installationDeadline,
                validityDays,
              };
              if (budgetId && onUpdate) {
                onUpdate(budgetId, items, total, currentClient, config);
              } else if (onSave) {
                onSave(items, total, currentClient, config);
              }
            }}
            data-testid="button-save-budget"
            disabled={!currentClient}
          >
            <FileText className="h-4 w-4 mr-2" />
            {budgetId ? "Atualizar Orçamento" : "Salvar Orçamento"}
          </Button>
          <Button 
            onClick={() => currentClient && onSendWhatsApp?.(items, total, currentClient)} 
            data-testid="button-send-whatsapp"
            disabled={!currentClient}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar via WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
