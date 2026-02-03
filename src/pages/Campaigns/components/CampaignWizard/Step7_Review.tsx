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
  Eye
} from 'lucide-react';

interface Step7Props {
  data: any; // Full campaign data
  onSubmit: () => void;
}

export default function Step7_Review({ data }: Step7Props) {
  
  // Validações finais
  const validations = [
    {
      valid: data.name && data.name.length >= 3,
      message: 'Nome da campanha definido',
      error: 'Nome muito curto',
    },
    {
      valid: data.audience_count > 0,
      message: `${data.audience_count} destinatários selecionados`,
      error: 'Nenhum destinatário selecionado',
    },
    {
      valid: data.channels.length > 0,
      message: `${data.channels.length} canal(is) configurado(s)`,
      error: 'Nenhum canal selecionado',
    },
    {
      valid: (() => {
        if (data.channels.includes('whatsapp') && !data.message_content.whatsapp?.text) return false;
        if (data.channels.includes('email') && (!data.message_content.email?.subject || !data.message_content.email?.body_html)) return false;
        if (data.channels.includes('sms') && !data.message_content.sms?.text) return false;
        return true;
      })(),
      message: 'Mensagens configuradas para todos os canais',
      error: 'Mensagem faltando em algum canal',
    },
  ];

  const allValid = validations.every(v => v.valid);

  const getScheduleLabel = () => {
    if (data.schedule_type === 'immediate') return 'Envio Imediato';
    if (data.schedule_type === 'scheduled') {
      const date = new Date(data.scheduled_at);
      return `Agendado para ${date.toLocaleString('pt-BR')}`;
    }
    if (data.schedule_type === 'recurring') {
      return `Recorrente (${data.recurring_config?.frequency})`;
    }
    return 'Não definido';
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ✅ Revisão Final
        </h3>
        <p className="text-gray-600">
          Confira todos os detalhes antes de criar a campanha
        </p>
      </div>

      {/* Status de Validação */}
      <div className={`rounded-xl p-6 ${allValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-start gap-4">
          {allValid ? (
            <CheckCircle2 className="text-green-600 flex-shrink-0" size={32} />
          ) : (
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={32} />
          )}
          <div className="flex-1">
            <h4 className={`text-lg font-bold mb-2 ${allValid ? 'text-green-900' : 'text-yellow-900'}`}>
              {allValid ? 'Campanha Pronta!' : 'Atenção Necessária'}
            </h4>
            <div className="space-y-2">
              {validations.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  {v.valid ? (
                    <>
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-sm text-green-700">{v.message}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-yellow-600" />
                      <span className="text-sm text-yellow-700">{v.error}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo da Campanha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card - Informações Básicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📝 Informações Básicas
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Nome</p>
              <p className="text-gray-900 font-semibold">{data.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Tipo</p>
              <p className="text-gray-900 font-semibold capitalize">{data.type}</p>
            </div>
            {data.description && (
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Descrição</p>
                <p className="text-gray-900 text-sm">{data.description}</p>
              </div>
            )}
            {data.tags.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card - Público-Alvo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} />
            Público-Alvo
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700 font-semibold">Total de Destinatários</span>
              <span className="text-2xl font-bold text-blue-900">{data.audience_count}</span>
            </div>
            {data.audience_filters.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Filtros Aplicados</p>
                <div className="space-y-1">
                  {data.audience_filters.map((filter: any, i: number) => (
                    <p key={i} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      {filter.field} {filter.operator} {filter.value}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card - Canais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle size={20} />
            Canais e Mensagens
          </h4>
          <div className="space-y-3">
            {data.channels.map((channel: string) => (
              <div key={channel} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-gray-900 capitalize mb-1">{channel}</p>
                {channel === 'whatsapp' && data.message_content.whatsapp?.text && (
                  <p className="text-xs text-gray-600 line-clamp-2">{data.message_content.whatsapp.text}</p>
                )}
                {channel === 'email' && data.message_content.email?.subject && (
                  <p className="text-xs text-gray-600">Assunto: {data.message_content.email.subject}</p>
                )}
                {channel === 'sms' && data.message_content.sms?.text && (
                  <p className="text-xs text-gray-600 line-clamp-2">{data.message_content.sms.text}</p>
                )}
              </div>
            ))}
            {data.fallback_enabled && (
              <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg font-semibold">
                ✅ Fallback ativado
              </p>
            )}
          </div>
        </motion.div>

        {/* Card - Agendamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Agendamento
          </h4>
          <div className="space-y-3">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 font-semibold mb-1">
                {getScheduleLabel()}
              </p>
              {data.schedule_type === 'recurring' && data.recurring_config && (
                <div className="text-xs text-purple-600 space-y-1 mt-2">
                  <p>• Frequência: {data.recurring_config.frequency}</p>
                  <p>• Intervalo: A cada {data.recurring_config.interval} {data.recurring_config.frequency === 'daily' ? 'dias' : data.recurring_config.frequency === 'weekly' ? 'semanas' : 'meses'}</p>
                  <p>• Término: {data.recurring_config.end_type === 'never' ? 'Nunca' : data.recurring_config.end_type === 'after_occurrences' ? `Após ${data.recurring_config.end_occurrences} envios` : `Em ${data.recurring_config.end_date}`}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Follow-ups */}
      {data.follow_ups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Repeat size={20} />
            Follow-ups Configurados ({data.follow_ups.length})
          </h4>
          <div className="space-y-2">
            {data.follow_ups.map((followUp: any) => (
              <div key={followUp.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">{followUp.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${followUp.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {followUp.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Gatilho: {followUp.trigger} • Aguardar {followUp.delay_value} {followUp.delay_unit}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Aviso Final */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Eye className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">
              Revise Cuidadosamente
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Após criar a campanha, você poderá {data.schedule_type === 'immediate' ? 'pausá-la a qualquer momento' : 'editá-la antes do envio'}. 
              Certifique-se de que todas as informações estão corretas.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}