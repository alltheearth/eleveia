// src/utils/campaigns/campaignValidators.ts
// ✅ VALIDADORES DE CAMPANHA

import type { 
  CampaignFormData, 
  MessageContent,
  AudienceFilter,
  FollowUpRule,
  RecurringConfig 
} from '../../types/campaigns/campaign.types';

// ============================================
// VALIDATION RESULT
// ============================================

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code?: string;
}

// ============================================
// MAIN VALIDATORS
// ============================================

export const validateCampaignBasicInfo = (data: Partial<CampaignFormData>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Nome obrigatório
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Nome da campanha é obrigatório',
      code: 'REQUIRED_FIELD',
    });
  } else if (data.name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Nome deve ter no mínimo 3 caracteres',
      code: 'MIN_LENGTH',
    });
  } else if (data.name.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Nome deve ter no máximo 100 caracteres',
      code: 'MAX_LENGTH',
    });
  }

  // Tipo obrigatório
  if (!data.type) {
    errors.push({
      field: 'type',
      message: 'Tipo de campanha é obrigatório',
      code: 'REQUIRED_FIELD',
    });
  }

  // Descrição opcional mas limitada
  if (data.description && data.description.length > 500) {
    warnings.push({
      field: 'description',
      message: 'Descrição muito longa. Recomenda-se no máximo 500 caracteres.',
      code: 'LONG_DESCRIPTION',
    });
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateAudience = (
  filters: AudienceFilter[],
  manualContacts?: number[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const hasFilters = filters && filters.length > 0;
  const hasManualContacts = manualContacts && manualContacts.length > 0;

  // Deve ter ao menos uma forma de seleção
  if (!hasFilters && !hasManualContacts) {
    errors.push({
      field: 'audience',
      message: 'É necessário definir filtros de audiência ou selecionar contatos manualmente',
      code: 'NO_AUDIENCE',
    });
  }

  // Validar filtros
  if (hasFilters) {
    filters.forEach((filter, index) => {
      if (!filter.field) {
        errors.push({
          field: `filters[${index}].field`,
          message: 'Campo do filtro é obrigatório',
          code: 'REQUIRED_FIELD',
        });
      }

      if (!filter.operator) {
        errors.push({
          field: `filters[${index}].operator`,
          message: 'Operador do filtro é obrigatório',
          code: 'REQUIRED_FIELD',
        });
      }

      if (filter.value === null || filter.value === undefined || filter.value === '') {
        errors.push({
          field: `filters[${index}].value`,
          message: 'Valor do filtro é obrigatório',
          code: 'REQUIRED_FIELD',
        });
      }
    });

    // Warning se muitos filtros
    if (filters.length > 10) {
      warnings.push({
        field: 'filters',
        message: 'Muitos filtros podem tornar a segmentação muito restritiva',
        code: 'TOO_MANY_FILTERS',
      });
    }
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateChannels = (data: Partial<CampaignFormData>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Ao menos um canal
  if (!data.channels || data.channels.length === 0) {
    errors.push({
      field: 'channels',
      message: 'Selecione ao menos um canal de comunicação',
      code: 'NO_CHANNELS',
    });
  }

  // Prioridade deve incluir todos os canais selecionados
  if (data.channels && data.channel_priority) {
    const missingChannels = data.channels.filter(c => !data.channel_priority?.includes(c));
    if (missingChannels.length > 0) {
      errors.push({
        field: 'channel_priority',
        message: 'Todos os canais selecionados devem ter prioridade definida',
        code: 'INCOMPLETE_PRIORITY',
      });
    }
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateMessageContent = (
  content: MessageContent,
  channels: string[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  channels.forEach(channel => {
    switch (channel) {
      case 'whatsapp':
        if (!content.whatsapp?.text) {
          errors.push({
            field: 'message.whatsapp.text',
            message: 'Mensagem do WhatsApp é obrigatória',
            code: 'REQUIRED_FIELD',
          });
        } else {
          // WhatsApp tem limite de caracteres
          if (content.whatsapp.text.length > 4096) {
            errors.push({
              field: 'message.whatsapp.text',
              message: 'Mensagem do WhatsApp não pode ter mais de 4096 caracteres',
              code: 'MAX_LENGTH',
            });
          }

          // Warning se muito longa
          if (content.whatsapp.text.length > 1000) {
            warnings.push({
              field: 'message.whatsapp.text',
              message: 'Mensagens longas podem ter menor engajamento',
              code: 'LONG_MESSAGE',
            });
          }
        }
        break;

      case 'email':
        if (!content.email?.subject) {
          errors.push({
            field: 'message.email.subject',
            message: 'Assunto do email é obrigatório',
            code: 'REQUIRED_FIELD',
          });
        } else if (content.email.subject.length > 200) {
          errors.push({
            field: 'message.email.subject',
            message: 'Assunto não pode ter mais de 200 caracteres',
            code: 'MAX_LENGTH',
          });
        }

        if (!content.email?.body_html && !content.email?.body_text) {
          errors.push({
            field: 'message.email.body',
            message: 'Corpo do email é obrigatório',
            code: 'REQUIRED_FIELD',
          });
        }
        break;

      case 'sms':
        if (!content.sms?.text) {
          errors.push({
            field: 'message.sms.text',
            message: 'Mensagem do SMS é obrigatória',
            code: 'REQUIRED_FIELD',
          });
        } else if (content.sms.text.length > 160) {
          warnings.push({
            field: 'message.sms.text',
            message: 'SMS com mais de 160 caracteres será dividido em múltiplas mensagens',
            code: 'LONG_SMS',
          });
        }
        break;
    }
  });

  return {
    is_valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateSchedule = (data: Partial<CampaignFormData>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!data.schedule_type) {
    errors.push({
      field: 'schedule_type',
      message: 'Tipo de agendamento é obrigatório',
      code: 'REQUIRED_FIELD',
    });
    return { is_valid: false, errors, warnings };
  }

  // Scheduled
  if (data.schedule_type === 'scheduled') {
    if (!data.scheduled_at) {
      errors.push({
        field: 'scheduled_at',
        message: 'Data e hora de envio são obrigatórias',
        code: 'REQUIRED_FIELD',
      });
    } else {
      const scheduledDate = new Date(data.scheduled_at);
      const now = new Date();

      if (scheduledDate <= now) {
        errors.push({
          field: 'scheduled_at',
          message: 'Data de envio deve ser futura',
          code: 'PAST_DATE',
        });
      }

      // Warning se muito próximo
      const diffMinutes = (scheduledDate.getTime() - now.getTime()) / (1000 * 60);
      if (diffMinutes < 15) {
        warnings.push({
          field: 'scheduled_at',
          message: 'Envio agendado para menos de 15 minutos. Considere enviar imediatamente.',
          code: 'TOO_SOON',
        });
      }
    }
  }

  // Recurring
  if (data.schedule_type === 'recurring') {
    if (!data.recurring_config) {
      errors.push({
        field: 'recurring_config',
        message: 'Configuração de recorrência é obrigatória',
        code: 'REQUIRED_FIELD',
      });
    } else {
      const config = data.recurring_config;

      if (!config.frequency) {
        errors.push({
          field: 'recurring_config.frequency',
          message: 'Frequência de recorrência é obrigatória',
          code: 'REQUIRED_FIELD',
        });
      }

      if (!config.interval || config.interval < 1) {
        errors.push({
          field: 'recurring_config.interval',
          message: 'Intervalo deve ser maior que zero',
          code: 'INVALID_VALUE',
        });
      }

      if (config.end_type === 'after_occurrences') {
        if (!config.end_occurrences || config.end_occurrences < 1) {
          errors.push({
            field: 'recurring_config.end_occurrences',
            message: 'Número de ocorrências deve ser maior que zero',
            code: 'INVALID_VALUE',
          });
        }
      }

      if (config.end_type === 'on_date') {
        if (!config.end_date) {
          errors.push({
            field: 'recurring_config.end_date',
            message: 'Data de término é obrigatória',
            code: 'REQUIRED_FIELD',
          });
        }
      }
    }
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateFollowUps = (followUps: FollowUpRule[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  followUps.forEach((rule, index) => {
    if (!rule.name || rule.name.trim().length === 0) {
      errors.push({
        field: `follow_ups[${index}].name`,
        message: 'Nome do follow-up é obrigatório',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!rule.trigger) {
      errors.push({
        field: `follow_ups[${index}].trigger`,
        message: 'Gatilho do follow-up é obrigatório',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!rule.delay_value || rule.delay_value < 0) {
      errors.push({
        field: `follow_ups[${index}].delay_value`,
        message: 'Delay deve ser maior ou igual a zero',
        code: 'INVALID_VALUE',
      });
    }

    if (!rule.delay_unit) {
      errors.push({
        field: `follow_ups[${index}].delay_unit`,
        message: 'Unidade de delay é obrigatória',
        code: 'REQUIRED_FIELD',
      });
    }

    // Validar conteúdo da mensagem do follow-up
    const hasWhatsApp = !!rule.message_content.whatsapp?.text;
    const hasEmail = !!rule.message_content.email?.subject && !!rule.message_content.email?.body_html;
    const hasSMS = !!rule.message_content.sms?.text;

    if (!hasWhatsApp && !hasEmail && !hasSMS) {
      errors.push({
        field: `follow_ups[${index}].message_content`,
        message: 'Follow-up deve ter mensagem em ao menos um canal',
        code: 'NO_MESSAGE',
      });
    }
  });

  // Warning se muitos follow-ups
  if (followUps.length > 5) {
    warnings.push({
      field: 'follow_ups',
      message: 'Muitos follow-ups podem gerar spam. Recomenda-se no máximo 5.',
      code: 'TOO_MANY_FOLLOWUPS',
    });
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings,
  };
};

// ============================================
// COMPLETE CAMPAIGN VALIDATION
// ============================================

export const validateCompleteCampaign = (data: CampaignFormData): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  // Step 1: Basic Info
  const basicValidation = validateCampaignBasicInfo(data);
  allErrors.push(...basicValidation.errors);
  allWarnings.push(...basicValidation.warnings);

  // Step 2: Audience
  const audienceValidation = validateAudience(data.audience_filters, data.manual_contacts);
  allErrors.push(...audienceValidation.errors);
  allWarnings.push(...audienceValidation.warnings);

  // Step 3: Channels
  const channelsValidation = validateChannels(data);
  allErrors.push(...channelsValidation.errors);
  allWarnings.push(...channelsValidation.warnings);

  // Step 4: Message
  if (data.channels) {
    const messageValidation = validateMessageContent(data.message_content, data.channels);
    allErrors.push(...messageValidation.errors);
    allWarnings.push(...messageValidation.warnings);
  }

  // Step 5: Schedule
  const scheduleValidation = validateSchedule(data);
  allErrors.push(...scheduleValidation.errors);
  allWarnings.push(...scheduleValidation.warnings);

  // Step 6: Follow-ups
  if (data.follow_ups && data.follow_ups.length > 0) {
    const followUpsValidation = validateFollowUps(data.follow_ups);
    allErrors.push(...followUpsValidation.errors);
    allWarnings.push(...followUpsValidation.warnings);
  }

  return {
    is_valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

// ============================================
// HELPER VALIDATORS
// ============================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  // Verifica se tem 10 ou 11 dígitos (Brasil)
  return cleaned.length === 10 || cleaned.length === 11;
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};