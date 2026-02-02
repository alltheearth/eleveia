// src/utils/campaigns/analyticsCalculators.ts
// 📊 CALCULADORES DE MÉTRICAS E ANALYTICS

import type { CampaignAnalytics, ChannelMetrics, FunnelStage } from '../../types/campaigns/analytics.types';

// ============================================
// RATE CALCULATORS
// ============================================

/**
 * Calcula taxa de entrega
 */
export const calculateDeliveryRate = (delivered: number, sent: number): number => {
  if (sent === 0) return 0;
  return Number(((delivered / sent) * 100).toFixed(2));
};

/**
 * Calcula taxa de abertura
 */
export const calculateOpenRate = (opened: number, delivered: number): number => {
  if (delivered === 0) return 0;
  return Number(((opened / delivered) * 100).toFixed(2));
};

/**
 * Calcula taxa de clique
 */
export const calculateClickRate = (clicked: number, delivered: number): number => {
  if (delivered === 0) return 0;
  return Number(((clicked / delivered) * 100).toFixed(2));
};

/**
 * Calcula taxa de resposta
 */
export const calculateResponseRate = (responded: number, delivered: number): number => {
  if (delivered === 0) return 0;
  return Number(((responded / delivered) * 100).toFixed(2));
};

/**
 * Calcula taxa de conversão
 */
export const calculateConversionRate = (conversions: number, delivered: number): number => {
  if (delivered === 0) return 0;
  return Number(((conversions / delivered) * 100).toFixed(2));
};

/**
 * Calcula taxa de bounce (falhas)
 */
export const calculateBounceRate = (failed: number, sent: number): number => {
  if (sent === 0) return 0;
  return Number(((failed / sent) * 100).toFixed(2));
};

// ============================================
// ENGAGEMENT METRICS
// ============================================

/**
 * Calcula score de engajamento (0-100)
 */
export const calculateEngagementScore = (
  opened: number,
  clicked: number,
  responded: number,
  delivered: number
): number => {
  if (delivered === 0) return 0;
  
  const openWeight = 0.3;
  const clickWeight = 0.4;
  const responseWeight = 0.3;
  
  const openScore = (opened / delivered) * 100 * openWeight;
  const clickScore = (clicked / delivered) * 100 * clickWeight;
  const responseScore = (responded / delivered) * 100 * responseWeight;
  
  return Number((openScore + clickScore + responseScore).toFixed(1));
};

/**
 * Calcula média de tempo até primeira abertura
 */
export const calculateAvgTimeToOpen = (
  contacts: Array<{ sent_at: string; opened_at?: string }>
): number => {
  const validContacts = contacts.filter(c => c.opened_at);
  
  if (validContacts.length === 0) return 0;
  
  const totalSeconds = validContacts.reduce((sum, contact) => {
    const sentTime = new Date(contact.sent_at).getTime();
    const openedTime = new Date(contact.opened_at!).getTime();
    return sum + (openedTime - sentTime) / 1000;
  }, 0);
  
  return Number((totalSeconds / validContacts.length).toFixed(0));
};

/**
 * Formata tempo em segundos para formato legível
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

// ============================================
// FUNNEL ANALYSIS
// ============================================

/**
 * Calcula funil de conversão
 */
export const calculateFunnel = (analytics: CampaignAnalytics): FunnelStage[] => {
  const stages: FunnelStage[] = [
    {
      stage: 'sent',
      label: 'Enviadas',
      count: analytics.messages_sent,
      percentage: 100,
    },
    {
      stage: 'delivered',
      label: 'Entregues',
      count: analytics.messages_delivered,
      percentage: Number(((analytics.messages_delivered / analytics.messages_sent) * 100).toFixed(1)),
      drop_off: analytics.messages_sent - analytics.messages_delivered,
      drop_off_percentage: Number((((analytics.messages_sent - analytics.messages_delivered) / analytics.messages_sent) * 100).toFixed(1)),
    },
    {
      stage: 'opened',
      label: 'Abertas',
      count: analytics.messages_opened,
      percentage: Number(((analytics.messages_opened / analytics.messages_sent) * 100).toFixed(1)),
      drop_off: analytics.messages_delivered - analytics.messages_opened,
      drop_off_percentage: Number((((analytics.messages_delivered - analytics.messages_opened) / analytics.messages_delivered) * 100).toFixed(1)),
    },
    {
      stage: 'clicked',
      label: 'Clicadas',
      count: analytics.messages_clicked,
      percentage: Number(((analytics.messages_clicked / analytics.messages_sent) * 100).toFixed(1)),
      drop_off: analytics.messages_opened - analytics.messages_clicked,
      drop_off_percentage: Number((((analytics.messages_opened - analytics.messages_clicked) / analytics.messages_opened) * 100).toFixed(1)),
    },
  ];
  
  if (analytics.conversions > 0) {
    stages.push({
      stage: 'converted',
      label: 'Convertidas',
      count: analytics.conversions,
      percentage: Number(((analytics.conversions / analytics.messages_sent) * 100).toFixed(1)),
      drop_off: analytics.messages_clicked - analytics.conversions,
      drop_off_percentage: analytics.messages_clicked > 0 
        ? Number((((analytics.messages_clicked - analytics.conversions) / analytics.messages_clicked) * 100).toFixed(1))
        : 0,
    });
  }
  
  return stages;
};

// ============================================
// CHANNEL COMPARISON
// ============================================

/**
 * Compara performance entre canais
 */
export const compareChannels = (
  byChannel: Record<string, ChannelMetrics>
): Array<{
  channel: string;
  metrics: ChannelMetrics;
  rank: number;
  best_metric: string;
}> => {
  const channels = Object.entries(byChannel).map(([channel, metrics]) => ({
    channel,
    metrics,
    rank: 0,
    best_metric: '',
  }));
  
  // Calcula scores para ranking
  channels.forEach(ch => {
    const score = 
      ch.metrics.delivery_rate * 0.2 +
      ch.metrics.open_rate * 0.3 +
      ch.metrics.click_rate * 0.3 +
      ch.metrics.conversion_rate * 0.2;
    
    (ch as any).score = score;
  });
  
  // Ordena por score
  channels.sort((a, b) => (b as any).score - (a as any).score);
  
  // Atribui ranks
  channels.forEach((ch, index) => {
    ch.rank = index + 1;
  });
  
  // Identifica melhor métrica de cada canal
  channels.forEach(ch => {
    const rates = {
      'Taxa de Entrega': ch.metrics.delivery_rate,
      'Taxa de Abertura': ch.metrics.open_rate,
      'Taxa de Clique': ch.metrics.click_rate,
      'Taxa de Conversão': ch.metrics.conversion_rate,
    };
    
    const best = Object.entries(rates).sort((a, b) => b[1] - a[1])[0];
    ch.best_metric = best[0];
  });
  
  return channels;
};

/**
 * Identifica canal com melhor performance
 */
export const getBestChannel = (
  byChannel: Record<string, ChannelMetrics>
): string | null => {
  const comparison = compareChannels(byChannel);
  return comparison.length > 0 ? comparison[0].channel : null;
};

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Calcula tendência de uma métrica (crescimento/queda)
 */
export const calculateTrend = (
  currentValue: number,
  previousValue: number
): {
  change: number;
  percentage: number;
  direction: 'up' | 'down' | 'stable';
} => {
  const change = currentValue - previousValue;
  const percentage = previousValue > 0 
    ? Number(((change / previousValue) * 100).toFixed(1))
    : 0;
  
  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(percentage) >= 5) {
    direction = percentage > 0 ? 'up' : 'down';
  }
  
  return {
    change,
    percentage,
    direction,
  };
};

// ============================================
// PERFORMANCE INDICATORS
// ============================================

/**
 * Avalia performance geral da campanha
 */
export const evaluateCampaignPerformance = (
  analytics: CampaignAnalytics
): {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  insights: string[];
  recommendations: string[];
} => {
  const deliveryScore = analytics.delivery_rate;
  const openScore = analytics.open_rate;
  const clickScore = analytics.click_rate;
  const conversionScore = analytics.conversion_rate * 10; // Peso maior
  
  const totalScore = Number((
    deliveryScore * 0.2 +
    openScore * 0.3 +
    clickScore * 0.3 +
    conversionScore * 0.2
  ).toFixed(1));
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 60) grade = 'B';
  else if (totalScore >= 40) grade = 'C';
  else if (totalScore >= 20) grade = 'D';
  else grade = 'F';
  
  const insights: string[] = [];
  const recommendations: string[] = [];
  
  // Insights
  if (analytics.delivery_rate < 95) {
    insights.push(`Taxa de entrega abaixo do ideal (${analytics.delivery_rate.toFixed(1)}%)`);
    recommendations.push('Revise a qualidade da lista de contatos e remova números inválidos');
  }
  
  if (analytics.open_rate < 20) {
    insights.push(`Taxa de abertura baixa (${analytics.open_rate.toFixed(1)}%)`);
    recommendations.push('Melhore o assunto/título da mensagem para aumentar abertura');
  }
  
  if (analytics.click_rate < 10) {
    insights.push(`Taxa de clique baixa (${analytics.click_rate.toFixed(1)}%)`);
    recommendations.push('Adicione CTAs (Call-to-Action) mais claros e atraentes');
  }
  
  if (analytics.conversion_rate < 5) {
    insights.push(`Taxa de conversão baixa (${analytics.conversion_rate.toFixed(1)}%)`);
    recommendations.push('Revise a oferta e facilite o processo de conversão');
  }
  
  // Insights positivos
  if (analytics.open_rate > 40) {
    insights.push(`Excelente taxa de abertura! (${analytics.open_rate.toFixed(1)}%)`);
  }
  
  if (analytics.conversion_rate > 10) {
    insights.push(`Ótima taxa de conversão! (${analytics.conversion_rate.toFixed(1)}%)`);
  }
  
  return {
    score: totalScore,
    grade,
    insights,
    recommendations,
  };
};

// ============================================
// BENCHMARKS
// ============================================

export const INDUSTRY_BENCHMARKS = {
  education: {
    delivery_rate: { min: 95, avg: 98, max: 99.5 },
    open_rate: { min: 20, avg: 35, max: 50 },
    click_rate: { min: 5, avg: 12, max: 25 },
    conversion_rate: { min: 2, avg: 8, max: 15 },
  },
};

/**
 * Compara com benchmarks da indústria
 */
export const compareWithBenchmarks = (
  analytics: CampaignAnalytics,
  industry: keyof typeof INDUSTRY_BENCHMARKS = 'education'
): {
  metric: string;
  value: number;
  benchmark_avg: number;
  performance: 'above' | 'at' | 'below';
  difference: number;
}[] => {
  const benchmarks = INDUSTRY_BENCHMARKS[industry];
  
  return [
    {
      metric: 'Entrega',
      value: analytics.delivery_rate,
      benchmark_avg: benchmarks.delivery_rate.avg,
      performance: analytics.delivery_rate >= benchmarks.delivery_rate.avg ? 'above' : 'below',
      difference: Number((analytics.delivery_rate - benchmarks.delivery_rate.avg).toFixed(1)),
    },
    {
      metric: 'Abertura',
      value: analytics.open_rate,
      benchmark_avg: benchmarks.open_rate.avg,
      performance: analytics.open_rate >= benchmarks.open_rate.avg ? 'above' : 'below',
      difference: Number((analytics.open_rate - benchmarks.open_rate.avg).toFixed(1)),
    },
    {
      metric: 'Clique',
      value: analytics.click_rate,
      benchmark_avg: benchmarks.click_rate.avg,
      performance: analytics.click_rate >= benchmarks.click_rate.avg ? 'above' : 'below',
      difference: Number((analytics.click_rate - benchmarks.click_rate.avg).toFixed(1)),
    },
    {
      metric: 'Conversão',
      value: analytics.conversion_rate,
      benchmark_avg: benchmarks.conversion_rate.avg,
      performance: analytics.conversion_rate >= benchmarks.conversion_rate.avg ? 'above' : 'below',
      difference: Number((analytics.conversion_rate - benchmarks.conversion_rate.avg).toFixed(1)),
    },
  ];
};