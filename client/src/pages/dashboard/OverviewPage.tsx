import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Share2, Users, CheckCircle, Plus, RefreshCw, TrendingUp, Activity, Calendar, Settings } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { Subscription } from "@/types/dashboard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function OverviewPage({ stats, subscriptions, getModuleIcon, getModuleName, onRefresh, isLoading }: OverviewPageProps) {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  async function handleCreateDemoData() {
    try {
      setIsSeeding(true);
      const res = await fetch('/api/demo-data', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Demo-Daten erstellt', description: 'PRO Account mit allen Produkten angelegt.' });
        onRefresh?.();
      } else {
        toast({ title: 'Fehler beim Erstellen', description: data?.message || 'Bitte erneut versuchen', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Netzwerkfehler', description: 'Server nicht erreichbar', variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  }
  // Sample data for charts
  const activityData = [
    { name: 'Mon', chats: 12, calls: 4, posts: 2 },
    { name: 'Tue', chats: 19, calls: 7, posts: 3 },
    { name: 'Wed', chats: 8, calls: 2, posts: 1 },
    { name: 'Thu', chats: 15, calls: 6, posts: 4 },
    { name: 'Fri', chats: 22, calls: 9, posts: 3 },
    { name: 'Sat', chats: 11, calls: 3, posts: 1 },
    { name: 'Sun', chats: 7, calls: 1, posts: 2 },
  ];

  const moduleUsageData = [
    { name: 'Chat Agent', value: stats.totalChats || 45, color: '#0088FE' },
    { name: 'Phone Agent', value: stats.totalCalls || 25, color: '#00C49F' },
    { name: 'Social Agent', value: stats.socialPosts || 15, color: '#FFBB28' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your AI agents' performance and activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Quickstart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quickstart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">1. Demo-Daten anlegen</div>
              <Button onClick={handleCreateDemoData} disabled={isSeeding} className="w-full">
                {isSeeding ? <RefreshCw className="h-4 w-4 mr-2 animate-spin"/> : <Plus className="h-4 w-4 mr-2"/>}
                PRO-Demo aktivieren
              </Button>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">2. Leads testen</div>
              <a href="/products" className="w-full">
                <Button variant="outline" className="w-full">Produkte ansehen</Button>
              </a>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">3. Agent konfigurieren</div>
              <a href="/dashboard/settings" className="w-full">
                <Button variant="ghost" className="w-full">Zu Einstellungen</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-stat-chats" className="hover-elevate cursor-pointer transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-chats">{stats.totalChats || 45}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% from last week
            </p>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View Conversations
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-calls" className="hover-elevate cursor-pointer transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-calls">{stats.totalCalls || 28}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +8% from last week
            </p>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View Call Logs
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-posts" className="hover-elevate cursor-pointer transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Share2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-posts">{stats.socialPosts || 15}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +5% from last week
            </p>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              Manage Posts
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-leads" className="hover-elevate cursor-pointer transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-leads">{stats.leadsGenerated || 12}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +18% from last week
            </p>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View Leads
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="chats" stackId="1" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                <Area type="monotone" dataKey="calls" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                <Area type="monotone" dataKey="posts" stackId="1" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Agent Usage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moduleUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moduleUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {moduleUsageData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
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
          <div className="text-center py-12" data-testid="no-subscriptions">
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by subscribing to our AI agents to automate your business processes.
            </p>
            <div className="flex gap-2 justify-center">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse AI Agents
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="border rounded-lg p-4 space-y-3 hover-elevate transition-all" data-testid={`subscription-${subscription.moduleId}`}>
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
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    View Stats
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm">Test Chat Bot</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Phone className="h-6 w-6" />
              <span className="text-sm">Call Logs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Export Leads</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span className="text-sm">Agent Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
