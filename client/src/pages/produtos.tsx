import { ProductList } from "@/components/product-list";

export default function Produtos() {
  const mockProducts = [
    {
      id: "1",
      name: "Painel em ACM",
      description: "Painel em alumínio composto com impressão digital de alta qualidade",
      pricePerM2: "150.00",
      fixedPrice: null,
      type: "m2",
      category: "Fachadas",
      productionTime: 5,
    },
    {
      id: "2",
      name: "Letreiro Luminoso",
      description: "Letreiro em acrílico com iluminação LED",
      pricePerM2: null,
      fixedPrice: "2500.00",
      type: "fixed",
      category: "Sinalização",
      productionTime: 7,
    },
    {
      id: "3",
      name: "Instalação de Fachada",
      description: "Serviço completo de instalação com equipe especializada",
      pricePerM2: null,
      fixedPrice: "500.00",
      type: "service",
      category: "Serviços",
      productionTime: 1,
    },
    {
      id: "4",
      name: "Banner em Lona",
      description: "Banner em lona com impressão digital e acabamento",
      pricePerM2: "45.00",
      fixedPrice: null,
      type: "m2",
      category: "Comunicação Visual",
      productionTime: 2,
    },
    {
      id: "5",
      name: "Adesivo de Vitrine",
      description: "Adesivo perfurado para aplicação em vidros",
      pricePerM2: "80.00",
      fixedPrice: null,
      type: "m2",
      category: "Comunicação Visual",
      productionTime: 3,
    },
    {
      id: "6",
      name: "Totem Luminoso",
      description: "Totem em ACM com iluminação interna",
      pricePerM2: null,
      fixedPrice: "3800.00",
      type: "fixed",
      category: "Sinalização",
      productionTime: 10,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Produtos</h1>
        <p className="text-muted-foreground">Catálogo de produtos e serviços</p>
      </div>

      <ProductList
        products={mockProducts}
        onEdit={(product) => console.log("Edit product:", product)}
        onDelete={(id) => console.log("Delete product:", id)}
        onAdd={() => console.log("Add new product")}
      />
    </div>
  );
}
