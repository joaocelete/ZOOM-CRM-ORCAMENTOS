// Mock data for PDF template preview
export const PREVIEW_DATA = {
  // Company info
  companyName: "Zoom Comunicação Visual",
  cnpj: "12.345.678/0001-90",
  address: "Rua das Flores, 123, Centro",
  city: "São Paulo",
  state: "SP",
  phone: "(11) 98765-4321",
  email: "contato@zoomcv.com.br",
  website: "www.zoomcv.com.br",
  logo: "", // Will be filled from settings if available
  
  // Budget info
  budgetNumber: "ABC12345",
  date: new Date().toLocaleDateString("pt-BR"),
  validityDays: "30",
  
  // Client info
  clientName: "João Silva",
  clientCompany: "Silva Restaurantes LTDA",
  clientPhone: "(11) 91234-5678",
  clientEmail: "joao@silvarestaurantes.com.br",
  clientLocation: "São Paulo - SP",
  
  // Items (example products)
  items: [
    {
      itemNumber: 1,
      productName: "Fachada em ACM com Impressão Digital",
      typeLabel: "Por m²",
      specs: "3.0m × 2.5m = 7.50m²",
      pricePerM2Info: "R$ 180,00/m²",
      subtotal: "R$ 1.350,00",
    },
    {
      itemNumber: 2,
      productName: "Adesivo Jateado para Vidro",
      typeLabel: "Por m²",
      specs: "1.2m × 0.8m = 0.96m²",
      pricePerM2Info: "R$ 95,00/m²",
      subtotal: "R$ 91,20",
    },
    {
      itemNumber: 3,
      productName: "Banner em Lona 440g com Ilhós",
      typeLabel: "Fixo",
      specs: "Valor único",
      pricePerM2Info: "",
      subtotal: "R$ 280,00",
    },
  ],
  
  // Totals
  total: "R$ 1.721,20",
  
  // Technical specs
  material: "ACM 3mm, Lona 440g, Película Jateada",
  finishing: "Ilhós, Acabamento em Fita Dupla Face",
  hasSpecs: true,
  
  // Commercial conditions
  paymentTerms: "50% na aprovação do orçamento, 50% na entrega",
  warranty: "12 meses de garantia contra defeitos de fabricação",
  installationInfo: "Instalação incluída no valor",
  installationDeadline: "5 dias úteis após aprovação",
  deliveryTime: "10 dias úteis",
  observations: "Cores sujeitas a variação de tonalidade conforme calibração do monitor",
};
