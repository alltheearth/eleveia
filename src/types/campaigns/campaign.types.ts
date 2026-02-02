// src/types/campaigns/campaign.types.ts
// 📊 TIPOS PRINCIPAIS DE CAMPANHAS

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
  manual_contacts?: number[];
  
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
  created_by?: number;
  created_by_name?: string;
  sent_at?: string;
  completed_at?: string;
  
  // Analytics (opcional - vem de endpoint separado)
  analytics?: CampaignAnalytics;
}

export interface MessageContent {
  whatsapp?: WhatsAppMessage;
  email?: EmailMessage;
  sms?: SMSMessage;
}

export interface WhatsAppMessage {
  text: string;
  attachments?: Attachment[];
  buttons?: MessageButton[];
  header?: {
    type: 'text' | 'image' | 'video' | 'document';
    content: string;
  };
  footer?: string;
}

export interface EmailMessage {
  subject: string;
  body_html: string;
  body_text: string;
  from_name?: string;
  reply_to?: string;
  attachments?: Attachment[];
  custom_headers?: Record<string, string>;
}

export interface SMSMessage {
  text: string;
  sender_id?: string;
}

export interface MessageButton {
  type: 'url' | 'quick_reply' | 'phone';
  text: string;
  value: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  mime_type?: string;
}

export interface AudienceFilter {
  id?: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'between' | 'is_null' | 'is_not_null';
  value: any;
  logic?: 'AND' | 'OR';
}

export interface FollowUpRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: FollowUpTrigger;
  delay_value: number;
  delay_unit: 'minutes' | 'hours' | 'days';
  message_content: MessageContent;
  conditions?: FollowUpCondition[];
  max_attempts?: number;
  stop_on_response?: boolean;
}

export type FollowUpTrigger = 
  | 'not_delivered'
  | 'not_opened'
  | 'not_clicked'
  | 'not_responded'
  | 'responded_negative'
  | 'custom';

export interface FollowUpCondition {
  field: string;
  operator: string;
  value: any;
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  days_of_week?: number[]; // 0-6 (domingo-sábado)
  day_of_month?: number;   // 1-31
  month_of_year?: number;  // 1-12
  time_of_day?: string;    // HH:MM format
  timezone?: string;
  end_type: 'never' | 'after_occurrences' | 'on_date';
  end_occurrences?: number;
  end_date?: string;
}

export interface CampaignFormData {
  // Step 1: Basic Info
  name: string;
  type: CampaignType;
  description?: string;
  tags?: string[];
  
  // Step 2: Audience
  audience_filters: AudienceFilter[];
  manual_contacts?: number[];
  
  // Step 3: Channels
  channels: CampaignChannel[];
  channel_priority: CampaignChannel[];
  fallback_enabled: boolean;
  
  // Step 4: Message
  message_template_id?: number;
  message_content: MessageContent;
  
  // Step 5: Schedule
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: string;
  recurring_config?: RecurringConfig;
  
  // Step 6: Follow-ups
  follow_ups: FollowUpRule[];
  
  // Meta
  school: number;
}

export interface MessageTemplate {
  id: number;
  name: string;
  type: CampaignType;
  description?: string;
  category: 'system' | 'custom';
  message_content: MessageContent;
  variables: string[]; // Ex: ['nome', 'data', 'horario']
  preview_data?: Record<string, string>;
  is_active: boolean;
  school?: number;
  created_at: string;
  updated_at: string;
}

// Config de tipos e status
export interface CampaignTypeConfig {
  label: string;
  gradient: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
  description?: string;
}

export interface CampaignStatusConfig {
  label: string;
  color: string;
  icon: string;
  description?: string;
}

export interface CampaignChannelConfig {
  label: string;
  icon: string;
  color: string;
  description?: string;
  available: boolean;
}