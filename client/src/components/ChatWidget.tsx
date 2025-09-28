import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Mail, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  agentConfigId: string;
  startedAt: string;
}

interface ChatWidgetProps {
  agentConfigId: string;
  position?: 'bottom-right' | 'bottom-left' | 'embedded';
  theme?: 'light' | 'dark' | 'auto';
  welcomeMessage?: string;
  brandColor?: string;
  companyName?: string;
}

export default function ChatWidget({
  agentConfigId,
  position = 'bottom-right',
  theme = 'auto',
  welcomeMessage = "Hello! How can I help you today?",
  brandColor = '#00cfff',
  companyName = 'AIDevelo.AI'
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'embedded': 'relative w-full h-full'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !session) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      const response = await apiRequest(
        'POST',
        '/api/chat/sessions',
        {
          agentConfigId,
          visitorId: `visitor-${Date.now()}`,
          visitorEmail: null,
          visitorName: null
        }
      );
      const responseData = await response.json();

      if (responseData.data) {
        setSession(responseData.data);
        
        // Add welcome message
        const welcomeMsg: ChatMessage = {
          id: `welcome-${Date.now()}`,
          sender: 'agent',
          message: welcomeMessage,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !session || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest(
        'POST',
        '/api/chat/messages',
        {
          sessionId: session.id,
          message: inputMessage,
          sender: 'user'
        }
      );
      const responseData = await response.json();

      if (responseData.data?.message) {
        const agentMessage: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          message: responseData.data.message,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, agentMessage]);
        
        // Handle AI actions
        if (responseData.data.isActionRequired) {
          switch (responseData.data.actionType) {
            case 'capture_lead':
              setShowLeadForm(true);
              break;
            case 'book_appointment':
              const appointmentMessage: ChatMessage = {
                id: `appointment-${Date.now()}`,
                sender: 'agent',
                message: "Great! I'd be happy to help you book an appointment. Please call us at +49 123 456 7890 or email hello@aidevelo.ai to schedule.",
                timestamp: new Date().toISOString()
              };
              setTimeout(() => setMessages(prev => [...prev, appointmentMessage]), 1000);
              break;
            case 'escalate_human':
              const escalateMessage: ChatMessage = {
                id: `escalate-${Date.now()}`,
                sender: 'agent',
                message: "I'll connect you with a human agent. Please hold while I transfer you, or you can contact us directly at hello@aidevelo.ai.",
                timestamp: new Date().toISOString()
              };
              setTimeout(() => setMessages(prev => [...prev, escalateMessage]), 1000);
              break;
          }
        }
        
        // If chat is minimized, increment unread count
        if (isMinimized) {
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'agent',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setUnreadCount(0); // Reset unread count when expanding
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const submitLeadForm = async () => {
    try {
      const response = await apiRequest('POST', '/api/leads', leadFormData);
      const data = await response.json();
      
      if (data.success) {
        setShowLeadForm(false);
        setLeadFormData({ name: '', email: '', phone: '', company: '', message: '' });
        
        const confirmMessage: ChatMessage = {
          id: `lead-confirm-${Date.now()}`,
          sender: 'agent',
          message: "Thank you! I've captured your information. Someone from our team will contact you within 24 hours.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, confirmMessage]);
      }
    } catch (error) {
      console.error('Error submitting lead form:', error);
      const errorMessage: ChatMessage = {
        id: `lead-error-${Date.now()}`,
        sender: 'agent',
        message: "Sorry, there was an error capturing your information. Please try again or contact us directly.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const LeadCaptureForm = () => (
    <div className="border-t p-4 bg-muted/20">
      <h4 className="font-medium mb-3 text-sm">Let's get your contact information:</h4>
      <div className="space-y-2">
        <Input
          placeholder="Your name"
          value={leadFormData.name}
          onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
          className="text-sm"
          data-testid="input-lead-name"
        />
        <Input
          type="email"
          placeholder="Email address"
          value={leadFormData.email}
          onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
          className="text-sm"
          data-testid="input-lead-email"
        />
        <Input
          placeholder="Phone (optional)"
          value={leadFormData.phone}
          onChange={(e) => setLeadFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="text-sm"
          data-testid="input-lead-phone"
        />
        <Input
          placeholder="Company"
          value={leadFormData.company}
          onChange={(e) => setLeadFormData(prev => ({ ...prev, company: e.target.value }))}
          className="text-sm"
          data-testid="input-lead-company"
        />
        <div className="flex gap-2 pt-2">
          <Button
            onClick={submitLeadForm}
            disabled={!leadFormData.name || !leadFormData.email || !leadFormData.company}
            size="sm"
            className="flex-1"
            style={{ backgroundColor: brandColor }}
            data-testid="button-submit-lead"
          >
            Submit
          </Button>
          <Button
            onClick={() => setShowLeadForm(false)}
            variant="outline"
            size="sm"
            data-testid="button-cancel-lead"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  if (position === 'embedded') {
    return (
      <Card className="w-full h-full flex flex-col" data-testid="chat-widget-embedded">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" style={{ color: brandColor }} />
            Chat with {companyName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.sender}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" data-testid="loading-indicator">
                <div className="bg-muted text-muted-foreground max-w-xs px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {showLeadForm && <LeadCaptureForm />}
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                style={{ backgroundColor: brandColor }}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={positionClasses[position]} data-testid="chat-widget-floating">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: brandColor }}
          data-testid="button-open-chat"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs"
              data-testid="badge-unread-count"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      ) : (
        <Card className="w-80 h-96 flex flex-col shadow-lg" data-testid="chat-widget-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageCircle className="h-4 w-4" style={{ color: brandColor }} />
              {companyName}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimize}
                className="h-8 w-8"
                data-testid="button-minimize-chat"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
                data-testid="button-close-chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${message.sender}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      style={message.sender === 'user' ? { backgroundColor: brandColor } : {}}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start" data-testid="loading-indicator">
                    <div className="bg-muted text-muted-foreground max-w-xs px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {showLeadForm && <LeadCaptureForm />}
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="input-chat-message"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    style={{ backgroundColor: brandColor }}
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}