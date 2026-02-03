// src/pages/Campaigns/types/campaign.types.ts

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
  audience_count: number;
  
  // Canais
  channels: CampaignChannel[];
  
  // Agendamento
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: string;
  
  // Status e métricas
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  completed_at?: string;
  
  // Analytics
  analytics?: CampaignAnalytics;
}

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
}

export interface ChannelMetrics {
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  responded: number;
}

export interface CampaignStats {
  total: number;
  draft: number;
  scheduled: number;
  sending: number;
  completed: number;
  paused: number;
  cancelled: number;
  avg_delivery_rate: number;
  avg_open_rate: number;
  avg_conversion_rate: number;
  sent_today: number;
}

export type ViewMode = 'grid' | 'list' | 'kanban';

export interface CampaignFilters {
  search: string;
  status: CampaignStatus | 'all';
  type: CampaignType | 'all';
  channel: CampaignChannel | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
}