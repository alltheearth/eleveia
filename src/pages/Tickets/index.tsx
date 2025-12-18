// src/pages/Tickets/index.tsx
import { useState } from 'react';
import { Search, Plus, Download, Filter, X, Edit2, Trash2, Ticket as TicketIcon, AlertCircle } from 'lucide-react';
import StatCard from '../../components/layout/StatCard';
import FilterBar from '../../components/layout/FilterBar';
import DataTable from '../../components/layout/DataTable';
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  extractErrorMessage,
  type Ticket
} from '../../services';

export default function Tickets() {
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoTicket, setEditandoTicket] = useState<Ticket | null>(null);
  const [ticketParaDeletar, setTicketParaDeletar] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // ✅ Buscar tickets da API
  const { 
    data: ticketsData, 
    isLoading, 
    error: fetchError,
    refetch 
  } = useGetTicketsQuery();

  // ✅ Mutations
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Ticket['priority'],
    status: 'open' as Ticket['status'],
    school: 1, // Será preenchido com escola do usuário
  });

  // ✅ Pegar tickets da API
  const tickets = ticketsData?.results || [];

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' || ticket.status === statusFilter;
    const matchPrioridade = prioridadeFilter === 'todas' || ticket.priority === prioridadeFilter;
    return matchSearch && matchStatus && matchPrioridade;
  });

  // ✅ Estatísticas calculadas dos tickets reais
  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'open').length,
    em_andamento: tickets.filter(t => t.status === 'in_progress').length,
    pendentes: tickets.filter(t => t.status === 'pending').length,
    resolvidos: tickets.filter(t => t.status === 'resolved').length,
    fechados: tickets.filter(t => t.status === 'closed').length,
  };

  // ============================================
  // HANDLERS
  // ============================================

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'open',
      school: 1,
    });
    setEditandoTicket(null);
    setMostrarFormulario(false);
  };

  const handleNovoTicket = () => {
    resetForm();
    setMostrarFormulario(true);
  };

  const handleCriarTicket = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Preencha título e descrição' });
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

    if (!formData.title.trim() || !formData.description.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Preencha título e descrição' });
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

  const handleExportar = () => {
    // Implementar exportação CSV
    const csv = [
      ['ID', 'Título', 'Descrição', 'Prioridade', 'Status', 'Criado em'].join(','),
      ...tickets.map(t => [
        t.id,
        `"${t.title}"`,
        `"${t.description}"`,
        t.priority,
        t.status,
        t.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setMensagem({ tipo: 'sucesso', texto: '✅ CSV exportado!' });
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <TicketIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando tickets...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
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
            <span className="font-semibold">Erro ao carregar tickets</span>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total de Tickets"
          value={stats.total}
          color="blue"
          icon={<Filter size={24} />}
        />
        <StatCard
          label="Abertos"
          value={stats.abertos}
          color="green"
          description="Aguardando atendimento"
        />
        <StatCard
          label="Em Andamento"
          value={stats.em_andamento}
          color="yellow"
          description="Sendo processados"
        />
        <StatCard
          label="Pendentes"
          value={stats.pendentes}
          color="orange"
          description="Aguardando informações"
        />
        <StatCard
          label="Resolvidos"
          value={stats.resolvidos}
          color="purple"
          description="Finalizados"
        />
        <StatCard
          label="Fechados"
          value={stats.fechados}
          color="gray"
          description="Arquivados"
        />
      </div>

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
              <label className="block text-gray-700 font-semibold mb-2">Título *</label>
              <input
                type="text"
                placeholder="Descreva o problema brevemente"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descrição *</label>
              <textarea
                placeholder="Descreva o problema em detalhes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
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
                  {isUpdating ? 'Atualizando...' : 'Atualizar Ticket'}
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
            render: (value) => getStatusBadge(value)
          },
          { 
            key: 'created_at', 
            label: 'Criado em',
            sortable: true,
            render: (value) => <span className="text-sm">{formatarData(value)}</span>
          },
        ]}
        data={filteredTickets}
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
      {filteredTickets.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{filteredTickets.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats.total}</span> tickets
          </p>
        </div>
      )}

      {/* Modal de Confirmação de Deleção */}
      {ticketParaDeletar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar este ticket? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setTicketParaDeletar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletar}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}