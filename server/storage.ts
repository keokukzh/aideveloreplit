import { 
  type User, type InsertUser, 
  type Lead, type InsertLead, 
  type Contact, type InsertContact,
  type Subscription, type InsertSubscription,
  type AgentConfig, type InsertAgentConfig,
  type ChatSession, type InsertChatSession,
  type ChatMessage, type InsertChatMessage,
  type PhoneCall, type SocialPost
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  
  // Contact management
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;
  
  // Subscription management
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getUserSubscriptions(userId: string): Promise<Subscription[]>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Agent configuration
  createAgentConfig(config: InsertAgentConfig): Promise<AgentConfig>;
  getUserAgentConfigs(userId: string): Promise<AgentConfig[]>;
  getAgentConfig(id: string): Promise<AgentConfig | undefined>;
  updateAgentConfig(id: string, updates: Partial<AgentConfig>): Promise<AgentConfig | undefined>;
  
  // Chat functionality
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Phone functionality
  createPhoneCall(call: Omit<PhoneCall, 'id' | 'createdAt'>): Promise<PhoneCall>;
  getPhoneCalls(agentConfigId: string): Promise<PhoneCall[]>;
  
  // Social media functionality
  createSocialPost(post: Omit<SocialPost, 'id' | 'createdAt'>): Promise<SocialPost>;
  getSocialPosts(agentConfigId: string): Promise<SocialPost[]>;
  updateSocialPost(id: string, updates: Partial<SocialPost>): Promise<SocialPost | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private contacts: Map<string, Contact>;
  private subscriptions: Map<string, Subscription>;
  private agentConfigs: Map<string, AgentConfig>;
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage>;
  private phoneCalls: Map<string, PhoneCall>;
  private socialPosts: Map<string, SocialPost>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.contacts = new Map();
    this.subscriptions = new Map();
    this.agentConfigs = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.phoneCalls = new Map();
    this.socialPosts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      company: insertUser.company || null,
      stripeCustomerId: null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      ...insertLead,
      message: insertLead.message ?? null,
      phone: insertLead.phone ?? null,
      id, 
      createdAt: new Date() 
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    
    // Calculate lead score based on responses
    let leadScore = 0;
    if (insertContact.budget === "100k+") leadScore += 30;
    else if (insertContact.budget === "50k-100k") leadScore += 25;
    else if (insertContact.budget === "15k-50k") leadScore += 20;
    else leadScore += 10;
    
    if (insertContact.timeline === "asap") leadScore += 20;
    else if (insertContact.timeline === "1-3months") leadScore += 15;
    else if (insertContact.timeline === "3-6months") leadScore += 10;
    else leadScore += 5;
    
    if (insertContact.employeeCount === "1000+") leadScore += 20;
    else if (insertContact.employeeCount === "201-999") leadScore += 15;
    else if (insertContact.employeeCount === "51-200") leadScore += 10;
    else leadScore += 5;
    
    if (insertContact.interestedModules.length >= 3) leadScore += 15;
    else if (insertContact.interestedModules.length >= 2) leadScore += 10;
    else leadScore += 5;

    const contact: Contact = { 
      ...insertContact,
      website: insertContact.website || null,
      phone: insertContact.phone || null,
      additionalInfo: insertContact.additionalInfo || null,
      acceptPrivacy: insertContact.acceptPrivacy || "false",
      acceptNewsletter: insertContact.acceptNewsletter || "false",
      leadScore: leadScore.toString(),
      status: "new",
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (contact) {
      const updatedContact = { ...contact, status };
      this.contacts.set(id, updatedContact);
      return updatedContact;
    }
    return undefined;
  }

  // Subscription methods
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const now = new Date();
    const subscription: Subscription = { 
      id,
      userId: insertSubscription.userId,
      moduleId: insertSubscription.moduleId,
      stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null,
      status: insertSubscription.status || "active",
      price: insertSubscription.price,
      startDate: insertSubscription.startDate || now,
      endDate: insertSubscription.endDate || null,
      createdAt: now,
      updatedAt: now
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      const updatedSubscription = { ...subscription, ...updates, updatedAt: new Date() };
      this.subscriptions.set(id, updatedSubscription);
      return updatedSubscription;
    }
    return undefined;
  }

  // Agent configuration methods
  async createAgentConfig(insertConfig: InsertAgentConfig): Promise<AgentConfig> {
    const id = randomUUID();
    const now = new Date();
    const config: AgentConfig = { 
      id,
      userId: insertConfig.userId,
      moduleId: insertConfig.moduleId,
      isActive: insertConfig.isActive !== undefined ? insertConfig.isActive : true,
      configuration: insertConfig.configuration,
      knowledgeBase: insertConfig.knowledgeBase || null,
      customInstructions: insertConfig.customInstructions || null,
      createdAt: now,
      updatedAt: now
    };
    this.agentConfigs.set(id, config);
    return config;
  }

  async getUserAgentConfigs(userId: string): Promise<AgentConfig[]> {
    return Array.from(this.agentConfigs.values())
      .filter(config => config.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getAgentConfig(id: string): Promise<AgentConfig | undefined> {
    return this.agentConfigs.get(id);
  }

  async updateAgentConfig(id: string, updates: Partial<AgentConfig>): Promise<AgentConfig | undefined> {
    const config = this.agentConfigs.get(id);
    if (config) {
      const updatedConfig = { ...config, ...updates, updatedAt: new Date() };
      this.agentConfigs.set(id, updatedConfig);
      return updatedConfig;
    }
    return undefined;
  }

  // Chat methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = { 
      id,
      agentConfigId: insertSession.agentConfigId,
      visitorId: insertSession.visitorId || null,
      visitorEmail: insertSession.visitorEmail || null,
      visitorName: insertSession.visitorName || null,
      isLeadCaptured: insertSession.isLeadCaptured || false,
      startedAt: new Date(),
      endedAt: null
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage,
      id,
      timestamp: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Phone methods
  async createPhoneCall(callData: Omit<PhoneCall, 'id' | 'createdAt'>): Promise<PhoneCall> {
    const id = randomUUID();
    const call: PhoneCall = { 
      ...callData,
      id,
      createdAt: new Date(),
      duration: callData.duration || null,
      transcript: callData.transcript || null,
      summary: callData.summary || null,
      appointmentDetails: callData.appointmentDetails || null
    };
    this.phoneCalls.set(id, call);
    return call;
  }

  async getPhoneCalls(agentConfigId: string): Promise<PhoneCall[]> {
    return Array.from(this.phoneCalls.values())
      .filter(call => call.agentConfigId === agentConfigId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Social media methods
  async createSocialPost(postData: Omit<SocialPost, 'id' | 'createdAt'>): Promise<SocialPost> {
    const id = randomUUID();
    const post: SocialPost = { 
      ...postData,
      id,
      createdAt: new Date(),
      imageUrl: postData.imageUrl || null,
      scheduledFor: postData.scheduledFor || null,
      publishedAt: postData.publishedAt || null,
      platformPostId: postData.platformPostId || null,
      engagement: postData.engagement || null
    };
    this.socialPosts.set(id, post);
    return post;
  }

  async getSocialPosts(agentConfigId: string): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values())
      .filter(post => post.agentConfigId === agentConfigId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateSocialPost(id: string, updates: Partial<SocialPost>): Promise<SocialPost | undefined> {
    const post = this.socialPosts.get(id);
    if (post) {
      const updatedPost = { ...post, ...updates };
      this.socialPosts.set(id, updatedPost);
      return updatedPost;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
