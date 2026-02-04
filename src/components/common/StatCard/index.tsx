// src/components/common/StatCard/index.tsx
// 📊 STAT CARD REUTILIZÁVEL
// Componente de card de estatística usado em todas as páginas

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { COLOR_CONFIGS, ANIMATIONS, type ColorVariant } from '../../../constants/design';

// ============================================
// TYPES
// ============================================

interface StatCardProps {
  /** Label/título do card */
  label: string;
  
  /** Valor principal a ser exibido */
  value: number | string;
  
  /** Mudança percentual (positivo ou negativo) */
  change?: number;
  
  /** Ícone a ser exibido */
  icon: ReactNode;
  
  /** Cor do card (define gradiente e cores) */
  color: ColorVariant;
  
  /** Texto adicional abaixo do valor */
  subtitle?: string;
  
  /** Se true, adiciona "%" após o valor */
  percentage?: boolean;
  
  /** Variante do card */
  variant?: 'default' | 'compact';
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Função ao clicar no card */
  onClick?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export default function StatCard({
  label,
  value,
  change,
  icon,
  color,
  subtitle,
  percentage = false,
  variant = 'default',
  className = '',
  onClick,
}: StatCardProps) {
  
  const config = COLOR_CONFIGS[color];
  const isPositive = change !== undefined && change >= 0;
  const isCompact = variant === 'compact';

  return (
    <motion.div
      {...ANIMATIONS.fadeIn}
      {...ANIMATIONS.cardHover}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} ${isCompact ? 'px-4 pt-4 pb-3' : 'px-5 pt-5 pb-4'}`}>
        <div className="flex items-start justify-between">
          {/* Ícone */}
          <div 
            className={`${isCompact ? 'w-10 h-10' : 'w-12 h-12'} ${config.light} rounded-xl flex items-center justify-center shadow-lg`}
          >
            {icon}
          </div>
          
          {/* Indicador de mudança */}
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.light}`}>
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
      <div className={isCompact ? 'px-4 py-3' : 'px-5 py-4'}>
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className={`${isCompact ? 'text-3xl' : 'text-4xl'} font-bold text-gray-900 mb-1`}>
          {percentage ? `${value}%` : value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}