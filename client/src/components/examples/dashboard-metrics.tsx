import { DashboardMetrics } from '../dashboard-metrics'

export default function DashboardMetricsExample() {
  return (
    <DashboardMetrics 
      totalClients={142}
      activeDeals={28}
      budgetsSent={67}
      conversionRate={34}
    />
  )
}
