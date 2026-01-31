// src/pages/Leads/index.tsx
// 💼 PÁGINA DE LEADS - VERSÃO PROFISSIONAL E MODERNA

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes Locais
import LeadStats from './components/LeadStats';
import LeadFilters from './components/LeadFilters';
import { type LeadViewMode } from './components/LeadFilters';
import LeadGridView from './components/LeadGridView';
import LeadListView from './components/LeadListView';
import LeadsKanbanView from './components/LeadsKanbanView';

// Componentes Comuns
import { 
  ConfirmDialog,
  FormModal,
  LoadingState,
} from '../../components/common';

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
} from '../../services';

// ============================================
// TYPES
// ============================================

interface LeadFilters {
  search?: string;
  status?: string;
  origem?: string;
}

interface LeadFormData {
  nome: string;
  email: string;
  telefone: string;
  status: Lead['status'];
  origem: Lead['origem'];
  observacoes: string;
  interesses: Record<string, any>;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function LeadsPage() {
  
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
  
  const [viewMode, setViewMode] = useState<LeadViewMode>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [origemFilter, setOrigemFilter] = useState('todas');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

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
  // API
  // ============================================
  
  const filters: LeadFilters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'todos' ? statusFilter : undefined,
    origem: origemFilter !== 'todas' ? origemFilter : undefined,
  };

  const { 
    data: leadsData, 
    isLoading: leadsLoading, 
    error: fetchError,
    refetch,
    isFetching,
  } = useGetLeadsQuery(filters);

  const { data: stats } = useGetLeadStatsQuery();

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [changeStatus] = useChangeLeadStatusMutation();
  const [exportCSV, { isLoading: isExporting }] = useExportLeadsCSVMutation();

  const leads = leadsData?.results || [];

  // ============================================
  // COMPUTED
  // ============================================
  
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || 
           statusFilter !== 'todos' || 
           origemFilter !== 'todas';
  }, [searchTerm, statusFilter, origemFilter]);

  // ============================================
  // HANDLERS
  // ============================================
  
  const resetForm = (): void => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      status: 'novo',
      origem: 'site',
      observacoes: '',
      interesses: {},
    });
    setEditingLead(null);
    setShowForm(false);
  };

  const validate = (): string | null => {
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (formData.nome.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido';
    if (!formData.telefone.trim()) return 'Telefone é obrigatório';
    return null;
  };

  const handleSubmit = async (): Promise<void> => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (editingLead) {
        await updateLead({ 
          id: editingLead.id, 
          data: {
            ...formData,
            escola: parseInt(currentSchoolId),
          }
        }).unwrap();
        toast.success('✅ Lead atualizado com sucesso!');
      } else {
        await createLead({
          ...formData,
          escola: parseInt(currentSchoolId),
        }).unwrap();
        toast.success('✅ Lead criado com sucesso!');
      }
      resetForm();
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleEdit = (lead: Lead): void => {
    setFormData({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      status: lead.status,
      origem: lead.origem,
      observacoes: lead.observacoes || '',
      interesses: lead.interesses || {},
    });
    setEditingLead(lead);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (): Promise<void> => {
    if (!leadToDelete) return;

    try {
      await deleteLead(leadToDelete.id).unwrap();
      toast.success('✅ Lead deletado com sucesso!');
      setLeadToDelete(null);
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleStatusChange = async (lead: Lead, newStatus: Lead['status']): Promise<void> => {
    try {
      await changeStatus({ id: lead.id, status: newStatus }).unwrap();
      toast.success('✅ Status atualizado!');
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleStatusChangeKanban = async (id: number, _fromStatus: string, toStatus: string): Promise<void> => {
    try {
      await changeStatus({ id, status: toStatus as Lead['status'] }).unwrap();
      toast.success('✅ Lead movido com sucesso!');
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleExport = async (): Promise<void> => {
    try {
      const blob = await exportCSV().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${currentSchool?.school_name || 'escola'}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('✅ CSV exportado com sucesso!');
    } catch (err) {
      toast.error('❌ Erro ao exportar CSV');
    }
  };

  const handleRefresh = (): void => {
    refetch();
    toast.success('🔄 Dados atualizados!');
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('todos');
    setOrigemFilter('todas');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (leadsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Carregando leads..."
        icon={<Users size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // NO SCHOOL STATE
  // ============================================
  
  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <Users className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Nenhuma escola cadastrada
          </h2>
          <p className="text-gray-600">
            Entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-blue-600" size={40} />
              Leads
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie seu funil de captação e conversão de alunos
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={`text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="text-sm font-semibold text-gray-700">
              {isFetching ? 'Atualizando...' : 'Atualizar'}
            </span>
          </button>
        </motion.div>

        {/* Error Alert */}
        {fetchError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
          >
            <p className="text-red-700 font-semibold">
              ❌ Erro: {extractErrorMessage(fetchError)}
            </p>
          </motion.div>
        )}

        {/* Stats */}
        {stats && (
          <LeadStats stats={stats} loading={leadsLoading} />
        )}

        {/* Filters */}
        <LeadFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          origemFilter={origemFilter}
          onOrigemFilterChange={setOrigemFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewLead={() => setShowForm(true)}
          onExport={handleExport}
          onRefresh={handleRefresh}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          isExporting={isExporting}
          isRefreshing={isFetching}
        />

        {/* Views */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LeadGridView
                leads={leads}
                onEdit={handleEdit}
                onDelete={setLeadToDelete}
                onStatusChange={handleStatusChange}
                loading={leadsLoading}
              />
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LeadListView
                leads={leads}
                onEdit={handleEdit}
                onDelete={setLeadToDelete}
                onStatusChange={handleStatusChange}
                loading={leadsLoading}
              />
            </motion.div>
          )}

          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LeadsKanbanView
                leads={leads}
                onLeadClick={handleEdit}
                onChangeStatus={handleStatusChangeKanban}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        {leads.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 p-4 rounded-lg border border-blue-200"
          >
            <p className="text-gray-700 font-semibold">
              Mostrando <span className="text-blue-600 font-bold">{leads.length}</span> de{' '}
              <span className="text-blue-600 font-bold">{stats?.total || 0}</span> leads
              {hasActiveFilters && (
                <span className="text-gray-600 text-sm ml-2">(filtrado)</span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          isOpen={showForm}
          title={editingLead ? '✏️ Editar Lead' : '➕ Novo Lead'}
          subtitle={editingLead ? 'Atualize as informações do lead' : 'Preencha os dados do novo lead'}
          onClose={resetForm}
          size="lg"
        >
          <LeadForm
            formData={formData}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isLoading={isCreating || isUpdating}
            isEditing={!!editingLead}
          />
        </FormModal>
      )}

      {/* Delete Confirmation */}
      {leadToDelete && (
        <ConfirmDialog
          isOpen={!!leadToDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar o lead "${leadToDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Deletar"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setLeadToDelete(null)}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </div>
  );
}

// ============================================
// LEAD FORM COMPONENT
// ============================================

interface LeadFormProps {
  formData: LeadFormData;
  onChange: (field: keyof LeadFormData, value: any) => void;
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
    <div className="space-y-6">
      
      {/* Nome e Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            placeholder="Ex: Maria Silva Santos"
            value={formData.nome}
            onChange={(e) => onChange('nome', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            placeholder="Ex: maria.silva@email.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      {/* Telefone e Origem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            placeholder="Ex: (11) 99999-0000"
            value={formData.telefone}
            onChange={(e) => onChange('telefone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Origem do Lead
          </label>
          <select
            value={formData.origem}
            onChange={(e) => onChange('origem', e.target.value as Lead['origem'])}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="site">🌐 Site</option>
            <option value="whatsapp">💬 WhatsApp</option>
            <option value="indicacao">👥 Indicação</option>
            <option value="ligacao">📞 Ligação</option>
            <option value="email">📧 Email</option>
            <option value="facebook">📘 Facebook</option>
            <option value="instagram">📷 Instagram</option>
          </select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Status Inicial
        </label>
        <select
          value={formData.status}
          onChange={(e) => onChange('status', e.target.value as Lead['status'])}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Observações
        </label>
        <textarea
          placeholder="Adicione informações relevantes sobre o lead, interesses, preferências de horário, etc."
          value={formData.observacoes}
          onChange={(e) => onChange('observacoes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
        >
          {isLoading 
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar Lead' : 'Criar Lead')
          }
        </button>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}