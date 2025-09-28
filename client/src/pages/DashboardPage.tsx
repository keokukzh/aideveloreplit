import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageCircle, Share2, Settings, BarChart3, Users, Clock, CheckCircle } from "lucide-react";

interface Subscription {
  id: string;
  moduleId: string;
  status: string;
  price: number;
  startDate: string;
}

interface AgentConfig {
  id: string;
  moduleId: string;
  isActive: boolean;
  configuration: any;
  updatedAt: string;
}

interface DashboardData {
  subscriptions: Subscription[];
  agentConfigs: AgentConfig[];
  stats: {
    totalChats: number;
    totalCalls: number;
    socialPosts: number;
    leadsGenerated: number;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user dashboard data
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'phone': return <Phone className="h-5 w-5" />;
      case 'chat': return <MessageCircle className="h-5 w-5" />;
      case 'social': return <Share2 className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getModuleName = (moduleId: string) => {
    switch (moduleId) {
      case 'phone': return 'AI Phone Agent';
      case 'chat': return 'AI Chat Agent';
      case 'social': return 'AI Social Media Agent';
      default: return 'Unknown Module';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const subscriptions = dashboardData?.subscriptions || [];
  const agentConfigs = dashboardData?.agentConfigs || [];
  const stats = dashboardData?.stats || { totalChats: 0, totalCalls: 0, socialPosts: 0, leadsGenerated: 0 };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" data-testid="title-dashboard">AIDevelo.AI Dashboard</h1>
              <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
                Manage your AI agents and monitor performance
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              data-testid="button-back-home"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" data-testid="tabs-dashboard">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="agents" data-testid="tab-agents">AI Agents</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="card-stat-chats">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-chats">{stats.totalChats}</div>
                  <p className="text-xs text-muted-foreground">Website conversations</p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-calls">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-calls">{stats.totalCalls}</div>
                  <p className="text-xs text-muted-foreground">Calls handled</p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-posts">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-posts">{stats.socialPosts}</div>
                  <p className="text-xs text-muted-foreground">Content published</p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-leads">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-leads">{stats.leadsGenerated}</div>
                  <p className="text-xs text-muted-foreground">New prospects</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Subscriptions */}
            <Card data-testid="card-subscriptions">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Active Subscriptions
                </CardTitle>
                <CardDescription>
                  Your current AI agent subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground" data-testid="no-subscriptions">
                    No active subscriptions found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border rounded-lg p-4 space-y-3" data-testid={`subscription-${subscription.moduleId}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getModuleIcon(subscription.moduleId)}
                            <span className="font-medium">{getModuleName(subscription.moduleId)}</span>
                          </div>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          €{(subscription.price / 100).toFixed(2)}/month
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started: {new Date(subscription.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card data-testid="card-agent-configs">
              <CardHeader>
                <CardTitle>AI Agent Configuration</CardTitle>
                <CardDescription>
                  Manage and configure your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card data-testid="card-analytics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Detailed insights into your AI agent performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p>Detailed performance metrics and insights coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card data-testid="card-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Settings Panel</h3>
                  <p>Account management and preferences coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}