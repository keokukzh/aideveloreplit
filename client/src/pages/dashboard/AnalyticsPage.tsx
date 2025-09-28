import { DashboardCard } from "@/components/DashboardCard";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardCard
      title="Performance Analytics"
      description="Detailed insights into your AI agent performance"
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <div className="text-center py-12 text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
        <p>Detailed performance metrics and insights coming soon.</p>
      </div>
    </DashboardCard>
  );
}
