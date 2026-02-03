// src/pages/Leads/index.tsx
// 💼 PÁGINA DE LEADS - DESIGN PROFISSIONAL E COERENTE (FIXED)

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';

// Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { 
  ConfirmDialog,
  FormModal,
  LoadingState,
} from '../../components/common';

// Componentes Locais
import LeadStats from './components/LeadStats';
import LeadFilters, { type LeadViewMode } from './components/LeadFilters';
import LeadGridView from './components/LeadGridView';
import LeadListView from './components/LeadListView';
import LeadsKanbanView from './components/LeadsKanbanView';

// ✅ IMPORTAR TIPO DA API
import type { Lead } from '../../services';

interface LeadFormData {
  nome: string;
  email: string;
  telefone: string;
  status: Lead['status'];
  origem: Lead['origem'];
  observacoes: string;
}

// ============================================
// DADOS MOCADOS (COM TODOS OS CAMPOS DA API)
// ============================================

const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    telefone: '11999998888',
    status: 'novo',
    status_display: 'Novo',
    origem: 'site',
    origem_display: 'Site',
    observacoes: 'Interessada em turma de manhã para o filho de 5 anos',
    interesses: {},
    contatado_em: null,
    convertido_em: null,
    criado_em: '2026-01-31T10:00:00',
    atualizado_em: '2026-01-31T10:00:00',
  },
  {
    id: 2,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'João Pedro Oliveira',
    email: 'joao.pedro@email.com',
    telefone: '11988887777',
    status: 'contato',
    status_display: 'Em Contato',
    origem: 'whatsapp',
    origem_display: 'WhatsApp',
    observacoes: 'Quer conhecer a estrutura da escola',
    interesses: {},
    contatado_em: '2026-01-30T15:00:00',
    convertido_em: null,
    criado_em: '2026-01-30T14:30:00',
    atualizado_em: '2026-01-30T15:00:00',
  },
  {
    id: 3,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Ana Carolina Lima',
    email: 'ana.lima@email.com',
    telefone: '11977776666',
    status: 'qualificado',
    status_display: 'Qualificado',
    origem: 'indicacao',
    origem_display: 'Indicação',
    observacoes: 'Indicada pela mãe do Pedro. Muito interessada.',
    interesses: {},
    contatado_em: '2026-01-29T10:00:00',
    convertido_em: null,
    criado_em: '2026-01-29T09:15:00',
    atualizado_em: '2026-01-29T10:00:00',
  },
  {
    id: 4,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Carlos Eduardo Costa',
    email: 'carlos.costa@email.com',
    telefone: '11966665555',
    status: 'conversao',
    status_display: 'Convertido',
    origem: 'facebook',
    origem_display: 'Facebook',
    observacoes: 'Matrícula confirmada para turma integral',
    interesses: {},
    contatado_em: '2026-01-28T17:00:00',
    convertido_em: '2026-01-29T14:00:00',
    criado_em: '2026-01-28T16:45:00',
    atualizado_em: '2026-01-29T14:00:00',
  },
  {
    id: 5,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Juliana Fernandes',
    email: 'juliana.f@email.com',
    telefone: '11955554444',
    status: 'novo',
    status_display: 'Novo',
    origem: 'instagram',
    origem_display: 'Instagram',
    observacoes: 'Perguntou sobre valores e horários',
    interesses: {},
    contatado_em: null,
    convertido_em: null,
    criado_em: '2026-01-31T11:20:00',
    atualizado_em: '2026-01-31T11:20:00',
  },
  {
    id: 6,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    telefone: '11944443333',
    status: 'contato',
    status_display: 'Em Contato',
    origem: 'ligacao',
    origem_display: 'Ligação',
    observacoes: 'Agendada visita para próxima semana',
    interesses: {},
    contatado_em: '2026-01-30T11:00:00',
    convertido_em: null,
    criado_em: '2026-01-30T10:00:00',
    atualizado_em: '2026-01-30T11:00:00',
  },
  {
    id: 7,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Patrícia Souza',
    email: 'patricia.souza@email.com',
    telefone: '11933332222',
    status: 'qualificado',
    status_display: 'Qualificado',
    origem: 'site',
    origem_display: 'Site',
    observacoes: 'Preencheu formulário completo. Alta chance de conversão.',
    interesses: {},
    contatado_em: '2026-01-29T16:00:00',
    convertido_em: null,
    criado_em: '2026-01-29T15:30:00',
    atualizado_em: '2026-01-29T16:00:00',
  },
  {
    id: 8,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Fernando Rocha',
    email: 'fernando.rocha@email.com',
    telefone: '11922221111',
    status: 'conversao',
    status_display: 'Convertido',
    origem: 'whatsapp',
    origem_display: 'WhatsApp',
    observacoes: 'Matrícula efetivada. Pagamento confirmado.',
    interesses: {},
    contatado_em: '2026-01-27T14:30:00',
    convertido_em: '2026-01-28T10:00:00',
    criado_em: '2026-01-27T14:00:00',
    atualizado_em: '2026-01-28T10:00:00',
  },
  {
    id: 9,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Amanda Torres',
    email: 'amanda.torres@email.com',
    telefone: '11911110000',
    status: 'perdido',
    status_display: 'Perdido',
    origem: 'email',
    origem_display: 'Email',
    observacoes: 'Optou por outra escola devido à localização',
    interesses: {},
    contatado_em: '2026-01-26T10:00:00',
    convertido_em: null,
    criado_em: '2026-01-26T09:00:00',
    atualizado_em: '2026-01-26T12:00:00',
  },
  {
    id: 10,
    escola: 1,
    escola_nome: 'Escola ABC',
    nome: 'Ricardo Mendes',
    email: 'ricardo.mendes@email.com',
    telefone: '11900009999',
    status: 'novo',
    status_display: 'Novo',
    origem: 'facebook',
    origem_display: 'Facebook',
    observacoes: 'Respondeu anúncio sobre período integral',
    interesses: {},
    contatado_em: null,
    convertido_em: null,
    criado_em: '2026-01-31T08:00:00',
    atualizado_em: '2026-01-31T08:00:00',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function LeadsPage() {
  
  // ============================================
  // STATE
  // ============================================
  
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isLoading, setIsLoading] = useState(false);
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
  });

  // ============================================
  // COMPUTED
  // ============================================
  
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchTerm === '' ||
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.telefone.includes(searchTerm);

      const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
      const matchesOrigem = origemFilter === 'todas' || lead.origem === origemFilter;

      return matchesSearch && matchesStatus && matchesOrigem;
    });
  }, [leads, searchTerm, statusFilter, origemFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      novo: leads.filter(l => l.status === 'novo').length,
      contato: leads.filter(l => l.status === 'contato').length,
      qualificado: leads.filter(l => l.status === 'qualificado').length,
      conversao: leads.filter(l => l.status === 'conversao').length,
      perdido: leads.filter(l => l.status === 'perdido').length,
      taxa_conversao: leads.length > 0 
        ? Number(((leads.filter(l => l.status === 'conversao').length / leads.length) * 100).toFixed(1))
        : 0,
      novos_hoje: leads.filter(l => {
        const hoje = new Date().toISOString().split('T')[0];
        const leadDate = l.criado_em.split('T')[0];
        return leadDate === hoje;
      }).length,
    };
  }, [leads]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'todos' || origemFilter !== 'todas';

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

  const handleSubmit = (): void => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const now = new Date().toISOString();

    if (editingLead) {
      setLeads(prev => prev.map(l => 
        l.id === editingLead.id 
          ? { 
              ...l, 
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
              status: formData.status,
              status_display: getStatusDisplay(formData.status),
              origem: formData.origem,
              origem_display: getOrigemDisplay(formData.origem),
              observacoes: formData.observacoes,
              atualizado_em: now,
            } 
          : l
      ));
      toast.success('✅ Lead atualizado com sucesso!');
    } else {
      const newLead: Lead = {
        id: Math.max(...leads.map(l => l.id)) + 1,
        escola: 1,
        escola_nome: 'Escola ABC',
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        status: formData.status,
        status_display: getStatusDisplay(formData.status),
        origem: formData.origem,
        origem_display: getOrigemDisplay(formData.origem),
        observacoes: formData.observacoes,
        interesses: {},
        contatado_em: null,
        convertido_em: null,
        criado_em: now,
        atualizado_em: now,
      };
      setLeads(prev => [newLead, ...prev]);
      toast.success('✅ Lead criado com sucesso!');
    }
    resetForm();
  };

  const handleEdit = (lead: Lead): void => {
    setFormData({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      status: lead.status,
      origem: lead.origem,
      observacoes: lead.observacoes || '',
    });
    setEditingLead(lead);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (): void => {
    if (!leadToDelete) return;
    setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
    toast.success('✅ Lead deletado com sucesso!');
    setLeadToDelete(null);
  };

  const handleStatusChange = (lead: Lead, newStatus: Lead['status']): void => {
    const now = new Date().toISOString();
    setLeads(prev => prev.map(l => 
      l.id === lead.id ? { 
        ...l, 
        status: newStatus,
        status_display: getStatusDisplay(newStatus),
        atualizado_em: now,
        contatado_em: newStatus === 'contato' && !l.contatado_em ? now : l.contatado_em,
        convertido_em: newStatus === 'conversao' ? now : l.convertido_em,
      } : l
    ));
    toast.success('✅ Status atualizado!');
  };

  const handleStatusChangeKanban = (id: number, _fromStatus: string, toStatus: string): void => {
    const now = new Date().toISOString();
    setLeads(prev => prev.map(l => 
      l.id === id ? { 
        ...l, 
        status: toStatus as Lead['status'],
        status_display: getStatusDisplay(toStatus as Lead['status']),
        atualizado_em: now,
        contatado_em: toStatus === 'contato' && !l.contatado_em ? now : l.contatado_em,
        convertido_em: toStatus === 'conversao' ? now : l.convertido_em,
      } : l
    ));
    toast.success('✅ Lead movido com sucesso!');
  };

  const handleExport = (): void => {
    const csv = convertToCSV(filteredLeads);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('✅ CSV exportado com sucesso!');
  };

  const handleRefresh = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('🔄 Dados atualizados!');
    }, 1000);
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('todos');
    setOrigemFilter('todas');
  };

  // ============================================
  // HELPERS
  // ============================================

  const getOrigemDisplay = (origem: Lead['origem']): string => {
    const map: Record<Lead['origem'], string> = {
      site: 'Site',
      whatsapp: 'WhatsApp',
      indicacao: 'Indicação',
      ligacao: 'Ligação',
      email: 'Email',
      facebook: 'Facebook',
      instagram: 'Instagram',
    };
    return map[origem];
  };

  const getStatusDisplay = (status: Lead['status']): string => {
    const map: Record<Lead['status'], string> = {
      novo: 'Novo',
      contato: 'Em Contato',
      qualificado: 'Qualificado',
      conversao: 'Convertido',
      perdido: 'Perdido',
    };
    return map[status];
  };

  const convertToCSV = (data: Lead[]): string => {
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Status', 'Origem', 'Criado Em'];
    const rows = data.map(l => [
      l.id,
      l.nome,
      l.email,
      l.telefone,
      l.status_display,
      l.origem_display,
      new Date(l.criado_em).toLocaleDateString('pt-BR'),
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (isLoading && leads.length === 0) {
    return (
      <LoadingState 
        message="Carregando leads..."
        icon={<Users size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <PageModel>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestão de Leads
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Users size={16} />
              Gerencie seu funil de captação e conversão de alunos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <LeadStats stats={stats} loading={false} />

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
        isExporting={false}
        isRefreshing={isLoading}
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
              leads={filteredLeads}
              onEdit={handleEdit}
              onDelete={setLeadToDelete}
              onStatusChange={handleStatusChange}
              loading={false}
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
              leads={filteredLeads}
              onEdit={handleEdit}
              onDelete={setLeadToDelete}
              onStatusChange={handleStatusChange}
              loading={false}
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
              leads={filteredLeads}
              onLeadClick={handleEdit}
              onChangeStatus={handleStatusChangeKanban}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      {filteredLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{filteredLeads.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats.total}</span> leads
            {hasActiveFilters && (
              <span className="text-gray-600 text-sm ml-2">(filtrado)</span>
            )}
          </p>
        </motion.div>
      )}

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
            isLoading={false}
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
          isLoading={false}
          variant="danger"
        />
      )}
    </PageModel>
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
            onChange={(e) => onChange('origem', e.target.value)}
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
          onChange={(e) => onChange('status', e.target.value)}
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