// src/pages/Campaigns/components/CampaignWizard/Step7_Review.tsx
// ✅ STEP 7 - REVISÃO FINAL

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle,
  Users,
  MessageCircle,
  Calendar,
  Repeat,
  Eye,
  Mail,
  MessageSquare,
  Send,
  XCircle
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Step7Props {
  data: any; // Full campaign data
  onSubmit: () => void;
}

// ============================================
// COMPONENT
// ============================================

export default function Step7_Review({ data, onSubmit }: Step7Props) {
  
  // ============================================
  // VALIDATIONS
  // ============================================

  const validations = [
    {
      valid: data.name && data.name.length >= 3,
      message: 'Nome da campanha definido',
      error: 'Nome deve ter pelo menos 3 caracteres',
      field: 'Informações Básicas',
    },
    {
      valid: data.type !== undefined,
      message: `Tipo: ${data.type}`,
      error: 'Tipo de campanha não selecionado',
      field: 'Informações Básicas',
    },
    {
      valid: data.audience_filters.length > 0 || data.audience_count > 0,
      message: `${data.audience_count || 0} destinatários selecionados`,
      error: 'Nenhum público-alvo definido',
      field: 'Público-Alvo',
    },
    {
      valid: data.channels.length > 0,
      message: `${data.channels.length} canal(is) configurado(s)`,
      error: 'Nenhum canal selecionado',
      field: 'Canais',
    },
    {
      valid: (() => {
        if (data.channels.includes('whatsapp') && !data.message_content.whatsapp?.text) return false;
        if (data.channels.includes('email') && (!data.message_content.email?.subject || !data.message_content.email?.body_html)) return false;
        if (data.channels.includes('sms') && !data.message_content.sms?.text) return false;
        return true;
      })(),
      message: 'Mensagens configuradas para todos os canais',
      error: 'Mensagem faltando em algum canal selecionado',
      field: 'Mensagem',
    },
    {
      valid: data.schedule_type !== undefined,
      message: 'Agendamento configurado',
      error: 'Tipo de agendamento não definido',
      field: 'Agendamento',
    },
  ];

  const allValid = validations.every(v => v.valid);
  const errors = validations.filter(v => !v.valid);

  // ============================================
  // HELPERS
  // ============================================

  const getScheduleLabel = () => {
    if (data.schedule_type === 'immediate') return '🚀 Envio Imediato';
    if (data.schedule_type === 'scheduled') {
      const date = data.scheduled_at ? new Date(data.scheduled_at) : null;
      return date ? `📅 Agendado para ${date.toLocaleString('pt-BR')}` : '📅 Agendado';
    }
    if (data.schedule_type === 'recurring') {
      return `🔄 Recorrente (${data.recurring_config?.frequency})`;
    }
    return 'Não definido';
  };

  const getChannelIcon = (channel: string) => {
    if (channel === 'whatsapp') return <MessageCircle size={18} className="text-green-600" />;
    if (channel === 'email') return <Mail size={18} className="text-blue-600" />;
    if (channel === 'sms') return <MessageSquare size={18} className="text-purple-600" />;
    return null;
  };

  const getChannelLabel = (channel: string) => {
    if (channel === 'whatsapp') return 'WhatsApp';
    if (channel === 'email') return 'Email';
    if (channel === 'sms') return 'SMS';
    return channel;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ✅ Revisão Final
        </h3>
        <p className="text-gray-600">
          Confira todos os detalhes antes de criar a campanha
        </p>
      </div>

      {/* Status de Validação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 border-2 ${
          allValid 
            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300' 
            : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
        }`}
      >
        <div className="flex items-start gap-4">
          {allValid ? (
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <CheckCircle2 className="text-white" size={24} />
            </div>
          ) : (
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertTriangle className="text-white" size={24} />
            </div>
          )}
          <div className="flex-1">
            <h4 className={`text-xl font-bold mb-2 ${allValid ? 'text-green-900' : 'text-yellow-900'}`}>
              {allValid ? 'Campanha Pronta para Envio! 🎉' : 'Atenção: Pendências Encontradas'}
            </h4>
            <p className={`text-sm ${allValid ? 'text-green-700' : 'text-yellow-700'} mb-4`}>
              {allValid 
                ? 'Todos os campos obrigatórios foram preenchidos. Sua campanha está pronta para ser criada.'
                : 'Alguns campos precisam de atenção antes de prosseguir. Revise os itens abaixo.'
              }
            </p>

            {/* Lista de Validações */}
            <div className="space-y-2">
              {validations.map((validation, index) => (
                <div key={index} className="flex items-start gap-3">
                  {validation.valid ? (
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${validation.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {validation.valid ? validation.message : validation.error}
                    {!validation.valid && (
                      <span className="ml-2 text-xs opacity-75">({validation.field})</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resumo da Campanha */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Eye size={20} />
            Resumo da Campanha
          </h4>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Informações Básicas */}
          <div>
            <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              📝 Informações Básicas
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-bold text-gray-900">{data.name || '(não definido)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-bold text-gray-900 capitalize">{data.type || '(não definido)'}</span>
              </div>
              {data.description && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Descrição:</span>
                  <span className="text-gray-700 text-sm max-w-md text-right">{data.description}</span>
                </div>
              )}
              {data.tags && data.tags.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-md">
                    {data.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Público-Alvo */}
          <div>
            <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users size={16} />
              Público-Alvo
            </h5>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <Users size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{data.audience_count || 0}</p>
                  <p className="text-sm text-gray-600">destinatários selecionados</p>
                </div>
              </div>
              {data.audience_filters.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    {data.audience_filters.length} filtro(s) aplicado(s)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Canais */}
          <div>
            <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              📱 Canais de Envio
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.channels.map((channel: string, index: number) => (
                <div key={channel} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getChannelIcon(channel)}
                    <span className="font-semibold text-gray-900">{getChannelLabel(channel)}</span>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
            {data.fallback_enabled && (
              <p className="text-xs text-gray-500 mt-2 italic">
                ✅ Fallback automático ativado
              </p>
            )}
          </div>

          <div className="border-t border-gray-200" />

          {/* Agendamento */}
          <div>
            <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              📅 Agendamento
            </h5>
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
              <Calendar size={24} className="text-orange-600" />
              <div>
                <p className="font-bold text-gray-900">{getScheduleLabel()}</p>
                {data.schedule_type === 'recurring' && data.recurring_config && (
                  <p className="text-sm text-gray-600 mt-1">
                    Repetir a cada {data.recurring_config.interval}{' '}
                    {data.recurring_config.frequency === 'daily' ? 'dia(s)' :
                     data.recurring_config.frequency === 'weekly' ? 'semana(s)' : 'mês(es)'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Follow-ups */}
          {data.follow_ups && data.follow_ups.length > 0 && (
            <>
              <div className="border-t border-gray-200" />
              <div>
                <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  🔄 Follow-ups
                </h5>
                <div className="space-y-2">
                  {data.follow_ups.map((followUp: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{followUp.name}</p>
                        <p className="text-xs text-gray-600">
                          Aguardar {followUp.delay_value}{' '}
                          {followUp.delay_unit === 'minutes' ? 'min' :
                           followUp.delay_unit === 'hours' ? 'h' : 'dias'} • {followUp.trigger}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botão de Criação */}
      {allValid && (
        <motion.button
          onClick={onSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <Send size={24} />
          Criar Campanha Agora
        </motion.button>
      )}

      {/* Aviso se houver erros */}
      {!allValid && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Não é possível criar a campanha</h4>
              <p className="text-sm text-red-700 mb-3">
                Corrija os {errors.length} erro(s) encontrado(s) para continuar:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error.error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Próximos Passos</h4>
            <p className="text-sm text-blue-700">
              Após criar a campanha, você poderá monitorar métricas em tempo real, 
              pausar/retomar o envio, e visualizar relatórios detalhados de desempenho.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}