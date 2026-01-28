// src/utils/faqStatusMapper.ts - ✅ MAPEADOR DE STATUS

import type { FAQ } from '../services';

/**
 * ============================================
 * FAQ STATUS MAPPER
 * ============================================
 * 
 * Normaliza status entre português e inglês
 * Handle de inconsistências da API
 */

// Tipo interno mais flexível
type InternalStatus = 'active' | 'inactive' | 'ativa' | 'inativa';

// Mapeamento de estilos (apenas inglês)
export const FAQ_STATUS_STYLES: Record<FAQ['status'], string> = {
  active: 'bg-green-100 text-green-700 border-green-300',
  inactive: 'bg-orange-100 text-orange-700 border-orange-300',
};

// Labels em português
export const FAQ_STATUS_LABELS: Record<FAQ['status'], string> = {
  active: 'Ativa',
  inactive: 'Inativa',
};

// Labels em inglês
export const FAQ_STATUS_LABELS_EN: Record<FAQ['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
};

/**
 * Normaliza status para inglês (padrão da API)
 */
export const normalizeStatus = (status: string | InternalStatus): FAQ['status'] => {
  const statusMap: Record<string, FAQ['status']> = {
    'active': 'active',
    'inactive': 'inactive',
    'ativa': 'active',
    'inativa': 'inactive',
    // Fallback
    '': 'active',
  };

  return statusMap[status?.toLowerCase()] || 'active';
};

/**
 * Verifica se status é válido
 */
export const isValidStatus = (status: any): status is FAQ['status'] => {
  return status === 'active' || status === 'inactive';
};

/**
 * Retorna ícone do status
 */
export const getStatusIcon = (status: FAQ['status']): string => {
  return status === 'active' ? '✅' : '⛔';
};

/**
 * Retorna cor Tailwind do status
 */
export const getStatusColor = (status: FAQ['status']): 'green' | 'orange' => {
  return status === 'active' ? 'green' : 'orange';
};