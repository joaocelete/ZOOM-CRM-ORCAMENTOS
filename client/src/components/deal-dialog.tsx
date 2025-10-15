import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Deal, Client } from "@shared/schema";

interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal;
  mode: "add" | "edit";
}

export function DealDialog({ open, onOpenChange, deal, mode }: DealDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    value: "",
    assignedTo: "",
    stage: "contact",
    status: "active",
    notes: "",
    category: "",
    origin: "",
  });

  useEffect(() => {
    if (deal && mode === "edit") {
      setFormData({
        title: deal.title || "",
        clientId: deal.clientId || "",
        value: deal.value?.toString() || "",
        assignedTo: deal.assignedTo || "",
        stage: deal.stage || "contact",
        status: deal.status || "active",
        notes: "",
        category: "",
        origin: "",
      });
    } else {
      setFormData({
        title: "",
        clientId: "",
        value: "",
        assignedTo: "",
        stage: "contact",
        status: "active",
        notes: "",
        category: "",
        origin: "",
      });
    }
  }, [deal, mode, open]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/deals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Negócio criado!",
        description: "O negócio foi adicionado ao pipeline.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o negócio.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", `/api/deals/${deal?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Negócio atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o negócio.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.clientId) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e cliente são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const dataToSend = {
      ...formData,
      value: formData.value || "0",
      budgetId: null,
    };

    if (mode === "edit") {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            {mode === "edit" ? "Editar Negócio" : "Novo Negócio"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">INFORMAÇÕES BÁSICAS</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Título do Negócio *</Label>
              <Input
                id="title"
                data-testid="input-deal-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Banner para evento corporativo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger data-testid="select-deal-client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company && `- ${client.company}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Detalhes do Negócio */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">DETALHES DO NEGÓCIO</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor Estimado (R$)</Label>
                <Input
                  id="value"
                  data-testid="input-deal-value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Responsável</Label>
                <Input
                  id="assignedTo"
                  data-testid="input-deal-assigned"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  data-testid="input-deal-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Sinalização, Adesivos..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) => setFormData({ ...formData, origin: value })}
                >
                  <SelectTrigger data-testid="select-deal-origin">
                    <SelectValue placeholder="Como chegou até nós?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {mode === "edit" && (
              <div className="space-y-2">
                <Label htmlFor="stage">Estágio do Negócio</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                >
                  <SelectTrigger data-testid="select-deal-stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contato</SelectItem>
                    <SelectItem value="collection">Coleta das Informações</SelectItem>
                    <SelectItem value="qualification">Qualificação Interesse</SelectItem>
                    <SelectItem value="costing">Cálculo do Custo</SelectItem>
                    <SelectItem value="sent">Envio Orçamento</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                data-testid="input-deal-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="O que foi feito e qual o próximo passo?"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              data-testid="button-cancel-deal"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="button-submit-deal"
            >
              {isLoading ? "Salvando..." : mode === "edit" ? "Atualizar Negócio" : "Criar Negócio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
