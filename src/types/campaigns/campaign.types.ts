// src/pages/Campaigns/types/campaign.types.ts
// 🎯 TIPOS PRINCIPAIS DE CAMPANHAS

// ============================================
// CAMPAIGN TYPES
// ============================================

export type CampaignType = 
  | 'matricula'
  | 'rematricula'
  | 'passei_direto'
  | 'reuniao'
  | 'evento'
  | 'cobranca'
  | 'comunicado';

export type CampaignStatus = 
  | 'draft'          // Rascunho
  | 'scheduled'      // Agendada
  | 'sending'        // Em envio
  | 'sent'           // Enviada
  | 'completed'      // Concluída
  | 'paused'         // Pausada
  | 'cancelled'      // Cancelada
  | 'failed';        // Falhou

export type CampaignChannel = 'whatsapp' | 'email' | 'sms';

export interface Campaign {
  id: number;
  school: number;
  school_name?: string;
  
  // Básico
  name: string;
  type: CampaignType;
  description?: string;
  tags?: string[];
  
  // Audiência
  audience_filters: AudienceFilter[];
  audience_count: number;
  
  // Canais
  channels: CampaignChannel[];
  channel_priority: CampaignChannel[];
  fallback_enabled: boolean;
  
  // Mensagem
  message_template_id?: number;
  message_content: MessageContent;
  
  // Agendamento
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: string;
  recurring_config?: RecurringConfig;
  
  // Follow-ups
  follow_ups: FollowUpRule[];
  
  // Status e métricas
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  completed_at?: string;
  
  // Analytics
  analytics?: CampaignAnalytics;
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface MessageContent {
  whatsapp?: {
    text: string;
    attachments?: Attachment[];
    buttons?: MessageButton[];
  };
  email?: {
    subject: string;
    body_html: string;
    body_text: string;
    from_name?: string;
    reply_to?: string;
    attachments?: Attachment[];
  };
  sms?: {
    text: string;
  };
}

export interface MessageButton {
  type: 'url' | 'quick_reply' | 'phone';
  text: string;
  value: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  filename: string;
  size: number;
}

// ============================================
// AUDIENCE TYPES
// ============================================

export interface AudienceFilter {
  id?: string;
  field: string;
  operator: FilterOperator;
  value: any;
  logic?: 'AND' | 'OR';
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'in' 
  | 'not_in' 
  | 'greater_than' 
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'between'
  | 'is_null'
  | 'is_not_null'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'date_equals'
  | 'date_before'
  | 'date_after'
  | 'date_between';

// ============================================
// FOLLOW-UP TYPES
// ============================================

export interface FollowUpRule {
  id: string;
  name: string;
  trigger: FollowUpTrigger;
  delay_value: number;
  delay_unit: 'minutes' | 'hours' | 'days';
  message_content: MessageContent;
  conditions?: FollowUpCondition[];
  enabled: boolean;
}

export type FollowUpTrigger = 
  | 'not_opened'
  | 'not_clicked'
  | 'not_responded'
  | 'responded_negative'
  | 'custom';

export interface FollowUpCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

// ============================================
// SCHEDULE TYPES
// ============================================

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  days_of_week?: number[]; // 0-6 (domingo-sábado)
  day_of_month?: number;   // 1-31
  end_type: 'never' | 'after_occurrences' | 'on_date';
  end_occurrences?: number;
  end_date?: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface CampaignAnalytics {
  // Envios
  total_recipients: number;
  messages_sent: number;
  messages_delivered: number;
  messages_failed: number;
  
  // Engajamento
  messages_opened: number;
  messages_clicked: number;
  messages_responded: number;
  
  // Conversão
  conversions: number;
  
  // Taxas
  delivery_rate: number;      // %
  open_rate: number;          // %
  click_rate: number;         // %
  response_rate: number;      // %
  conversion_rate: number;    // %
  
  // Por canal
  by_channel: {
    [key in CampaignChannel]?: ChannelMetrics;
  };
  
  // Timeline
  timeline: TimelineDataPoint[];
}

export interface ChannelMetrics {
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  responded: number;
}

export interface TimelineDataPoint {
  timestamp: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

// ============================================
// TEMPLATE TYPES
// ============================================

export interface MessageTemplate {
  id: number;
  name: string;
  category: CampaignType;
  description?: string;
  content: MessageContent;
  variables: string[]; // Lista de variáveis disponíveis, ex: {{nome}}, {{escola}}
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface CampaignFormData {
  // Step 1
  name: string;
  type: CampaignType;
  description?: string;
  tags?: string[];
  
  // Step 2
  audience_filters: AudienceFilter[];
  manual_contacts?: number[];
  
  // Step 3
  channels: CampaignChannel[];
  channel_priority: CampaignChannel[];
  fallback_enabled: boolean;
  
  // Step 4
  message_template_id?: number;
  message_content: MessageContent;
  
  // Step 5
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: string;
  recurring_config?: RecurringConfig;
  
  // Step 6
  follow_ups: FollowUpRule[];
  
  // Meta
  school: number;
}

// ============================================
// STATS TYPES
// ============================================

export interface CampaignStats {
  total: number;
  draft: number;
  scheduled: number;
  sending: number;
  completed: number;
  paused: number;
  cancelled: number;
  failed: number;
  
  avg_delivery_rate: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_conversion_rate: number;
  
  sent_today: number;
  sent_this_week: number;
  sent_this_month: number;
}