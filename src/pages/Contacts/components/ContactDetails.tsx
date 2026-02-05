// src/pages/Contacts/components/ContactDetails.tsx
// 📋 DETALHES COMPLETOS DO CONTATO - COM TABS

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Users,
  FileText,
  DollarSign,
  MessageSquare,
  ClipboardList,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import type { Contact, Student, Document, Interaction, Request } from '../index';

// ============================================
// TYPES
// ============================================

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

type TabType = 'personal' | 'children' | 'documents' | 'finance' | 'interactions' | 'requests';

// ============================================
// COMPONENT
// ============================================

export default function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  const tabs = [
    { id: 'personal' as TabType, label: 'Dados Pessoais', icon: User, count: null },
    { id: 'children' as TabType, label: 'Filhos', icon: Users, count: contact.filhos.length },
    { id: 'documents' as TabType, label: 'Documentos', icon: FileText, count: contact.documentos.length },
    { id: 'finance' as TabType, label: 'Financeiro', icon: DollarSign, count: contact.debitos_pendentes },
    { id: 'interactions' as TabType, label: 'Histórico', icon: MessageSquare, count: contact.interacoes.length },
    { id: 'requests' as TabType, label: 'Solicitações', icon: ClipboardList, count: contact.solicitacoes.length },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header com Info Rápida */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
              {contact.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{contact.nome}</h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold border border-white/30">
                  {contact.parentesco_display}
                </span>
                {contact.responsavel_financeiro && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold border border-white/30">
                    💰 Resp. Financeiro
                  </span>
                )}
                {contact.responsavel_pedagogico && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold border border-white/30">
                    📚 Resp. Pedagógico
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Documentação</p>
            <p className="text-lg font-bold">
              {contact.documentacao_completa ? '✅ Completa' : '⚠️ Pendente'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Financeiro</p>
            <p className="text-lg font-bold">
              {contact.mensalidades_em_dia ? '✅ Em Dia' : `🔴 ${contact.debitos_pendentes} Débitos`}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-white/70 text-xs mb-1">Filhos</p>
            <p className="text-lg font-bold">
              {contact.filhos.length} {contact.filhos.length === 1 ? 'filho' : 'filhos'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'personal' && <PersonalTab contact={contact} />}
        {activeTab === 'children' && <ChildrenTab filhos={contact.filhos} />}
        {activeTab === 'documents' && <DocumentsTab documentos={contact.documentos} />}
        {activeTab === 'finance' && <FinanceTab contact={contact} />}
        {activeTab === 'interactions' && <InteractionsTab interacoes={contact.interacoes} />}
        {activeTab === 'requests' && <RequestsTab solicitacoes={contact.solicitacoes} />}
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
        >
          Fechar
        </button>
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <Mail size={18} />
          Enviar Email
        </button>
        <button
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <Phone size={18} />
          WhatsApp
        </button>
      </div>
    </div>
  );
}

// ============================================
// TAB: DADOS PESSOAIS
// ============================================

function PersonalTab({ contact }: { contact: Contact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Informações Básicas
          </h3>
          <div className="space-y-3">
            <InfoItem label="CPF" value={contact.cpf} />
            <InfoItem label="Email" value={contact.email} icon={<Mail size={14} />} />
            <InfoItem label="Telefone" value={contact.telefone} icon={<Phone size={14} />} />
            {contact.telefone_secundario && (
              <InfoItem label="Tel. Secundário" value={contact.telefone_secundario} />
            )}
            <InfoItem label="WhatsApp" value={contact.whatsapp} />
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-purple-600" />
            Endereço
          </h3>
          <div className="space-y-3">
            <InfoItem label="CEP" value={contact.endereco.cep} />
            <InfoItem 
              label="Logradouro" 
              value={`${contact.endereco.logradouro}, ${contact.endereco.numero}`} 
            />
            {contact.endereco.complemento && (
              <InfoItem label="Complemento" value={contact.endereco.complemento} />
            )}
            <InfoItem label="Bairro" value={contact.endereco.bairro} />
            <InfoItem 
              label="Cidade/UF" 
              value={`${contact.endereco.cidade}/${contact.endereco.estado}`} 
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      {contact.observacoes && (
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📝 Observações</h3>
          <p className="text-gray-700 leading-relaxed">{contact.observacoes}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Cadastro: {new Date(contact.data_cadastro).toLocaleDateString('pt-BR')}</span>
        </div>
        {contact.ultima_interacao && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageSquare size={16} />
            <span>Última interação: {new Date(contact.ultima_interacao).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// TAB: FILHOS
// ============================================

function ChildrenTab({ filhos }: { filhos: Student[] }) {
  if (filhos.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <p className="text-gray-600">Nenhum filho cadastrado</p>
      </div>
    );
  }

  const getPeriodoColor = (periodo: Student['periodo']) => {
    const colors = {
      manha: 'bg-blue-100 text-blue-700',
      tarde: 'bg-orange-100 text-orange-700',
      integral: 'bg-purple-100 text-purple-700',
    };
    return colors[periodo];
  };

  const getStatusColor = (status: Student['status']) => {
    const colors = {
      ativo: 'bg-green-100 text-green-700',
      inativo: 'bg-gray-100 text-gray-700',
      transferido: 'bg-red-100 text-red-700',
    };
    return colors[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {filhos.map((filho) => (
        <div key={filho.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{filho.nome}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(filho.status)}`}>
                  {filho.status === 'ativo' ? '✅' : filho.status === 'transferido' ? '🔄' : '⛔'} 
                  {' '}
                  {filho.status.charAt(0).toUpperCase() + filho.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPeriodoColor(filho.periodo)}`}>
                  {filho.periodo === 'manha' ? '🌅' : filho.periodo === 'tarde' ? '🌤️' : '☀️'}
                  {' '}
                  {filho.periodo.charAt(0).toUpperCase() + filho.periodo.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Série" value={filho.serie} />
            <InfoItem label="Turma" value={filho.turma} />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ============================================
// TAB: DOCUMENTOS
// ============================================

function DocumentsTab({ documentos }: { documentos: Document[] }) {
  const getStatusConfig = (status: Document['status']) => {
    const configs = {
      pendente: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Pendente' },
      entregue: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Entregue' },
      aprovado: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Aprovado' },
      rejeitado: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejeitado' },
    };
    return configs[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {documentos.map((doc) => {
        const config = getStatusConfig(doc.status);
        const StatusIcon = config.icon;

        return (
          <div key={doc.id} className={`rounded-xl border-2 ${config.border} ${config.bg} p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <StatusIcon className={config.color} size={20} />
                  <h4 className="font-bold text-gray-900">{doc.nome}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">Tipo: {doc.tipo}</p>
                {doc.data_entrega && (
                  <p className="text-sm text-gray-600">
                    Entregue em: {new Date(doc.data_entrega).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {doc.observacoes && (
                  <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded-lg border border-gray-200">
                    💬 {doc.observacoes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${config.bg} ${config.color} border ${config.border}`}>
                  {config.label}
                </span>
                {doc.status === 'aprovado' && (
                  <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Baixar">
                    <Download size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

// ============================================
// TAB: FINANCEIRO
// ============================================

function FinanceTab({ contact }: { contact: Contact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Status Geral */}
      <div className={`rounded-xl p-6 border-2 ${
        contact.mensalidades_em_dia 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {contact.mensalidades_em_dia ? (
            <CheckCircle2 className="text-green-600" size={32} />
          ) : (
            <AlertCircle className="text-red-600" size={32} />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {contact.mensalidades_em_dia ? 'Mensalidades em Dia' : 'Pendências Financeiras'}
            </h3>
            {!contact.mensalidades_em_dia && (
              <p className="text-sm text-gray-700">
                {contact.debitos_pendentes} {contact.debitos_pendentes === 1 ? 'débito pendente' : 'débitos pendentes'}
              </p>
            )}
          </div>
        </div>

        {!contact.mensalidades_em_dia && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="px-4 py-3 bg-white border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-all">
              Ver Débitos
            </button>
            <button className="px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">
              Enviar Cobrança
            </button>
          </div>
        )}
      </div>

      {/* Placeholder para histórico financeiro */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Histórico Financeiro</h3>
        <p className="text-gray-600 text-center py-8">
          Histórico de pagamentos e débitos em desenvolvimento
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// TAB: HISTÓRICO DE INTERAÇÕES
// ============================================

function InteractionsTab({ interacoes }: { interacoes: Interaction[] }) {
  const getInteractionIcon = (tipo: Interaction['tipo']) => {
    const icons = {
      ligacao: { icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
      email: { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
      whatsapp: { icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
      presencial: { icon: User, color: 'text-orange-600', bg: 'bg-orange-50' },
      reuniao: { icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
    };
    return icons[tipo];
  };

  if (interacoes.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <p className="text-gray-600">Nenhuma interação registrada</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Timeline */}
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {interacoes.map((interacao, index) => {
          const config = getInteractionIcon(interacao.tipo);
          const InteractionIcon = config.icon;

          return (
            <div key={interacao.id} className="relative pl-16 pb-8">
              {/* Ícone */}
              <div className={`absolute left-0 w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center border-2 border-white shadow-md`}>
                <InteractionIcon className={config.color} size={20} />
              </div>

              {/* Conteúdo */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{interacao.assunto}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(interacao.data).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{interacao.descricao}</p>
                <p className="text-xs text-gray-600">
                  Por: <span className="font-semibold">{interacao.responsavel}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// TAB: SOLICITAÇÕES
// ============================================

function RequestsTab({ solicitacoes }: { solicitacoes: Request[] }) {
  const getStatusConfig = (status: Request['status']) => {
    const configs = {
      pendente: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Pendente', icon: '⏳' },
      em_andamento: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Em Andamento', icon: '🔄' },
      concluido: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Concluído', icon: '✅' },
      cancelado: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Cancelado', icon: '❌' },
    };
    return configs[status];
  };

  const getPrioridadeColor = (prioridade: Request['prioridade']) => {
    const colors = {
      baixa: 'bg-gray-100 text-gray-700',
      media: 'bg-yellow-100 text-yellow-700',
      alta: 'bg-red-100 text-red-700',
    };
    return colors[prioridade];
  };

  if (solicitacoes.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <p className="text-gray-600">Nenhuma solicitação registrada</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {solicitacoes.map((solicitacao) => {
        const statusConfig = getStatusConfig(solicitacao.status);

        return (
          <div key={solicitacao.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">{solicitacao.tipo}</h4>
                <p className="text-sm text-gray-700 mb-3">{solicitacao.descricao}</p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPrioridadeColor(solicitacao.prioridade)}`}>
                    Prioridade: {solicitacao.prioridade.charAt(0).toUpperCase() + solicitacao.prioridade.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Criado em:</span>{' '}
                {new Date(solicitacao.data_criacao).toLocaleDateString('pt-BR')}
              </div>
              {solicitacao.data_conclusao && (
                <div>
                  <span className="font-semibold">Concluído em:</span>{' '}
                  {new Date(solicitacao.data_conclusao).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        {icon}
        {value}
      </p>
    </div>
  );
}