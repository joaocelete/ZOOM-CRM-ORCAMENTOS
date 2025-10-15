import { BudgetCreator } from "@/components/budget-creator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client, Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Orcamentos() {
  const { toast } = useToast();

  const { data: clients = [], isLoading: loadingClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const saveBudgetMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/budgets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Orçamento salvo!",
        description: "O orçamento foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o orçamento.",
        variant: "destructive",
      });
    },
  });

  if (loadingClients || loadingProducts) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Novo Orçamento</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Novo Orçamento</h1>
        <p className="text-muted-foreground">Crie orçamentos dinâmicos com cálculo automático</p>
      </div>

      <BudgetCreator
        clients={clients}
        products={products}
        onSave={(items, total, client) => {
          const budgetData = {
            clientId: client.id,
            total: total.toString(),
            status: "draft",
            items: items.map(item => ({
              productName: item.productName,
              type: item.type,
              width: item.width?.toString(),
              height: item.height?.toString(),
              pricePerM2: item.pricePerM2?.toString(),
              fixedPrice: item.fixedPrice?.toString(),
              subtotal: item.subtotal.toString(),
            })),
          };
          saveBudgetMutation.mutate(budgetData);
        }}
        onSendWhatsApp={(items, total, client) => {
          const message = `Olá ${client.name}! Segue o orçamento:\n\nTotal: R$ ${total.toFixed(2)}\n\nQualquer dúvida fico à disposição!`;
          const phone = client.phone.replace(/\D/g, "");
          window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank");
        }}
      />
    </div>
  );
}
