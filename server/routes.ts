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
  for (const [key, value] of Array.from(rateLimitMap.entries())) {
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

// Lazy initialize Stripe when needed
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripe;
}

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

      const paymentIntent = await getStripe().paymentIntents.create({
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

  // Contact form submission endpoint with rate limiting
  app.post("/api/leads", async (req, res) => {
    try {
      // Rate limiting for lead submissions
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      if (!checkRateLimit(`leads_${clientIp}`, 5, 60000)) { // 5 leads per minute
        return res.status(429).json({
          success: false,
          message: "Too many lead submissions. Please try again later."
        });
      }

      const validationResult = insertLeadSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.errors
        });
      }

      const leadData = await storage.createLead(validationResult.data);
      
      res.json({
        success: true,
        data: leadData
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      res.status(500).json({
        success: false,
        message: "Failed to submit contact information"
      });
    }
  });

  // Contact form submission endpoint with rate limiting
  app.post("/api/contact", async (req, res) => {
    try {
      // Rate limiting for contact submissions
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      if (!checkRateLimit(`contact_${clientIp}`, 5, 60000)) { // 5 contacts per minute
        return res.status(429).json({
          success: false,
          message: "Too many contact submissions. Please try again later."
        });
      }

      const validationResult = insertContactSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.errors
        });
      }

      const contactData = await storage.createContact(validationResult.data);
      
      res.json({
        success: true,
        data: contactData
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({
        success: false,
        message: "Failed to submit contact form"
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

  // Create demo data endpoint for testing - Pro Account with All Products
  app.post("/api/demo-data", async (req, res) => {
    try {
      const mockUserId = "pro-user-123";
      
      // Create PRO subscriptions for ALL products
      await storage.createSubscription({
        userId: mockUserId,
        moduleId: "chat",
        price: 4900, // €49.00
        status: "active",
        stripeSubscriptionId: "sub_chat_demo_123",
        startDate: new Date()
      });
      
      await storage.createSubscription({
        userId: mockUserId,
        moduleId: "phone",
        price: 7900, // €79.00
        status: "active",
        stripeSubscriptionId: "sub_phone_demo_123",
        startDate: new Date()
      });
      
      // Add Social Media Agent - NEW!
      await storage.createSubscription({
        userId: mockUserId,
        moduleId: "social",
        price: 5900, // €59.00
        status: "active",
        stripeSubscriptionId: "sub_social_demo_123",
        startDate: new Date()
      });
      
      // Create ADVANCED agent configs for ALL products
      await storage.createAgentConfig({
        userId: mockUserId,
        moduleId: "chat",
        isActive: true,
        configuration: {
          welcomeMessage: "Welcome to AIDevelo.AI! I'm your AI assistant ready to help with automation solutions.",
          brandVoice: "professional, knowledgeable, and solution-focused",
          leadCaptureEnabled: true,
          appointmentBooking: true,
          escalationEnabled: true,
          maxConversationLength: 50,
          responseTime: "instant"
        },
        knowledgeBase: {
          companyInfo: "AIDevelo.AI - Leading AI automation platform helping businesses scale with intelligent agents",
          services: [
            "AI Chat Agent - €49/month - Automated customer support and lead generation",
            "AI Phone Agent - €79/month - Intelligent call handling and appointment booking", 
            "AI Social Media Agent - €59/month - Content creation and posting automation"
          ],
          faq: [
            { question: "What's included in the Chat Agent?", answer: "24/7 automated chat support, lead capture forms, appointment booking, and CRM integration." },
            { question: "How does the Phone Agent work?", answer: "Handles incoming calls, qualifies leads, books appointments, and can transfer to human agents when needed." },
            { question: "Can the Social Media Agent post to multiple platforms?", answer: "Yes! It supports Facebook, Instagram, LinkedIn, and Twitter with automated content scheduling." },
            { question: "Is there a setup fee?", answer: "No setup fees! We include free onboarding and configuration for all plans." },
            { question: "How quickly can I get started?", answer: "Most clients are up and running within 24 hours with our express setup process." }
          ],
          businessHours: "Monday-Friday 9AM-6PM CET",
          contactInfo: {
            email: "hello@aidevelo.ai",
            phone: "+49 123 456 7890",
            website: "https://aidevelo.ai"
          }
        }
      });
      
      await storage.createAgentConfig({
        userId: mockUserId,
        moduleId: "phone", 
        isActive: true,
        configuration: {
          greeting: "Thank you for calling AIDevelo.AI, your AI automation partner. How can I help you today?",
          appointmentBooking: true,
          leadQualification: true,
          callRecording: true,
          businessHours: "Monday-Friday 9AM-6PM CET",
          afterHoursMessage: "We're currently closed. Please leave a message or schedule a callback.",
          transferKeywords: ["human", "manager", "urgent", "complaint"],
          maxCallDuration: 15
        }
      });
      
      await storage.createAgentConfig({
        userId: mockUserId,
        moduleId: "social",
        isActive: true,
        configuration: {
          platforms: ["facebook", "instagram", "linkedin", "twitter"],
          postingSchedule: {
            frequency: "daily",
            times: ["09:00", "13:00", "17:00"],
            timezone: "Europe/Berlin"
          },
          contentTypes: ["promotional", "educational", "industry_news", "company_updates"],
          brandVoice: "professional, engaging, informative",
          hashtagStrategy: "industry-relevant, trending, branded",
          engagementTracking: true,
          autoRespond: true,
          contentApproval: false
        }
      });
      
      res.json({
        success: true,
        message: "✅ PRO Account Created! All AI products activated with advanced configurations.",
        data: {
          userId: mockUserId,
          activeProducts: [
            {
              name: "AI Chat Agent",
              price: "€49/month",
              status: "active",
              features: ["24/7 Support", "Lead Capture", "Appointment Booking", "CRM Integration"]
            },
            {
              name: "AI Phone Agent", 
              price: "€79/month",
              status: "active",
              features: ["Call Handling", "Lead Qualification", "Call Recording", "Human Transfer"]
            },
            {
              name: "AI Social Media Agent",
              price: "€59/month", 
              status: "active",
              features: ["Multi-Platform Posting", "Content Generation", "Engagement Tracking", "Auto-Response"]
            }
          ],
          totalValue: "€187/month",
          setupStatus: "Ready to use"
        }
      });
    } catch (error) {
      console.error("Error creating demo data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Phone Agent API - Provision phone service
  app.post("/api/phone/provision", async (req, res) => {
    try {
      const { calendarProvider } = req.body;
      
      // Simulate provisioning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful provisioning
      res.json({
        success: true,
        data: {
          phoneNumber: "+49 123 456 7890",
          twilioAccountSid: "AC" + Math.random().toString(36).substring(2, 36),
          calendarIntegrated: calendarProvider === 'google' || calendarProvider === 'microsoft',
          webhookUrl: "https://your-app.replit.app/webhook/phone"
        }
      });
    } catch (error) {
      console.error("Error provisioning phone:", error);
      res.status(500).json({
        success: false,
        message: "Phone provisioning failed"
      });
    }
  });

  // Phone Agent API - Run test call
  app.post("/api/phone/test-call", async (req, res) => {
    try {
      const { to } = req.body;
      
      if (!to) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required"
        });
      }
      
      // Simulate test call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful test call
      res.json({
        success: true,
        data: {
          callSid: "CA" + Math.random().toString(36).substring(2, 36),
          to: to,
          status: "completed",
          duration: "28 seconds",
          recording: "https://api.twilio.com/recording/test-123",
          transcript: "Hello, this is a test call from AIDevelo.AI phone agent. The setup is working correctly. Thank you!"
        }
      });
    } catch (error) {
      console.error("Error making test call:", error);
      res.status(500).json({
        success: false,
        message: "Test call failed"
      });
    }
  });

  // Chat Agent API - Get widget key for installation
  app.get("/api/chat/widget-key", async (req, res) => {
    try {
      // Generate a unique widget key
      const widgetKey = "widget_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      res.json({
        ok: true,
        widgetKey: widgetKey,
        instructions: "Add this script tag to your website before the closing </body> tag"
      });
    } catch (error) {
      console.error("Error generating widget key:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate widget key"
      });
    }
  });

  // Chat Agent API - Verify widget installation
  app.post("/api/chat/verify-install", async (req, res) => {
    try {
      const { widgetKey, origin } = req.body;
      
      if (!widgetKey || !origin) {
        return res.status(400).json({
          success: false,
          message: "Widget key and origin URL are required"
        });
      }
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification
      res.json({
        success: true,
        data: {
          widgetKey: widgetKey,
          isInstalled: true,
          origin: origin,
          verifiedAt: new Date().toISOString(),
          chatEndpoint: "/api/chat/messages",
          sessionEndpoint: "/api/chat/sessions"
        }
      });
    } catch (error) {
      console.error("Error verifying widget install:", error);
      res.status(500).json({
        success: false,
        message: "Widget verification failed"
      });
    }
  });

  // Social Media Agent API - Connect social platform
  app.post("/api/social/connect", async (req, res) => {
    try {
      const { provider } = req.body;
      
      if (!provider) {
        return res.status(400).json({
          success: false,
          message: "Provider is required"
        });
      }
      
      // Simulate OAuth connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful connection
      res.json({
        success: true,
        data: {
          provider: provider,
          accountId: provider + "_" + Math.random().toString(36).substring(2, 10),
          accountName: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} Account`,
          permissions: ["read", "write", "manage"],
          connectedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error connecting social platform:", error);
      res.status(500).json({
        success: false,
        message: "Social platform connection failed"
      });
    }
  });

  // Social Media Agent API - Schedule draft post
  app.post("/api/social/schedule-draft", async (req, res) => {
    try {
      const { text, when } = req.body;
      
      if (!text) {
        return res.status(400).json({
          success: false,
          message: "Post text is required"
        });
      }
      
      // Simulate scheduling delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful scheduling
      res.json({
        success: true,
        data: {
          postId: "post_" + Math.random().toString(36).substring(2, 12),
          text: text,
          scheduledFor: when || new Date(Date.now() + 60000).toISOString(),
          status: "scheduled",
          platforms: ["facebook", "instagram", "linkedin"],
          estimatedReach: Math.floor(Math.random() * 500) + 100,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error scheduling post:", error);
      res.status(500).json({
        success: false,
        message: "Post scheduling failed"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
