import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";

interface ProductionItem {
  id: string;
  clientName: string;
  product: string;
  status: string;
  assignedTo?: string;
  deadline: string;
}

const statuses = [
  { id: "awaiting", name: "Aguardando", color: "bg-chart-4/10 text-chart-4" },
  { id: "production", name: "Em Produção", color: "bg-chart-2/10 text-chart-2" },
  { id: "installation", name: "Instalação", color: "bg-chart-1/10 text-chart-1" },
  { id: "completed", name: "Concluído", color: "bg-chart-3/10 text-chart-3" },
];

interface ProductionKanbanProps {
  items: ProductionItem[];
  onStatusChange?: (id: string, status: string) => void;
}

export function ProductionKanban({ items, onStatusChange }: ProductionKanbanProps) {
  const getItemsByStatus = (statusId: string) => {
    return items.filter(item => item.status === statusId);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {statuses.map(status => {
          const statusItems = getItemsByStatus(status.id);
          
          return (
            <div key={status.id} className="w-80 shrink-0">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">{status.name}</CardTitle>
                    <Badge variant="secondary" className={status.color}>
                      {statusItems.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {statusItems.map(item => (
                    <Card
                      key={item.id}
                      className="hover-elevate"
                      data-testid={`production-card-${item.id}`}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <p className="font-semibold text-sm">{item.clientName}</p>
                          <p className="text-xs text-muted-foreground">{item.product}</p>
                        </div>
                        {item.assignedTo && (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {item.assignedTo.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.assignedTo}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{item.deadline}</span>
                          </div>
                          {status.id !== "completed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const nextStatus = statuses[statuses.findIndex(s => s.id === status.id) + 1];
                                if (nextStatus) {
                                  onStatusChange?.(item.id, nextStatus.id);
                                }
                              }}
                              data-testid={`button-next-status-${item.id}`}
                              className="h-7 text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Avançar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {statusItems.length === 0 && (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">Nenhum item</p>
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
