import type { Home, PropertyType } from '../types';

export const currency = (value: number | string | readonly (number | string)[] | undefined) => {
  const normalized = Array.isArray(value) ? value[0] : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(normalized ?? 0));
};

export const propertyTypeLabel = (type: PropertyType) =>
  type
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

export const monthlyMortgage = (price: number) => {
  const principal = price * 0.85;
  const monthlyRate = 0.064 / 12;
  const payments = 30 * 12;
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -payments);
};

export const saveHomeIds = (ids: string[]) => {
  window.localStorage.setItem('kenaihomesales-saved', JSON.stringify(ids));
};

export const loadHomeIds = () => JSON.parse(window.localStorage.getItem('kenaihomesales-saved') || '[]') as string[];

export const findSimilarHomes = (home: Home, homes: Home[]) =>
  homes.filter((entry) => entry.id !== home.id && (entry.city === home.city || entry.propertyType === home.propertyType)).slice(0, 3);
