// src/types/campaigns/audience.types.ts
// 👥 TIPOS DE AUDIÊNCIA E SEGMENTAÇÃO

export interface AudienceSegment {
  id: number;
  name: string;
  description?: string;
  filters: AudienceFilter[];
  contact_count: number;
  school: number;
  is_dynamic: boolean; // Atualiza automaticamente
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
}

export interface AudienceFilter {
  id?: string;
  field: AudienceField;
  operator: FilterOperator;
  value: any;
  logic?: 'AND' | 'OR';
}

export type AudienceField = 
  // Dados pessoais
  | 'name'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'birth_date'
  | 'gender'
  
  // Relacionamento com escola
  | 'student_name'
  | 'student_grade'
  | 'student_class'
  | 'student_shift'
  | 'enrollment_status'
  | 'enrollment_date'
  | 'has_debts'
  | 'debt_amount'
  
  // Histórico
  | 'last_contact_date'
  | 'last_event_attended'
  | 'campaigns_received'
  | 'campaigns_opened'
  | 'campaigns_clicked'
  
  // Segmentação
  | 'tags'
  | 'custom_field'
  | 'lead_status'
  | 'lead_source';

export type FilterOperator = 
  // Texto
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  
  // Lista
  | 'in'
  | 'not_in'
  
  // Numérico
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  
  // Data
  | 'date_is'
  | 'date_before'
  | 'date_after'
  | 'date_between'
  | 'date_in_last'
  | 'date_in_next'
  
  // Existência
  | 'is_null'
  | 'is_not_null'
  | 'is_empty'
  | 'is_not_empty';

export interface FilterFieldConfig {
  field: AudienceField;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  operators: FilterOperator[];
  options?: Array<{
    value: string | number;
    label: string;
  }>;
  placeholder?: string;
  help_text?: string;
}

export interface AudiencePreview {
  total_count: number;
  sample_contacts: PreviewContact[];
  breakdown: {
    by_grade?: Record<string, number>;
    by_class?: Record<string, number>;
    by_shift?: Record<string, number>;
    by_status?: Record<string, number>;
  };
  filters_applied: AudienceFilter[];
  estimated_reach: {
    whatsapp: number;
    email: number;
    sms: number;
  };
}

export interface PreviewContact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  student_name?: string;
  student_grade?: string;
  student_class?: string;
  tags?: string[];
}

export interface ContactImport {
  id: number;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  processed_rows: number;
  successful_imports: number;
  failed_imports: number;
  errors?: ImportError[];
  created_at: string;
  completed_at?: string;
}

export interface ImportError {
  row: number;
  field?: string;
  error: string;
  value?: string;
}

export interface ContactListUpload {
  file: File;
  mapping: Record<string, string>; // CSV column -> DB field
  skip_duplicates: boolean;
  update_existing: boolean;
}

export const AUDIENCE_FIELD_CONFIGS: FilterFieldConfig[] = [
  // Dados Pessoais
  {
    field: 'name',
    label: 'Nome',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with'],
    placeholder: 'Ex: Maria Silva',
  },
  {
    field: 'email',
    label: 'Email',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_null', 'is_not_null'],
    placeholder: 'Ex: maria@email.com',
  },
  {
    field: 'phone',
    label: 'Telefone',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'is_null', 'is_not_null'],
    placeholder: 'Ex: 11999990000',
  },
  
  // Relacionamento com Escola
  {
    field: 'student_grade',
    label: 'Série/Ano',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: 'infantil_1', label: 'Infantil 1' },
      { value: 'infantil_2', label: 'Infantil 2' },
      { value: '1_ano', label: '1º Ano' },
      { value: '2_ano', label: '2º Ano' },
      { value: '3_ano', label: '3º Ano' },
      { value: '4_ano', label: '4º Ano' },
      { value: '5_ano', label: '5º Ano' },
      { value: '6_ano', label: '6º Ano' },
      { value: '7_ano', label: '7º Ano' },
      { value: '8_ano', label: '8º Ano' },
      { value: '9_ano', label: '9º Ano' },
    ],
  },
  {
    field: 'enrollment_status',
    label: 'Status de Matrícula',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: 'active', label: 'Ativa' },
      { value: 'pending', label: 'Pendente' },
      { value: 'cancelled', label: 'Cancelada' },
      { value: 'graduated', label: 'Concluída' },
    ],
  },
  {
    field: 'has_debts',
    label: 'Possui Débitos',
    type: 'boolean',
    operators: ['equals'],
    options: [
      { value: true, label: 'Sim' },
      { value: false, label: 'Não' },
    ],
  },
  
  // Histórico e Engajamento
  {
    field: 'last_contact_date',
    label: 'Último Contato',
    type: 'date',
    operators: ['date_is', 'date_before', 'date_after', 'date_between', 'date_in_last', 'is_null'],
    placeholder: 'Selecione a data',
  },
  {
    field: 'campaigns_opened',
    label: 'Campanhas Abertas',
    type: 'number',
    operators: ['equals', 'greater_than', 'greater_than_or_equal', 'less_than', 'less_than_or_equal', 'between'],
    placeholder: 'Ex: 5',
  },
  
  // Lead
  {
    field: 'lead_status',
    label: 'Status de Lead',
    type: 'select',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: 'novo', label: 'Novo' },
      { value: 'contato', label: 'Em Contato' },
      { value: 'qualificado', label: 'Qualificado' },
      { value: 'conversao', label: 'Convertido' },
      { value: 'perdido', label: 'Perdido' },
    ],
  },
];