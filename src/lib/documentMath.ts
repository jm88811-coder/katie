import type { DocumentItem } from '../types';

export function itemAmount(item: DocumentItem): number {
  return item.quantity * item.unitPrice;
}

export function subtotalOf(items: DocumentItem[]): number {
  return items.reduce((sum, item) => sum + itemAmount(item), 0);
}

export function taxOf(items: DocumentItem[], taxRate: number): number {
  return Math.round((subtotalOf(items) * taxRate) / 100);
}

export function totalOf(items: DocumentItem[], taxRate: number): number {
  return subtotalOf(items) + taxOf(items, taxRate);
}
