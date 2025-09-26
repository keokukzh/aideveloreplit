import { useState, useEffect } from 'react';
import { Bot, User, ArrowRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface Scenario {
  id: string;
  title: string;
  userQuery: string;
  aiResponse: string;
  impact: string;
}

const scenarios: Scenario[] = [
  {
    id: 'customer-support',
    title: 'Kundensupport-Optimierung',
    userQuery: 'Wie kann KI unseren Kundensupport verbessern?',
    aiResponse: 'Ich analysiere Ihre Support-Daten... Mit unserem Multichannel-Kundensupport können Sie: 1) 80% der Anfragen automatisch bearbeiten, 2) Wartezeiten um 65% reduzieren, 3) Kundenzufriedenheit um 40% steigern. Geschätzte Kosteneinsparung: €125.000/Jahr.',
    impact: '€125.000 Jahresersparnis'
  },
  {
    id: 'process-automation',
    title: 'Prozessautomatisierung',
    userQuery: 'Welche Geschäftsprozesse kann KI automatisieren?',
    aiResponse: 'Basierend auf Ihrer Branche empfehle ich: 1) Rechnungsverarbeitung (95% Automatisierung), 2) Dokumentenklassifizierung, 3) Datenvalidierung, 4) Berichtserstellung. ROI: 300% in 8 Monaten, 15 Stunden/Woche Zeitersparnis pro Mitarbeiter.',
    impact: '300% ROI in 8 Monaten'
  },
  {
    id: 'data-analysis',
    title: 'Datenanalyse & Insights',
    userQuery: 'Wie kann KI unsere Unternehmensdaten nutzen?',
    aiResponse: 'Ihre Daten bergen enormes Potenzial: 1) Predictive Analytics für Verkaufsprognosen, 2) Kundenverhalten-Analyse, 3) Markttrend-Erkennung, 4) Risikobewertung. Erwartete Umsatzsteigerung: 25%, bessere Entscheidungen in Echtzeit.',
    impact: '25% Umsatzsteigerung'
  }
];

export default function AIAssistantSimulation() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const startDemo = () => {
      const scenario = scenarios[currentScenario];
      
      // Clear previous messages
      setMessages([]);
      
      // Add user message
      setTimeout(() => {
        setMessages([{
          id: 1,
          type: 'user',
          content: scenario.userQuery,
          timestamp: Date.now()
        }]);
        
        // Start AI typing animation
        setTimeout(() => {
          setIsTyping(true);
          typeAIResponse(scenario.aiResponse);
        }, 1000);
      }, 500);
    };

    const typeAIResponse = (response: string) => {
      let currentIndex = 0;
      setTypingText('');
      
      const typeInterval = setInterval(() => {
        if (currentIndex < response.length) {
          setTypingText(response.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          
          // Add complete AI message
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: 2,
              type: 'ai',
              content: response,
              timestamp: Date.now()
            }]);
            
            // Move to next scenario after delay
            setTimeout(() => {
              setCurrentScenario((prev) => (prev + 1) % scenarios.length);
            }, 4000);
          }, 500);
        }
      }, 30); // Typing speed
    };

    startDemo();
  }, [currentScenario]);

  const scenario = scenarios[currentScenario];

  return (
    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Scenario Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium text-primary">Live Demo</span>
        </div>
        <h3 className="text-sm font-semibold text-muted-foreground">{scenario.title}</h3>
      </div>

      {/* Chat Interface */}
      <Card className="glass-intense border-primary/20 overflow-hidden" data-testid="ai-chat-simulation">
        <div className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AIDevelo Assistent</span>
            <div className="ml-auto flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>

        <div className="h-48 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`p-3 rounded-lg text-sm leading-relaxed ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted border border-border'
                  }`}
                >
                  {message.content}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="max-w-[80%]">
                <div className="p-3 rounded-lg text-sm leading-relaxed bg-muted border border-border">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Impact Display */}
        <div className="p-4 border-t border-primary/10 bg-gradient-to-r from-green-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Erwarteter Geschäftsimpact:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-600">{scenario.impact}</span>
              <ArrowRight className="h-3 w-3 text-green-600" />
            </div>
          </div>
        </div>
      </Card>

      {/* Scenario Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {scenarios.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentScenario(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentScenario 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            data-testid={`scenario-indicator-${index}`}
          />
        ))}
      </div>
    </div>
  );
}