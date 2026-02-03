// src/pages/Campaigns/utils/campaignConfig.ts
// 🎨 CONFIGURAÇÕES E DADOS MOCKADOS

import type {
  Campaign,
  CampaignType,
  CampaignStatus,
  CampaignChannel,
  CampaignStats,
  MessageTemplate,
} from '../types/campaign.types';

// ============================================
// TYPE CONFIG
// ============================================

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
    description: 'Campanha para captação de novos alunos',
  },
  rematricula: {
    label: 'Rematrícula',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '🔄',
    description: 'Renovação de matrículas de alunos atuais',
  },
  passei_direto: {
    label: 'Passei Direto',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🎉',
    description: 'Congratulações e incentivo aos aprovados',
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
    description: 'Lembretes e cobranças de mensalidades',
  },
  comunicado: {
    label: 'Comunicado',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '📢',
    description: 'Comunicações gerais e avisos',
  },
};

// ============================================
// STATUS CONFIG
// ============================================

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
    description: 'Campanha em edição',
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
    description: 'Campanha finalizada',
  },
  paused: {
    label: 'Pausada',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    dotColor: 'bg-orange-500',
    icon: '⏸️',
    description: 'Temporariamente suspensa',
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
    description: 'Erro no envio',
  },
};

// ============================================
// CHANNEL CONFIG
// ============================================

export const CHANNEL_CONFIG: Record<CampaignChannel, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: '💬',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Mensagens via WhatsApp Business',
  },
  email: {
    label: 'E-mail',
    icon: '📧',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'E-mails personalizados',
  },
  sms: {
    label: 'SMS',
    icon: '📱',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: 'Mensagens de texto SMS',
  },
};

// ============================================
// MOCK DATA
// ============================================

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Matrículas 2026 - Turma Integral',
    type: 'matricula',
    description: 'Campanha de captação para turma de período integral',
    tags: ['2026', 'integral', 'captacao'],
    audience_filters: [
      {
        id: '1',
        field: 'idade',
        operator: 'between',
        value: [4, 6],
        logic: 'AND',
      },
    ],
    audience_count: 450,
    channels: ['whatsapp', 'email'],
    channel_priority: ['whatsapp', 'email'],
    fallback_enabled: true,
    message_template_id: 1,
    message_content: {
      whatsapp: {
        text: 'Olá {{nome}}! 🎓\n\nAs matrículas para 2026 estão abertas! Garanta a vaga do(a) {{nome_filho}} em nossa turma integral.\n\nBenefícios:\n✅ Ensino de qualidade\n✅ Professores especializados\n✅ Estrutura completa\n\nClique no link para saber mais!',
        buttons: [
          {
            type: 'url',
            text: 'Saiba Mais',
            value: 'https://escola.com.br/matricula',
          },
        ],
      },
      email: {
        subject: '🎓 Matrículas Abertas 2026 - Vagas Limitadas!',
        body_html: '<h1>Olá {{nome}}!</h1><p>As matrículas para 2026 estão abertas...</p>',
        body_text: 'Olá {{nome}}! As matrículas para 2026 estão abertas...',
        from_name: 'Escola ABC',
      },
    },
    schedule_type: 'scheduled',
    scheduled_at: '2026-02-10T09:00:00Z',
    follow_ups: [
      {
        id: 'fu1',
        name: 'Follow-up não abriu',
        trigger: 'not_opened',
        delay_value: 3,
        delay_unit: 'days',
        message_content: {
          whatsapp: {
            text: 'Oi {{nome}}! Não quer perder essa oportunidade? 🎓',
          },
        },
        enabled: true,
      },
    ],
    status: 'scheduled',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 2,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Rematrícula 2026 - Alunos Atuais',
    type: 'rematricula',
    description: 'Renovação de matrícula para alunos já cadastrados',
    tags: ['2026', 'rematricula', 'alunos-atuais'],
    audience_filters: [
      {
        id: '2',
        field: 'status',
        operator: 'equals',
        value: 'ativo',
        logic: 'AND',
      },
    ],
    audience_count: 280,
    channels: ['whatsapp', 'email', 'sms'],
    channel_priority: ['whatsapp', 'email', 'sms'],
    fallback_enabled: true,
    message_content: {
      whatsapp: {
        text: 'Oi {{nome}}! 🔄\n\nA rematrícula para 2026 já está disponível!\n\nCondições especiais para renovação:\n✅ 10% de desconto\n✅ Sem taxa de matrícula\n✅ Prioridade na escolha de turma',
      },
      email: {
        subject: '🔄 Rematrícula 2026 - Condições Especiais!',
        body_html: '<h1>Renove já!</h1>',
        body_text: 'Renove já!',
      },
      sms: {
        text: 'Rematrícula 2026 aberta! 10% desconto. Renove já!',
      },
    },
    schedule_type: 'immediate',
    follow_ups: [],
    status: 'completed',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-20T15:30:00Z',
    sent_at: '2026-01-15T10:05:00Z',
    completed_at: '2026-01-15T12:00:00Z',
    analytics: {
      total_recipients: 280,
      messages_sent: 280,
      messages_delivered: 275,
      messages_failed: 5,
      messages_opened: 220,
      messages_clicked: 180,
      messages_responded: 120,
      conversions: 95,
      delivery_rate: 98.2,
      open_rate: 80.0,
      click_rate: 65.5,
      response_rate: 43.6,
      conversion_rate: 34.5,
      by_channel: {
        whatsapp: {
          sent: 180,
          delivered: 178,
          failed: 2,
          opened: 150,
          clicked: 120,
          responded: 80,
        },
        email: {
          sent: 80,
          delivered: 77,
          failed: 3,
          opened: 60,
          clicked: 50,
          responded: 30,
        },
        sms: {
          sent: 20,
          delivered: 20,
          failed: 0,
          opened: 10,
          clicked: 10,
          responded: 10,
        },
      },
      timeline: [
        {
          timestamp: '2026-01-15T10:00:00Z',
          sent: 280,
          delivered: 250,
          opened: 100,
          clicked: 50,
        },
        {
          timestamp: '2026-01-15T12:00:00Z',
          sent: 280,
          delivered: 275,
          opened: 200,
          clicked: 150,
        },
      ],
    },
  },
  {
    id: 3,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Festa Junina 2026',
    type: 'evento',
    description: 'Convite para festa junina da escola',
    tags: ['evento', 'festa-junina', '2026'],
    audience_filters: [],
    audience_count: 500,
    channels: ['whatsapp'],
    channel_priority: ['whatsapp'],
    fallback_enabled: false,
    message_content: {
      whatsapp: {
        text: 'Arraiá da Escola ABC! 🎊🌽\n\nData: 15/06/2026\nHorário: 18h\nLocal: Quadra da escola\n\nVenha com toda a família!',
      },
    },
    schedule_type: 'scheduled',
    scheduled_at: '2026-06-01T09:00:00Z',
    follow_ups: [],
    status: 'draft',
    created_at: '2026-02-02T14:00:00Z',
    updated_at: '2026-02-02T14:00:00Z',
  },
  {
    id: 4,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Cobrança Mensalidade Janeiro',
    type: 'cobranca',
    description: 'Lembrete de pagamento da mensalidade de janeiro',
    tags: ['cobranca', 'janeiro', '2026'],
    audience_filters: [
      {
        id: '3',
        field: 'mensalidade_em_atraso',
        operator: 'equals',
        value: true,
        logic: 'AND',
      },
    ],
    audience_count: 35,
    channels: ['whatsapp', 'email'],
    channel_priority: ['whatsapp', 'email'],
    fallback_enabled: true,
    message_content: {
      whatsapp: {
        text: 'Olá {{nome}}! 💰\n\nIdentificamos que a mensalidade de janeiro ainda não foi paga.\n\nValor: R$ {{valor}}\nVencimento: 10/01/2026\n\nPague agora e evite multas!',
      },
      email: {
        subject: 'Lembrete: Mensalidade Janeiro/2026',
        body_html: '<h1>Mensalidade Pendente</h1>',
        body_text: 'Mensalidade pendente...',
      },
    },
    schedule_type: 'immediate',
    follow_ups: [],
    status: 'sending',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:15:00Z',
    sent_at: '2026-01-20T10:15:00Z',
    analytics: {
      total_recipients: 35,
      messages_sent: 25,
      messages_delivered: 24,
      messages_failed: 1,
      messages_opened: 20,
      messages_clicked: 15,
      messages_responded: 10,
      conversions: 8,
      delivery_rate: 96.0,
      open_rate: 83.3,
      click_rate: 62.5,
      response_rate: 41.7,
      conversion_rate: 33.3,
      by_channel: {},
      timeline: [],
    },
  },
  {
    id: 5,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Reunião de Pais - 1º Trimestre',
    type: 'reuniao',
    description: 'Convite para reunião de pais e responsáveis',
    tags: ['reuniao', 'pais', '1-trimestre'],
    audience_filters: [],
    audience_count: 320,
    channels: ['whatsapp', 'email'],
    channel_priority: ['whatsapp', 'email'],
    fallback_enabled: true,
    message_content: {
      whatsapp: {
        text: 'Prezado(a) {{nome}}! 📅\n\nConvocamos para a Reunião de Pais do 1º Trimestre.\n\nData: 20/03/2026\nHorário: 19h\nLocal: Auditório\n\nSua presença é muito importante!',
      },
      email: {
        subject: '📅 Convite: Reunião de Pais - 1º Trimestre',
        body_html: '<h1>Reunião de Pais</h1>',
        body_text: 'Reunião de Pais...',
      },
    },
    schedule_type: 'scheduled',
    scheduled_at: '2026-03-10T09:00:00Z',
    follow_ups: [
      {
        id: 'fu2',
        name: 'Lembrete 1 dia antes',
        trigger: 'custom',
        delay_value: 1,
        delay_unit: 'days',
        message_content: {
          whatsapp: {
            text: 'Lembrete: Reunião de pais amanhã às 19h! Não falte!',
          },
        },
        enabled: true,
      },
    ],
    status: 'scheduled',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 6,
    school: 1,
    school_name: 'Escola ABC',
    name: 'Parabéns Aprovados ENEM 2025',
    type: 'passei_direto',
    description: 'Mensagem de congratulações para aprovados no ENEM',
    tags: ['enem', '2025', 'aprovados'],
    audience_filters: [
      {
        id: '4',
        field: 'aprovado_enem',
        operator: 'equals',
        value: true,
        logic: 'AND',
      },
    ],
    audience_count: 45,
    channels: ['whatsapp', 'email'],
    channel_priority: ['whatsapp', 'email'],
    fallback_enabled: false,
    message_content: {
      whatsapp: {
        text: 'PARABÉNS {{nome}}! 🎉🎓\n\nVocê foi aprovado(a) no ENEM 2025!\n\nEstamos muito orgulhosos da sua conquista!\n\nDesejamos muito sucesso nessa nova jornada! 🚀',
      },
      email: {
        subject: '🎉 PARABÉNS! Aprovação no ENEM 2025!',
        body_html: '<h1>Parabéns pela aprovação!</h1>',
        body_text: 'Parabéns!',
      },
    },
    schedule_type: 'completed',
    follow_ups: [],
    status: 'completed',
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T15:00:00Z',
    sent_at: '2026-01-25T10:30:00Z',
    completed_at: '2026-01-25T11:00:00Z',
    analytics: {
      total_recipients: 45,
      messages_sent: 45,
      messages_delivered: 45,
      messages_failed: 0,
      messages_opened: 44,
      messages_clicked: 35,
      messages_responded: 40,
      conversions: 40,
      delivery_rate: 100,
      open_rate: 97.8,
      click_rate: 79.5,
      response_rate: 90.9,
      conversion_rate: 90.9,
      by_channel: {},
      timeline: [],
    },
  },
];

export const MOCK_STATS: CampaignStats = {
  total: 6,
  draft: 1,
  scheduled: 2,
  sending: 1,
  completed: 2,
  paused: 0,
  cancelled: 0,
  failed: 0,
  
  avg_delivery_rate: 98.5,
  avg_open_rate: 85.0,
  avg_click_rate: 68.0,
  avg_conversion_rate: 52.0,
  
  sent_today: 1,
  sent_this_week: 3,
  sent_this_month: 4,
};

export const MOCK_TEMPLATES: MessageTemplate[] = [
  {
    id: 1,
    name: 'Template de Matrícula Padrão',
    category: 'matricula',
    description: 'Template padrão para campanhas de matrícula',
    content: {
      whatsapp: {
        text: 'Olá {{nome}}! 🎓 As matrículas estão abertas...',
      },
      email: {
        subject: 'Matrículas Abertas!',
        body_html: '<h1>Matrículas</h1>',
        body_text: 'Matrículas...',
      },
    },
    variables: ['nome', 'escola', 'ano', 'turma'],
    is_default: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];