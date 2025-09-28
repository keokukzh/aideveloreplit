import { DashboardCard } from "@/components/DashboardCard";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardCard
      title="Account Settings"
      description="Manage your account and billing preferences"
      icon={<Settings className="h-5 w-5" />}
    >
      <div className="text-center py-12 text-muted-foreground">
        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Settings Panel</h3>
        <p>Account management and preferences coming soon.</p>
      </div>
    </DashboardCard>
  );
}
