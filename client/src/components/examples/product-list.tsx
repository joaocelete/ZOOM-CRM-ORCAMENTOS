import { ProductList } from '../product-list'

export default function ProductListExample() {
  const mockProducts = [
    {
      id: "1",
      name: "Painel em ACM",
      description: "Painel em alumínio composto com impressão digital",
      pricePerM2: "150.00",
      fixedPrice: null,
      type: "m2",
      category: "Fachadas",
      productionTime: 5,
    },
    {
      id: "2",
      name: "Letreiro Luminoso",
      description: "Letreiro em acrílico com LED",
      pricePerM2: null,
      fixedPrice: "2500.00",
      type: "fixed",
      category: "Sinalização",
      productionTime: 7,
    },
    {
      id: "3",
      name: "Instalação de Fachada",
      description: "Serviço de instalação completa",
      pricePerM2: null,
      fixedPrice: "500.00",
      type: "service",
      category: "Serviços",
      productionTime: 1,
    },
  ];

  return (
    <ProductList 
      products={mockProducts}
      onEdit={(product) => console.log('Edit product:', product)}
      onDelete={(id) => console.log('Delete product:', id)}
      onAdd={() => console.log('Add new product')}
    />
  )
}
