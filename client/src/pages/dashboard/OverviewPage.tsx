import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Share2, Users, CheckCircle } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { Subscription } from "@/types/dashboard";

interface OverviewPageProps {
  stats: {
    totalChats: number;
    totalCalls: number;
    socialPosts: number;
    leadsGenerated: number;
  };
  subscriptions: Subscription[];
  getModuleIcon: (moduleId: string) => React.ReactNode;
  getModuleName: (moduleId: string) => string;
}

export default function OverviewPage({ stats, subscriptions, getModuleIcon, getModuleName }: OverviewPageProps) {
  return (
    <div className="space-y-6">
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
      <DashboardCard
        title="Active Subscriptions"
        description="Your current AI agent subscriptions"
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
      >
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
      </DashboardCard>
    </div>
  );
}
