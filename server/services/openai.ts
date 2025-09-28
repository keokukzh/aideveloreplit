// OpenAI service for AI functionality (from javascript_openai integration)
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000 // 30 second timeout
    });
  }
  return openai;
}

export interface ChatResponse {
  message: string;
  isActionRequired?: boolean;
  actionType?: 'book_appointment' | 'capture_lead' | 'escalate_human';
  actionData?: any;
}

export interface KnowledgeBase {
  companyInfo: string;
  services: string[];
  faq: Array<{ question: string; answer: string }>;
  businessHours: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

/**
 * Generate intelligent chat response for website chat agent
 */
export async function generateChatResponse(
  message: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  knowledgeBase: KnowledgeBase,
  businessContext?: string
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are a helpful AI assistant for ${knowledgeBase.companyInfo || 'this business'}. 

Business Information:
- Services: ${knowledgeBase.services.join(', ')}
- Hours: ${knowledgeBase.businessHours}
- Contact: ${JSON.stringify(knowledgeBase.contactInfo)}

Available Actions:
- If user wants to book an appointment, respond with "book_appointment" action
- If user provides contact info, respond with "capture_lead" action  
- If you can't help, respond with "escalate_human" action

FAQ Knowledge:
${knowledgeBase.faq.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n')}

Instructions:
- Be friendly, professional, and helpful
- Answer questions about the business using the knowledge base
- Offer to book appointments when relevant
- Capture leads when users show interest
- Respond in JSON format: { "message": "your response", "isActionRequired": boolean, "actionType": "type", "actionData": {} }
`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory,
      { role: "user" as const, content: message }
    ];

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages,
      response_format: { type: "json_object" },
    });

    const responseContent = response.choices[0].message.content || '{}';
    
    // Validate OpenAI response structure
    try {
      const result = JSON.parse(responseContent);
      
      return {
        message: typeof result.message === 'string' ? result.message : "I'm here to help! How can I assist you today?",
        isActionRequired: Boolean(result.isActionRequired),
        actionType: ['book_appointment', 'capture_lead', 'escalate_human'].includes(result.actionType) ? result.actionType : undefined,
        actionData: result.actionData || undefined
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return {
        message: "I'm here to help! How can I assist you today?",
        isActionRequired: false
      };
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    return {
      message: "I apologize, but I'm having trouble right now. Please try again or contact us directly.",
      isActionRequired: false
    };
  }
}

/**
 * Generate phone call response and determine actions
 */
export async function generatePhoneResponse(
  transcript: string,
  knowledgeBase: KnowledgeBase,
  callContext?: any
): Promise<{
  response: string;
  shouldBookAppointment: boolean;
  appointmentDetails?: any;
  summary: string;
}> {
  try {
    const systemPrompt = `You are a professional phone assistant for ${knowledgeBase.companyInfo}. 

Business Information:
- Services: ${knowledgeBase.services.join(', ')}
- Hours: ${knowledgeBase.businessHours}
- Contact: ${JSON.stringify(knowledgeBase.contactInfo)}

Instructions:
- Handle phone calls professionally
- Book appointments when requested
- Provide information about services
- Take messages when needed
- Respond in JSON format with: response, shouldBookAppointment, appointmentDetails, summary
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Phone call transcript: ${transcript}` }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      response: result.response || "Thank you for calling. How can I help you today?",
      shouldBookAppointment: result.shouldBookAppointment || false,
      appointmentDetails: result.appointmentDetails,
      summary: result.summary || "Phone call handled"
    };
  } catch (error) {
    console.error('Error generating phone response:', error);
    return {
      response: "Thank you for calling. Please hold while I connect you with someone who can help.",
      shouldBookAppointment: false,
      summary: "Error processing call"
    };
  }
}

/**
 * Generate social media content
 */
export async function generateSocialContent(
  prompt: string,
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter',
  brandVoice?: string,
  companyInfo?: string
): Promise<{
  content: string;
  hashtags: string[];
  suggestedImagePrompt?: string;
}> {
  try {
    const platformGuidelines = {
      facebook: "conversational, engaging, can be longer",
      instagram: "visual-focused, trendy, use emojis",
      linkedin: "professional, business-focused, thought leadership",
      twitter: "concise, under 280 characters, engaging"
    };

    const systemPrompt = `Create social media content for ${platform}.

Guidelines for ${platform}: ${platformGuidelines[platform]}
Brand voice: ${brandVoice || 'professional and friendly'}
Company: ${companyInfo || 'this business'}

Content request: ${prompt}

Respond in JSON format with: content, hashtags (array), suggestedImagePrompt
Make content engaging and platform-appropriate.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      content: result.content || "Exciting things happening at our business!",
      hashtags: result.hashtags || [],
      suggestedImagePrompt: result.suggestedImagePrompt
    };
  } catch (error) {
    console.error('Error generating social content:', error);
    return {
      content: "Stay tuned for updates!",
      hashtags: ['#business', '#update'],
      suggestedImagePrompt: "Professional business image"
    };
  }
}

/**
 * Analyze conversation sentiment and extract lead information
 */
export async function analyzeConversation(
  conversation: string,
  type: 'chat' | 'phone'
): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  leadScore: number; // 1-10
  extractedInfo: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    interests?: string[];
  };
  summary: string;
}> {
  try {
    const systemPrompt = `Analyze this ${type} conversation and extract information.

Provide:
1. Sentiment: positive, neutral, or negative
2. Lead score: 1-10 (10 = high intent to purchase)
3. Extracted contact information
4. Brief summary

Respond in JSON format with: sentiment, leadScore, extractedInfo, summary
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: conversation }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      sentiment: result.sentiment || 'neutral',
      leadScore: Math.max(1, Math.min(10, result.leadScore || 5)),
      extractedInfo: result.extractedInfo || {},
      summary: result.summary || 'Conversation analyzed'
    };
  } catch (error) {
    console.error('Error analyzing conversation:', error);
    return {
      sentiment: 'neutral',
      leadScore: 5,
      extractedInfo: {},
      summary: 'Error analyzing conversation'
    };
  }
}

export { openai };