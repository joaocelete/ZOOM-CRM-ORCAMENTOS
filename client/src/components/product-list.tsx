import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export function ProductList({ products, onEdit, onDelete, onAdd }: ProductListProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      m2: "M²",
      fixed: "Fixo",
      service: "Serviço",
    };
    return types[type] || type;
  };

  const getPrice = (product: Product) => {
    if (product.type === "m2" && product.pricePerM2) {
      return `R$ ${parseFloat(product.pricePerM2).toFixed(2)}/m²`;
    }
    if (product.fixedPrice) {
      return `R$ ${parseFloat(product.fixedPrice).toFixed(2)}`;
    }
    return "Sob consulta";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-products"
          />
        </div>
        <Button onClick={onAdd} data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover-elevate" data-testid={`product-card-${product.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">{product.name}</CardTitle>
                  {product.category && (
                    <Badge variant="secondary" className="mt-2">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit?.(product)}
                    data-testid={`button-edit-product-${product.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete?.(product.id)}
                    data-testid={`button-delete-product-${product.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline">{getTypeLabel(product.type)}</Badge>
                <p className="font-semibold text-primary">{getPrice(product)}</p>
              </div>
              {product.productionTime && (
                <p className="text-xs text-muted-foreground">
                  Prazo: {product.productionTime} dias úteis
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
