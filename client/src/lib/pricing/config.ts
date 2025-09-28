import { type Module, type PricingConfig } from './types';

export const MODULES: readonly Module[] = [
  {
    id: "phone",
    name: "AI Phone Agent",
    price: 79,
    highlights: [
      "Answers calls 24/7",
      "Books appointments",
      "Creates call notes"
    ],
    description: "Intelligent phone assistant that handles calls, understands customer intents, and automatically schedules appointments to your calendar."
  },
  {
    id: "chat", 
    name: "AI Website Chat Agent",
    price: 49,
    highlights: [
      "Answers FAQs instantly",
      "Captures leads", 
      "Schedules appointments"
    ],
    description: "24/7 website assistant that answers customer questions, captures leads, and converts visitors into appointments."
  },
  {
    id: "social",
    name: "AI Social Media Agent", 
    price: 59,
    highlights: [
      "Plans & publishes content",
      "Replies to comments/messages",
      "Grows your reach"
    ],
    description: "Automated social media management that creates content, engages with your audience, and grows your online presence."
  }
] as const;

export const PRICING_CONFIG: PricingConfig = {
  modules: MODULES,
  discountTiers: [
    { moduleCount: 2, discountPercent: 10 },
    { moduleCount: 3, discountPercent: 15 }
  ]
} as const;

// Helper function to get module by ID
export const getModuleById = (id: string): Module | undefined => {
  return MODULES.find(module => module.id === id);
};

// Helper function to get all module IDs
export const getAllModuleIds = (): string[] => {
  return MODULES.map(module => module.id);
};