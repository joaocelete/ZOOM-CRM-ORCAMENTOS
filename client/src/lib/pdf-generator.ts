import jsPDF from "jspdf";
import type { Budget, BudgetItem, Client } from "@shared/schema";

export function generateBudgetPDF(
  budget: Budget & { items?: BudgetItem[] },
  client: Client
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Cores da Zoom (amarelo #FFD200)
  const primaryColor = [255, 210, 0] as [number, number, number];
  const darkGray = [50, 50, 50] as [number, number, number];
  const lightGray = [240, 240, 240] as [number, number, number];

  // CABEÇALHO - Logo e título
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 30, "F");
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ZOOM", 15, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Comunicação Visual", 15, 22);

  // Número do orçamento e data
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ORÇAMENTO", pageWidth - 15, 15, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Data: ${new Date(budget.createdAt!).toLocaleDateString("pt-BR")}`,
    pageWidth - 15,
    21,
    { align: "right" }
  );

  yPos = 40;

  // DADOS DO CLIENTE
  doc.setFillColor(...lightGray);
  doc.rect(15, yPos, pageWidth - 30, 25, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("Cliente:", 20, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.text(client.name, 38, yPos + 7);

  if (client.company) {
    doc.setFont("helvetica", "bold");
    doc.text("Empresa:", 20, yPos + 13);
    doc.setFont("helvetica", "normal");
    doc.text(client.company, 38, yPos + 13);
  }

  if (client.city) {
    doc.setFont("helvetica", "bold");
    doc.text("Local:", 20, yPos + 19);
    doc.setFont("helvetica", "normal");
    doc.text(`${client.city}${client.state ? ` - ${client.state}` : ""}`, 38, yPos + 19);
  }

  yPos += 35;

  // DESCRIÇÃO TÉCNICA
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Descrição Técnica", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  
  const techSpecs = [
    "• Mídia: Lona front/back 440 g/m², impressão digital 1440 dpi.",
    "• Estrutura: Tubos metálicos galvanizados, travamento conforme dimensão.",
    "• Acabamento: Tensionamento, ilhoses, solda perimetral; aplicação de verniz",
    "  automotivo PU sobre a lona para proteção UV e brilho.",
    "• Iluminação: Refletores LED IP65, temperatura 6.000 K, cabeamento e conexões;",
    "  acionamento automático por fotocélula crepuscular.",
    "• Instalação: Fixação em parede/alvenaria com parafusos de expansão.",
    "• Garantia: 6 meses contra defeitos de fabricação/instalação."
  ];

  techSpecs.forEach(spec => {
    doc.text(spec, 20, yPos);
    yPos += 5;
  });

  yPos += 5;

  // ITENS DO ORÇAMENTO
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Itens do Orçamento", 15, yPos);
  yPos += 7;

  // Cabeçalho da tabela
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Item", 20, yPos + 5);
  doc.text("Tipo", 80, yPos + 5);
  doc.text("Dimensões", 115, yPos + 5);
  doc.text("Valor", pageWidth - 20, yPos + 5, { align: "right" });
  yPos += 8;

  // Linhas dos itens
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  
  budget.items?.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
      
      // Repetir cabeçalho da tabela na nova página
      doc.setFillColor(...primaryColor);
      doc.rect(15, yPos, pageWidth - 30, 8, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Item", 20, yPos + 5);
      doc.text("Tipo", 80, yPos + 5);
      doc.text("Dimensões", 115, yPos + 5);
      doc.text("Valor", pageWidth - 20, yPos + 5, { align: "right" });
      yPos += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkGray);
    }

    // Fundo alternado
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos, pageWidth - 30, 8, "F");
    }

    doc.text(item.productName, 20, yPos + 5);
    
    const typeLabel = item.type === "m2" ? "Por m²" : item.type === "fixed" ? "Fixo" : "Serviço";
    doc.text(typeLabel, 80, yPos + 5);
    
    let dimensions = "-";
    if (item.width && item.height) {
      dimensions = `${item.width}m × ${item.height}m`;
    }
    doc.text(dimensions, 115, yPos + 5);
    
    doc.text(
      `R$ ${parseFloat(item.subtotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      pageWidth - 20,
      yPos + 5,
      { align: "right" }
    );
    
    yPos += 8;
  });

  yPos += 5;

  // RESUMO FINANCEIRO
  doc.setFillColor(...lightGray);
  doc.rect(15, yPos, pageWidth - 30, 25, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("RESUMO FINANCEIRO", 20, yPos + 7);
  
  yPos += 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 20, yPos);
  doc.text(
    `R$ ${parseFloat(budget.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    pageWidth - 20,
    yPos,
    { align: "right" }
  );
  
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("TOTAL:", 20, yPos);
  doc.text(
    `R$ ${parseFloat(budget.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    pageWidth - 20,
    yPos,
    { align: "right" }
  );

  yPos += 15;

  // CONDIÇÕES E PRAZOS
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Condições e Prazos", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  
  const conditions = [
    `• Prazo de execução: ${budget.deliveryTime || "5-7"} dias úteis após aprovação.`,
    "• Pagamento: 50% na aprovação + 50% na entrega/instalação.",
    "• Validade da proposta: 7 dias.",
    "• Energia: Ponto de energia 127/220V fornecido pelo cliente.",
    "• Impostos: Inclusos no valor total. Emissão de NF-e.",
  ];

  conditions.forEach(condition => {
    doc.text(condition, 20, yPos);
    yPos += 5;
  });

  yPos += 10;

  // RODAPÉ
  const footerY = doc.internal.pageSize.height - 20;
  doc.setDrawColor(...darkGray);
  doc.line(15, footerY, pageWidth - 15, footerY);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  doc.text("Zoom Comunicação Visual", 15, footerY + 5);
  if (client.phone) {
    doc.text(`Contato: ${client.phone}`, pageWidth - 15, footerY + 5, { align: "right" });
  }
  doc.text(
    `www.zoomcomunicacao.com.br`,
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  return doc;
}
