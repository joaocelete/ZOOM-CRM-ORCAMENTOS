import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CompanySettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Upload, Save, Building2, FileCode, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { ImageCropDialog } from "@/components/image-crop-dialog";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PDF_TEMPLATE } from "@/lib/default-pdf-template";
import { PREVIEW_DATA } from "@/lib/pdf-preview-data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Settings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: settings, isLoading } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    logo: "",
    pdfTemplate: "",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || "",
        cnpj: settings.cnpj || "",
        address: settings.address || "",
        city: settings.city || "",
        state: settings.state || "",
        zipCode: settings.zipCode || "",
        phone: settings.phone || "",
        email: settings.email || "",
        website: settings.website || "",
        logo: settings.logo || "",
        pdfTemplate: settings.pdfTemplate || DEFAULT_PDF_TEMPLATE,
      });
      if (settings.logo) {
        setLogoPreview(settings.logo);
      }
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Configurações salvas!",
        description: "As configurações da empresa foram atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 and open crop dialog
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageToCrop(base64);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageBase64: string) => {
    setFormData((prev) => ({ ...prev, logo: croppedImageBase64 }));
    setLogoPreview(croppedImageBase64);
    toast({
      title: "Logo recortado!",
      description: "Não esqueça de salvar as configurações.",
    });
  };

  // Simple template compiler for preview (same logic as html-pdf-generator)
  const compileTemplate = (template: string, data: Record<string, any>): string => {
    let result = template;
    
    const processConditionals = (content: string, context: Record<string, any>): string => {
      let result = content;
      let previousResult = '';
      
      while (result !== previousResult) {
        previousResult = result;
        result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, varName, innerContent) => {
          if (context[varName]) {
            return processConditionals(innerContent, context);
          }
          return '';
        });
      }
      
      return result;
    };
    
    const replaceVariables = (content: string, context: Record<string, any>): string => {
      let processedContent = content;
      Object.keys(context).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        processedContent = processedContent.replace(regex, context[key] || '');
      });
      return processedContent;
    };
    
    result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, varName, content) => {
      const items = data[varName] || [];
      return items.map((item: any) => {
        let itemContent = content;
        itemContent = processConditionals(itemContent, item);
        itemContent = replaceVariables(itemContent, item);
        return itemContent;
      }).join('');
    });
    
    result = processConditionals(result, data);
    result = replaceVariables(result, data);
    
    return result;
  };

  const handleGeneratePreview = () => {
    try {
      const previewDataWithLogo = {
        ...PREVIEW_DATA,
        logo: logoPreview || formData.logo,
        companyName: formData.companyName || PREVIEW_DATA.companyName,
        cnpj: formData.cnpj || PREVIEW_DATA.cnpj,
        address: formData.address || PREVIEW_DATA.address,
        city: formData.city || PREVIEW_DATA.city,
        state: formData.state || PREVIEW_DATA.state,
        phone: formData.phone || PREVIEW_DATA.phone,
        email: formData.email || PREVIEW_DATA.email,
        website: formData.website || PREVIEW_DATA.website,
      };

      const compiled = compileTemplate(formData.pdfTemplate, previewDataWithLogo);
      setPreviewHtml(compiled);
      setPreviewOpen(true);

      toast({
        title: "Preview atualizado!",
        description: "Visualize o resultado abaixo.",
      });
    } catch (error) {
      console.error("Erro ao gerar preview:", error);
      toast({
        title: "Erro ao gerar preview",
        description: "Verifique se o template HTML está correto.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Configurações da Empresa</h1>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Configurações da Empresa</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os dados da sua empresa para documentos e orçamentos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Logo da Empresa
            </CardTitle>
            <CardDescription>
              Imagem que aparecerá no cabeçalho dos orçamentos (máx. 2MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {logoPreview && (
              <div className="flex justify-center p-4 bg-muted rounded-lg">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-h-32 object-contain"
                  data-testid="img-logo-preview"
                />
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                data-testid="input-logo-file"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full md:w-auto"
                data-testid="button-upload-logo"
              >
                <Upload className="h-4 w-4 mr-2" />
                {logoPreview ? "Alterar Logo" : "Enviar Logo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>
              Informações básicas que aparecerão nos documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Zoom Comunicação Visual"
                  required
                  data-testid="input-company-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  data-testid="input-cnpj"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número, bairro"
                data-testid="input-address"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="São Paulo"
                  data-testid="input-city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                  data-testid="input-state"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="00000-000"
                  data-testid="input-zip"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>
              Informações de contato que aparecerão nos documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 98765-4321"
                  data-testid="input-phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contato@empresa.com.br"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="www.empresa.com.br"
                data-testid="input-website"
              />
            </div>
          </CardContent>
        </Card>

        {/* PDF Template Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Template de PDF Personalizado
            </CardTitle>
            <CardDescription>
              Edite o template HTML do PDF para personalizar totalmente o layout dos seus orçamentos.
              Use variáveis como {`{{companyName}}`}, {`{{budgetNumber}}`}, {`{{clientName}}`}, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pdfTemplate">Código HTML do Template</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange("pdfTemplate", DEFAULT_PDF_TEMPLATE)}
                  data-testid="button-reset-template"
                >
                  Restaurar Padrão
                </Button>
              </div>
              <Textarea
                id="pdfTemplate"
                value={formData.pdfTemplate}
                onChange={(e) => handleInputChange("pdfTemplate", e.target.value)}
                placeholder="Cole o código HTML do template aqui..."
                className="font-mono text-xs min-h-[400px]"
                data-testid="textarea-pdf-template"
              />
              <p className="text-xs text-muted-foreground">
                <strong>Variáveis disponíveis:</strong> {`{{companyName}}`}, {`{{logo}}`}, {`{{cnpj}}`}, {`{{address}}`}, 
                {`{{city}}`}, {`{{state}}`}, {`{{phone}}`}, {`{{email}}`}, {`{{website}}`}, {`{{budgetNumber}}`}, 
                {`{{date}}`}, {`{{validityDays}}`}, {`{{clientName}}`}, {`{{clientCompany}}`}, {`{{clientPhone}}`}, 
                {`{{clientEmail}}`}, {`{{clientLocation}}`}, {`{{total}}`}, {`{{material}}`}, {`{{finishing}}`}, 
                {`{{paymentTerms}}`}, {`{{warranty}}`}, {`{{installationInfo}}`}, {`{{installationDeadline}}`}, 
                {`{{deliveryTime}}`}, {`{{observations}}`}
              </p>
            </div>

            {/* Preview Button */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="default"
                onClick={handleGeneratePreview}
                data-testid="button-preview-template"
              >
                <Eye className="h-4 w-4 mr-2" />
                Atualizar Preview
              </Button>
            </div>

            {/* Preview Area */}
            {previewHtml && (
              <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    data-testid="button-toggle-preview"
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Visualização do PDF
                    </span>
                    {previewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-[800px]"
                      title="PDF Preview"
                      sandbox="allow-same-origin"
                      data-testid="iframe-pdf-preview"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Esta é uma visualização do PDF. Salve as configurações e gere um PDF real em "Orçamentos" para o arquivo final.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="w-full md:w-auto"
            data-testid="button-save-settings"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>

      {/* Image Crop Dialog */}
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
