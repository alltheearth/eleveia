// src/components/ui/MetricCard/index.tsx
// 📊 METRIC CARD - CARD DE MÉTRICAS UNIFICADO
//
// Unifica MetricCard (Dashboard) e StatCard (Leads) em um único componente.
// Baseado no design atual com gradiente no header e animações.
//
// RECURSOS:
// - Header com gradiente colorido
// - Ícone com background claro
// - Badge de mudança (positivo/negativo)
// - Barra de progresso opcional
// - Estados de loading
// - Animações com framer-motion
// - Hover effects
//
// USO BÁSICO:
// <MetricCard
//   title="Total de Leads"
//   value={150}
//   icon={<Users size={24} />}
//   color="blue"
// />
//
// COM MUDANÇA E PROGRESSO:
// <MetricCard
//   title="Convertidos"
//   value={45}
//   change={12}
//   percentage={30}
//   icon={<CheckCircle2 size={24} />}
//   color="green"
//   subtitle="Matrículas confirmadas"
// />

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { THEME_COLORS, type ThemeColor } from '../../../constants/colors';

// ============================================
// TYPES
// ============================================

export interface MetricCardProps {
  /**
   * Título do card (label da métrica)
   */
  title: string;
  
  /**
   * Valor principal a ser exibido
   */
  value: string | number;
  
  /**
   * Ícone da métrica
   */
  icon: ReactNode;
  
  /**
   * Cor do tema (gradiente e acentos)
   * @default 'blue'
   */
  color?: ThemeColor;
  
  /**
   * Percentual de mudança (positivo ou negativo)
   * Exibe badge com seta e cor
   */
  change?: number;
  
  /**
   * Texto do período de comparação
   * @default 'vs mês anterior'
   */
  period?: string;
  
  /**
   * Subtítulo/descrição adicional
   */
  subtitle?: string;
  
  /**
   * Percentual para barra de progresso (0-100)
   * Se fornecido, exibe barra de progresso
   */
  percentage?: number;
  
  /**
   * Label da barra de progresso
   * @default 'Do total'
   */
  progressLabel?: string;
  
  /**
   * Estado de loading
   * @default false
   */
  loading?: boolean;
  
  /**
   * Tamanho do ícone
   * @default 'md'
   */
  iconSize?: 'sm' | 'md' | 'lg';
  
  /**
   * Callback ao clicar no card
   */
  onClick?: () => void;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const iconSizes = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

// ============================================
// COMPONENT
// ============================================

export default function MetricCard({
  title,
  value,
  icon,
  color = 'blue',
  change,
  period = 'vs mês anterior',
  subtitle,
  percentage,
  progressLabel = 'Do total',
  loading = false,
  iconSize = 'md',
  onClick,
}: MetricCardProps) {
  
  const config = THEME_COLORS[color];
  const isPositive = change !== undefined && change >= 0;
  const isClickable = !!onClick;
  
  // Classes base
  const baseClasses = `
    bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
    ${isClickable ? 'cursor-pointer' : ''}
  `;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={isClickable || !loading ? { 
        y: -4, 
        boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' 
      } : undefined}
      className={baseClasses}
      onClick={onClick}
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between">
          {/* Ícone */}
          <div className={`
            ${iconSizes[iconSize]}
            ${config.light} 
            rounded-xl 
            flex items-center justify-center 
            shadow-lg
            transform transition-transform
            ${isClickable ? 'group-hover:scale-110' : ''}
          `}>
            {icon}
          </div>
          
          {/* Badge de mudança */}
          {change !== undefined && (
            <div className={`
              flex items-center gap-1.5 
              px-3 py-1.5 
              rounded-full 
              ${config.light} 
              shadow-sm
            `}>
              {isPositive ? (
                <ArrowUpRight size={14} className={config.text} />
              ) : (
                <ArrowDownRight size={14} className="text-red-600" />
              )}
              <span className={`text-xs font-bold ${isPositive ? config.text : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-5 py-4">
        {/* Título */}
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {title}
        </p>
        
        {/* Valor principal */}
        {loading ? (
          <div className="space-y-3">
            <div className="h-9 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <>
            <p className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
              {value}
            </p>
            
            {/* Subtítulo ou período */}
            {subtitle ? (
              <p className="text-xs text-gray-500">{subtitle}</p>
            ) : (
              period && change !== undefined && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {period}
                </p>
              )
            )}
          </>
        )}
        
        {/* Barra de progresso */}
        {percentage !== undefined && !loading && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{progressLabel}</span>
              <span className="text-xs font-bold text-gray-700">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.gradient}`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// VARIAÇÕES PRÉ-CONFIGURADAS
// ============================================

/**
 * Card de métrica compacto (sem gradiente, mais simples)
 * Para QuickStats e dashboards simplificados
 */
export function CompactMetricCard({
  title,
  value,
  icon,
  color = 'blue',
}: Pick<MetricCardProps, 'title' | 'value' | 'icon' | 'color'>) {
  const config = THEME_COLORS[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${config.light} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// METRIC CARD GRID
// ============================================

interface MetricCardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid responsivo para cards de métricas
 */
export function MetricCardGrid({ 
  children, 
  columns = 4,
  className = '' 
}: MetricCardGridProps) {
  const gridCols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
}