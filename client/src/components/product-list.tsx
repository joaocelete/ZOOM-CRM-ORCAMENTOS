import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2, CopyPlus, MoreVertical, Star } from "lucide-react";
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
import type { Product } from "@shared/schema";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onToggleFavorite?: (id: string) => void;
}

export function ProductList({ products, onEdit, onDelete, onAdd, onToggleFavorite }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // Favoritos sempre primeiro
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    
    if (sortBy === "price") {
      const priceA = Number(a.fixedPrice || a.pricePerM2 || 0);
      const priceB = Number(b.fixedPrice || b.pricePerM2 || 0);
      return priceB - priceA;
    }

    return a.name.localeCompare(b.name);
  });

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
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-products"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger data-testid="select-category-filter">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat!}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger data-testid="select-type-filter">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="m2">Por m²</SelectItem>
            <SelectItem value="fixed">Valor Fixo</SelectItem>
            <SelectItem value="service">Serviço</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger data-testid="select-sort-products">
            <SelectValue placeholder="Ordenação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Ordenar por nome</SelectItem>
            <SelectItem value="price">Ordenar por preço</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAdd} className="w-full" data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[220px]">Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Prazo produção</TableHead>
              <TableHead className="w-[80px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow
                key={product.id}
                data-testid={`product-card-${product.id}`}
                className="cursor-pointer hover:bg-muted/70"
                onClick={() => onEdit?.(product)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFavorite?.(product.id)}
                    data-testid={`button-favorite-${product.id}`}
                    className="h-8 w-8"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        product.isFavorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{product.name}</span>
                    {product.description && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {product.category ? (
                    <Badge variant="secondary">{product.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getTypeLabel(product.type)}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {getPrice(product)}
                </TableCell>
                <TableCell>
                  {product.productionTime ? (
                    `${product.productionTime} dias úteis`
                  ) : (
                    <span className="text-muted-foreground">Sob consulta</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(event) => event.stopPropagation()}
                        aria-label="Opções do produto"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit?.(product);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          navigator.clipboard.writeText(product.name).catch(() => {});
                        }}
                      >
                        <CopyPlus className="mr-2 h-4 w-4" />
                        Copiar nome
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete?.(product.id);
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

            {sortedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
