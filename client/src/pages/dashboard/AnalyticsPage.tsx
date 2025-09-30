import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, MessageSquare, Phone, Calendar, Download, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  // Sample analytics data
  const performanceData = [
    { date: '2024-01-01', chats: 45, calls: 23, leads: 12, satisfaction: 4.2 },
    { date: '2024-01-02', chats: 52, calls: 31, leads: 18, satisfaction: 4.5 },
    { date: '2024-01-03', chats: 38, calls: 19, leads: 9, satisfaction: 4.1 },
    { date: '2024-01-04', chats: 61, calls: 41, leads: 24, satisfaction: 4.7 },
    { date: '2024-01-05', chats: 55, calls: 28, leads: 16, satisfaction: 4.3 },
    { date: '2024-01-06', chats: 49, calls: 35, leads: 21, satisfaction: 4.6 },
    { date: '2024-01-07', chats: 43, calls: 25, leads: 14, satisfaction: 4.4 },
  ];

  const responseTimeData = [
    { agent: 'Chat Bot', avgTime: 2.3, target: 3.0 },
    { agent: 'Phone Agent', avgTime: 1.8, target: 2.0 },
    { agent: 'Social Bot', avgTime: 4.1, target: 5.0 },
  ];

  const satisfactionData = [
    { name: 'Excellent', value: 65, color: '#10B981' },
    { name: 'Good', value: 25, color: '#F59E0B' },
    { name: 'Average', value: 8, color: '#EF4444' },
    { name: 'Poor', value: 2, color: '#6B7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Detailed performance insights for your AI agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4s</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              -0.3s from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +0.2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Daily activity over the past week</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="chats" stroke="#0088FE" strokeWidth={2} />
                <Line type="monotone" dataKey="calls" stroke="#00C49F" strokeWidth={2} />
                <Line type="monotone" dataKey="leads" stroke="#FFBB28" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <p className="text-sm text-muted-foreground">Feedback distribution</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {satisfactionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Average response times vs targets</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#0088FE" name="Average Time (s)" />
              <Bar dataKey="target" fill="#E5E7EB" name="Target (s)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed breakdown by agent type</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Agent</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Interactions</th>
                  <th className="text-left py-2">Avg Response</th>
                  <th className="text-left py-2">Satisfaction</th>
                  <th className="text-left py-2">Uptime</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat Agent
                  </td>
                  <td className="py-3">
                    <Badge variant="default">Active</Badge>
                  </td>
                  <td className="py-3">843</td>
                  <td className="py-3">2.3s</td>
                  <td className="py-3">4.7/5</td>
                  <td className="py-3">99.2%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Agent
                  </td>
                  <td className="py-3">
                    <Badge variant="default">Active</Badge>
                  </td>
                  <td className="py-3">256</td>
                  <td className="py-3">1.8s</td>
                  <td className="py-3">4.5/5</td>
                  <td className="py-3">98.7%</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Social Agent
                  </td>
                  <td className="py-3">
                    <Badge variant="secondary">Inactive</Badge>
                  </td>
                  <td className="py-3">148</td>
                  <td className="py-3">4.1s</td>
                  <td className="py-3">4.2/5</td>
                  <td className="py-3">95.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
