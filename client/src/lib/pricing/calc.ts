import { PRICING_CONFIG, getModuleById } from './config';
import { type PricingCalculation, type Module } from './types';

/**
 * Calculate pricing with discounts based on selected module IDs
 * @param selectedModuleIds Array of selected module IDs
 * @returns PricingCalculation with subtotal, discount, and total
 */
export function calculatePricing(selectedModuleIds: string[]): PricingCalculation {
  // Get selected modules
  const selectedModules: Module[] = selectedModuleIds
    .map(id => getModuleById(id))
    .filter((module): module is Module => module !== undefined);
  
  // Calculate subtotal
  const subtotal = selectedModules.reduce((sum, module) => sum + module.price, 0);
  
  // Determine discount based on number of selected modules
  const moduleCount = selectedModules.length;
  const discountTier = PRICING_CONFIG.discountTiers
    .slice()
    .reverse() // Check highest discounts first
    .find(tier => moduleCount >= tier.moduleCount);
  
  const discountPercent = discountTier ? discountTier.discountPercent : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;
  
  return {
    subtotal,
    discountPercent,
    discountAmount,
    total,
    selectedModules
  };
}

/**
 * Format price for display (EUR with 2 decimal places)
 */
export function formatPrice(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

/**
 * Format discount percentage for display
 */
export function formatDiscountPercent(percent: number): string {
  return `${percent}%`;
}