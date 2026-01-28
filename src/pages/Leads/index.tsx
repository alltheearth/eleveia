// src/pages/Leads/index.tsx - ✅ CORRIGIDO

import { useState, useEffect } from 'react';
import { Plus, Users as UsersIcon, Download, TrendingUp } from 'lucide-react';

// Componentes de Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { 
  StatCard,
  FilterBar,
  MessageAlert,
  LoadingState,
  EmptyState,
  ConfirmDialog,
  FormModal,
  ViewToggle,
  type ViewMode,
} from '../../components/common';

// Componentes Locais
import LeadsKanbanView from './components/LeadsKanbanView';
import LeadsListView from './components/LeadsListView';

// Hooks e Services
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetLeadsQuery,
  useGetLeadStatsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useChangeLeadStatusMutation,
  useExportLeadsCSVMutation,
  extractErrorMessage,
  type Lead,
  type LeadFilters
} from '../../services';

// ============================================
// TYPES - ✅ CORRIGIDO
// ============================================

interface LeadFormData {
  nome: string;
  email: string;
  telefone: string;
  status: Lead['status'];
  origem: Lead['origem'];
  observacoes: string;
  interesses: Record<string, any>;
}

interface Message {
  type: 'success' | 'error';
  text: string; // ✅ CORRIGIDO: era 'texto'
}

// ============================================
// COMPONENT
// ============================================

export default function Leads() {
  // ============================================
  // HOOKS
  // ============================================
  
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ============================================
  // STATE
  // ============================================
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoLead, setEditandoLead] = useState<Lead | null>(null);
  const [leadParaDeletar, setLeadParaDeletar] = useState<Lead | null>(null);
  const [mensagem, setMensagem] = useState<Message | null>(null);

  const [formData, setFormData] = useState<LeadFormData>({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo',
    origem: 'site',
    observacoes: '',
    interesses: {},
  });

  // ============================================
  // RTK QUERY
  // ============================================
  
  const filters: LeadFilters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'todos' ? statusFilter : undefined,
  };

  const { 
    data: leadsData, 
    isLoading: leadsLoading, 
    error: fetchError,
    refetch 
  } = useGetLeadsQuery(filters);

  const { data: stats } = useGetLeadStatsQuery();

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [changeStatus] = useChangeLeadStatusMutation();
  const [exportCSV, { isLoading: isExporting }] = useExportLeadsCSVMutation();

  const leads = leadsData?.results || [];

  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // ============================================
  // HANDLERS
  // ============================================
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      status: 'novo',
      origem: 'site',
      observacoes: '',
      interesses: {},
    });
    setEditandoLead(null);
    setMostrarFormulario(false);
  };

  const validarFormulario = (): string | null => {
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (formData.nome.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido';
    if (!formData.telefone.trim()) return 'Telefone é obrigatório';
    return null;
  };

  const handleSubmit = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ type: 'error', text: erro }); // ✅ CORRIGIDO
      return;
    }

    try {
      if (editandoLead) {
        await updateLead({ 
          id: editandoLead.id, 
          data: {
            ...formData,
            escola: parseInt(currentSchoolId),
          }
        }).unwrap();
        setMensagem({ type: 'success', text: '✅ Lead atualizado com sucesso!' }); // ✅ CORRIGIDO
      } else {
        await createLead({
          ...formData,
          escola: parseInt(currentSchoolId),
        }).unwrap();
        setMensagem({ type: 'success', text: '✅ Lead criado com sucesso!' }); // ✅ CORRIGIDO
      }
      resetForm();
      refetch();
    } catch (err) {
      setMensagem({ type: 'error', text: `❌ ${extractErrorMessage(err)}` }); // ✅ CORRIGIDO
    }
  };

  const handleEditar = (lead: Lead) => {
    setFormData({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      status: lead.status,
      origem: lead.origem,
      observacoes: lead.observacoes || '',
      interesses: lead.interesses || {},
    });
    setEditandoLead(lead);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = async () => {
    if (!leadParaDeletar) return;

    try {
      await deleteLead(leadParaDeletar.id).unwrap();
      setMensagem({ type: 'success', text: '✅ Lead deletado com sucesso!' }); // ✅ CORRIGIDO
      setLeadParaDeletar(null);
      refetch();
    } catch (err) {
      setMensagem({ type: 'error', text: `❌ ${extractErrorMessage(err)}` }); // ✅ CORRIGIDO
    }
  };

  const handleMudarStatus = async (id: number, _fromStatus: string, toStatus: string) => {
    try {
      await changeStatus({ id, status: toStatus as Lead['status'] }).unwrap();
      setMensagem({ type: 'success', text: '✅ Status atualizado!' }); // ✅ CORRIGIDO
      refetch();
    } catch (err) {
      setMensagem({ type: 'error', text: `❌ ${extractErrorMessage(err)}` }); // ✅ CORRIGIDO
    }
  };

  const handleExportar = async () => {
    try {
      const blob = await exportCSV().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${currentSchool?.school_name || 'escola'}_${new Date().toISOString().split('T')[0]}.csv`; // ✅ CORRIGIDO: school_name
      a.click();
      window.URL.revokeObjectURL(url);
      setMensagem({ type: 'success', text: '✅ CSV exportado!' }); // ✅ CORRIGIDO
    } catch (err) {
      setMensagem({ type: 'error', text: '❌ Erro ao exportar CSV' }); // ✅ CORRIGIDO
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================
  // LOADING & ERROR STATES
  // ============================================
  
  if (leadsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Carregando leads..."
        icon={<UsersIcon size={48} className="text-blue-600" />}
      />
    );
  }

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<UsersIcon size={64} className="text-yellow-600" />}
        title="Nenhuma escola cadastrada"
        description="Entre em contato com o administrador."
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <PageModel>
      {/* Mensagens */}
      {mensagem && (
        <MessageAlert
          type={mensagem.type}
          message={mensagem.text}
          onClose={() => setMensagem(null)}
        />
      )}

      {/* Erro ao carregar */}
      {fetchError && (
        <MessageAlert
          type="error"
          message={`Erro: ${extractErrorMessage(fetchError)}`}
          dismissible={false}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Gerencie seu funil de leads</p>
        </div>
        
        <ViewToggle
          viewMode={viewMode}
          onToggle={toggleViewMode}
          gridLabel="Visão Kanban"
          listLabel="Visão em lista"
        />
      </div>

      {/* Estatísticas */}
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard 
            label="Total" 
            value={stats.total} 
            color="gray" 
            icon={<UsersIcon size={24} />} 
          />
          <StatCard 
            label="Novos" 
            value={stats.novo} 
            color="blue" 
            description="Aguardando contato" 
          />
          <StatCard 
            label="Em Contato" 
            value={stats.contato} 
            color="yellow" 
            description="Sendo trabalhados" 
          />
          <StatCard 
            label="Qualificados" 
            value={stats.qualificado} 
            color="purple" 
            description="Prontos para conversão" 
          />
          <StatCard 
            label="Conversão" 
            value={stats.conversao} 
            color="green" 
            description="Matriculados" 
          />
          <StatCard 
            label="Perdidos" 
            value={stats.perdido} 
            color="red" 
            description="Não convertidos" 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard 
            label="Total" 
            value={0} 
            color="gray" 
            icon={<UsersIcon size={24} />} 
          />
          <StatCard 
            label="Novos" 
            value={0}
            color="blue" 
            description="Aguardando contato" 
          />
          <StatCard 
            label="Em Contato" 
            value={0}
            color="yellow" 
            description="Sendo trabalhados" 
          />
          <StatCard 
            label="Qualificados" 
            value={0}
            color="purple" 
            description="Prontos para conversão" 
          />
          <StatCard 
            label="Conversão" 
            value={0}
            color="green" 
            description="Matriculados" 
          />
          <StatCard 
            label="Perdidos" 
            value={0} 
            color="red" 
            description="Não convertidos" 
          />
        </div>
      )}

      {/* Taxa de Conversão */}
      {stats && stats.taxa_conversao > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600 font-medium">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-green-600">{stats.taxa_conversao}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Novos Hoje</p>
              <p className="text-xl font-bold text-blue-600">{stats.novos_hoje}</p>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Rendering: Kanban OR List */}
      {viewMode === 'grid' ? (
        <LeadsKanbanView
          leads={leads}
          onLeadClick={handleEditar}
          onChangeStatus={handleMudarStatus}
        />
      ) : (
        <>
          <FilterBar
            fields={[
              {
                type: 'search',
                name: 'search',
                placeholder: 'Buscar por nome ou email...',
                value: searchTerm,
                onChange: setSearchTerm,
              },
              {
                type: 'select',
                name: 'status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: 'Todos os Status', value: 'todos' },
                  { label: 'Novo', value: 'novo' },
                  { label: 'Em Contato', value: 'contato' },
                  { label: 'Qualificado', value: 'qualificado' },
                  { label: 'Conversão', value: 'conversao' },
                  { label: 'Perdido', value: 'perdido' },
                ],
              },
            ]}
            actions={[
              {
                label: 'Exportar',
                onClick: handleExportar,
                icon: <Download size={18} />,
                variant: 'success',
                loading: isExporting,
              },
              {
                label: 'Novo Lead',
                onClick: () => setMostrarFormulario(true),
                icon: <Plus size={18} />,
                variant: 'primary',
              },
            ]}
            onClear={() => {
              setSearchTerm('');
              setStatusFilter('todos');
            }}
          />

          <LeadsListView
            leads={leads}
            onEdit={handleEditar}
            onDelete={setLeadParaDeletar}
            onChangeStatus={(id, status) => handleMudarStatus(id, '', status)}
            formatDate={formatarData}
          />

          {leads.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700 font-semibold">
                Mostrando <span className="text-blue-600 font-bold">{leads.length}</span> de{' '}
                <span className="text-blue-600 font-bold">{stats?.total || 0}</span> leads
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de Formulário */}
      <FormModal
        isOpen={mostrarFormulario}
        title={editandoLead ? '✏️ Editar Lead' : '➕ Novo Lead'}
        subtitle={editandoLead ? 'Atualize as informações do lead' : 'Preencha os dados do novo lead'}
        onClose={resetForm}
        size="lg"
      >
        <LeadForm
          formData={formData}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isCreating || isUpdating}
          isEditing={!!editandoLead}
        />
      </FormModal>

      {/* Modal de Confirmação de Deleção */}
      <ConfirmDialog
        isOpen={!!leadParaDeletar}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar o lead "${leadParaDeletar?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        onConfirm={handleDeletar}
        onCancel={() => setLeadParaDeletar(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </PageModel>
  );
}

// ============================================
// COMPONENTE DE FORMULÁRIO - ✅ CORRIGIDO
// ============================================

interface LeadFormProps {
  formData: LeadFormData;
  onChange: (field: keyof LeadFormData, value: any) => void; // ✅ CORRIGIDO
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

function LeadForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: LeadFormProps) {
  return (
    <div className="space-y-4">
      {/* Nome e Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nome *</label>
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => onChange('nome', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email *</label>
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Telefone e Origem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
          <input
            type="tel"
            placeholder="(11) 99999-0000"
            value={formData.telefone}
            onChange={(e) => onChange('telefone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Origem</label>
          <select
            value={formData.origem}
            onChange={(e) => onChange('origem', e.target.value as Lead['origem'])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="site">Site</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="indicacao">Indicação</option>
            <option value="ligacao">Ligação</option>
            <option value="email">Email</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => onChange('status', e.target.value as Lead['status'])}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="novo">🆕 Novo</option>
          <option value="contato">📞 Em Contato</option>
          <option value="qualificado">⭐ Qualificado</option>
          <option value="conversao">✅ Conversão</option>
          <option value="perdido">❌ Perdido</option>
        </select>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Observações</label>
        <textarea
          placeholder="Informações adicionais sobre o lead..."
          value={formData.observacoes}
          onChange={(e) => onChange('observacoes', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          <Plus size={20} />
          {isLoading 
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar' : 'Criar Lead')
          }
        </button>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}