// src/types/common.types.ts
// Tipos e interfaces compartilhados em toda a aplicação

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Resposta paginada padrão da API
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Resposta de erro padrão da API
 */
export interface ApiError {
  detail?: string;
  message?: string;
  error?: string;
  non_field_errors?: string[];
  [key: string]: any;
}

/**
 * Resposta de sucesso genérica
 */
export interface ApiSuccess<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// ============================================================================
// BASE ENTITY TYPES
// ============================================================================

/**
 * Interface base para entidades com timestamps
 */
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para entidades com soft delete
 */
export interface SoftDeletable extends BaseEntity {
  deleted_at: string | null;
  is_active: boolean;
}

/**
 * Interface para entidades pertencentes a uma escola
 */
export interface SchoolEntity extends BaseEntity {
  school: number;
  school_name?: string;
}

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export type UserRole = 'admin' | 'manager' | 'teacher' | 'staff';

export interface User extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  schools: number[];
  permissions: string[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

// ============================================================================
// SCHOOL TYPES
// ============================================================================

export type SchoolStatus = 'active' | 'inactive' | 'pending';

export interface School extends BaseEntity {
  name: string;
  slug: string;
  logo?: string;
  address?: Address;
  phone?: string;
  email?: string;
  website?: string;
  status: SchoolStatus;
  subscription?: Subscription;
  settings?: SchoolSettings;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Subscription {
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expires_at: string;
  features: string[];
  limits: {
    max_students: number;
    max_campaigns: number;
    max_storage_mb: number;
  };
}

export interface SchoolSettings {
  timezone: string;
  language: string;
  currency: string;
  date_format: string;
  time_format: string;
  academic_year_start: string;
  academic_year_end: string;
}

// ============================================================================
// CONTACT TYPES
// ============================================================================

export type ContactType = 'parent' | 'guardian' | 'student' | 'other';
export type ContactStatus = 'active' | 'inactive' | 'blocked';

export interface Contact extends SchoolEntity {
  type: ContactType;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  cpf?: string;
  birth_date?: string;
  address?: Address;
  status: ContactStatus;
  tags?: string[];
  custom_fields?: Record<string, any>;
  students?: number[];
}

// ============================================================================
// FILE & ATTACHMENT TYPES
// ============================================================================

export type FileType = 
  | 'image' 
  | 'document' 
  | 'video' 
  | 'audio' 
  | 'spreadsheet' 
  | 'pdf' 
  | 'other';

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: FileType;
  mime_type: string;
  size: number;
  uploaded_at: string;
  uploaded_by?: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error';

export type NotificationChannel = 
  | 'in_app' 
  | 'email' 
  | 'push' 
  | 'whatsapp' 
  | 'sms';

export interface Notification extends BaseEntity {
  type: NotificationType;
  title: string;
  message: string;
  channels: NotificationChannel[];
  read: boolean;
  read_at?: string;
  action_url?: string;
  data?: Record<string, any>;
  user: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface MetricValue {
  value: number;
  change?: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'in'
  | 'not_in'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  | 'is_null'
  | 'is_not_null';

export type FilterLogic = 'AND' | 'OR';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: any;
  logic?: FilterLogic;
}

export interface FilterGroup {
  logic: FilterLogic;
  filters: (Filter | FilterGroup)[];
}

// ============================================================================
// SORTING & ORDERING TYPES
// ============================================================================

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// ============================================================================
// QUERY PARAMS TYPES
// ============================================================================

export interface BaseQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface FilteredQueryParams extends BaseQueryParams {
  filters?: Filter[];
  filter_groups?: FilterGroup[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  condition?: (row: T) => boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export type ViewMode = 'grid' | 'list' | 'kanban' | 'calendar';

export interface ViewState {
  mode: ViewMode;
  filters: Filter[];
  search: string;
  sort?: SortConfig;
  page: number;
  pageSize: number;
}

// ============================================================================
// OPTION TYPES (para selects, etc)
// ============================================================================

export interface Option<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface OptionGroup<T = string> {
  label: string;
  options: Option<T>[];
}

// ============================================================================
// DATE & TIME TYPES
// ============================================================================

export interface DateRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface RecurringSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  days_of_week?: number[];
  day_of_month?: number;
  month_of_year?: number;
  end_type: 'never' | 'after_occurrences' | 'on_date';
  end_occurrences?: number;
  end_date?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Torna todas as propriedades opcionais de forma profunda
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Torna algumas propriedades obrigatórias
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Remove propriedades específicas
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Extrai valores de um tipo union
 */
export type ValueOf<T> = T[keyof T];

// ============================================================================
// ASYNC OPERATION TYPES
// ============================================================================

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = any> {
  status: AsyncStatus;
  data?: T;
  error?: any;
}

// ============================================================================
// EXPORT DEFAULT PARA FACILITAR IMPORTS
// ============================================================================

export default {
  // Re-export tudo para facilitar
};