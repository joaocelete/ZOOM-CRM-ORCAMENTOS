import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  mode: "add" | "edit";
}

export function ProductDialog({ open, onOpenChange, product, mode }: ProductDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "m2" as "m2" | "fixed" | "service",
    pricePerM2: "",
    fixedPrice: "",
    category: "",
    productionTime: "",
  });

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        type: product.type as "m2" | "fixed" | "service",
        pricePerM2: product.pricePerM2?.toString() || "",
        fixedPrice: product.fixedPrice?.toString() || "",
        category: product.category || "",
        productionTime: product.productionTime?.toString() || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "m2",
        pricePerM2: "",
        fixedPrice: "",
        category: "",
        productionTime: "",
      });
    }
  }, [product, mode, open]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto criado!",
        description: "O produto foi adicionado com sucesso.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o produto.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", `/api/products/${product?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e tipo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const dataToSend = {
      ...formData,
      pricePerM2: formData.pricePerM2 ? formData.pricePerM2 : null,
      fixedPrice: formData.fixedPrice ? formData.fixedPrice : null,
      category: formData.category || null,
      productionTime: formData.productionTime || null,
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {mode === "edit" ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                data-testid="input-product-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Banner em Lona"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                data-testid="input-product-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Sinalização, Adesivos..."
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                data-testid="input-product-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o produto..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Precificação *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "m2" | "fixed" | "service") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger data-testid="select-product-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m2">Por M² (Área)</SelectItem>
                  <SelectItem value="fixed">Preço Fixo</SelectItem>
                  <SelectItem value="service">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productionTime">Tempo de Produção (dias)</Label>
              <Input
                id="productionTime"
                data-testid="input-product-time"
                value={formData.productionTime}
                onChange={(e) => setFormData({ ...formData, productionTime: e.target.value })}
                placeholder="3"
              />
            </div>
            {formData.type === "m2" && (
              <div className="space-y-2">
                <Label htmlFor="pricePerM2">Preço por M²</Label>
                <Input
                  id="pricePerM2"
                  data-testid="input-product-price-m2"
                  type="number"
                  step="0.01"
                  value={formData.pricePerM2}
                  onChange={(e) => setFormData({ ...formData, pricePerM2: e.target.value })}
                  placeholder="45.00"
                />
              </div>
            )}
            {(formData.type === "fixed" || formData.type === "service") && (
              <div className="space-y-2">
                <Label htmlFor="fixedPrice">Preço {formData.type === "service" ? "do Serviço" : "Fixo"}</Label>
                <Input
                  id="fixedPrice"
                  data-testid="input-product-price-fixed"
                  type="number"
                  step="0.01"
                  value={formData.fixedPrice}
                  onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value })}
                  placeholder="150.00"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              data-testid="button-cancel-product"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="button-submit-product"
            >
              {isLoading ? "Salvando..." : mode === "edit" ? "Atualizar" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
