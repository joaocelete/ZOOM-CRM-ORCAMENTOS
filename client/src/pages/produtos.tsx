import { useState } from "react";
import { ProductList } from "@/components/product-list";
import { ProductDialog } from "@/components/product-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Produtos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Produtos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Catálogo de produtos e serviços</p>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        onAdd={handleAdd}
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        mode={dialogMode}
      />
    </div>
  );
}
