import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, GripVertical, Phone, Mail, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Deal {
  id: string;
  title: string;
  clientName: string;
  value: number;
  stage: string;
  updatedAt: string;
  isStale?: boolean; // True if no activity for >7 days
  daysInactive?: number;
}

const stages = [
  { id: "contact", name: "CONTATO", count: 2, total: 42050.00, color: "bg-blue-500" },
  { id: "collection", name: "COLETA DAS INFORMAÇÕES", count: 3, total: 50300.00, color: "bg-purple-500" },
  { id: "qualification", name: "QUALIFICAÇÃO INTERESSE", count: 0, total: 6000.00, color: "bg-yellow-500" },
  { id: "costing", name: "CÁLCULO DO CUSTO", count: 1, total: 48800.00, color: "bg-orange-500" },
  { id: "sent", name: "ENVIO ORÇAMENTO", count: 1, total: 3837.00, color: "bg-pink-500" },
  { id: "followup", name: "FOLLOW-UP", count: 1, total: 450.00, color: "bg-green-500" },
];

interface KanbanBoardProps {
  deals: Deal[];
  onDealClick?: (deal: Deal) => void;
  onDeleteDeal?: (id: string) => void;
  onMoveCard?: (dealId: string, newStage: string) => void;
}

export function KanbanBoard({ deals, onDealClick, onDeleteDeal, onMoveCard }: KanbanBoardProps) {
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
    if (draggedDeal && draggedDeal.stage !== stageId) {
      onMoveCard?.(draggedDeal.id, stageId);
      setDraggedDeal(null);
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-3 min-w-max px-1 h-[calc(100vh-280px)]">
        {stages.map(stage => {
          const stageDeals = getDealsByStage(stage.id);
          const total = getStageTotal(stage.id);
          
          return (
            <div
              key={stage.id}
              className="w-[280px] shrink-0 flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="mb-3 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`h-1 w-8 rounded-full ${stage.color}`} />
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    {stage.name}
                  </h3>
                  <Badge variant="secondary" className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-xs">
                    {stageDeals.length}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-foreground">
                  R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {stageDeals.map(deal => (
                  <Card
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    className="group cursor-move border border-border bg-card transition-all hover:shadow-md"
                    data-testid={`deal-card-${deal.id}`}
                  >
                    <CardContent className="p-3">
                      <div className="mb-2 flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold leading-tight text-foreground">
                                  {deal.clientName}
                                </span>
                                {deal.isStale && (
                                  <Badge variant="destructive" className="h-4 text-[10px] px-1">
                                    {deal.daysInactive}d parado
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground leading-tight">
                                {deal.title}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                  data-testid={`button-menu-${deal.id}`}
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onDealClick?.(deal)}>
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDeleteDeal?.(deal.id)}>
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-xs font-semibold text-primary">
                                {deal.clientName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => console.log('Call client')}
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => console.log('Email client')}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                            <span className="text-base font-bold text-primary">
                              R$ {deal.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs text-muted-foreground">{deal.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="flex h-full min-h-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20">
                    <p className="text-xs text-muted-foreground">Arraste negócios aqui</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
