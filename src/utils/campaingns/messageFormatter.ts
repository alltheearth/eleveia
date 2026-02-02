// src/utils/campaigns/messageFormatter.ts
// 💬 FORMATADORES DE MENSAGENS

import type { MessageContent, MessageVariable } from '../../types/campaigns/message.types';

// ============================================
// VARIABLE REPLACEMENT
// ============================================

/**
 * Substitui variáveis {{nome}} no texto com valores reais
 */
export const replaceVariables = (
  text: string,
  variables: Record<string, string>
): string => {
  let result = text;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    result = result.replace(regex, value || '');
  });
  
  return result;
};

/**
 * Extrai todas as variáveis {{var}} de um texto
 */
export const extractVariables = (text: string): string[] => {
  const regex = /{{\\s*([a-zA-Z0-9_]+)\\s*}}/g;
  const matches: string[] = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (!matches.includes(match[1])) {
      matches.push(match[1]);
    }
  }
  
  return matches;
};

/**
 * Valida se todas as variáveis no texto têm valores disponíveis
 */
export const validateVariables = (
  text: string,
  availableVariables: Record<string, string>
): {
  is_valid: boolean;
  missing_variables: string[];
  found_variables: string[];
} => {
  const foundVariables = extractVariables(text);
  const missingVariables = foundVariables.filter(
    v => !availableVariables.hasOwnProperty(v)
  );
  
  return {
    is_valid: missingVariables.length === 0,
    missing_variables: missingVariables,
    found_variables: foundVariables,
  };
};

// ============================================
// MESSAGE RENDERING
// ============================================

/**
 * Renderiza uma mensagem completa substituindo variáveis
 */
export const renderMessage = (
  content: MessageContent,
  channel: 'whatsapp' | 'email' | 'sms',
  variables: Record<string, string>
): {
  subject?: string;
  body: string;
  buttons?: Array<{ text: string; value: string }>;
} => {
  switch (channel) {
    case 'whatsapp':
      if (!content.whatsapp) return { body: '' };
      
      return {
        body: replaceVariables(content.whatsapp.text, variables),
        buttons: content.whatsapp.buttons?.map(btn => ({
          text: replaceVariables(btn.text, variables),
          value: replaceVariables(btn.value, variables),
        })),
      };
    
    case 'email':
      if (!content.email) return { body: '' };
      
      return {
        subject: replaceVariables(content.email.subject, variables),
        body: replaceVariables(content.email.body_html || content.email.body_text, variables),
      };
    
    case 'sms':
      if (!content.sms) return { body: '' };
      
      return {
        body: replaceVariables(content.sms.text, variables),
      };
    
    default:
      return { body: '' };
  }
};

// ============================================
// CHARACTER COUNTING
// ============================================

/**
 * Conta caracteres considerando emojis e caracteres especiais
 */
export const countCharacters = (text: string): {
  total: number;
  without_spaces: number;
  words: number;
  lines: number;
} => {
  // Normaliza quebras de linha
  const normalized = text.replace(/\r\n/g, '\n');
  
  return {
    total: Array.from(normalized).length, // Conta corretamente emojis
    without_spaces: normalized.replace(/\s/g, '').length,
    words: normalized.trim().split(/\s+/).filter(Boolean).length,
    lines: normalized.split('\n').length,
  };
};

/**
 * Verifica se mensagem excede limite de caracteres
 */
export const checkCharacterLimit = (
  text: string,
  channel: 'whatsapp' | 'email' | 'sms'
): {
  is_within_limit: boolean;
  current: number;
  limit: number;
  overflow: number;
} => {
  const limits = {
    whatsapp: 4096,
    email: 100000, // Praticamente sem limite
    sms: 160,
  };
  
  const current = countCharacters(text).total;
  const limit = limits[channel];
  
  return {
    is_within_limit: current <= limit,
    current,
    limit,
    overflow: Math.max(0, current - limit),
  };
};

/**
 * Calcula número de SMS que serão enviados
 */
export const calculateSMSCount = (text: string): {
  sms_count: number;
  characters: number;
  characters_per_sms: number;
} => {
  const chars = countCharacters(text).total;
  
  // SMS simples: 160 chars
  // SMS concatenado: 153 chars por SMS (7 chars para header)
  const charsPerSMS = chars <= 160 ? 160 : 153;
  const smsCount = chars <= 160 ? 1 : Math.ceil(chars / 153);
  
  return {
    sms_count: smsCount,
    characters: chars,
    characters_per_sms: charsPerSMS,
  };
};

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Formata texto para WhatsApp (bold, italic, etc)
 */
export const formatWhatsAppText = (text: string): {
  formatted: string;
  has_formatting: boolean;
} => {
  let formatted = text;
  let hasFormatting = false;
  
  // Detecta formatação markdown
  const patterns = [
    /\*\*(.+?)\*\*/g,  // **bold**
    /__(.+?)__/g,      // __italic__
    /~~(.+?)~~/g,      // ~~strikethrough~~
    /```(.+?)```/g,    // ```monospace```
  ];
  
  patterns.forEach(pattern => {
    if (pattern.test(text)) {
      hasFormatting = true;
    }
  });
  
  return {
    formatted,
    has_formatting: hasFormatting,
  };
};

/**
 * Remove formatação HTML de email
 */
export const stripHTML = (html: string): string => {
  // Remove tags HTML
  let text = html.replace(/<[^>]*>/g, '');
  
  // Decodifica entidades HTML
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  
  Object.entries(entities).forEach(([entity, char]) => {
    text = text.replace(new RegExp(entity, 'g'), char);
  });
  
  return text.trim();
};

/**
 * Converte texto simples em HTML para email
 */
export const textToHTML = (text: string): string => {
  // Escapa caracteres HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Converte quebras de linha em <br>
  html = html.replace(/\n/g, '<br>');
  
  // Detecta links e torna clicáveis
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  html = html.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  
  return html;
};

// ============================================
// PERSONALIZATION
// ============================================

/**
 * Gera saudação personalizada baseada no horário
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

/**
 * Formata nome para primeira letra maiúscula
 */
export const capitalizeFirstName = (fullName: string): string => {
  const firstName = fullName.trim().split(' ')[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};

/**
 * Gera variáveis padrão do sistema
 */
export const generateSystemVariables = (): Record<string, string> => {
  const now = new Date();
  
  return {
    data_atual: now.toLocaleDateString('pt-BR'),
    hora_atual: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    dia_semana: now.toLocaleDateString('pt-BR', { weekday: 'long' }),
    mes: now.toLocaleDateString('pt-BR', { month: 'long' }),
    ano: now.getFullYear().toString(),
    saudacao: getTimeBasedGreeting(),
  };
};

// ============================================
// LINK TRACKING
// ============================================

/**
 * Extrai todos os links de um texto
 */
export const extractLinks = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches ? [...new Set(matches)] : [];
};

/**
 * Encurta links para tracking
 */
export const generateTrackingLink = (
  originalUrl: string,
  campaignId: number,
  contactId: number
): string => {
  // Na prática, isso seria uma chamada ao backend
  // Por enquanto, retorna formato de exemplo
  const trackingParams = new URLSearchParams({
    c: campaignId.toString(),
    ct: contactId.toString(),
    url: originalUrl,
  });
  
  return `https://track.escola.app/link?${trackingParams.toString()}`;
};

/**
 * Substitui links no texto por versões trackable
 */
export const replaceLinksWithTracking = (
  text: string,
  campaignId: number,
  contactId: number
): string => {
  const links = extractLinks(text);
  let result = text;
  
  links.forEach(link => {
    const trackingLink = generateTrackingLink(link, campaignId, contactId);
    result = result.replace(link, trackingLink);
  });
  
  return result;
};

// ============================================
// PREVIEW GENERATION
// ============================================

/**
 * Gera preview de mensagem com dados de exemplo
 */
export const generatePreview = (
  content: MessageContent,
  channel: 'whatsapp' | 'email' | 'sms',
  sampleVariables?: Record<string, string>
): {
  subject?: string;
  body: string;
  character_count: number;
  estimated_sms_count?: number;
} => {
  // Variáveis de exemplo se não fornecidas
  const variables = sampleVariables || {
    nome: 'Maria Silva',
    primeiro_nome: 'Maria',
    email: 'maria@email.com',
    telefone: '(11) 99999-0000',
    escola_nome: 'Escola ABC',
    ...generateSystemVariables(),
  };
  
  const rendered = renderMessage(content, channel, variables);
  const charCount = countCharacters(rendered.body);
  
  const result: any = {
    subject: rendered.subject,
    body: rendered.body,
    character_count: charCount.total,
  };
  
  if (channel === 'sms') {
    const smsCalc = calculateSMSCount(rendered.body);
    result.estimated_sms_count = smsCalc.sms_count;
  }
  
  return result;
};