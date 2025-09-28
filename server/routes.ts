import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";
import { generateChatResponse, type KnowledgeBase } from "./services/openai";

// Chat API validation schemas
const createChatSessionSchema = z.object({
  agentConfigId: z.string().min(1, "Agent config ID is required"),
  visitorId: z.string().optional(),
  visitorEmail: z.string().email().optional(),
  visitorName: z.string().optional()
});

const chatMessageSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  message: z.string().min(1, "Message is required"),
  sender: z.enum(['user', 'agent'], { required_error: "Sender must be 'user' or 'agent'" })
});

// Rate limiting map (simple in-memory rate limiting)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(identifier);
  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.resetTime < now) {
    // Reset window
    current.count = 1;
    current.resetTime = now + windowMs;
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

// Initialize Stripe with secret key from javascript_stripe integration
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      // Validate request body
      const leadData = insertLeadSchema.parse(req.body);
      
      // Create lead in storage
      const lead = await storage.createLead(leadData);
      
      res.status(201).json({
        success: true,
        message: "Lead successfully created",
        data: {
          id: lead.id,
          name: lead.name,
          company: lead.company,
          email: lead.email
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  });

  // Contact form submission endpoint (enhanced version)
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const contactData = insertContactSchema.parse(req.body);
      
      // Create contact in storage
      const contact = await storage.createContact(contactData);
      
      res.status(201).json({
        success: true,
        message: "Kontaktanfrage erfolgreich gesendet",
        data: {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          company: contact.company,
          email: contact.email,
          leadScore: contact.leadScore
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validierungsfehler",
          errors: error.errors
        });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({
          success: false,
          message: "Interner Serverfehler"
        });
      }
    }
  });

  // Get all contacts endpoint (for potential admin dashboard)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get all leads endpoint (for potential admin dashboard)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({
        success: true,
        data: leads
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Stripe payment route for one-time payments (from javascript_stripe integration)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, selectedModuleIds } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid amount" 
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur", // Use EUR for German market
        metadata: {
          selectedModules: selectedModuleIds?.join(',') || '',
        },
      });
      
      res.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        success: false,
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Dashboard API - Get user dashboard data
  app.get("/api/dashboard", async (req, res) => {
    try {
      // For demo purposes, use a mock user ID
      // In production, this would come from authentication
      const mockUserId = "demo-user-123";
      
      const subscriptions = await storage.getUserSubscriptions(mockUserId);
      const agentConfigs = await storage.getUserAgentConfigs(mockUserId);
      
      // Calculate stats from agent configs
      let totalChats = 0;
      let totalCalls = 0;
      let socialPosts = 0;
      let leadsGenerated = 0;
      
      for (const config of agentConfigs) {
        if (config.moduleId === 'chat') {
          // Mock chat stats - in real implementation, query chat messages
          totalChats += Math.floor(Math.random() * 50) + 10;
        } else if (config.moduleId === 'phone') {
          const calls = await storage.getPhoneCalls(config.id);
          totalCalls += calls.length;
        } else if (config.moduleId === 'social') {
          const posts = await storage.getSocialPosts(config.id);
          socialPosts += posts.length;
        }
      }
      
      // Mock leads generated
      leadsGenerated = Math.floor(Math.random() * 20) + 5;
      
      res.json({
        success: true,
        data: {
          subscriptions,
          agentConfigs,
          stats: {
            totalChats,
            totalCalls,
            socialPosts,
            leadsGenerated
          }
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Chat Agent API - Start new chat session
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      // Rate limiting
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      if (!checkRateLimit(`session_${clientIp}`, 10, 60000)) { // 10 sessions per minute
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later."
        });
      }

      // Validate request body
      const validationResult = createChatSessionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.errors
        });
      }

      const { agentConfigId, visitorId, visitorEmail, visitorName } = validationResult.data;
      
      const sessionData = {
        agentConfigId,
        visitorId: visitorId || null,
        visitorEmail: visitorEmail || null,
        visitorName: visitorName || null,
        isLeadCaptured: false
      };
      
      const session = await storage.createChatSession(sessionData);
      
      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Chat Agent API - Send message and get AI response
  app.post("/api/chat/messages", async (req, res) => {
    try {
      // Rate limiting
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      if (!checkRateLimit(`message_${clientIp}`, 60, 60000)) { // 60 messages per minute
        return res.status(429).json({
          success: false,
          message: "Too many messages. Please slow down."
        });
      }

      // Validate request body
      const validationResult = chatMessageSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.errors
        });
      }

      const { sessionId, message, sender } = validationResult.data;
      
      // Store user message
      await storage.createChatMessage({
        sessionId,
        sender,
        message
      });
      
      if (sender === 'user') {
        // Get session and agent config
        const session = await storage.getChatSession(sessionId);
        if (!session) {
          return res.status(404).json({
            success: false,
            message: "Chat session not found"
          });
        }
        
        const agentConfig = await storage.getAgentConfig(session.agentConfigId);
        if (!agentConfig) {
          return res.status(404).json({
            success: false,
            message: "Agent configuration not found"
          });
        }
        
        // Get conversation history
        const messages = await storage.getChatMessages(sessionId);
        const conversationHistory = messages
          .slice(-10) // Last 10 messages for context
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.message
          }));
        
        // Get knowledge base from agent config or use default
        const agentKnowledgeBase = agentConfig.knowledgeBase as any || {};
        const knowledgeBase: KnowledgeBase = {
          companyInfo: agentKnowledgeBase.companyInfo || "AIDevelo.AI - Your AI automation partner",
          services: agentKnowledgeBase.services || ["AI Phone Agent", "AI Chat Agent", "AI Social Media Agent"],
          faq: agentKnowledgeBase.faq || [
            { question: "What services do you offer?", answer: "We offer AI automation solutions including phone agents, chat agents, and social media agents to help businesses grow." },
            { question: "How much does it cost?", answer: "Our packages start from €49/month for the Chat Agent, €79/month for the Phone Agent, and €59/month for the Social Media Agent." },
            { question: "How quickly can you set this up?", answer: "We can typically have your AI agents up and running within 24-48 hours." }
          ],
          businessHours: agentKnowledgeBase.businessHours || "Monday-Friday 9AM-6PM CET",
          contactInfo: agentKnowledgeBase.contactInfo || {
            email: "hello@aidevelo.ai",
            phone: "+49 123 456 7890"
          }
        };
        
        // Generate AI response
        const aiResponse = await generateChatResponse(
          message,
          conversationHistory,
          knowledgeBase
        );
        
        // Store AI response
        await storage.createChatMessage({
          sessionId,
          sender: 'agent',
          message: aiResponse.message
        });
        
        res.json({
          success: true,
          data: {
            message: aiResponse.message,
            isActionRequired: aiResponse.isActionRequired,
            actionType: aiResponse.actionType,
            actionData: aiResponse.actionData,
            sessionId: sessionId
          }
        });
      } else {
        // If sender is 'agent', just store the message
        res.json({
          success: true,
          data: { message: "Message stored" }
        });
      }
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Create demo data endpoint for testing
  app.post("/api/demo-data", async (req, res) => {
    try {
      const mockUserId = "demo-user-123";
      
      // Create demo subscriptions
      await storage.createSubscription({
        userId: mockUserId,
        moduleId: "chat",
        price: 4900, // €49.00
        status: "active",
        stripeSubscriptionId: null,
        startDate: new Date()
      });
      
      await storage.createSubscription({
        userId: mockUserId,
        moduleId: "phone",
        price: 7900, // €79.00
        status: "active",
        stripeSubscriptionId: null,
        startDate: new Date()
      });
      
      // Create demo agent configs
      await storage.createAgentConfig({
        userId: mockUserId,
        moduleId: "chat",
        isActive: true,
        configuration: {
          welcomeMessage: "Hello! How can I help you today?",
          brandVoice: "friendly and professional",
          leadCaptureEnabled: true
        }
      });
      
      await storage.createAgentConfig({
        userId: mockUserId,
        moduleId: "phone",
        isActive: true,
        configuration: {
          greeting: "Thank you for calling AIDevelo.AI, how can I assist you?",
          appointmentBooking: true,
          businessHours: "9AM-6PM CET"
        }
      });
      
      res.json({
        success: true,
        message: "Demo data created successfully"
      });
    } catch (error) {
      console.error("Error creating demo data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
