// src/constants/design.ts
// 🎨 CONSTANTES DE DESIGN DO PROJETO
// Centraliza todos os padrões visuais para garantir consistência

import type { ReactNode } from 'react';

// ============================================
// CORES E GRADIENTES
// ============================================

export const COLOR_CONFIGS = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100',
  },
  yellow: {
    gradient: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-100',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:bg-green-100',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    hover: 'hover:bg-red-100',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100',
  },
} as const;

export type ColorVariant = keyof typeof COLOR_CONFIGS;

// ============================================
// TAMANHOS PADRONIZADOS
// ============================================

export const SIZES = {
  icon: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  button: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  },
  input: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  },
} as const;

// ============================================
// BORDER RADIUS PADRONIZADO
// ============================================

export const RADIUS = {
  card: 'rounded-2xl',      // 16px - Cards principais
  button: 'rounded-xl',     // 12px - Botões e inputs
  input: 'rounded-xl',      // 12px - Inputs
  badge: 'rounded-full',    // Circular - Badges
  modal: 'rounded-2xl',     // 16px - Modais
  sm: 'rounded-lg',         // 8px - Elementos pequenos
} as const;

// ============================================
// SOMBRAS PADRONIZADAS
// ============================================

export const SHADOWS = {
  card: 'shadow-sm border border-gray-100',
  cardHover: 'hover:shadow-md',
  modal: 'shadow-2xl',
  button: 'shadow-lg',
  buttonHover: 'hover:shadow-xl',
  none: 'shadow-none',
} as const;

// ============================================
// ESPAÇAMENTOS PADRONIZADOS
// ============================================

export const SPACING = {
  cardPadding: 'p-6',
  cardHeader: 'px-5 pt-5 pb-4',
  sectionGap: 'space-y-6',
  gridGap: 'gap-6',
  modalPadding: 'p-6',
  buttonGap: 'gap-3',
} as const;

// ============================================
// ANIMAÇÕES FRAMER MOTION
// ============================================

export const ANIMATIONS = {
  // Fade in com movimento vertical
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  },
  
  // Fade in rápido sem movimento
  fadeInFast: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.15 },
  },
  
  // Hover com elevação (para cards)
  cardHover: {
    whileHover: { y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' },
    transition: { duration: 0.2 },
  },
  
  // Scale in (para modais)
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },
  
  // Fade in com delay
  fadeInDelayed: (delay: number = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, delay },
  }),
  
  // Slide in da direita
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2 },
  },
  
  // Slide in da esquerda
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2 },
  },
} as const;

// ============================================
// TRANSIÇÕES CSS
// ============================================

export const TRANSITIONS = {
  default: 'transition-all duration-200',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-300',
  colors: 'transition-colors duration-200',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gera classes de gradiente para um card header
 */
export const getGradientClasses = (color: ColorVariant): string => {
  return `bg-gradient-to-r ${COLOR_CONFIGS[color].gradient}`;
};

/**
 * Gera classes para um badge colorido
 */
export const getBadgeClasses = (color: ColorVariant): string => {
  const config = COLOR_CONFIGS[color];
  return `${config.light} ${config.text} ${config.border} border`;
};

/**
 * Gera classes para um botão com hover
 */
export const getButtonHoverClasses = (color: ColorVariant): string => {
  return COLOR_CONFIGS[color].hover;
};