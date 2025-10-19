export const DEFAULT_PDF_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #333;
      max-width: 180mm;
      margin: 0 auto;
      padding: 0;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10mm;
      padding-bottom: 5mm;
      border-bottom: 3px solid #FFD200;
    }
    
    .header-left {
      flex: 1;
    }
    
    .logo {
      max-width: 45mm;
      max-height: 28mm;
      margin-bottom: 3mm;
    }
    
    .company-info {
      font-size: 8pt;
      color: #666;
      line-height: 1.5;
    }
    
    .header-right {
      text-align: right;
      font-size: 8pt;
      color: #666;
    }
    
    h1 {
      font-size: 16pt;
      color: #333;
      margin-bottom: 3mm;
      text-align: center;
    }
    
    .budget-number {
      font-size: 9pt;
      font-weight: bold;
      color: #FFD200;
    }
    
    .section-title {
      background-color: #f5f5f5;
      padding: 2mm 3mm;
      font-weight: bold;
      font-size: 11pt;
      margin-top: 5mm;
      margin-bottom: 3mm;
      border-left: 4px solid #FFD200;
    }
    
    .client-info {
      background-color: #fafafa;
      padding: 3mm;
      margin-bottom: 5mm;
      border-radius: 2mm;
    }
    
    .client-info p {
      margin-bottom: 2mm;
    }
    
    .client-info strong {
      color: #333;
      display: inline-block;
      min-width: 25mm;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 5mm;
    }
    
    table thead {
      background-color: #333;
      color: white;
    }
    
    table th {
      padding: 2mm 3mm;
      text-align: left;
      font-size: 9pt;
      font-weight: bold;
    }
    
    table td {
      padding: 3mm;
      border-bottom: 1px solid #e0e0e0;
      font-size: 9pt;
    }
    
    table tbody tr:nth-child(even) {
      background-color: #fafafa;
    }
    
    .item-name {
      font-weight: bold;
      color: #333;
    }
    
    .item-specs {
      font-size: 8pt;
      color: #666;
      margin-top: 1mm;
    }
    
    .totals {
      margin-top: 5mm;
    }
    
    .subtotal-box {
      background-color: #f5f5f5;
      padding: 3mm;
      margin-bottom: 3mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2mm;
    }
    
    .total-box {
      background-color: #FFD200;
      padding: 4mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 13pt;
      border-radius: 2mm;
    }
    
    .specs-section {
      background-color: #fafafa;
      padding: 3mm;
      margin-bottom: 3mm;
      border-radius: 2mm;
    }
    
    .specs-section p {
      margin-bottom: 2mm;
    }
    
    .conditions-section {
      background-color: #fafafa;
      padding: 3mm;
      border-radius: 2mm;
    }
    
    .conditions-section p {
      margin-bottom: 2mm;
      padding-left: 5mm;
      position: relative;
    }
    
    .conditions-section p:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #FFD200;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 10mm;
      padding-top: 3mm;
      border-top: 1px solid #e0e0e0;
      font-size: 8pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <!-- CABEÇALHO -->
  <div class="header">
    <div class="header-left">
      {{#if logo}}
      <img src="{{logo}}" alt="Logo" class="logo">
      {{/if}}
      <div class="company-info">
        <strong>{{companyName}}</strong><br>
        {{#if cnpj}}CNPJ: {{cnpj}}<br>{{/if}}
        {{#if address}}{{address}}<br>{{/if}}
        {{#if city}}{{city}}{{#if state}} - {{state}}{{/if}}<br>{{/if}}
        {{#if phone}}Tel: {{phone}}<br>{{/if}}
        {{#if email}}Email: {{email}}{{/if}}
      </div>
    </div>
    <div class="header-right">
      <span class="budget-number">Orçamento #{{budgetNumber}}</span><br>
      Data: {{date}}<br>
      {{#if validityDays}}Validade: {{validityDays}} dias{{/if}}
    </div>
  </div>
  
  <h1>ORÇAMENTO</h1>
  
  <!-- INFORMAÇÕES DO CLIENTE -->
  <div class="section-title">DADOS DO CLIENTE</div>
  <div class="client-info">
    <p><strong>Nome:</strong> {{clientName}}</p>
    {{#if clientCompany}}<p><strong>Empresa:</strong> {{clientCompany}}</p>{{/if}}
    {{#if clientPhone}}<p><strong>Telefone:</strong> {{clientPhone}}</p>{{/if}}
    {{#if clientEmail}}<p><strong>Email:</strong> {{clientEmail}}</p>{{/if}}
    {{#if clientLocation}}<p><strong>Localização:</strong> {{clientLocation}}</p>{{/if}}
  </div>
  
  <!-- ITENS DO ORÇAMENTO -->
  <div class="section-title">ITENS DO ORÇAMENTO</div>
  <table>
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 35%;">DESCRIÇÃO</th>
        <th style="width: 12%;">TIPO</th>
        <th style="width: 28%;">ESPECIFICAÇÕES</th>
        <th style="width: 20%; text-align: right;">VALOR</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td>{{itemNumber}}</td>
        <td>
          <div class="item-name">{{productName}}</div>
        </td>
        <td>{{typeLabel}}</td>
        <td>
          {{specs}}
          {{#if pricePerM2Info}}
          <div class="item-specs">{{pricePerM2Info}}</div>
          {{/if}}
        </td>
        <td style="text-align: right; font-weight: bold;">{{subtotal}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  
  <!-- TOTAIS -->
  <div class="totals">
    <div class="subtotal-box">
      <span>Subtotal:</span>
      <span style="font-weight: bold;">{{total}}</span>
    </div>
    <div class="total-box">
      <span>VALOR TOTAL</span>
      <span>{{total}}</span>
    </div>
  </div>
  
  <!-- ESPECIFICAÇÕES TÉCNICAS -->
  {{#if hasSpecs}}
  <div class="section-title">ESPECIFICAÇÕES TÉCNICAS</div>
  <div class="specs-section">
    {{#if material}}<p><strong>Material:</strong> {{material}}</p>{{/if}}
    {{#if finishing}}<p><strong>Acabamento:</strong> {{finishing}}</p>{{/if}}
  </div>
  {{/if}}
  
  <!-- CONDIÇÕES COMERCIAIS -->
  <div class="section-title">CONDIÇÕES COMERCIAIS</div>
  <div class="conditions-section">
    {{#if paymentTerms}}<p>{{paymentTerms}}</p>{{/if}}
    {{#if warranty}}<p>{{warranty}}</p>{{/if}}
    {{#if installationInfo}}<p>{{installationInfo}}</p>{{/if}}
    {{#if installationDeadline}}<p>Prazo de instalação: {{installationDeadline}}</p>{{/if}}
    {{#if deliveryTime}}<p>Prazo de entrega: {{deliveryTime}}</p>{{/if}}
    {{#if observations}}<p>{{observations}}</p>{{/if}}
  </div>
  
  <!-- RODAPÉ -->
  <div class="footer">
    {{companyName}} | {{#if phone}}{{phone}}{{/if}} | {{#if email}}{{email}}{{/if}}
  </div>
</body>
</html>`;
