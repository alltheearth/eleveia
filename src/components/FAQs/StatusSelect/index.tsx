// src/components/FAQs/StatusSelect/index.tsx - ✅ VERSÃO FINAL CORRIGIDA
import React from 'react';
import type { FAQ } from '../../../services';
import { 
  FAQ_STATUS_STYLES, 
  FAQ_STATUS_LABELS,
  normalizeStatus,
  getStatusIcon 
} from '../../../utils/faqStatusMapper';

// ============================================
// TYPES
// ============================================

interface StatusSelectProps {
  value: FAQ['status'];
  onChange: (status: FAQ['status']) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

// ============================================
// COMPONENT
// ============================================

const StatusSelect: React.FC<StatusSelectProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  variant = 'default' 
}) => {
  // ✅ Normalizar valor para garantir compatibilidade
  const normalizedValue = normalizeStatus(value);
  
  // ✅ Garantir que temos um estilo válido
  const styleClass = FAQ_STATUS_STYLES[normalizedValue] || FAQ_STATUS_STYLES.active;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = normalizeStatus(e.target.value);
    onChange(newStatus);
  };

  const baseClasses = `
    ${styleClass}
    rounded-full font-semibold 
    border-2
    cursor-pointer 
    focus:outline-none focus:ring-2 focus:ring-blue-300 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all hover:brightness-95
  `;

  const sizeClasses = variant === 'compact' 
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <select
      value={normalizedValue}
      onChange={handleChange}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses}`}
    >
      <option value="active">
        {getStatusIcon('active')} {FAQ_STATUS_LABELS.active}
      </option>
      <option value="inactive">
        {getStatusIcon('inactive')} {FAQ_STATUS_LABELS.inactive}
      </option>
    </select>
  );
};

export default StatusSelect;