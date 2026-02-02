// src/types/campaigns/message.types.ts
// 💬 TIPOS DE MENSAGENS E TEMPLATES

export interface MessageVariable {
  key: string;
  label: string;
  description?: string;
  example?: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'url';
  required?: boolean;
  default_value?: string;
}

export interface MessageValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  character_count: {
    whatsapp?: number;
    email_subject?: number;
    email_body?: number;
    sms?: number;
  };
  variable_usage: {
    total: number;
    found: number;
    missing: string[];
  };
  attachment_validation?: {
    total_size: number;
    max_size: number;
    valid: boolean;
    errors: string[];
  };
}

export interface MessagePreview {
  channel: 'whatsapp' | 'email' | 'sms';
  rendered_content: {
    subject?: string;
    body: string;
    buttons?: Array<{
      text: string;
      type: string;
    }>;
    attachments?: Array<{
      filename: string;
      type: string;
    }>;
  };
  sample_data: Record<string, string>;
  preview_url?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  template_count?: number;
}

export const DEFAULT_VARIABLES: MessageVariable[] = [
  {
    key: 'nome',
    label: 'Nome do Destinatário',
    description: 'Nome completo do destinatário',
    example: 'Maria Silva',
    type: 'text',
    required: false,
  },
  {
    key: 'primeiro_nome',
    label: 'Primeiro Nome',
    description: 'Primeiro nome do destinatário',
    example: 'Maria',
    type: 'text',
    required: false,
  },
  {
    key: 'email',
    label: 'Email',
    description: 'Endereço de email',
    example: 'maria@email.com',
    type: 'text',
    required: false,
  },
  {
    key: 'telefone',
    label: 'Telefone',
    description: 'Número de telefone',
    example: '(11) 99999-0000',
    type: 'text',
    required: false,
  },
  {
    key: 'escola_nome',
    label: 'Nome da Escola',
    description: 'Nome da instituição',
    example: 'Escola ABC',
    type: 'text',
    required: false,
  },
  {
    key: 'data_atual',
    label: 'Data Atual',
    description: 'Data de envio da mensagem',
    example: '02/02/2026',
    type: 'date',
    required: false,
  },
  {
    key: 'hora_atual',
    label: 'Hora Atual',
    description: 'Hora de envio da mensagem',
    example: '14:30',
    type: 'text',
    required: false,
  },
];