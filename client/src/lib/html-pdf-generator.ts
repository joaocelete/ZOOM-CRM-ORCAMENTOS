import html2pdf from "html2pdf.js";
import type { Budget, Client, BudgetItem, CompanySettings } from "@shared/schema";

interface GeneratePDFParams {
  budget: Budget;
  client: Client;
  items: BudgetItem[];
  settings: CompanySettings;
  template?: string;
}

// Simple Handlebars-like template engine
function compileTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  
  // Helper function to process conditionals with item context (recursive for nested {{#if}})
  function processConditionals(content: string, context: Record<string, any>): string {
    let result = content;
    let previousResult = '';
    
    // Keep processing until no more {{#if}} blocks remain
    while (result !== previousResult) {
      previousResult = result;
      result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, varName, innerContent) => {
        // If the condition is true, recursively process the inner content
        if (context[varName]) {
          return processConditionals(innerContent, context);
        }
        return '';
      });
    }
    
    return result;
  }
  
  // Helper function to replace variables with item context
  function replaceVariables(content: string, context: Record<string, any>): string {
    let processedContent = content;
    Object.keys(context).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedContent = processedContent.replace(regex, context[key] || '');
    });
    return processedContent;
  }
  
  // Handle {{#each items}}...{{/each}} blocks FIRST (before global conditionals)
  result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, varName, content) => {
    const items = data[varName] || [];
    return items.map((item: any) => {
      let itemContent = content;
      // Process conditionals within this item's context
      itemContent = processConditionals(itemContent, item);
      // Replace variables within this item's context
      itemContent = replaceVariables(itemContent, item);
      return itemContent;
    }).join('');
  });
  
  // Handle global {{#if variable}}...{{/if}} blocks (outside of loops)
  result = processConditionals(result, data);
  
  // Handle simple {{variable}} replacements at the top level
  result = replaceVariables(result, data);
  
  return result;
}

export async function generateHTMLPDF(params: GeneratePDFParams): Promise<void> {
  const { budget, client, items, settings, template } = params;
  
  if (!template) {
    throw new Error("Template HTML não encontrado");
  }
  
  // Prepare data for template
  const budgetNumber = budget.id.substring(0, 8).toUpperCase();
  const date = budget.createdAt 
    ? new Date(budget.createdAt).toLocaleDateString("pt-BR")
    : new Date().toLocaleDateString("pt-BR");
  
  const clientLocation = [client.city, client.state].filter(Boolean).join(" - ");
  
  // Process items
  const processedItems = items.map((item, index) => {
    let typeLabel = "Serviço";
    if (item.type === "m2") typeLabel = "Por m²";
    else if (item.type === "fixed") typeLabel = "Fixo";
    
    let specs = "";
    let pricePerM2Info = "";
    
    if (item.type === "m2" && item.width && item.height) {
      const area = (parseFloat(item.width) * parseFloat(item.height)).toFixed(2);
      specs = `${item.width}m × ${item.height}m = ${area}m²`;
      
      if (item.pricePerM2) {
        const pricePerM2 = parseFloat(item.pricePerM2);
        pricePerM2Info = `R$ ${pricePerM2.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/m²`;
      }
    } else if (item.type === "fixed") {
      specs = "Valor único";
    } else {
      specs = "Serviço";
    }
    
    const subtotalFormatted = `R$ ${parseFloat(item.subtotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    
    return {
      itemNumber: index + 1,
      productName: item.productName,
      typeLabel,
      specs,
      pricePerM2Info,
      subtotal: subtotalFormatted,
    };
  });
  
  // Installation info
  let installationInfo = "";
  if (budget.installationIncluded === "yes") {
    installationInfo = "Instalação incluída no valor";
  } else if (budget.installationIncluded === "no") {
    installationInfo = "Instalação não incluída";
  } else if (budget.installationIncluded === "optional") {
    installationInfo = "Instalação disponível mediante orçamento adicional";
  }
  
  const totalFormatted = `R$ ${parseFloat(budget.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  
  const templateData = {
    // Company info
    companyName: settings.companyName || "",
    cnpj: settings.cnpj || "",
    address: settings.address || "",
    city: settings.city || "",
    state: settings.state || "",
    phone: settings.phone || "",
    email: settings.email || "",
    website: settings.website || "",
    logo: settings.logo || "",
    
    // Budget info
    budgetNumber,
    date,
    validityDays: budget.validityDays || "",
    
    // Client info
    clientName: client.name || "",
    clientCompany: client.company || "",
    clientPhone: client.phone || "",
    clientEmail: client.email || "",
    clientLocation,
    
    // Items
    items: processedItems,
    
    // Totals
    total: totalFormatted,
    
    // Technical specs
    material: budget.material || "",
    finishing: budget.finishing || "",
    hasSpecs: !!(budget.material || budget.finishing),
    
    // Commercial conditions
    paymentTerms: budget.paymentTerms || "",
    warranty: budget.warranty || "",
    installationInfo,
    installationDeadline: budget.installationDeadline || "",
    deliveryTime: budget.deliveryTime || "",
    observations: budget.observations || "",
  };
  
  // Compile template
  const html = compileTemplate(template, templateData);
  
  // Generate PDF
  const opt = {
    margin: [15, 15, 15, 15] as [number, number, number, number],
    filename: `Orcamento-${budgetNumber}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
  };
  
  await html2pdf().set(opt).from(html).save();
}
