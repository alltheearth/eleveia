// src/pages/Campaigns/config/campaign.config.ts

import type { CampaignType, CampaignStatus } from '../../../types/campaigns/campaign.types';

export const CAMPAIGN_TYPE_CONFIG: Record<CampaignType, {
  label: string;
  gradient: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
  description: string;
}> = {
  matricula: {
    label: 'Matrícula',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '🎓',
    description: 'Campanhas para captação de novos alunos',
  },
  rematricula: {
    label: 'Rematrícula',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '🔄',
    description: 'Campanhas de renovação de matrículas',
  },
  passei_direto: {
    label: 'Passei Direto',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🎉',
    description: 'Campanhas de captação via Passei Direto',
  },
  reuniao: {
    label: 'Reunião',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '📅',
    description: 'Convites para reuniões e encontros',
  },
  evento: {
    label: 'Evento',
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    icon: '🎊',
    description: 'Divulgação de eventos escolares',
  },
  cobranca: {
    label: 'Cobrança',
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '💰',
    description: 'Lembretes de pagamento e cobranças',
  },
  comunicado: {
    label: 'Comunicado',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '📢',
    description: 'Comunicados gerais aos responsáveis',
  },
};

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, {
  label: string;
  color: string;
  dotColor: string;
  icon: string;
  description: string;
}> = {
  draft: {
    label: 'Rascunho',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    dotColor: 'bg-gray-500',
    icon: '📝',
    description: 'Campanha em elaboração',
  },
  scheduled: {
    label: 'Agendada',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    dotColor: 'bg-blue-500',
    icon: '⏰',
    description: 'Aguardando data de envio',
  },
  sending: {
    label: 'Enviando',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    dotColor: 'bg-yellow-500',
    icon: '🚀',
    description: 'Mensagens sendo enviadas',
  },
  sent: {
    label: 'Enviada',
    color: 'bg-green-100 text-green-700 border-green-300',
    dotColor: 'bg-green-500',
    icon: '✅',
    description: 'Todas as mensagens enviadas',
  },
  completed: {
    label: 'Concluída',
    color: 'bg-green-100 text-green-700 border-green-300',
    dotColor: 'bg-green-500',
    icon: '✅',
    description: 'Campanha finalizada com sucesso',
  },
  paused: {
    label: 'Pausada',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    dotColor: 'bg-orange-500',
    icon: '⏸️',
    description: 'Campanha pausada temporariamente',
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-700 border-red-300',
    dotColor: 'bg-red-500',
    icon: '🚫',
    description: 'Campanha cancelada',
  },
  failed: {
    label: 'Falhou',
    color: 'bg-red-100 text-red-700 border-red-300',
    dotColor: 'bg-red-500',
    icon: '❌',
    description: 'Erro no envio da campanha',
  },
};

export const CHANNEL_CONFIG = {
  whatsapp: {
    label: 'WhatsApp',
    icon: '💬',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  email: {
    label: 'E-mail',
    icon: '✉️',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  sms: {
    label: 'SMS',
    icon: '📱',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
};