import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company").notNull(),
  industry: text("industry").notNull(),
  phone: text("phone"),
  email: text("email").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company").notNull(),
  website: text("website"),
  employeeCount: text("employee_count").notNull(),
  industry: text("industry").notNull(),
  interestedModules: text("interested_modules").array().notNull(),
  currentChallenges: text("current_challenges").notNull(),
  budget: text("budget").notNull(),
  timeline: text("timeline").notNull(),
  additionalInfo: text("additional_info"),
  acceptPrivacy: text("accept_privacy").notNull().default("false"),
  acceptNewsletter: text("accept_newsletter").default("false"),
  leadScore: text("lead_score"), // calculated lead score based on responses
  status: text("status").default("new"), // new, contacted, qualified, converted
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table for tracking user purchases
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: text("module_id").notNull(), // 'phone', 'chat', 'social'
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull().default("active"), // active, cancelled, paused
  price: integer("price").notNull(), // price in cents
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Agent configurations for each user's purchased modules
export const agentConfigs = pgTable("agent_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: text("module_id").notNull(), // 'phone', 'chat', 'social'
  isActive: boolean("is_active").notNull().default(true),
  configuration: jsonb("configuration").notNull(), // module-specific config JSON
  knowledgeBase: jsonb("knowledge_base"), // FAQ, business info, etc.
  customInstructions: text("custom_instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat conversations and messages
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentConfigId: varchar("agent_config_id").notNull().references(() => agentConfigs.id),
  visitorId: text("visitor_id"), // for anonymous website visitors
  visitorEmail: text("visitor_email"),
  visitorName: text("visitor_name"),
  isLeadCaptured: boolean("is_lead_captured").default(false),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => chatSessions.id),
  sender: text("sender").notNull(), // 'user' or 'agent'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Phone call logs
export const phoneCalls = pgTable("phone_calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentConfigId: varchar("agent_config_id").notNull().references(() => agentConfigs.id),
  callerNumber: text("caller_number").notNull(),
  duration: integer("duration"), // in seconds
  transcript: text("transcript"),
  summary: text("summary"),
  appointmentBooked: boolean("appointment_booked").default(false),
  appointmentDetails: jsonb("appointment_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Social media posts and analytics
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentConfigId: varchar("agent_config_id").notNull().references(() => agentConfigs.id),
  platform: text("platform").notNull(), // 'facebook', 'instagram', 'linkedin', 'twitter'
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  platformPostId: text("platform_post_id"), // ID from the social platform
  engagement: jsonb("engagement"), // likes, shares, comments count
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  company: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentConfigSchema = createInsertSchema(agentConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  startedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  leadScore: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertAgentConfig = z.infer<typeof insertAgentConfigSchema>;
export type AgentConfig = typeof agentConfigs.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type PhoneCall = typeof phoneCalls.$inferSelect;
export type SocialPost = typeof socialPosts.$inferSelect;
