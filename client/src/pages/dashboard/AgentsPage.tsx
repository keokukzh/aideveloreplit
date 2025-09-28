import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";
import { AgentConfig } from "@/types/dashboard";
import { Bot } from "lucide-react";

interface AgentsPageProps {
  agentConfigs: AgentConfig[];
  getModuleIcon: (moduleId: string) => React.ReactNode;
  getModuleName: (moduleId: string) => string;
}

export default function AgentsPage({ agentConfigs, getModuleIcon, getModuleName }: AgentsPageProps) {
  return (
    <DashboardCard
      title="AI Agent Configuration"
      description="Manage and configure your AI agents"
      icon={<Bot className="h-5 w-5" />}
    >
      {agentConfigs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground" data-testid="no-agents">
          No AI agents configured yet.
        </div>
      ) : (
        <div className="space-y-4">
          {agentConfigs.map((config) => (
            <div key={config.id} className="border rounded-lg p-4" data-testid={`agent-config-${config.moduleId}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getModuleIcon(config.moduleId)}
                  <div>
                    <h4 className="font-medium">{getModuleName(config.moduleId)}</h4>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(config.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={config.isActive ? 'default' : 'secondary'}>
                    {config.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm" data-testid={`button-configure-${config.moduleId}`}>
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
