// src/constants/boards.ts
// 🎨 CONSTANTES E CONFIGURAÇÕES DO SISTEMA DE BOARDING

import type { BoardColor, CardPriority } from '../types/boards';

// ============================================
// CORES DOS BOARDS
// ============================================

export const BOARD_COLORS: Record<BoardColor, {
  bg: string;
  gradient: string;
  light: string;
  text: string;
  border: string;
}> = {
  blue: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  purple: {
    bg: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  green: {
    bg: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  orange: {
    bg: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  red: {
    bg: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  pink: {
    bg: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600',
    light: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
  },
  indigo: {
    bg: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    light: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  teal: {
    bg: 'bg-teal-500',
    gradient: 'from-teal-500 to-teal-600',
    light: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
  },
};

// ============================================
// PRIORIDADES DOS CARDS
// ============================================

export const PRIORITY_CONFIG: Record<CardPriority, {
  label: string;
  color: string;
  icon: string;
  gradient: string;
}> = {
  low: {
    label: 'Baixa',
    color: 'bg-gray-100 text-gray-700',
    icon: '⬇️',
    gradient: 'from-gray-400 to-gray-500',
  },
  medium: {
    label: 'Média',
    color: 'bg-yellow-100 text-yellow-700',
    icon: '➡️',
    gradient: 'from-yellow-400 to-yellow-500',
  },
  high: {
    label: 'Alta',
    color: 'bg-red-100 text-red-700',
    icon: '⬆️',
    gradient: 'from-red-400 to-red-500',
  },
};

// ============================================
// LABELS/TAGS PREDEFINIDOS
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
// ÍCONES POR TIPO
// ============================================

export const BOARD_ICONS: Record<string, string> = {
  default: '📋',
  project: '🎯',
  tasks: '✅',
  ideas: '💡',
  bugs: '🐛',
  features: '✨',
  meetings: '🤝',
  planning: '📅',
};