// src/components/FAQs/StatusBadge/index.tsx - ✅ VERSÃO AVANÇADA
import React from 'react';
import type { FAQ } from '../../../services';

// ============================================
// TYPES
// ============================================

interface StatusBadgeProps {
  status: FAQ['status'];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'subtle';
  showIcon?: boolean;
  showDot?: boolean;
  language?: 'pt' | 'en';
  onClick?: () => void;
  className?: string;
}

// ============================================
// CONFIG
// ============================================

const STATUS_CONFIG: Record<FAQ['status'], {
  labelPt: string;
  labelEn: string;
  icon: string;
  dotColor: string;
  solid: string;
  outline: string;
  subtle: string;
}> = {
  active: {
    labelPt: 'Ativa',
    labelEn: 'Active',
    icon: '✅',
    dotColor: 'bg-green-500',
    solid: 'bg-green-600 text-white border-green-600',
    outline: 'bg-white text-green-700 border-green-600',
    subtle: 'bg-green-100 text-green-700 border-green-300',
  },
  inactive: {
    labelPt: 'Inativa',
    labelEn: 'Inactive',
    icon: '⛔',
    dotColor: 'bg-orange-500',
    solid: 'bg-orange-600 text-white border-orange-600',
    outline: 'bg-white text-orange-700 border-orange-600',
    subtle: 'bg-orange-100 text-orange-700 border-orange-300',
  },
};

// ============================================
// COMPONENT
// ============================================

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status,
  size = 'md',
  variant = 'subtle',
  showIcon = true,
  showDot = false,
  language = 'pt',
  onClick,
  className = '',
}) => {
  const config = STATUS_CONFIG[status];
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  // Variant classes
  const variantClass = config[variant];

  // Base classes
  const baseClasses = `
    inline-flex items-center gap-1.5
    rounded-full font-semibold
    border-2
    transition-all
    ${variantClass}
    ${sizeClasses[size]}
    ${onClick ? 'cursor-pointer hover:brightness-95 active:scale-95 hover:shadow-md' : ''}
    ${className}
  `;

  // Label
  const label = language === 'pt' ? config.labelPt : config.labelEn;

  return (
    <span 
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Dot indicator */}
      {showDot && (
        <span className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
      )}
      
      {/* Icon */}
      {showIcon && !showDot && (
        <span>{config.icon}</span>
      )}
      
      {/* Label */}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;

// ============================================
// EXPORT HOOK FOR STATUS TOGGLE
// ============================================

export const useStatusToggle = (
  currentStatus: FAQ['status'],
  onToggle: (newStatus: FAQ['status']) => void
) => {
  const toggleStatus = () => {
    const newStatus: FAQ['status'] = currentStatus === 'active' ? 'inactive' : 'active';
    onToggle(newStatus);
  };

  return { toggleStatus };
};

// ============================================
// EXPORT UTILITIES
// ============================================

export const getStatusLabel = (status: FAQ['status'], language: 'pt' | 'en' = 'pt'): string => {
  return language === 'pt' 
    ? STATUS_CONFIG[status].labelPt 
    : STATUS_CONFIG[status].labelEn;
};

export const getStatusIcon = (status: FAQ['status']): string => {
  return STATUS_CONFIG[status].icon;
};

export const isActiveStatus = (status: FAQ['status']): boolean => {
  return status === 'active';
};