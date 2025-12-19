// src/pages/Tickets/index.tsx - ✅ COMPLETO E FUNCIONAL
import { useState, useEffect } from 'react';
import { Search, Plus, Download, X, Edit2, Trash2, Ticket as TicketIcon, AlertCircle, User as UserIcon } from 'lucide-react';
import StatCard from '../../components/Statistics/StatCard';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useChangeTicketStatusMutation,
  useGetTicketStatsQuery,
  useExportTicketsCSVMutation,
  extractErrorMessage,
  type Ticket,
  type TicketFilters
} from '../../services';
import PageModel from '../../components/layout/PageModel';
import Statistics from '../../components/Statistics';
import ResultsInformation from '../../components/ResultsInformation';
import DeletionConfirmation from '../../components/modals/DeletionConfirmation';

export default function Tickets() {
  // ✅ Hook para escola atual
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('todas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoTicket, setEditandoTicket] = useState<Ticket | null>(null);
  const [ticketParaDeletar, setTicketParaDeletar] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // ✅ Preparar filtros para API
  const filters: TicketFilters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'todos' ? statusFilter : undefined,
    priority: prioridadeFilter !== 'todas' ? prioridadeFilter : undefined,
  };

  // ✅ RTK Query Hooks
  const { 
    data: ticketsData, 
    isLoading: ticketsLoading, 
    error: fetchError,
    refetch 
  } = useGetTicketsQuery(filters);


const { data: stats } = useGetTicketStatsQuery();


  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [changeStatus] = useChangeTicketStatusMutation();
  const [exportCSV, { isLoading: isExporting }] = useExportTicketsCSVMutation();

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Ticket['priority'],
    status: 'open' as Ticket['status'],
    school: parseInt(currentSchoolId),
  });

  // ✅ Atualizar escola quando mudar
  useEffect(() => {
    if (currentSchoolId && !editandoTicket) {
      setFormData(prev => ({ 
        ...prev, 
        school: parseInt(currentSchoolId)
      }));
    }
  }, [currentSchoolId, editandoTicket]);

  // ✅ Limpar mensagens automaticamente
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // ✅ Pegar tickets da API
  const tickets = ticketsData?.results || [];

  // ============================================
  // HANDLERS
  // ============================================

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'open',
      school: parseInt(currentSchoolId),
    });
    setEditandoTicket(null);
    setMostrarFormulario(false);
  };

  const handleNovoTicket = () => {
    resetForm();
    setMostrarFormulario(true);
  };

  const validarFormulario = (): string | null => {
    if (!formData.title.trim()) return 'Título é obrigatório';
    if (formData.title.trim().length < 5) return 'Título deve ter no mínimo 5 caracteres';
    if (!formData.description.trim()) return 'Descrição é obrigatória';
    if (formData.description.trim().length < 10) return 'Descrição deve ter no mínimo 10 caracteres';
    return null;
  };

  const handleCriarTicket = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await createTicket(formData).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Ticket criado com sucesso!' });
      resetForm();
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleEditar = (ticket: Ticket) => {
    setFormData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      school: ticket.school,
    });
    setEditandoTicket(ticket);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAtualizarTicket = async () => {
    if (!editandoTicket) return;

    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await updateTicket({ 
        id: editandoTicket.id, 
        data: formData 
      }).unwrap();
      
      setMensagem({ tipo: 'sucesso', texto: '✅ Ticket atualizado com sucesso!' });
      resetForm();
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const confirmarDelecao = (ticket: Ticket) => {
    setTicketParaDeletar(ticket.id);
  };

  const handleDeletar = async () => {
    if (!ticketParaDeletar) return;

    try {
      await deleteTicket(ticketParaDeletar).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Ticket deletado com sucesso!' });
      setTicketParaDeletar(null);
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleMudarStatus = async (id: number, novoStatus: Ticket['status']) => {
    try {
      await changeStatus({ id, status: novoStatus }).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Status atualizado!' });
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleExportar = async () => {
    try {
      const blob = await exportCSV(filters).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets_${currentSchool?.nome_escola || 'escola'}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMensagem({ tipo: 'sucesso', texto: '✅ CSV exportado!' });
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: '❌ Erro ao exportar CSV' });
    }
  };

  const handleLimparFiltros = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setPrioridadeFilter('todas');
  };

  // ============================================
  // FORMATADORES
  // ============================================

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const badges = {
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-blue-100 text-blue-700',
      urgent: 'bg-red-100 text-red-700',
    };
    const labels = {
      high: '🟠 Alta',
      medium: '🔵 Média',
      urgent: '🔴 Urgente',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[prioridade as keyof typeof badges]}`}>
        {labels[prioridade as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-orange-100 text-orange-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      open: '📝 Aberto',
      in_progress: '⏳ Em Andamento',
      pending: '⏸️ Pendente',
      resolved: '✅ Resolvido',
      closed: '🔒 Fechado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // ============================================
  // LOADING & ERROR STATES
  // ============================================

  if (ticketsLoading || schoolsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <TicketIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando tickets...</p>
        </div>
      </div>
    );
  }

  // Sem escola cadastrada
  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <TicketIcon className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma escola cadastrada</h2>
          <p className="text-gray-600">Entre em contato com o administrador.</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
      <PageModel>
      {/* Mensagens */}
      {mensagem && (
        <div className={`p-4 rounded-lg border-l-4 ${
          mensagem.tipo === 'sucesso' 
            ? 'bg-green-50 border-green-500 text-green-700' 
            : 'bg-red-50 border-red-500 text-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{mensagem.texto}</span>
            <button onClick={() => setMensagem(null)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Erro ao carregar */}
      {fetchError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-semibold">Erro: {extractErrorMessage(fetchError)}</span>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      {stats && (
        <Statistics  statsData={
          [{ label: 'Total', value: stats.total, color: 'blue', icon: <TicketIcon size={24} /> },
          { label: 'Abertos', value: stats.open, color: 'green', description: 'Aguardando' },
          { label: 'Em Andamento', value: stats.in_progress, color: 'yellow', description: 'Processando' },
          { label: 'Pendentes', value: stats.pending, color: 'orange', description: 'Aguardando info' },
          { label: 'Resolvidos', value: stats.resolved, color: 'purple', description: 'Finalizados' },
          { label: 'Fechados', value: stats.closed, color: 'gray', description: 'Arquivados' }
        ]
        }/>
      )}

      {/* Formulário */}
      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {editandoTicket ? '✏️ Editar Ticket' : '➕ Novo Ticket'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Título * (mín. 5 caracteres)</label>
              <input
                type="text"
                placeholder="Descreva o problema brevemente"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.title.length} caracteres</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descrição * (mín. 10 caracteres)</label>
              <textarea
                placeholder="Descreva o problema em detalhes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length} caracteres</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Ticket['priority'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="medium">🔵 Média</option>
                  <option value="high">🟠 Alta</option>
                  <option value="urgent">🔴 Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Ticket['status'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="open">📝 Aberto</option>
                  <option value="in_progress">⏳ Em Andamento</option>
                  <option value="pending">⏸️ Pendente</option>
                  <option value="resolved">✅ Resolvido</option>
                  <option value="closed">🔒 Fechado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              {editandoTicket ? (
                <button
                  onClick={handleAtualizarTicket}
                  disabled={isUpdating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  {isUpdating ? 'Atualizando...' : 'Atualizar'}
                </button>
              ) : (
                <button
                  onClick={handleCriarTicket}
                  disabled={isCreating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  {isCreating ? 'Criando...' : 'Criar Ticket'}
                </button>
              )}

              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <FilterBar
        fields={[
          {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar por título ou descrição...',
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
              { label: 'Aberto', value: 'open' },
              { label: 'Em Andamento', value: 'in_progress' },
              { label: 'Pendente', value: 'pending' },
              { label: 'Resolvido', value: 'resolved' },
              { label: 'Fechado', value: 'closed' },
            ],
          },
          {
            type: 'select',
            name: 'prioridade',
            value: prioridadeFilter,
            onChange: setPrioridadeFilter,
            options: [
              { label: 'Todas as Prioridades', value: 'todas' },
              { label: 'Média', value: 'medium' },
              { label: 'Alta', value: 'high' },
              { label: 'Urgente', value: 'urgent' },
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
            label: 'Novo Ticket',
            onClick: handleNovoTicket,
            icon: <Plus size={18} />,
            variant: 'primary',
          },
        ]}
        onClear={handleLimparFiltros}
      />

      {/* Tabela */}
      <DataTable
        columns={[
          { key: 'id', label: '#', width: '80px', sortable: true },
          { 
            key: 'title', 
            label: 'Título', 
            sortable: true,
            render: (value) => <span className="font-medium text-gray-900">{value}</span>
          },
          { 
            key: 'description', 
            label: 'Descrição',
            render: (value) => (
              <span className="text-sm text-gray-600 line-clamp-2">{value}</span>
            )
          },
          { 
            key: 'priority', 
            label: 'Prioridade',
            render: (value) => getPrioridadeBadge(value)
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (value, row) => (
              <select
                value={value}
                onChange={(e) => handleMudarStatus(row.id, e.target.value as Ticket['status'])}
                className={`${value === 'open' ? 'bg-blue-100 text-blue-700' : 
                           value === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                           value === 'pending' ? 'bg-orange-100 text-orange-700' :
                           value === 'resolved' ? 'bg-green-100 text-green-700' :
                           'bg-gray-100 text-gray-700'} 
                           px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none`}
              >
                <option value="open">📝 Aberto</option>
                <option value="in_progress">⏳ Em Andamento</option>
                <option value="pending">⏸️ Pendente</option>
                <option value="resolved">✅ Resolvido</option>
                <option value="closed">🔒 Fechado</option>
              </select>
            )
          },
          { 
            key: 'created_at', 
            label: 'Criado em',
            sortable: true,
            render: (value) => <span className="text-sm">{formatarData(value)}</span>
          },
        ]}
        data={tickets}
        keyExtractor={(ticket) => ticket.id.toString()}
        actions={[
          {
            icon: <Edit2 size={18} />,
            onClick: handleEditar,
            variant: 'primary',
            label: 'Editar',
          },
          {
            icon: <Trash2 size={18} />,
            onClick: confirmarDelecao,
            variant: 'danger',
            label: 'Deletar',
          },
        ]}
        emptyMessage="Nenhum ticket encontrado"
        emptyIcon={<TicketIcon size={48} className="text-gray-400" />}
      />

      {/* Info de Resultados */}
      {tickets.length > 0 && (
        <ResultsInformation itemsNumber={tickets.length} statsNumber={stats?.total || 0} />
      )}

      {/* Modal de Confirmação de Deleção */}
      {ticketParaDeletar && (
        <DeletionConfirmation
          info="Tem certeza que deseja deletar este ticket? Esta ação não pode ser desfeita."
          onConfirm={handleDeletar}
          onCancel={() => setTicketParaDeletar(null)}
          isDeleting={isDeleting}
        />
      )}
    </PageModel>   
  );
}