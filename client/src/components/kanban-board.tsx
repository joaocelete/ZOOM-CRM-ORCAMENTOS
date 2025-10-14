import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Eye, Trash2 } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  clientName: string;
  value: number;
  stage: string;
  updatedAt: string;
}

const stages = [
  { id: "contact", name: "Contato", color: "bg-chart-2/10 text-chart-2" },
  { id: "collection", name: "Coleta", color: "bg-chart-4/10 text-chart-4" },
  { id: "qualification", name: "Qualificação", color: "bg-chart-1/10 text-chart-1" },
  { id: "costing", name: "Cálculo", color: "bg-chart-5/10 text-chart-5" },
  { id: "sent", name: "Enviado", color: "bg-chart-2/10 text-chart-2" },
  { id: "followup", name: "Follow-up", color: "bg-chart-4/10 text-chart-4" },
  { id: "closed", name: "Fechamento", color: "bg-chart-3/10 text-chart-3" },
];

interface KanbanBoardProps {
  deals: Deal[];
  onDealClick?: (deal: Deal) => void;
  onDeleteDeal?: (id: string) => void;
}

export function KanbanBoard({ deals, onDealClick, onDeleteDeal }: KanbanBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDrop = (stageId: string) => {
    if (draggedDeal) {
      console.log(`Moving deal ${draggedDeal.id} to stage ${stageId}`);
      setDraggedDeal(null);
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map(stage => {
          const stageDeals = getDealsByStage(stage.id);
          const total = getStageTotal(stage.id);
          
          return (
            <div
              key={stage.id}
              className="w-80 shrink-0"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">{stage.name}</CardTitle>
                    <Badge variant="secondary" className={stage.color}>
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stageDeals.map(deal => (
                    <Card
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                      className="cursor-move hover-elevate active-elevate-2"
                      data-testid={`deal-card-${deal.id}`}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <p className="font-semibold text-sm">{deal.clientName}</p>
                          <p className="text-xs text-muted-foreground">{deal.title}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-base font-bold text-primary">
                            R$ {deal.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => onDealClick?.(deal)}
                              data-testid={`button-view-${deal.id}`}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => onDeleteDeal?.(deal.id)}
                              data-testid={`button-delete-deal-${deal.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{deal.updatedAt}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">Arraste aqui</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
