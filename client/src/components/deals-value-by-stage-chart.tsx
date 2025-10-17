import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Deal } from "@shared/schema";

interface DealsValueByStageChartProps {
  deals: Deal[];
}

const stageNames: Record<string, string> = {
  contact: "Contato",
  collection: "Coleta",
  qualification: "Qualificação",
  costing: "Custo",
  sent: "Enviado",
  followup: "Follow-up",
  closed: "Fechado",
  unknown: "Sem estágio",
};

export function DealsValueByStageChart({ deals }: DealsValueByStageChartProps) {
  const activeDeals = deals.filter(d => d.status === "active");

  const stages = ["contact", "collection", "qualification", "costing", "sent", "followup", "closed", "unknown"];
  
  const data = stages.map(stage => {
    const stageDeals = activeDeals.filter(d => {
      if (stage === "unknown") {
        return !d.stage || !["contact", "collection", "qualification", "costing", "sent", "followup", "closed"].includes(d.stage);
      }
      return d.stage === stage;
    });
    const totalValue = stageDeals.reduce((sum, d) => sum + Number(d.value ?? 0), 0);
    
    return {
      stage: stageNames[stage] || stage,
      value: totalValue,
      count: stageDeals.length,
    };
  }).filter(item => item.count > 0);

  return (
    <Card data-testid="card-deals-value-by-stage">
      <CardHeader>
        <CardTitle className="text-lg">Valor por Estágio (Pipeline)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="stage" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Valor Total"]}
                labelStyle={{ color: "#000" }}
              />
              <Bar dataKey="value" fill="#FFD200" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nenhum negócio ativo no pipeline
          </div>
        )}
      </CardContent>
    </Card>
  );
}
