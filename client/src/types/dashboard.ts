export interface Subscription {
  id: string;
  moduleId: string;
  status: string;
  price: number;
  startDate: string;
}

export interface AgentConfig {
  id: string;
  moduleId: string;
  isActive: boolean;
  configuration: any;
  updatedAt: string;
}

export interface DashboardData {
  subscriptions: Subscription[];
  agentConfigs: AgentConfig[];
  stats: {
    totalChats: number;
    totalCalls: number;
    socialPosts: number;
    leadsGenerated: number;
  };
}
