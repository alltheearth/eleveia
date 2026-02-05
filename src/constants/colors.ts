export type ThemeColor = 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red' | 'gray';

export interface ColorConfig {
  /** Classes de gradiente (from-X-500 to-X-600) */
  gradient: string;
  /** Background claro (bg-X-50) */
  light: string;
  /** Cor do texto (text-X-600) */
  text: string;
  /** Cor da borda (border-X-200) */
  border: string;
  /** Cor do ring de foco (ring-X-100) */
  ring: string;
  /** Background sólido (bg-X-600) */
  solid: string;
  /** Background hover (bg-X-700) */
  hover: string;
}

/**
 * Configurações de cores do tema ELEVE.IA
 * 
 * Baseado no design system atual:
 * - Dashboard: MetricCard
 * - Leads: StatCard
 * - Boards: BoardCard
 */
export const THEME_COLORS: Record<ThemeColor, ColorConfig> = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    ring: 'ring-blue-100',
    solid: 'bg-blue-600',
    hover: 'bg-blue-700',
  },
  
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    ring: 'ring-green-100',
    solid: 'bg-green-600',
    hover: 'bg-green-700',
  },
  
  yellow: {
    gradient: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
    ring: 'ring-yellow-100',
    solid: 'bg-yellow-600',
    hover: 'bg-yellow-700',
  },
  
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    ring: 'ring-purple-100',
    solid: 'bg-purple-600',
    hover: 'bg-purple-700',
  },
  
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    ring: 'ring-orange-100',
    solid: 'bg-orange-600',
    hover: 'bg-orange-700',
  },
  
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    ring: 'ring-red-100',
    solid: 'bg-red-600',
    hover: 'bg-red-700',
  },
  
  gray: {
    gradient: 'from-gray-500 to-gray-600',
    light: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    ring: 'ring-gray-100',
    solid: 'bg-gray-600',
    hover: 'bg-gray-700',
  },
};

/**
 * Helper para obter configuração de cor de forma type-safe
 */
export function getColorConfig(color: ThemeColor): ColorConfig {
  return THEME_COLORS[color];
}

/**
 * Cores para indicadores de mudança (change/trend)
 */
export const CHANGE_COLORS = {
  positive: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    icon: 'text-green-600',
  },
  negative: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    icon: 'text-red-600',
  },
} as const;