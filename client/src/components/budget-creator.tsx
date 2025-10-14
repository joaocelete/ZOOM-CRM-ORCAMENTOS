import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileText, Send } from "lucide-react";
import type { Client } from "@shared/schema";

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
  client: Client;
  onSave?: (items: BudgetItem[], total: number) => void;
  onSendWhatsApp?: (items: BudgetItem[], total: number) => void;
}

export function BudgetCreator({ client, onSave, onSendWhatsApp }: BudgetCreatorProps) {
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Cliente: <span className="font-normal text-muted-foreground">{client.name}</span></p>
            {client.company && <p className="text-sm font-medium">Empresa: <span className="font-normal text-muted-foreground">{client.company}</span></p>}
          </div>
          <p className="text-sm font-medium">Telefone: <span className="font-normal text-muted-foreground">{client.phone}</span></p>
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
                  <Input
                    placeholder="Ex: Painel em ACM"
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, { productName: e.target.value })}
                    data-testid={`input-product-${item.id}`}
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
          <Button variant="outline" onClick={() => onSave?.(items, total)} data-testid="button-save-budget">
            <FileText className="h-4 w-4 mr-2" />
            Salvar Orçamento
          </Button>
          <Button onClick={() => onSendWhatsApp?.(items, total)} data-testid="button-send-whatsapp">
            <Send className="h-4 w-4 mr-2" />
            Enviar via WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
