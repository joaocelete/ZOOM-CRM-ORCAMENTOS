import { ProductList } from "@/components/product-list";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Produtos() {
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
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Produtos</h1>
        <p className="text-muted-foreground">Catálogo de produtos e serviços</p>
      </div>

      <ProductList
        products={products}
        onEdit={(product) => console.log("Edit product:", product)}
        onDelete={(id) => deleteMutation.mutate(id)}
        onAdd={() => console.log("Add new product")}
      />
    </div>
  );
}
