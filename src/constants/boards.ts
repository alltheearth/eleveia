// src/constants/boards.ts
// 🎨 CONSTANTES PARA O SISTEMA DE BOARDING

import type { BoardColor, CardPriority } from '../types/boards';

// ============================================
// CORES DOS BOARDS
// ============================================

export const BOARD_COLORS: Record<BoardColor, {
  bg: string;
  gradient: string;
  text: string;
  light: string;
}> = {
  blue: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    text: 'text-blue-600',
    light: 'bg-blue-50',
  },
  purple: {
    bg: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
    light: 'bg-purple-50',
  },
  green: {
    bg: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-600',
    light: 'bg-green-50',
  },
  orange: {
    bg: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-600',
    light: 'bg-orange-50',
  },
  red: {
    bg: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    text: 'text-red-600',
    light: 'bg-red-50',
  },
  pink: {
    bg: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600',
    text: 'text-pink-600',
    light: 'bg-pink-50',
  },
  indigo: {
    bg: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    text: 'text-indigo-600',
    light: 'bg-indigo-50',
  },
  teal: {
    bg: 'bg-teal-500',
    gradient: 'from-teal-500 to-teal-600',
    text: 'text-teal-600',
    light: 'bg-teal-50',
  },
};

// ============================================
// PRIORIDADES DOS CARDS
// ============================================

export const PRIORITY_CONFIG: Record<CardPriority, {
  label: string;
  color: string;
  icon: string;
}> = {
  low: {
    label: 'Baixa',
    color: 'bg-gray-100 text-gray-700',
    icon: '⬇️',
  },
  medium: {
    label: 'Média',
    color: 'bg-yellow-100 text-yellow-700',
    icon: '➡️',
  },
  high: {
    label: 'Alta',
    color: 'bg-red-100 text-red-700',
    icon: '⬆️',
  },
};

// ============================================
// LABELS PREDEFINIDOS
// ============================================

export const PREDEFINED_LABELS = [
  { name: 'Urgente', color: 'bg-red-500' },
  { name: 'Bug', color: 'bg-orange-500' },
  { name: 'Feature', color: 'bg-blue-500' },
  { name: 'Importante', color: 'bg-purple-500' },
  { name: 'Aprovado', color: 'bg-green-500' },
  { name: 'Em Revisão', color: 'bg-yellow-500' },
  { name: 'Bloqueado', color: 'bg-gray-500' },
  { name: 'Design', color: 'bg-pink-500' },
];

// ============================================
// OPÇÕES DE LABELS (para filtros)
// ============================================

export const LABEL_OPTIONS = PREDEFINED_LABELS.map(label => ({
  value: label.name,
  label: label.name,
  color: `${label.color} text-white`,
}));