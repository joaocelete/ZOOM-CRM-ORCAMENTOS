import jsPDF from "jspdf";
import type { Budget, BudgetItem, Client, CompanySettings } from "@shared/schema";

export function generateBudgetPDF(
  budget: Budget & { items?: BudgetItem[] },
  client: Client,
  companySettings?: CompanySettings
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPos = 20;

  // Cores
  const primaryColor = [255, 210, 0] as [number, number, number];
  const darkGray = [50, 50, 50] as [number, number, number];
  const mediumGray = [120, 120, 120] as [number, number, number];
  const lightGray = [245, 245, 245] as [number, number, number];
  const borderGray = [220, 220, 220] as [number, number, number];

  // Configurações da empresa
  const companyName = companySettings?.companyName || "Zoom Comunicação Visual";
  const companyLogo = companySettings?.logo;
  const companyPhone = companySettings?.phone || "";
  const companyEmail = companySettings?.email || "";
  const companyWebsite = companySettings?.website || "www.zoomcomunicacao.com.br";
  const companyCNPJ = companySettings?.cnpj || "";
  const companyAddress = companySettings?.address || "";
  const companyCity = companySettings?.city || "";
  const companyState = companySettings?.state || "";

  // ============ CABEÇALHO ============
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");

  // Logo ou nome da empresa
  if (companyLogo) {
    try {
      doc.addImage(companyLogo, "PNG", 15, 8, 25, 20);
      
      // Nome da empresa ao lado da logo
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 45, 18);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      if (companyPhone) doc.text(`Tel: ${companyPhone}`, 45, 23);
      if (companyEmail) doc.text(companyEmail, 45, 27);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 15, 20);
    }
  } else {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, 15, 18);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    if (companyPhone) doc.text(`Tel: ${companyPhone}`, 15, 24);
    if (companyEmail) doc.text(companyEmail, 15, 28);
  }

  // Título ORÇAMENTO
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ORÇAMENTO", pageWidth - 15, 15, { align: "right" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const budgetNumber = budget.id.substring(0, 8).toUpperCase();
  doc.text(`Nº ${budgetNumber}`, pageWidth - 15, 22, { align: "right" });
  doc.text(`Data: ${new Date(budget.createdAt!).toLocaleDateString("pt-BR")}`, pageWidth - 15, 27, { align: "right" });
  doc.text(`Validade: 7 dias`, pageWidth - 15, 32, { align: "right" });

  yPos = 45;

  // ============ DADOS DO CLIENTE ============
  doc.setFillColor(...lightGray);
  doc.setDrawColor(...borderGray);
  doc.rect(15, yPos, pageWidth - 30, 28, "FD");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("DADOS DO CLIENTE", 20, yPos + 6);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  yPos += 12;
  
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(client.name, 38, yPos);
  
  if (client.company) {
    doc.setFont("helvetica", "bold");
    doc.text("Empresa:", 110, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(client.company, 130, yPos);
  }
  
  yPos += 6;
  
  if (client.phone) {
    doc.setFont("helvetica", "bold");
    doc.text("Telefone:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(client.phone, 38, yPos);
  }
  
  if (client.email) {
    doc.setFont("helvetica", "bold");
    doc.text("Email:", 110, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(client.email, 130, yPos);
  }
  
  yPos += 6;
  
  if (client.city || client.state) {
    doc.setFont("helvetica", "bold");
    doc.text("Localização:", 20, yPos);
    doc.setFont("helvetica", "normal");
    const location = `${client.city || ""}${client.city && client.state ? " - " : ""}${client.state || ""}`;
    doc.text(location, 38, yPos);
  }

  yPos += 12;

  // ============ ITENS DO ORÇAMENTO ============
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("ITENS DO ORÇAMENTO", 15, yPos);
  yPos += 8;

  // Cabeçalho da tabela
  doc.setFillColor(...darkGray);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("#", 18, yPos + 5.5);
  doc.text("DESCRIÇÃO", 28, yPos + 5.5);
  doc.text("TIPO", 95, yPos + 5.5);
  doc.text("ESPECIFICAÇÕES", 115, yPos + 5.5);
  doc.text("VALOR", pageWidth - 18, yPos + 5.5, { align: "right" });
  yPos += 8;

  // Linhas dos itens
  doc.setTextColor(...darkGray);
  
  budget.items?.forEach((item, index) => {
    // Verificar se precisa de nova página
    if (yPos > 240) {
      addFooter(doc, pageWidth, pageHeight, companyName, companyPhone, companyEmail, companyWebsite, companyCNPJ, companyAddress, companyCity, companyState, darkGray, mediumGray);
      doc.addPage();
      yPos = 20;
      
      // Repetir cabeçalho da tabela
      doc.setFillColor(...darkGray);
      doc.rect(15, yPos, pageWidth - 30, 8, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("#", 18, yPos + 5.5);
      doc.text("DESCRIÇÃO", 28, yPos + 5.5);
      doc.text("TIPO", 95, yPos + 5.5);
      doc.text("ESPECIFICAÇÕES", 115, yPos + 5.5);
      doc.text("VALOR", pageWidth - 18, yPos + 5.5, { align: "right" });
      yPos += 8;
      doc.setTextColor(...darkGray);
    }

    const rowHeight = 12;
    
    // Fundo alternado
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(15, yPos, pageWidth - 30, rowHeight, "F");
    }
    
    // Borda inferior
    doc.setDrawColor(...borderGray);
    doc.line(15, yPos + rowHeight, pageWidth - 15, yPos + rowHeight);

    // Número do item
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}`, 18, yPos + 5);

    // Nome do produto
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(item.productName, 28, yPos + 5);

    // Tipo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const typeLabel = item.type === "m2" ? "Por m²" : item.type === "fixed" ? "Fixo" : "Serviço";
    doc.text(typeLabel, 95, yPos + 5);

    // Especificações
    doc.setFont("helvetica", "normal");
    let specs = "";
    
    if (item.type === "m2" && item.width && item.height) {
      const area = (parseFloat(item.width) * parseFloat(item.height)).toFixed(2);
      specs = `${item.width}m × ${item.height}m = ${area}m²`;
      
      if (item.pricePerM2) {
        const pricePerM2 = parseFloat(item.pricePerM2);
        doc.text(specs, 115, yPos + 5);
        doc.setFontSize(7);
        doc.setTextColor(...mediumGray);
        doc.text(`R$ ${pricePerM2.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/m²`, 115, yPos + 9);
        doc.setTextColor(...darkGray);
        doc.setFontSize(8);
      } else {
        doc.text(specs, 115, yPos + 5);
      }
    } else if (item.type === "fixed") {
      specs = "Valor único";
      doc.text(specs, 115, yPos + 5);
    } else {
      specs = "Serviço";
      doc.text(specs, 115, yPos + 5);
    }

    // Valor
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `R$ ${parseFloat(item.subtotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      pageWidth - 18,
      yPos + 5,
      { align: "right" }
    );

    yPos += rowHeight;
  });

  yPos += 5;

  // ============ TOTAL ============
  doc.setFillColor(...lightGray);
  doc.rect(15, yPos, pageWidth - 30, 18, "FD");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkGray);
  doc.text("Subtotal:", 20, yPos + 7);
  doc.text(
    `R$ ${parseFloat(budget.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    pageWidth - 20,
    yPos + 7,
    { align: "right" }
  );

  yPos += 8;
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, pageWidth - 30, 10, "F");
  
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("VALOR TOTAL", 20, yPos + 7);
  doc.text(
    `R$ ${parseFloat(budget.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    pageWidth - 20,
    yPos + 7,
    { align: "right" }
  );

  yPos += 18;

  // ============ CONDIÇÕES COMERCIAIS ============
  if (yPos > 220) {
    addFooter(doc, pageWidth, pageHeight, companyName, companyPhone, companyEmail, companyWebsite, companyCNPJ, companyAddress, companyCity, companyState, darkGray, mediumGray);
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("CONDIÇÕES COMERCIAIS", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const conditions = [
    {
      title: "Prazo de Execução:",
      text: `${budget.deliveryTime || "5-7"} dias úteis após aprovação do orçamento e confirmação de pagamento.`
    },
    {
      title: "Forma de Pagamento:",
      text: "50% de entrada na aprovação + 50% na entrega/conclusão da instalação."
    },
    {
      title: "Validade da Proposta:",
      text: "Este orçamento tem validade de 7 dias corridos a partir da data de emissão."
    },
    {
      title: "Garantia:",
      text: "6 meses contra defeitos de fabricação e instalação."
    },
    {
      title: "Observações:",
      text: "Valores incluem material, mão de obra e impostos. Emissão de NF-e conforme legislação vigente."
    }
  ];

  conditions.forEach(condition => {
    if (yPos > 250) {
      addFooter(doc, pageWidth, pageHeight, companyName, companyPhone, companyEmail, companyWebsite, companyCNPJ, companyAddress, companyCity, companyState, darkGray, mediumGray);
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`• ${condition.title}`, 20, yPos);
    doc.setFont("helvetica", "normal");
    
    const lines = doc.splitTextToSize(condition.text, pageWidth - 50);
    doc.text(lines, 25, yPos + 4);
    yPos += 4 + (lines.length * 4) + 2;
  });

  // ============ RODAPÉ ============
  addFooter(doc, pageWidth, pageHeight, companyName, companyPhone, companyEmail, companyWebsite, companyCNPJ, companyAddress, companyCity, companyState, darkGray, mediumGray);

  return doc;
}

function addFooter(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  companyName: string,
  companyPhone: string,
  companyEmail: string,
  companyWebsite: string,
  companyCNPJ: string,
  companyAddress: string,
  companyCity: string,
  companyState: string,
  darkGray: [number, number, number],
  mediumGray: [number, number, number]
) {
  const footerY = pageHeight - 22;
  
  // Linha divisória
  doc.setDrawColor(...mediumGray);
  doc.setLineWidth(0.5);
  doc.line(15, footerY, pageWidth - 15, footerY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text(companyName, pageWidth / 2, footerY + 5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...mediumGray);

  // Linha de contatos
  let contactLine = "";
  if (companyPhone) contactLine += `Tel: ${companyPhone}`;
  if (companyEmail) contactLine += (contactLine ? " | " : "") + companyEmail;
  if (companyWebsite) contactLine += (contactLine ? " | " : "") + companyWebsite;
  
  if (contactLine) {
    doc.text(contactLine, pageWidth / 2, footerY + 9, { align: "center" });
  }

  // Linha de CNPJ e endereço
  let addressLine = "";
  if (companyCNPJ) addressLine += `CNPJ: ${companyCNPJ}`;
  if (companyAddress) addressLine += (addressLine ? " | " : "") + companyAddress;
  if (companyCity && companyState) {
    addressLine += (addressLine ? " | " : "") + `${companyCity} - ${companyState}`;
  }
  
  if (addressLine) {
    doc.text(addressLine, pageWidth / 2, footerY + 13, { align: "center" });
  }

  // Número da página
  const pageNumber = (doc as any).internal.getCurrentPageInfo().pageNumber;
  doc.text(`Página ${pageNumber}`, pageWidth - 15, footerY + 17, { align: "right" });
}
