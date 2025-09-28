import { describe, it, expect } from 'vitest';
import { calculatePricing, formatPrice, formatDiscountPercent } from '../calc';

describe('calculatePricing', () => {
  it('calculates pricing for no modules selected', () => {
    const result = calculatePricing([]);
    
    expect(result).toEqual({
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      total: 0,
      selectedModules: []
    });
  });

  it('calculates pricing for single phone module', () => {
    const result = calculatePricing(['phone']);
    
    expect(result.subtotal).toBe(79);
    expect(result.discountPercent).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(79);
    expect(result.selectedModules).toHaveLength(1);
    expect(result.selectedModules[0].id).toBe('phone');
  });

  it('calculates pricing for single chat module', () => {
    const result = calculatePricing(['chat']);
    
    expect(result.subtotal).toBe(49);
    expect(result.discountPercent).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(49);
    expect(result.selectedModules).toHaveLength(1);
    expect(result.selectedModules[0].id).toBe('chat');
  });

  it('calculates pricing for single social module', () => {
    const result = calculatePricing(['social']);
    
    expect(result.subtotal).toBe(59);
    expect(result.discountPercent).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(59);
    expect(result.selectedModules).toHaveLength(1);
    expect(result.selectedModules[0].id).toBe('social');
  });

  it('calculates pricing for two modules with 10% discount', () => {
    const result = calculatePricing(['phone', 'chat']);
    
    expect(result.subtotal).toBe(128); // 79 + 49
    expect(result.discountPercent).toBe(10);
    expect(result.discountAmount).toBe(12.8); // 10% of 128
    expect(result.total).toBe(115.2); // 128 - 12.8
    expect(result.selectedModules).toHaveLength(2);
  });

  it('calculates pricing for three modules with 15% discount', () => {
    const result = calculatePricing(['phone', 'chat', 'social']);
    
    expect(result.subtotal).toBe(187); // 79 + 49 + 59
    expect(result.discountPercent).toBe(15);
    expect(result.discountAmount).toBe(28.05); // 15% of 187
    expect(result.total).toBe(158.95); // 187 - 28.05
    expect(result.selectedModules).toHaveLength(3);
  });

  it('ignores unknown module IDs', () => {
    const result = calculatePricing(['phone', 'unknown-module', 'chat']);
    
    expect(result.subtotal).toBe(128); // 79 + 49 (unknown ignored)
    expect(result.discountPercent).toBe(10);
    expect(result.discountAmount).toBe(12.8);
    expect(result.total).toBe(115.2);
    expect(result.selectedModules).toHaveLength(2);
    expect(result.selectedModules.some(m => m.id === 'unknown-module')).toBe(false);
  });

  it('handles duplicate module IDs correctly', () => {
    const result = calculatePricing(['phone', 'phone', 'chat']);
    
    // Should treat duplicates as single selection
    expect(result.subtotal).toBe(128); // 79 + 49 (phone counted once)
    expect(result.discountPercent).toBe(10);
    expect(result.total).toBe(115.2);
    expect(result.selectedModules).toHaveLength(2);
  });

  it('calculates correct discount for mixed valid/invalid modules', () => {
    const result = calculatePricing(['invalid', 'phone', 'also-invalid', 'chat', 'social']);
    
    expect(result.subtotal).toBe(187); // All 3 valid modules
    expect(result.discountPercent).toBe(15); // 3 modules = 15% discount
    expect(result.total).toBe(158.95);
    expect(result.selectedModules).toHaveLength(3);
  });
});

describe('formatPrice', () => {
  it('formats whole numbers correctly', () => {
    expect(formatPrice(100)).toBe('€100.00');
    expect(formatPrice(0)).toBe('€0.00');
  });

  it('formats decimal numbers correctly', () => {
    expect(formatPrice(99.99)).toBe('€99.99');
    expect(formatPrice(115.2)).toBe('€115.20');
    expect(formatPrice(158.95)).toBe('€158.95');
  });

  it('handles edge cases', () => {
    expect(formatPrice(0.01)).toBe('€0.01');
    expect(formatPrice(9999.99)).toBe('€9999.99');
  });
});

describe('formatDiscountPercent', () => {
  it('formats discount percentages correctly', () => {
    expect(formatDiscountPercent(0)).toBe('0%');
    expect(formatDiscountPercent(10)).toBe('10%');
    expect(formatDiscountPercent(15)).toBe('15%');
    expect(formatDiscountPercent(100)).toBe('100%');
  });

  it('handles decimal percentages', () => {
    expect(formatDiscountPercent(12.5)).toBe('12.5%');
    expect(formatDiscountPercent(0.1)).toBe('0.1%');
  });
});

describe('pricing edge cases', () => {
  it('applies highest discount tier when multiple apply', () => {
    // With 3 modules, should get 15% not 10%
    const result = calculatePricing(['phone', 'chat', 'social']);
    expect(result.discountPercent).toBe(15);
  });

  it('handles empty array gracefully', () => {
    const result = calculatePricing([]);
    expect(result.selectedModules).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('handles array with only invalid modules', () => {
    const result = calculatePricing(['invalid1', 'invalid2']);
    expect(result.selectedModules).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.discountPercent).toBe(0);
  });
});