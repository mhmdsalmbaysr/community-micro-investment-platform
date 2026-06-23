'use client';
// Client-side demo store for simulated investments (localStorage).
const KEY = 'cmip_demo_investments';

export function getInvestments() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function addInvestment(inv) {
  const list = getInvestments();
  list.push({ ...inv, id: 'inv_' + Date.now(), date: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export { fmt } from './format';
