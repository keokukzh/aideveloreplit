import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Share2, Settings, BarChart3, Users, CheckCircle, LayoutDashboard, Bot } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Router, Switch, Route } from "wouter";
import { DashboardData } from "@/types/dashboard";
import OverviewPage from "./dashboard/OverviewPage";
import AgentsPage from "./dashboard/AgentsPage";
import AnalyticsPage from "./dashboard/AnalyticsPage";
import SettingsPage from "./dashboard/SettingsPage";
import mainLogoImage from "@assets/IMG_0948_1758859780928.png";

export default function DashboardPage() {
  // Fetch user dashboard data with auto-refresh
  const { data: dashboardData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: true,
  });

  const handleRefresh = () => {
    refetch();
  };

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

  const sidebarNavItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "AI Agents",
      href: "/dashboard/agents",
      icon: <Bot className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={mainLogoImage}
                alt="AIDevelo.AI Logo"
                className="h-10 w-auto invert dark:invert-0"
                data-testid="img-dashboard-logo"
              />
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <Sidebar items={sidebarNavItems} />
          </aside>

          <main className="lg:col-span-4">
            <Router base="/dashboard">
              <Switch>
                <Route path="/agents">
                  <AgentsPage agentConfigs={agentConfigs} getModuleIcon={getModuleIcon} getModuleName={getModuleName} />
                </Route>
                <Route path="/analytics">
                  <AnalyticsPage />
                </Route>
                <Route path="/settings">
                  <SettingsPage />
                </Route>
                <Route path="/">
                  <OverviewPage 
                    stats={stats} 
                    subscriptions={subscriptions} 
                    getModuleIcon={getModuleIcon} 
                    getModuleName={getModuleName}
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                  />
                </Route>
              </Switch>
            </Router>
          </main>
        </div>
      </div>
    </div>
  );
}
