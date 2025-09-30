import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { AgentConfig } from "@/types/dashboard";
import { Bot, Plus, Settings, Play, Pause, BarChart3, MessageSquare, Eye, RefreshCw } from "lucide-react";

interface AgentsPageProps {
  agentConfigs: AgentConfig[];
  getModuleIcon: (moduleId: string) => React.ReactNode;
  getModuleName: (moduleId: string) => string;
}

export default function AgentsPage({ agentConfigs, getModuleIcon, getModuleName }: AgentsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Agents</h2>
          <p className="text-muted-foreground">Configure and manage your AI agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Agent
          </Button>
        </div>
      </div>

      {/* Agent Cards */}
      {agentConfigs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12" data-testid="no-agents">
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No AI Agents Configured</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first AI agent to start automating your business processes.
            </p>
            <div className="flex gap-2 justify-center">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentConfigs.map((config) => (
            <Card key={config.id} className="hover-elevate transition-all" data-testid={`agent-config-${config.moduleId}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {getModuleIcon(config.moduleId)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{getModuleName(config.moduleId)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {config.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <Badge variant={config.isActive ? 'default' : 'secondary'}>
                    {config.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(config.updatedAt).toLocaleDateString()}
                </div>
                
                {/* Agent Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold">24</div>
                    <div className="text-xs text-muted-foreground">Interactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">98%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-configure-${config.moduleId}`}>
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button 
                    variant={config.isActive ? "secondary" : "default"} 
                    size="sm" 
                    className="flex-1"
                  >
                    {config.isActive ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Test Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Agent Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Agent Templates</CardTitle>
          <p className="text-sm text-muted-foreground">Quick start with pre-configured agent templates</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover-elevate transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Customer Support Bot</h4>
                  <p className="text-sm text-muted-foreground">24/7 customer assistance</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </div>

            <div className="border rounded-lg p-4 hover-elevate transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Sales Assistant</h4>
                  <p className="text-sm text-muted-foreground">Lead qualification & follow-up</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </div>

            <div className="border rounded-lg p-4 hover-elevate transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Custom Agent</h4>
                  <p className="text-sm text-muted-foreground">Build from scratch</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Create Custom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
