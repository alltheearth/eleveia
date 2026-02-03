// src/types/campaigns/analytics.types.ts

import type { CampaignChannel } from './campaign.types';

export interface TimelineDataPoint {
  timestamp: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface CampaignMetrics {
  total_campaigns: number;
  draft: number;
  scheduled: number;
  sending: number;
  completed: number;
  paused: number;
  cancelled: number;
  failed: number;
  
  // Médias
  avg_delivery_rate: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_conversion_rate: number;
  
  // Hoje
  sent_today: number;
  completed_today: number;
}