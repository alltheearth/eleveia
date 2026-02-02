// src/utils/campaigns/audienceFilters.ts
// 👥 LÓGICA DE FILTROS E SEGMENTAÇÃO

import type { 
  AudienceFilter, 
  FilterOperator,
  AudienceField 
} from '../../types/campaigns/audience.types';

// ============================================
// FILTER EVALUATION
// ============================================

/**
 * Avalia se um contato corresponde a um filtro específico
 */
export const evaluateFilter = (
  filter: AudienceFilter,
  contactData: Record<string, any>
): boolean => {
  const fieldValue = contactData[filter.field];
  const filterValue = filter.value;
  
  switch (filter.operator) {
    // Texto
    case 'equals':
      return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
    
    case 'not_equals':
      return String(fieldValue).toLowerCase() !== String(filterValue).toLowerCase();
    
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
    
    case 'not_contains':
      return !String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
    
    case 'starts_with':
      return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
    
    case 'ends_with':
      return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
    
    // Lista
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(fieldValue);
    
    case 'not_in':
      return Array.isArray(filterValue) && !filterValue.includes(fieldValue);
    
    // Numérico
    case 'greater_than':
      return Number(fieldValue) > Number(filterValue);
    
    case 'greater_than_or_equal':
      return Number(fieldValue) >= Number(filterValue);
    
    case 'less_than':
      return Number(fieldValue) < Number(filterValue);
    
    case 'less_than_or_equal':
      return Number(fieldValue) <= Number(filterValue);
    
    case 'between':
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const num = Number(fieldValue);
        return num >= Number(filterValue[0]) && num <= Number(filterValue[1]);
      }
      return false;
    
    // Data
    case 'date_is':
      return formatDate(fieldValue) === formatDate(filterValue);
    
    case 'date_before':
      return new Date(fieldValue) < new Date(filterValue);
    
    case 'date_after':
      return new Date(fieldValue) > new Date(filterValue);
    
    case 'date_between':
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const date = new Date(fieldValue);
        return date >= new Date(filterValue[0]) && date <= new Date(filterValue[1]);
      }
      return false;
    
    case 'date_in_last':
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(filterValue));
      return new Date(fieldValue) >= daysAgo;
    
    case 'date_in_next':
      const daysAhead = new Date();
      daysAhead.setDate(daysAhead.getDate() + Number(filterValue));
      return new Date(fieldValue) <= daysAhead;
    
    // Existência
    case 'is_null':
      return fieldValue === null || fieldValue === undefined;
    
    case 'is_not_null':
      return fieldValue !== null && fieldValue !== undefined;
    
    case 'is_empty':
      return !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
    
    case 'is_not_empty':
      return fieldValue && (typeof fieldValue !== 'string' || fieldValue.trim() !== '');
    
    default:
      return false;
  }
};

/**
 * Avalia se um contato corresponde a múltiplos filtros com lógica AND/OR
 */
export const evaluateFilters = (
  filters: AudienceFilter[],
  contactData: Record<string, any>
): boolean => {
  if (filters.length === 0) return true;
  
  // Agrupa filtros por lógica
  const andFilters: AudienceFilter[] = [];
  const orFilters: AudienceFilter[] = [];
  
  filters.forEach(filter => {
    if (filter.logic === 'OR') {
      orFilters.push(filter);
    } else {
      andFilters.push(filter);
    }
  });
  
  // Avalia filtros AND (todos devem passar)
  const andResult = andFilters.every(filter => evaluateFilter(filter, contactData));
  
  // Avalia filtros OR (ao menos um deve passar)
  const orResult = orFilters.length === 0 || orFilters.some(filter => evaluateFilter(filter, contactData));
  
  return andResult && orResult;
};

// ============================================
// HELPERS
// ============================================

/**
 * Formata data para comparação
 */
const formatDate = (date: any): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Normaliza valor para comparação
 */
export const normalizeValue = (value: any): any => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return value;
};

// ============================================
// FILTER BUILDERS
// ============================================

/**
 * Cria filtro de texto
 */
export const createTextFilter = (
  field: AudienceField,
  operator: FilterOperator,
  value: string
): AudienceFilter => {
  return {
    id: generateFilterId(),
    field,
    operator,
    value,
    logic: 'AND',
  };
};

/**
 * Cria filtro numérico
 */
export const createNumberFilter = (
  field: AudienceField,
  operator: FilterOperator,
  value: number | number[]
): AudienceFilter => {
  return {
    id: generateFilterId(),
    field,
    operator,
    value,
    logic: 'AND',
  };
};

/**
 * Cria filtro de data
 */
export const createDateFilter = (
  field: AudienceField,
  operator: FilterOperator,
  value: string | string[]
): AudienceFilter => {
  return {
    id: generateFilterId(),
    field,
    operator,
    value,
    logic: 'AND',
  };
};

/**
 * Cria filtro de lista
 */
export const createListFilter = (
  field: AudienceField,
  operator: 'in' | 'not_in',
  value: any[]
): AudienceFilter => {
  return {
    id: generateFilterId(),
    field,
    operator,
    value,
    logic: 'AND',
  };
};

/**
 * Gera ID único para filtro
 */
const generateFilterId = (): string => {
  return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// FILTER VALIDATION
// ============================================

/**
 * Valida estrutura de filtro
 */
export const validateFilter = (filter: AudienceFilter): {
  is_valid: boolean;
  error?: string;
} => {
  if (!filter.field) {
    return { is_valid: false, error: 'Campo é obrigatório' };
  }
  
  if (!filter.operator) {
    return { is_valid: false, error: 'Operador é obrigatório' };
  }
  
  if (filter.value === null || filter.value === undefined || filter.value === '') {
    const nullOperators: FilterOperator[] = ['is_null', 'is_not_null', 'is_empty', 'is_not_empty'];
    if (!nullOperators.includes(filter.operator)) {
      return { is_valid: false, error: 'Valor é obrigatório para este operador' };
    }
  }
  
  // Validações específicas por operador
  if (['between', 'date_between'].includes(filter.operator)) {
    if (!Array.isArray(filter.value) || filter.value.length !== 2) {
      return { is_valid: false, error: 'Operador "between" requer array com 2 valores' };
    }
  }
  
  if (['in', 'not_in'].includes(filter.operator)) {
    if (!Array.isArray(filter.value)) {
      return { is_valid: false, error: 'Operador "in/not_in" requer array de valores' };
    }
  }
  
  return { is_valid: true };
};

/**
 * Valida conjunto de filtros
 */
export const validateFilters = (filters: AudienceFilter[]): {
  is_valid: boolean;
  invalid_filters: Array<{ index: number; error: string }>;
} => {
  const invalidFilters: Array<{ index: number; error: string }> = [];
  
  filters.forEach((filter, index) => {
    const validation = validateFilter(filter);
    if (!validation.is_valid) {
      invalidFilters.push({
        index,
        error: validation.error || 'Filtro inválido',
      });
    }
  });
  
  return {
    is_valid: invalidFilters.length === 0,
    invalid_filters: invalidFilters,
  };
};

// ============================================
// FILTER DESCRIPTIONS
// ============================================

/**
 * Gera descrição humanizada de um filtro
 */
export const describeFilter = (filter: AudienceFilter): string => {
  const operatorLabels: Record<FilterOperator, string> = {
    equals: 'é igual a',
    not_equals: 'é diferente de',
    contains: 'contém',
    not_contains: 'não contém',
    starts_with: 'começa com',
    ends_with: 'termina com',
    in: 'está em',
    not_in: 'não está em',
    greater_than: 'é maior que',
    greater_than_or_equal: 'é maior ou igual a',
    less_than: 'é menor que',
    less_than_or_equal: 'é menor ou igual a',
    between: 'está entre',
    date_is: 'é em',
    date_before: 'é antes de',
    date_after: 'é depois de',
    date_between: 'está entre',
    date_in_last: 'nos últimos',
    date_in_next: 'nos próximos',
    is_null: 'está vazio',
    is_not_null: 'não está vazio',
    is_empty: 'está vazio',
    is_not_empty: 'não está vazio',
  };
  
  const fieldLabel = filter.field.replace(/_/g, ' ');
  const operatorLabel = operatorLabels[filter.operator];
  
  let valueLabel = '';
  if (filter.operator !== 'is_null' && filter.operator !== 'is_not_null' && 
      filter.operator !== 'is_empty' && filter.operator !== 'is_not_empty') {
    if (Array.isArray(filter.value)) {
      valueLabel = filter.value.join(', ');
    } else {
      valueLabel = String(filter.value);
    }
  }
  
  return `${fieldLabel} ${operatorLabel} ${valueLabel}`.trim();
};

/**
 * Gera descrição humanizada de conjunto de filtros
 */
export const describeFilters = (filters: AudienceFilter[]): string => {
  if (filters.length === 0) return 'Todos os contatos';
  
  const descriptions = filters.map((filter, index) => {
    const desc = describeFilter(filter);
    const logic = index > 0 ? (filter.logic === 'OR' ? ' OU ' : ' E ') : '';
    return `${logic}${desc}`;
  });
  
  return descriptions.join('');
};

// ============================================
// SEGMENT HELPERS
// ============================================

/**
 * Estima tamanho de audiência baseado em filtros
 * (Simulação - na prática seria chamada ao backend)
 */
export const estimateAudienceSize = async (
  filters: AudienceFilter[],
  schoolId: number
): Promise<{
  total: number;
  breakdown: Record<string, number>;
}> => {
  // Simulação
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const randomTotal = Math.floor(Math.random() * 500) + 50;
  
  return {
    total: randomTotal,
    breakdown: {
      whatsapp: Math.floor(randomTotal * 0.9),
      email: Math.floor(randomTotal * 0.85),
      sms: Math.floor(randomTotal * 0.7),
    },
  };
};

/**
 * Sugere filtros complementares baseados nos existentes
 */
export const suggestComplementaryFilters = (
  existingFilters: AudienceFilter[]
): AudienceFilter[] => {
  const suggestions: AudienceFilter[] = [];
  
  // Se filtrou por série, sugerir filtro de turno
  const hasGradeFilter = existingFilters.some(f => f.field === 'student_grade');
  if (hasGradeFilter && !existingFilters.some(f => f.field === 'student_shift')) {
    suggestions.push(
      createTextFilter('student_shift' as AudienceField, 'equals', 'manha')
    );
  }
  
  // Se filtrou por status de matrícula, sugerir filtro de débitos
  const hasEnrollmentFilter = existingFilters.some(f => f.field === 'enrollment_status');
  if (hasEnrollmentFilter && !existingFilters.some(f => f.field === 'has_debts')) {
    suggestions.push({
      id: generateFilterId(),
      field: 'has_debts' as AudienceField,
      operator: 'equals',
      value: false,
      logic: 'AND',
    });
  }
  
  return suggestions;
};