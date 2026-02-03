// src/types/campaigns/campaign.types.ts

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
  
  // Status e métricas
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
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

export interface CampaignFormData {
  name: string;
  type: CampaignType;
  description?: string;
  tags?: string[];
  channels: CampaignChannel[];
  scheduled_at?: string;
  school: number;
}

// Configurações de tipos e status
export const CAMPAIGN_TYPE_CONFIG: Record<CampaignType, {
  label: string;
  gradient: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  matricula: {
    label: 'Matrícula',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '🎓',
  },
  rematricula: {
    label: 'Rematrícula',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '🔄',
  },
  passei_direto: {
    label: 'Passei Direto',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🎉',
  },
  reuniao: {
    label: 'Reunião',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '📅',
  },
  evento: {
    label: 'Evento',
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    icon: '🎊',
  },
  cobranca: {
    label: 'Cobrança',
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '💰',
  },
  comunicado: {
    label: 'Comunicado',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '📢',
  },
};

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  draft: {
    label: 'Rascunho',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: '📝',
  },
  scheduled: {
    label: 'Agendada',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: '⏰',
  },
  sending: {
    label: 'Enviando',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: '🚀',
  },
  sent: {
    label: 'Enviada',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '✅',
  },
  completed: {
    label: 'Concluída',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '✅',
  },
  paused: {
    label: 'Pausada',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: '⏸️',
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: '🚫',
  },
  failed: {
    label: 'Falhou',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: '❌',
  },
};

export const CHANNEL_CONFIG: Record<CampaignChannel, {
  label: string;
  icon: string;
  color: string;
}> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: '💬',
    color: 'bg-green-100 text-green-700',
  },
  email: {
    label: 'Email',
    icon: '📧',
    color: 'bg-blue-100 text-blue-700',
  },
  sms: {
    label: 'SMS',
    icon: '📱',
    color: 'bg-purple-100 text-purple-700',
  },
};