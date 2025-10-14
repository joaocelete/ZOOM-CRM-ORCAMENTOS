import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Phone, CheckCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "budget" | "call" | "deal" | "followup";
  client: string;
  description: string;
  time: string;
  status?: "sent" | "approved" | "pending";
}

const activityIcons = {
  budget: FileText,
  call: Phone,
  deal: CheckCircle,
  followup: Clock,
};

const statusColors = {
  sent: "bg-chart-2/10 text-chart-2",
  approved: "bg-chart-3/10 text-chart-3",
  pending: "bg-chart-4/10 text-chart-4",
};

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex gap-3" data-testid={`activity-${activity.id}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-none">{activity.client}</p>
                    {activity.status && (
                      <Badge variant="secondary" className={statusColors[activity.status]}>
                        {activity.status === "sent" && "Enviado"}
                        {activity.status === "approved" && "Aprovado"}
                        {activity.status === "pending" && "Pendente"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
