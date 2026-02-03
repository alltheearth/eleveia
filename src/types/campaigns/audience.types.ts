// src/types/campaigns/audience.types.ts

export interface AudienceFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
  logic?: 'AND' | 'OR';
}

export interface SavedSegment {
  id: number;
  name: string;
  description?: string;
  filters: AudienceFilter[];
  count: number;
  created_at: string;
  updated_at: string;
}