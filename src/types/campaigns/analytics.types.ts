// src/types/campaigns/analytics.types.ts
// 📈 TIPOS DE ANALYTICS E MÉTRICAS

import type { CampaignChannel } from './campaign.types';

export interface CampaignAnalytics {
  campaign_id: number;
  
  // Envios
  total_recipients: number;
  messages_sent: number;
  messages_delivered: number;
  messages_failed: number;
  messages_pending: number;
  
  // Engajamento
  messages_opened: number;
  messages_clicked: number;
  messages_responded: number;
  unique_opens: number;
  unique_clicks: number;
  
  // Conversão
  conversions: number;
  conversion_value?: number;
  
  // Taxas (percentuais)
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  response_rate: number;
  conversion_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  
  // Por canal
  by_channel: {
    [key in CampaignChannel]?: ChannelMetrics;
  };
  
  // Timeline
  timeline: TimelineDataPoint[];
  
  // Top performers
  top_links?: LinkPerformance[];
  top_contacts?: ContactPerformance[];
  
  // Dispositivos e localização
  devices?: DeviceStats;
  locations?: LocationStats[];
  
  // Última atualização
  updated_at: string;
}

export interface ChannelMetrics {
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  opened: number;
  clicked: number;
  responded: number;
  conversions: number;
  
  // Taxas
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  response_rate: number;
  conversion_rate: number;
  
  // Tempo médio
  avg_delivery_time?: number; // em segundos
  avg_response_time?: number; // em segundos
}

export interface TimelineDataPoint {
  timestamp: string;
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  responded: number;
  conversions: number;
}

export interface LinkPerformance {
  url: string;
  clicks: number;
  unique_clicks: number;
  click_rate: number;
  conversions: number;
}

export interface ContactPerformance {
  contact_id: number;
  contact_name: string;
  contact_email?: string;
  opened: boolean;
  clicked: boolean;
  responded: boolean;
  converted: boolean;
  engagement_score: number; // 0-100
  last_interaction: string;
}

export interface DeviceStats {
  mobile: number;
  desktop: number;
  tablet: number;
  unknown: number;
}

export interface LocationStats {
  country: string;
  city?: string;
  count: number;
  percentage: number;
}

export interface CampaignComparison {
  campaign_id: number;
  campaign_name: string;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversions: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
  };
}

export interface MetricTrend {
  metric_name: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ContactEngagement {
  contact_id: number;
  campaign_id: number;
  
  // Delivery
  sent_at?: string;
  delivered_at?: string;
  failed_at?: string;
  failure_reason?: string;
  
  // Engagement
  opened_at?: string;
  open_count: number;
  last_opened_at?: string;
  
  clicked_at?: string;
  click_count: number;
  last_clicked_at?: string;
  clicked_links?: string[];
  
  responded_at?: string;
  response_text?: string;
  
  // Conversion
  converted_at?: string;
  conversion_value?: number;
  
  // Device & Location
  device?: 'mobile' | 'desktop' | 'tablet';
  user_agent?: string;
  ip_address?: string;
  location?: string;
  
  // Status
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'responded' | 'converted' | 'failed' | 'bounced' | 'unsubscribed';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface FunnelStage {
  stage: 'sent' | 'delivered' | 'opened' | 'clicked' | 'responded' | 'converted';
  label: string;
  count: number;
  percentage: number;
  drop_off?: number;
  drop_off_percentage?: number;
}

export interface CampaignReport {
  campaign: {
    id: number;
    name: string;
    type: string;
    status: string;
    created_at: string;
    sent_at?: string;
  };
  
  summary: CampaignAnalytics;
  funnel: FunnelStage[];
  trends: MetricTrend[];
  comparisons?: CampaignComparison[];
  
  // Detailed breakdowns
  hourly_breakdown?: TimelineDataPoint[];
  daily_breakdown?: TimelineDataPoint[];
  
  // Export metadata
  generated_at: string;
  generated_by?: string;
}