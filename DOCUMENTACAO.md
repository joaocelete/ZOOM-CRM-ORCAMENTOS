# 📘 Documentação Completa - Zoom CRM para Comunicação Visual

## 📑 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Módulo Dashboard](#módulo-dashboard)
3. [Módulo Clientes](#módulo-clientes)
4. [Módulo Orçamentos](#módulo-orçamentos)
5. [Módulo Pipeline de Vendas](#módulo-pipeline-de-vendas)
6. [Módulo Produtos](#módulo-produtos)
7. [Módulo Produção](#módulo-produção)
8. [Módulo Configurações](#módulo-configurações)
9. [Sistema de PDF Personalizado](#sistema-de-pdf-personalizado)
10. [Estrutura Técnica](#estrutura-técnica)
11. [API Endpoints](#api-endpoints)

---

## 🎯 Visão Geral do Sistema

### O que é o Zoom CRM?

O Zoom CRM é um **sistema completo de gestão de relacionamento com clientes** projetado especificamente para empresas de **comunicação visual**. O sistema integra todas as etapas do processo comercial, desde o primeiro contato com o cliente até a produção e entrega final.

### Principais Características

- ✅ **100% Web** - Acesso de qualquer lugar
- ✅ **Responsivo** - Funciona perfeitamente em desktop, tablet e celular
- ✅ **Completo** - Gerencia todo o ciclo de vendas
- ✅ **Personalizável** - Templates de PDF editáveis
- ✅ **Profissional** - Interface moderna e intuitiva

### Navegação

**Desktop:**
- Barra de navegação superior com todos os módulos
- Interface ampla com visualização completa

**Mobile:**
- Barra de navegação inferior (bottom navigation)
- Interface otimizada para telas pequenas
- Gestos touch-friendly

---

## 📊 Módulo Dashboard

**Acesso:** `/` (página inicial)

### Funcionalidades

O Dashboard é o **centro de comando** do sistema, oferecendo uma visão geral completa do negócio.

#### 1. Métricas Principais

Exibe cards com informações-chave:

- **Total de Clientes**
  - Contagem total de clientes cadastrados
  - Ícone: Grupo de pessoas
  
- **Orçamentos Ativos**
  - Número de orçamentos em aberto (status: draft ou sent)
  - Ícone: Documento
  
- **Deals em Andamento**
  - Total de negociações ativas no pipeline
  - Ícone: Kanban
  
- **Valor em Pipeline**
  - Soma de todos os valores dos deals ativos
  - Formatado em reais (R$)
  - Ícone: Cifrão

#### 2. Gráfico de Vendas

- **Tipo:** Gráfico de área
- **Período:** Últimos 7 dias
- **Dados:** Vendas realizadas por dia
- **Visual:** 
  - Linha amarela (#FFD200 - cor da marca Zoom)
  - Área preenchida com gradiente
  - Eixo X: Dias da semana
  - Eixo Y: Valores em R$

#### 3. Status dos Deals

- **Tipo:** Gráfico de pizza (donut)
- **Categorias:**
  - Ativos (azul)
  - Ganhos (verde)
  - Perdidos (vermelho)
- **Interativo:** Hover mostra valores exatos

#### 4. Valor do Pipeline por Estágio

- **Tipo:** Gráfico de barras horizontal
- **Estágios:**
  1. Contato
  2. Coleta das Informações
  3. Qualificação Interesse
  4. Cálculo do Custo
  5. Envio Orçamento
  6. Follow-up
- **Visual:** Cada estágio tem sua cor característica
- **Dados:** Valor total de deals em cada estágio

### Como Usar

1. **Acesse o Dashboard** ao fazer login
2. **Visualize métricas** nos cards superiores
3. **Analise tendências** no gráfico de vendas
4. **Monitore pipeline** nos gráficos de status e estágios
5. **Tome decisões** baseadas nos dados apresentados

---

## 👥 Módulo Clientes

**Acesso:** `/clientes`

### Funcionalidades Principais

#### 1. Listagem de Clientes

**Visualização:**
- Cards organizados em grid responsivo
- Informações visíveis: Nome, Empresa, Telefone, Email, Localização
- Botões de ação: Editar, Excluir, Ver Timeline

**Funcionalidades:**
- **Busca em tempo real**
  - Campo de pesquisa no topo
  - Busca por: nome, empresa, telefone, email, cidade
  - Resultados instantâneos (debounced)
  
- **Ordenação**
  - Por nome (A-Z ou Z-A)
  - Por empresa
  - Por localização

#### 2. Adicionar Novo Cliente

**Campos do Formulário:**
- **Nome*** (obrigatório)
- **Empresa** (opcional)
- **Telefone*** (obrigatório)
  - Validação de formato brasileiro
- **Email** (opcional)
  - Validação de formato de email
- **Cidade** (opcional)
- **Estado** (opcional)
- **Observações** (opcional)
  - Campo de texto livre para notas

**Como Adicionar:**
1. Clique no botão "Adicionar Cliente"
2. Preencha o formulário
3. Clique em "Salvar"
4. Cliente é adicionado e aparece na listagem

#### 3. Editar Cliente

**Acesso:** Botão de lápis em cada card de cliente

**Processo:**
1. Clique no botão "Editar"
2. Formulário abre com dados preenchidos
3. Modifique os campos desejados
4. Clique em "Salvar"
5. Dados são atualizados

#### 4. Excluir Cliente

**Processo:**
1. Clique no botão de lixeira
2. Confirme a exclusão no diálogo
3. Cliente é removido do sistema

**⚠️ Atenção:** A exclusão é permanente!

#### 5. Timeline do Cliente

**Acesso:** `/client/:id/timeline`

**O que mostra:**
- Histórico completo de interações
- Orçamentos enviados
- Deals vinculados
- Atividades registradas
- Ordem cronológica (mais recente primeiro)

**Tipos de Atividades:**
- 📝 Nota adicionada
- 📞 Ligação realizada
- 📧 Email enviado
- 💬 Mensagem WhatsApp
- 🤝 Reunião
- 📊 Mudança de estágio
- ✅ Status alterado
- ➕ Registro criado
- ✏️ Registro atualizado

**Visualização:**
- Layout de linha do tempo vertical
- Cards com detalhes de cada atividade
- Data e hora de cada evento
- Descrição completa
- Metadados adicionais quando disponíveis

### Dados Armazenados

Cada cliente tem os seguintes campos no banco de dados:

```typescript
{
  id: string,              // UUID único
  name: string,            // Nome do cliente
  company: string | null,  // Nome da empresa
  phone: string,           // Telefone
  email: string | null,    // Email
  city: string | null,     // Cidade
  state: string | null,    // Estado (UF)
  notes: string | null     // Observações
}
```

---

## 💰 Módulo Orçamentos

**Acesso:** `/orcamentos`

### Funcionalidades Principais

#### 1. Listagem de Orçamentos

**Visualização:**
- Cards com resumo de cada orçamento
- Informações: Cliente, Total, Status, Data
- Botões de ação: Editar, Excluir, Gerar PDF

**Status Possíveis:**
- 🟡 **Rascunho** (draft) - Ainda não enviado
- 🔵 **Enviado** (sent) - Aguardando resposta
- 🟢 **Aprovado** (approved) - Cliente aceitou
- 🔴 **Rejeitado** (rejected) - Cliente recusou

#### 2. Criar Novo Orçamento

**Processo Completo:**

##### Passo 1: Selecionar Cliente
1. Clique em "Novo Orçamento"
2. Escolha o cliente da lista dropdown
3. Dados do cliente são carregados automaticamente

##### Passo 2: Adicionar Itens

**Tipos de Itens:**

**A) Por Metro Quadrado (m²)**
- Selecione o produto
- Informe largura (m)
- Informe altura (m)
- Informe preço por m²
- **Cálculo automático:** Largura × Altura × Preço/m²

**B) Preço Fixo**
- Selecione o produto
- Informe o valor fixo
- **Cálculo:** Valor fixo informado

**C) Serviço**
- Selecione o serviço
- Informe o valor
- **Cálculo:** Valor informado

**Funcionalidades dos Itens:**
- ➕ Adicionar múltiplos itens
- ✏️ Editar item existente
- 🗑️ Remover item
- 📊 Total calculado automaticamente

##### Passo 3: Configurações Adicionais

**Campos Configuráveis:**

1. **Prazo de Entrega**
   - Tempo estimado para conclusão
   - Exemplo: "15 dias úteis"

2. **Observações**
   - Notas gerais sobre o orçamento
   - Condições especiais
   - Informações relevantes

3. **Condições de Pagamento**
   - Forma de pagamento
   - Exemplo: "50% entrada + 50% entrega"
   - Parcelamento

4. **Garantia**
   - Período de garantia
   - Exemplo: "12 meses contra defeitos de fabricação"

5. **Instalação**
   - Opções:
     - ✅ Incluída no valor
     - ❌ Não incluída
     - ⚠️ Opcional (orçamento adicional)

6. **Material**
   - Descrição do material principal
   - Exemplos: Lona, Vinil, ACM, Acrílico

7. **Acabamento**
   - Detalhes do acabamento
   - Exemplos: Ilhós, Laminação, Moldura

8. **Prazo de Instalação**
   - Tempo para instalação após produção
   - Exemplo: "3 dias úteis"

9. **Validade do Orçamento**
   - Número de dias que o orçamento é válido
   - Exemplo: 30 dias

##### Passo 4: Salvar

1. Revise todos os dados
2. Clique em "Salvar Orçamento"
3. Orçamento é salvo com status "Rascunho"

#### 3. Editar Orçamento

**Acesso:** Botão de lápis em cada card

**Processo:**
1. Clique em "Editar"
2. Formulário abre com todos os dados
3. **Itens são carregados** do banco de dados
4. Modifique o que for necessário
5. Salve as alterações

**⚠️ Importante:** Ao editar, todos os itens existentes são carregados automaticamente.

#### 4. Gerar PDF

**Acesso:** Botão "Gerar PDF" em cada orçamento

**Processo:**
1. Clique no botão
2. Sistema compila o template HTML
3. Dados são inseridos nas variáveis
4. PDF é gerado usando html2pdf.js
5. Download automático do arquivo

**Características do PDF:**
- ✅ Margens de 15mm em todos os lados
- ✅ Conteúdo centralizado (max 180mm)
- ✅ Logo da empresa no cabeçalho
- ✅ Layout profissional
- ✅ Todas as informações configuradas
- ✅ Tabela de itens formatada
- ✅ Totais destacados
- ✅ Rodapé com dados da empresa

**Nome do Arquivo:**
- Formato: `Orcamento-[CÓDIGO].pdf`
- Exemplo: `Orcamento-A39FAD7A.pdf`

#### 5. Excluir Orçamento

**Processo:**
1. Clique no botão de lixeira
2. Confirme a exclusão
3. Orçamento e seus itens são removidos

### Dados Armazenados

**Tabela Budgets:**
```typescript
{
  id: string,
  clientId: string,
  total: decimal,
  status: 'draft' | 'sent' | 'approved' | 'rejected',
  deliveryTime: string | null,
  observations: string | null,
  paymentTerms: string | null,
  warranty: string | null,
  installationIncluded: 'yes' | 'no' | 'optional' | null,
  material: string | null,
  finishing: string | null,
  installationDeadline: string | null,
  validityDays: number | null,
  createdAt: timestamp
}
```

**Tabela Budget Items:**
```typescript
{
  id: string,
  budgetId: string,
  productName: string,
  type: 'm2' | 'fixed' | 'service',
  width: decimal | null,
  height: decimal | null,
  pricePerM2: decimal | null,
  fixedPrice: decimal | null,
  subtotal: decimal
}
```

---

## 🎯 Módulo Pipeline de Vendas

**Acesso:** `/pipeline`

### Visão Geral

O Pipeline é um **quadro Kanban** que organiza todos os negócios (deals) em estágios visuais, facilitando o acompanhamento do processo comercial.

### Estágios do Pipeline

#### 1. 🔵 CONTATO
- **Descrição:** Primeiro contato com o cliente
- **Ações típicas:**
  - Registro inicial do interesse
  - Captura de informações básicas
  - Qualificação preliminar

#### 2. 🟣 COLETA DAS INFORMAÇÕES
- **Descrição:** Levantamento de requisitos
- **Ações típicas:**
  - Detalhamento do projeto
  - Medidas e especificações
  - Prazo desejado
  - Orçamento disponível

#### 3. 🟡 QUALIFICAÇÃO INTERESSE
- **Descrição:** Avaliação da viabilidade
- **Ações típicas:**
  - Confirmar interesse real
  - Verificar budget disponível
  - Definir timeline
  - Identificar decisores

#### 4. 🟠 CÁLCULO DO CUSTO
- **Descrição:** Precificação interna
- **Ações típicas:**
  - Calcular custos de material
  - Estimar tempo de produção
  - Definir margem de lucro
  - Preparar valores

#### 5. 🔴 ENVIO ORÇAMENTO
- **Descrição:** Proposta enviada ao cliente
- **Ações típicas:**
  - Gerar PDF do orçamento
  - Enviar por email/WhatsApp
  - Apresentar a proposta
  - Aguardar retorno

#### 6. 🟢 FOLLOW-UP
- **Descrição:** Acompanhamento pós-envio
- **Ações típicas:**
  - Contato de seguimento
  - Esclarecimento de dúvidas
  - Negociação de valores
  - Fechamento

#### 7. ✅ FECHADO (Won/Lost)
- **Won:** Deal ganho - Cliente aceitou
- **Lost:** Deal perdido - Cliente recusou

### Funcionalidades do Pipeline

#### 1. Visualização Kanban

**Layout:**
- Colunas representam os estágios
- Cards representam os deals
- Arrastar e soltar para mover
- Contadores em cada coluna

**Informações no Card:**
- Título do deal
- Nome do cliente
- Valor (R$)
- Categoria do serviço
- Prazo de entrega
- Indicadores visuais

**Indicadores:**
- 🔴 **Atrasado:** Deal parado há muito tempo
- 🟡 **Atenção:** Necessita acompanhamento
- 🟢 **Ok:** Dentro do prazo normal

#### 2. Criar Novo Deal

**Campos do Formulário:**

**Informações Básicas:**
- **Título*** - Nome do negócio
- **Cliente*** - Seleção da lista
- **Valor*** - Valor estimado (R$)
- **Estágio Inicial*** - Posição no pipeline
- **Status*** - active, won, lost

**Categorização:**
- **Categoria** - Tipo de serviço
  - Sinalização
  - Adesivos
  - Banners
  - Fachadas
  - Letreiros
  - Placas
  - Outros
  
- **Origem** - Como chegou
  - Website
  - Instagram
  - Facebook
  - Indicação
  - WhatsApp
  - Google
  - Outros

**Detalhes do Serviço:**
- **Descrição** - Descrição completa
- **Quantidade** - Número de unidades
- **Dimensões** - Tamanho (ex: "3m x 2m")
- **Material** - Tipo de material
  - Lona
  - Vinil
  - ACM
  - Acrílico
  - PVC
  - Outros
  
- **Acabamento**
  - Ilhós
  - Bastão
  - Moldura
  - Laminação
  - Outros

**Prazos e Instalação:**
- **Prazo de Entrega** - Dias úteis
- **Instalação Necessária**
  - Sim
  - Não
  - A avaliar

**Observações:**
- Campo de texto livre
- Notas importantes
- Requisitos especiais

#### 3. Mover Deal entre Estágios

**Método 1: Arrastar e Soltar**
1. Clique e segure o card do deal
2. Arraste para a coluna desejada
3. Solte o card
4. **Atividade é registrada automaticamente**

**Método 2: Editar Deal**
1. Abra o deal
2. Altere o campo "Estágio"
3. Salve
4. Deal move para nova coluna

**⚠️ Importante:**
- Cada movimentação gera uma atividade
- Histórico completo é mantido
- Timeline registra todas as mudanças

#### 4. Workspace do Deal

**Acesso:** `/deal/:id` (clique no card)

**Abas Disponíveis:**

##### Aba 1: 📋 Visão Geral
- Todos os dados do deal
- Edição inline
- Status e estágio
- Informações do cliente
- Detalhes do serviço

##### Aba 2: 💰 Orçamentos
- Lista de orçamentos vinculados
- Criar novo orçamento para o deal
- Visualizar orçamentos existentes
- Gerar PDFs
- **Vinculação automática** ao criar

##### Aba 3: ✅ Tarefas
- Lista de tarefas do deal
- Adicionar nova tarefa
- Marcar como concluída
- Excluir tarefa
- Status: Pendente, Concluída, Cancelada

**Criar Tarefa:**
- Título da tarefa
- Descrição (opcional)
- Status inicial
- Vinculada ao deal

##### Aba 4: 📅 Timeline
- Histórico completo do deal
- Todas as atividades
- Mudanças de estágio
- Notas adicionadas
- Tarefas criadas/concluídas
- Orçamentos gerados
- Ordem cronológica

#### 5. Atividades do Deal

**Tipos de Atividades Registradas:**

- **created** - Deal criado
- **updated** - Deal atualizado
- **stage_change** - Mudança de estágio
- **status_change** - Mudança de status
- **note** - Nota adicionada
- **call** - Ligação registrada
- **email** - Email enviado
- **whatsapp** - Mensagem WhatsApp
- **meeting** - Reunião realizada

**Registro Automático:**
- Criação do deal
- Mudanças de estágio
- Mudanças de status
- Edições significativas

**Registro Manual:**
- Notas
- Ligações
- Emails
- Reuniões

### Dados Armazenados

```typescript
{
  id: string,
  clientId: string,
  budgetId: string | null,
  title: string,
  value: decimal,
  stage: 'contact' | 'collection' | 'qualification' | 'costing' | 'sent' | 'followup' | 'closed',
  status: 'active' | 'won' | 'lost',
  assignedTo: string | null,
  category: string | null,
  origin: string | null,
  description: string | null,
  quantity: number | null,
  dimensions: string | null,
  material: string | null,
  finishing: string | null,
  deliveryDeadline: number | null,
  installationRequired: 'yes' | 'no' | 'evaluate' | null,
  observations: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 📦 Módulo Produtos

**Acesso:** `/produtos`

### Funcionalidades

#### 1. Catálogo de Produtos

**Visualização:**
- Grid de cards com produtos
- Informações: Nome, Tipo, Categoria, Preços
- Busca e filtros

**Tipos de Produto:**

**A) Por Metro Quadrado (m²)**
- Produtos precificados por área
- Exemplo: Lona, Vinil, ACM
- Campo: Preço por m²

**B) Preço Fixo**
- Produtos com valor único
- Exemplo: Placa, Letreiro
- Campo: Preço fixo

**C) Serviço**
- Mão de obra ou serviços
- Exemplo: Instalação, Design
- Preço variável

#### 2. Adicionar Produto

**Campos:**
- **Nome*** - Nome do produto
- **Descrição** - Detalhes
- **Tipo*** - m2, fixed, service
- **Preço por m²** - Se tipo = m2
- **Preço Fixo** - Se tipo = fixed
- **Categoria** - Classificação
- **Tempo de Produção** - Dias

**Categorias Sugeridas:**
- Sinalização
- Adesivos
- Banners
- Placas
- Letreiros
- Comunicação Visual
- Materiais
- Serviços

#### 3. Editar Produto

**Processo:**
1. Clique em "Editar"
2. Modifique os campos
3. Salve as alterações

#### 4. Excluir Produto

**Processo:**
1. Clique em "Excluir"
2. Confirme a ação
3. Produto é removido

**⚠️ Atenção:**
- Produtos em orçamentos não são afetados
- Apenas a referência no catálogo é removida

### Dados Armazenados

```typescript
{
  id: string,
  name: string,
  description: string | null,
  pricePerM2: decimal | null,
  fixedPrice: decimal | null,
  type: 'm2' | 'fixed' | 'service',
  category: string | null,
  productionTime: number | null
}
```

---

## 🏭 Módulo Produção

**Acesso:** `/producao`

### Visão Geral

Gerencia os **itens em produção** através de um quadro Kanban, acompanhando desde o início até a conclusão.

### Status de Produção

#### 1. 🟡 Aguardando
- Aprovado, aguardando início
- Fila de produção
- Pendências resolvidas

#### 2. 🔵 Em Produção
- Produção em andamento
- Equipe alocada
- Prazo em monitoramento

#### 3. 🟠 Instalação
- Produção concluída
- Aguardando/realizando instalação
- Equipe de instalação alocada

#### 4. 🟢 Concluído
- Tudo finalizado
- Cliente recebeu
- Produção arquivada

### Funcionalidades

#### 1. Quadro Kanban

**Layout:**
- 4 colunas (status)
- Cards de itens de produção
- Arrastar e soltar
- Contadores por coluna

**Informações no Card:**
- Cliente
- Orçamento vinculado
- Deal vinculado (se houver)
- Responsável
- Prazo (deadline)
- Tempo decorrido

#### 2. Criar Item de Produção

**Métodos:**

**A) A partir de Orçamento Aprovado**
1. Orçamento com status "approved"
2. Sistema cria automaticamente
3. Inicia em "Aguardando"

**B) Manual**
1. Clique em "Novo Item"
2. Selecione o orçamento
3. Defina responsável
4. Defina deadline
5. Crie o item

#### 3. Mover entre Status

**Arrastar e Soltar:**
1. Clique e segure o card
2. Arraste para nova coluna
3. Solte
4. Status atualizado
5. Atividade registrada

#### 4. Editar Item de Produção

**Campos Editáveis:**
- Status
- Responsável
- Deadline
- Observações

#### 5. Monitoramento

**Indicadores:**
- Prazo próximo (amarelo)
- Atrasado (vermelho)
- No prazo (verde)

**Filtros:**
- Por status
- Por responsável
- Por prazo

### Fluxo Completo

```
Orçamento Aprovado
       ↓
Criação Automática
       ↓
Aguardando
       ↓
Em Produção
       ↓
Instalação
       ↓
Concluído
```

### Dados Armazenados

```typescript
{
  id: string,
  dealId: string | null,
  budgetId: string,
  status: 'awaiting' | 'production' | 'installation' | 'completed',
  assignedTo: string | null,
  deadline: timestamp | null,
  createdAt: timestamp
}
```

---

## ⚙️ Módulo Configurações

**Acesso:** `/settings`

### Funcionalidades

#### 1. Dados da Empresa

**Campos Configuráveis:**

**Identificação:**
- **Nome da Empresa*** - Razão social
- **CNPJ** - Documento
- **Website** - Site da empresa

**Endereço:**
- **Endereço** - Rua, número, complemento
- **Cidade** - Município
- **Estado** - UF
- **CEP** - Código postal

**Contato:**
- **Telefone** - Telefone principal
- **Email** - Email de contato

**Logo:**
- Upload de imagem
- Máximo 2MB
- Formatos: JPG, PNG, GIF
- **Recorte automático** após upload
- Preview em tempo real

#### 2. Upload e Recorte de Logo

**Processo:**
1. Clique em "Upload Logo"
2. Selecione arquivo (máx 2MB)
3. **Ferramenta de recorte abre automaticamente**
4. Ajuste a área de recorte
5. Confirme o recorte
6. Preview é exibido
7. Salve as configurações

**Características:**
- Recorte livre
- Zoom in/out
- Rotação
- Preview em tempo real
- Armazenado como base64

#### 3. Editor de Template PDF

**Acesso:** Seção "Template de PDF Personalizado"

**Funcionalidades:**

##### A) Editor de Código HTML
- Textarea com código HTML completo
- Syntax highlighting básico
- Fonte monoespaçada
- Altura ajustável (min 400px)

##### B) Documentação de Variáveis

**Variáveis Disponíveis:**

**Empresa:**
- `{{companyName}}` - Nome da empresa
- `{{logo}}` - Logo (base64)
- `{{cnpj}}` - CNPJ
- `{{address}}` - Endereço
- `{{city}}` - Cidade
- `{{state}}` - Estado
- `{{phone}}` - Telefone
- `{{email}}` - Email
- `{{website}}` - Website

**Orçamento:**
- `{{budgetNumber}}` - Número do orçamento
- `{{date}}` - Data de emissão
- `{{validityDays}}` - Dias de validade

**Cliente:**
- `{{clientName}}` - Nome do cliente
- `{{clientCompany}}` - Empresa do cliente
- `{{clientPhone}}` - Telefone do cliente
- `{{clientEmail}}` - Email do cliente
- `{{clientLocation}}` - Cidade - Estado

**Valores:**
- `{{total}}` - Valor total formatado

**Especificações:**
- `{{material}}` - Material
- `{{finishing}}` - Acabamento

**Condições:**
- `{{paymentTerms}}` - Condições de pagamento
- `{{warranty}}` - Garantia
- `{{installationInfo}}` - Info de instalação
- `{{installationDeadline}}` - Prazo de instalação
- `{{deliveryTime}}` - Prazo de entrega
- `{{observations}}` - Observações

##### C) Loops e Condicionais

**Loop de Itens:**
```html
{{#each items}}
  <tr>
    <td>{{itemNumber}}</td>
    <td>{{productName}}</td>
    <td>{{typeLabel}}</td>
    <td>{{specs}}</td>
    <td>{{subtotal}}</td>
  </tr>
{{/each}}
```

**Condicional:**
```html
{{#if logo}}
  <img src="{{logo}}" alt="Logo">
{{/if}}
```

**Condicional Aninhado:**
```html
{{#if material}}
  <p><strong>Material:</strong> {{material}}</p>
  {{#if finishing}}
    <p><strong>Acabamento:</strong> {{finishing}}</p>
  {{/if}}
{{/if}}
```

##### D) Preview em Tempo Real

**Funcionalidade:**
1. Edite o template HTML
2. Clique em **"Atualizar Preview"**
3. Sistema compila o template
4. **Preview aparece em iframe**
5. Área é colapsável

**Dados do Preview:**
- Usa dados de exemplo (mock)
- Combina com dados da empresa
- Mostra exatamente como ficará o PDF
- Logo real da empresa (se configurado)
- Layout idêntico ao PDF final

**Interface:**
- Botão "Atualizar Preview"
- Área colapsável
- Iframe com HTML renderizado
- Altura de 800px
- Mensagem explicativa

##### E) Restaurar Padrão

**Funcionalidade:**
1. Clique em "Restaurar Padrão"
2. Template volta ao original
3. Preview pode ser atualizado
4. Mudanças anteriores são perdidas

**Template Padrão Inclui:**
- Layout profissional
- Todas as seções
- Formatação adequada
- Cores da marca Zoom
- Margens e espaçamento
- Tabelas responsivas

#### 4. Salvar Configurações

**Processo:**
1. Preencha todos os campos desejados
2. Faça upload do logo (opcional)
3. Edite o template PDF (opcional)
4. Clique em **"Salvar Configurações"**
5. Notificação de sucesso
6. Dados salvos no banco

**⚠️ Importante:**
- Todas as configurações são globais
- Afetam todos os PDFs gerados
- Logo aparece em todos os orçamentos
- Template personalizado é usado em todos os PDFs

### Dados Armazenados

```typescript
{
  id: string,
  companyName: string | null,
  cnpj: string | null,
  address: string | null,
  city: string | null,
  state: string | null,
  zipCode: string | null,
  phone: string | null,
  email: string | null,
  website: string | null,
  logo: string | null,          // base64
  pdfTemplate: string | null    // HTML completo
}
```

---

## 📄 Sistema de PDF Personalizado

### Visão Geral

Sistema completo de geração de PDFs profissionais com **total personalização** através de templates HTML editáveis.

### Tecnologia

**Biblioteca:** html2pdf.js
- Converte HTML para PDF
- Mantém CSS e formatação
- Suporta imagens base64
- Alta qualidade de renderização

### Template System

#### 1. Arquitetura

**Componentes:**
- `default-pdf-template.ts` - Template padrão HTML/CSS
- `html-pdf-generator.ts` - Compilador e gerador
- `pdf-preview-data.ts` - Dados de exemplo

#### 2. Compilador de Template

**Funcionalidades:**

**A) Substituição de Variáveis**
```javascript
{{variableName}} → valor real
```

**B) Condicionais**
```javascript
{{#if variable}}
  conteúdo se verdadeiro
{{/if}}
```

**C) Loops**
```javascript
{{#each items}}
  {{itemProperty}}
{{/each}}
```

**D) Condicionais Aninhados**
```javascript
{{#if condition1}}
  {{#if condition2}}
    conteúdo duplo condicional
  {{/if}}
{{/if}}
```

#### 3. Processo de Compilação

```
Template HTML
    ↓
1. Processar loops {{#each}}
    ↓
2. Processar condicionais {{#if}}
    ↓
3. Substituir variáveis {{var}}
    ↓
HTML Final Compilado
    ↓
html2pdf.js
    ↓
PDF Gerado
```

#### 4. Configuração do PDF

**Margens:**
- Superior: 15mm
- Direita: 15mm
- Inferior: 15mm
- Esquerda: 15mm

**Página:**
- Formato: A4
- Orientação: Retrato (Portrait)
- Unidade: Milímetros (mm)

**Conteúdo:**
- Largura máxima: 180mm
- Centralizado automaticamente
- Fonte: Arial, Helvetica

**Qualidade:**
- Imagens: JPEG, 98% qualidade
- Escala de renderização: 2x
- CORS habilitado para imagens

### Layout Padrão

#### Seções do PDF

**1. Cabeçalho**
- Logo da empresa (esquerda)
- Dados da empresa
- Número do orçamento (direita)
- Data e validade
- Barra amarela (#FFD200)

**2. Título**
- "ORÇAMENTO" centralizado
- Fonte grande (16pt)

**3. Dados do Cliente**
- Título da seção
- Nome, Empresa, Telefone
- Email, Localização

**4. Itens do Orçamento**
- Tabela formatada
- Colunas: #, Descrição, Tipo, Especificações, Valor
- Linhas zebradas
- Cabeçalho escuro (#333)

**5. Totais**
- Subtotal (fundo cinza)
- Total destacado (fundo amarelo #FFD200)
- Valores em negrito

**6. Especificações Técnicas**
- Material
- Acabamento
- (Só aparece se preenchido)

**7. Condições Comerciais**
- Pagamento
- Garantia
- Instalação
- Prazos
- Observações
- Lista com bullets amarelos

**8. Rodapé**
- Dados de contato
- Centralizado
- Fonte pequena (8pt)

### Personalização

#### O que Pode Ser Personalizado

**Layout:**
- ✅ Cores de fundo
- ✅ Cores de texto
- ✅ Fontes
- ✅ Tamanhos de fonte
- ✅ Espaçamentos
- ✅ Margens internas
- ✅ Bordas
- ✅ Posicionamento

**Estrutura:**
- ✅ Ordem das seções
- ✅ Adicionar novas seções
- ✅ Remover seções
- ✅ Alterar colunas da tabela
- ✅ Modificar cabeçalho/rodapé

**Conteúdo:**
- ✅ Textos estáticos
- ✅ Formatação de valores
- ✅ Idioma
- ✅ Termos e condições

#### Como Personalizar

**1. Acesse Configurações**
```
Menu → Configurações → Template de PDF Personalizado
```

**2. Edite o HTML/CSS**
- Modifique cores
- Ajuste espaçamentos
- Altere estrutura
- Personalize textos

**3. Teste com Preview**
```
Editar → Atualizar Preview → Visualizar
```

**4. Salve**
```
Salvar Configurações
```

**5. Use em Orçamentos**
```
Orçamentos → Gerar PDF
```

### Variáveis do Template

#### Como Usar Variáveis

**Sintaxe:**
```html
{{nomeDaVariavel}}
```

**Exemplo:**
```html
<h1>{{companyName}}</h1>
<p>CNPJ: {{cnpj}}</p>
```

**Resultado:**
```html
<h1>Zoom Comunicação Visual</h1>
<p>CNPJ: 12.345.678/0001-90</p>
```

#### Variáveis de Item (Loop)

**Sintaxe:**
```html
{{#each items}}
  <div>
    <h3>{{productName}}</h3>
    <p>Tipo: {{typeLabel}}</p>
    <p>Valor: {{subtotal}}</p>
  </div>
{{/each}}
```

**Campos de Item:**
- `itemNumber` - Número sequencial (1, 2, 3...)
- `productName` - Nome do produto
- `typeLabel` - "Por m²", "Fixo", "Serviço"
- `specs` - Especificações (dimensões, área)
- `pricePerM2Info` - Preço/m² formatado
- `subtotal` - Valor formatado (R$ 1.234,56)

### Preview em Tempo Real

#### Funcionamento

**1. Dados de Exemplo**
```javascript
// Mock data em pdf-preview-data.ts
{
  companyName: "Zoom Comunicação Visual",
  budgetNumber: "ABC12345",
  clientName: "João Silva",
  items: [
    { productName: "Banner", ... },
    { productName: "Adesivo", ... }
  ]
}
```

**2. Compilação**
```javascript
// Merge de dados reais + mock
const data = {
  ...mockData,
  logo: settings.logo,
  companyName: settings.companyName,
  // ... outros campos do formulário
}
```

**3. Renderização**
```html
<iframe srcdoc="{{htmlCompilado}}">
```

**4. Visualização**
- HTML renderizado
- Estilos aplicados
- Imagens carregadas
- Layout final

#### Quando Usar Preview

**Recomendado:**
- ✅ Após editar template
- ✅ Antes de salvar mudanças
- ✅ Para testar novo layout
- ✅ Para ver variáveis em ação

**Processo:**
1. Edite o template
2. Clique "Atualizar Preview"
3. Expanda área de preview
4. Verifique resultado
5. Ajuste se necessário
6. Repita até satisfeito
7. Salve configurações

### Exemplos de Personalização

#### Exemplo 1: Mudar Cor do Cabeçalho

**Original:**
```css
.header {
  border-bottom: 3px solid #FFD200;
}
```

**Modificado:**
```css
.header {
  border-bottom: 3px solid #0066CC;
}
```

#### Exemplo 2: Adicionar Seção

**Adicionar após rodapé:**
```html
<div class="footer">
  {{companyName}} | {{phone}} | {{email}}
</div>

<!-- NOVA SEÇÃO -->
<div style="margin-top: 10mm; text-align: center; font-size: 8pt; color: #999;">
  <p>Este orçamento é válido por {{validityDays}} dias.</p>
  <p>Após este prazo, valores podem sofrer alteração.</p>
</div>
```

#### Exemplo 3: Mudar Formato da Tabela

**Original:**
```html
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>DESCRIÇÃO</th>
      <th>VALOR</th>
    </tr>
  </thead>
  ...
</table>
```

**Com Quantidade:**
```html
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>DESCRIÇÃO</th>
      <th>QTD</th>
      <th>VALOR UNIT.</th>
      <th>TOTAL</th>
    </tr>
  </thead>
  ...
</table>
```

---

## 🏗️ Estrutura Técnica

### Stack Tecnológico

#### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Wouter** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **Shadcn/ui** - Componentes UI
- **Radix UI** - Primitivos acessíveis
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **html2pdf.js** - Geração de PDF
- **React Hook Form** - Formulários
- **Zod** - Validação

#### Backend
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM type-safe
- **PostgreSQL** - Banco de dados
- **Neon Serverless** - Database hosting

### Arquitetura do Projeto

```
zoom-crm/
├── client/              # Frontend
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   │   ├── ui/     # Componentes Shadcn
│   │   │   └── ...     # Componentes customizados
│   │   ├── pages/      # Páginas/Rotas
│   │   ├── lib/        # Utilitários
│   │   │   ├── queryClient.ts
│   │   │   ├── html-pdf-generator.ts
│   │   │   ├── default-pdf-template.ts
│   │   │   └── pdf-preview-data.ts
│   │   └── index.css   # Estilos globais
│   └── index.html
├── server/             # Backend
│   ├── index.ts        # Entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   └── vite.ts         # Vite integration
├── shared/             # Compartilhado
│   └── schema.ts       # Database schema & types
└── package.json
```

### Padrões de Código

#### Frontend

**Componentes:**
```typescript
// Componente funcional com TypeScript
export default function ComponentName() {
  const { data, isLoading } = useQuery<Type>({
    queryKey: ['/api/endpoint'],
  });

  if (isLoading) return <Loading />;

  return <div>...</div>;
}
```

**Formulários:**
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});

const onSubmit = (data: FormData) => {
  mutation.mutate(data);
};
```

**Mutations:**
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    return await apiRequest('POST', '/api/endpoint', data);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/endpoint'] });
    toast({ title: "Sucesso!" });
  }
});
```

#### Backend

**Routes:**
```typescript
app.get("/api/resource", async (req, res) => {
  try {
    const data = await storage.getResource();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Message" });
  }
});

app.post("/api/resource", async (req, res) => {
  try {
    const data = insertSchema.parse(req.body);
    const result = await storage.createResource(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});
```

**Storage:**
```typescript
export class Storage {
  async getResource(): Promise<Resource[]> {
    return await db.select().from(table);
  }

  async createResource(data: InsertResource): Promise<Resource> {
    const [result] = await db.insert(table).values(data).returning();
    return result;
  }
}
```

### Schema do Banco de Dados

**Tabelas:**

1. **users** - Usuários do sistema
2. **clients** - Clientes
3. **products** - Catálogo de produtos
4. **budgets** - Orçamentos
5. **budget_items** - Itens dos orçamentos
6. **deals** - Negociações (pipeline)
7. **production** - Itens em produção
8. **activities** - Log de atividades
9. **tasks** - Tarefas de deals
10. **company_settings** - Configurações da empresa

**Relacionamentos:**

```
clients (1) ←→ (N) budgets
clients (1) ←→ (N) deals
budgets (1) ←→ (N) budget_items
deals (1) ←→ (N) tasks
deals (1) ←→ (N) activities
budgets (1) ←→ (N) production
```

### Validação de Dados

**Zod Schemas:**
```typescript
// shared/schema.ts
export const insertClientSchema = createInsertSchema(clients);
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
```

**Uso no Frontend:**
```typescript
const schema = insertClientSchema.extend({
  phone: z.string().min(10, "Telefone inválido")
});
```

**Uso no Backend:**
```typescript
const data = insertClientSchema.parse(req.body);
// Lança erro se inválido
```

---

## 🔌 API Endpoints

### Clients

```
GET    /api/clients           # Listar todos
GET    /api/clients/:id       # Buscar por ID
POST   /api/clients           # Criar novo
PATCH  /api/clients/:id       # Atualizar
DELETE /api/clients/:id       # Excluir
GET    /api/clients/:id/timeline  # Timeline do cliente
```

### Products

```
GET    /api/products          # Listar todos
GET    /api/products/:id      # Buscar por ID
POST   /api/products          # Criar novo
PATCH  /api/products/:id      # Atualizar
DELETE /api/products/:id      # Excluir
```

### Budgets

```
GET    /api/budgets           # Listar todos
GET    /api/budgets/:id       # Buscar por ID
POST   /api/budgets           # Criar novo
PATCH  /api/budgets/:id       # Atualizar
DELETE /api/budgets/:id       # Excluir
GET    /api/budgets/:id/items # Itens do orçamento
```

### Budget Items

```
POST   /api/budgets/:budgetId/items       # Criar item
PATCH  /api/budgets/:budgetId/items/:id   # Atualizar item
DELETE /api/budgets/:budgetId/items/:id   # Excluir item
```

### Deals

```
GET    /api/deals             # Listar todos
GET    /api/deals/:id         # Buscar por ID
POST   /api/deals             # Criar novo
PATCH  /api/deals/:id         # Atualizar
DELETE /api/deals/:id         # Excluir
GET    /api/deals/:id/budgets # Orçamentos do deal
POST   /api/deals/:id/budgets # Criar orçamento para deal
```

### Production

```
GET    /api/production        # Listar todos
GET    /api/production/:id    # Buscar por ID
POST   /api/production        # Criar novo
PATCH  /api/production/:id    # Atualizar status
DELETE /api/production/:id    # Excluir
```

### Activities

```
GET    /api/activities?entityType=deal&entityId=123  # Listar filtradas
POST   /api/activities        # Criar atividade
```

### Tasks

```
GET    /api/tasks?dealId=123  # Listar por deal
POST   /api/tasks             # Criar tarefa
PATCH  /api/tasks/:id         # Atualizar
DELETE /api/tasks/:id         # Excluir
```

### Settings

```
GET    /api/settings          # Buscar configurações
PUT    /api/settings          # Atualizar configurações
```

### Formato de Request/Response

**Request (POST/PATCH):**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Response Success:**
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Response Error:**
```json
{
  "error": "Error message"
}
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile */
< 768px

/* Tablet */
768px - 1024px

/* Desktop */
> 1024px
```

### Adaptações Mobile

**Navegação:**
- Bottom navigation visível
- Top navbar oculta
- Menu hambúrguer (se aplicável)

**Layout:**
- Grid de 1 coluna
- Cards full-width
- Padding reduzido
- Fontes ajustadas

**Interações:**
- Botões maiores
- Touch-friendly
- Modals full-screen
- Swipe gestures

### Adaptações Tablet

**Navegação:**
- Bottom navigation visível
- Top navbar visível
- Híbrido

**Layout:**
- Grid de 2 colunas
- Cards responsivos
- Padding médio

**Interações:**
- Mix touch/mouse
- Modals centrados
- Hover states

### Adaptações Desktop

**Navegação:**
- Top navbar completa
- Bottom navigation oculta
- Sidebar (se aplicável)

**Layout:**
- Grid de 3-4 colunas
- Cards otimizados
- Padding completo
- Tooltips

**Interações:**
- Mouse-driven
- Hover states
- Keyboard shortcuts
- Drag and drop

---

## 🎨 Design System

### Cores

**Primária (Amarelo Zoom):**
```css
#FFD200
```

**Background:**
```css
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
```

**Muted:**
```css
--muted: 210 40% 96.1%
--muted-foreground: 215.4 16.3% 46.9%
```

**Card:**
```css
--card: 0 0% 100%
--card-foreground: 222.2 84% 4.9%
```

**Primary:**
```css
--primary: 47 100% 50%  /* #FFD200 */
--primary-foreground: 222.2 47.4% 11.2%
```

### Tipografia

**Fontes:**
```css
font-family: Arial, Helvetica, sans-serif
```

**Tamanhos:**
- H1: 2rem (32px)
- H2: 1.5rem (24px)
- H3: 1.25rem (20px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Espaçamento

**Sistema:**
```
1 = 0.25rem = 4px
2 = 0.5rem = 8px
3 = 0.75rem = 12px
4 = 1rem = 16px
6 = 1.5rem = 24px
8 = 2rem = 32px
```

### Componentes

**Button:**
- Variants: default, destructive, outline, ghost
- Sizes: default, sm, lg, icon

**Card:**
- Bordas arredondadas
- Sombra sutil
- Padding padrão

**Badge:**
- Status coloridos
- Tamanho small
- Corners arredondados

---

## 🚀 Como Usar o Sistema

### 1. Configuração Inicial

**Primeiro Acesso:**
1. Acesse `/settings`
2. Preencha dados da empresa
3. Faça upload do logo
4. Revise template de PDF
5. Salve configurações

### 2. Cadastrar Clientes

1. Acesse `/clientes`
2. Clique "Adicionar Cliente"
3. Preencha formulário
4. Salve

### 3. Cadastrar Produtos

1. Acesse `/produtos`
2. Clique "Adicionar Produto"
3. Defina tipo e preços
4. Salve

### 4. Criar Orçamento

1. Acesse `/orcamentos`
2. Clique "Novo Orçamento"
3. Selecione cliente
4. Adicione itens
5. Configure detalhes
6. Salve

### 5. Gerar PDF

1. Abra orçamento
2. Clique "Gerar PDF"
3. PDF é baixado

### 6. Criar Deal no Pipeline

1. Acesse `/pipeline`
2. Clique "Novo Deal"
3. Preencha informações
4. Selecione estágio
5. Salve

### 7. Movimentar Deal

1. Arraste card no Kanban
2. Solte em novo estágio
3. Atividade é registrada

### 8. Acompanhar Produção

1. Aprove orçamento
2. Item criado automaticamente
3. Acesse `/producao`
4. Movimente entre status
5. Acompanhe até conclusão

---

## 📋 Glossário

**Deal:** Negociação/oportunidade de venda no pipeline

**Pipeline:** Funil de vendas com estágios visuais

**Budget:** Orçamento/proposta comercial

**Item:** Produto ou serviço em um orçamento

**Client:** Cliente cadastrado no sistema

**Product:** Produto/serviço do catálogo

**Production:** Item em processo de produção

**Activity:** Registro de interação ou mudança

**Task:** Tarefa vinculada a um deal

**Stage:** Estágio no pipeline de vendas

**Status:** Estado atual de um registro

**Template:** Modelo HTML para PDFs

**Preview:** Visualização prévia antes de gerar

**m²:** Metro quadrado (tipo de precificação)

**Fixed:** Preço fixo (tipo de precificação)

**Service:** Serviço (tipo de produto)

---

## 📞 Suporte e Ajuda

Para dúvidas sobre funcionalidades específicas, consulte a seção correspondente nesta documentação.

Para questões técnicas, consulte o código-fonte nos arquivos mencionados em cada seção.

---

**Versão da Documentação:** 1.0  
**Data:** 19 de Outubro de 2025  
**Sistema:** Zoom CRM - Comunicação Visual
