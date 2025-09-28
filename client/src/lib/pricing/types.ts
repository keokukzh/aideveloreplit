export interface Module {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly highlights: readonly string[];
  readonly icon?: string;
  readonly description?: string;
}

export interface PricingCalculation {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  selectedModules: Module[];
}

export type ModuleId = "phone" | "chat" | "social";

export interface PricingConfig {
  modules: readonly Module[];
  discountTiers: readonly {
    moduleCount: number;
    discountPercent: number;
  }[];
}

export interface ProductActivation {
  moduleId: string;
  status: 'inactive' | 'provisioning' | 'active';
  activatedAt?: string;
  onboardingCompleted?: boolean;
}

export type ActiveProducts = Record<string, ProductActivation>;