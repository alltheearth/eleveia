// src/pages/Tickets/index.tsx - ✅ REFATORADO
import { useState, useEffect } from 'react';
import {  Download, Edit2, Trash2, Ticket as TicketIcon, Plus } from 'lucide-react';

// Componentes de Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns (reutilizáveis)
import StatCard  from '../../components/common/Statistics/StatCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import MessageAlert from '../../components/common/MessageAlert';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormModal from '../../components/common/FormModal';

// Componentes específicos de Tickets
import TicketForm from '../../components/tickets/TicketForm';
import PriorityBadge from '../../components/tickets/PriorityBadge';
import StatusSelect from '../../components/tickets/StatusSelect';

// Hooks e Services
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useChangeTicketStatusMutation,
  // useGetTicketStatsQuery,
  useExportTicketsCSVMutation,
  extractErrorMessage,
  type Ticket,
  type TicketFilters
} from '../../services';


export default function Tickets() {
  // ============================================
  // HOOKS
  // ============================================
  
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ============================================
  // ESTADOS
  // ============================================
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoTicket, setEditandoTicket] = useState<Ticket | null>(null);
  const [ticketParaDeletar, setTicketParaDeletar] = useState<Ticket | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Ticket['priority'],
    status: 'open' as Ticket['status'],
    school: parseInt(currentSchoolId),
  });

  // ============================================
  // RTK QUERY
  // ============================================
  
  const filters: TicketFilters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'todos' ? statusFilter : undefined,
    priority: prioridadeFilter !== 'todas' ? prioridadeFilter : undefined,
  };

  const { 
    data: ticketsData, 
    isLoading: ticketsLoading, 
    error: fetchError,
    refetch 
  } = useGetTicketsQuery(filters);


  // const { data: stats } = useGetTicketStatsQuery();

const converteStats = () => {
    let total = 0;
    let open = 0;
    let in_progress = 0;
    let pending = 0;
    let resolved = 0;
    let closed = 0;

    ticketsData?.results.forEach(ticket => {
      total += 1;
      if (ticket.status === 'open') open += 1;
      if (ticket.status === 'in_progress') in_progress += 1;
      if (ticket.status === 'pending') pending += 1;
      if (ticket.status === 'resolved') resolved += 1;
      if (ticket.status === 'closed') closed += 1;
    });

    return { total, open, in_progress, pending, resolved, closed };
  }

const stats = converteStats();

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [changeStatus] = useChangeTicketStatusMutation();
  const [exportCSV, { isLoading: isExporting }] = useExportTicketsCSVMutation();

  const tickets = ticketsData?.results || [];

  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    if (currentSchoolId && !editandoTicket) {
      setFormData(prev => ({ ...prev, school: parseInt(currentSchoolId) }));
    }
  }, [currentSchoolId, editandoTicket]);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

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

  const validarFormulario = (): string | null => {
    if (!formData.title.trim()) return 'Título é obrigatório';
    if (formData.title.trim().length < 5) return 'Título deve ter no mínimo 5 caracteres';
    if (!formData.description.trim()) return 'Descrição é obrigatória';
    if (formData.description.trim().length < 10) return 'Descrição deve ter no mínimo 10 caracteres';
    return null;
  };

  const handleSubmit = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'error', texto: erro });
      return;
    }

    try {
      if (editandoTicket) {
        await updateTicket({ id: editandoTicket.id, data: formData }).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ Ticket atualizado com sucesso!' });
      } else {
        await createTicket(formData).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ Ticket criado com sucesso!' });
      }
      resetForm();
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
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

  const handleDeletar = async () => {
    if (!ticketParaDeletar) return;

    try {
      await deleteTicket(ticketParaDeletar.id).unwrap();
      setMensagem({ tipo: 'success', texto: '✅ Ticket deletado com sucesso!' });
      setTicketParaDeletar(null);
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleMudarStatus = async (id: number, novoStatus: Ticket['status']) => {
    try {
      await changeStatus({ id, status: novoStatus }).unwrap();
      setMensagem({ tipo: 'success', texto: '✅ Status atualizado!' });
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleExportar = async () => {
    try {
      const blob = await exportCSV(filters).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets_${currentSchool?.school_name || 'escola'}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMensagem({ tipo: 'success', texto: '✅ CSV exportado!' });
    } catch (err) {
      setMensagem({ tipo: 'error', texto: '❌ Erro ao exportar CSV' });
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
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
  
  if (ticketsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Carregando tickets..."
        icon={<TicketIcon size={48} className="text-blue-600" />}
      />
    );
  }

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<TicketIcon size={64} className="text-yellow-600" />}
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
          type={mensagem.tipo}
          message={mensagem.texto}
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

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard label="Total" value={stats.total} color="blue" icon={<TicketIcon size={24} />} />
          <StatCard label="Abertos" value={stats.open} color="green" description="Aguardando" />
          <StatCard label="Em Andamento" value={stats.in_progress} color="yellow" description="Processando" />
          <StatCard label="Pendentes" value={stats.pending} color="orange" description="Aguardando info" />
          <StatCard label="Resolvidos" value={stats.resolved} color="purple" description="Finalizados" />
          <StatCard label="Fechados" value={stats.closed} color="gray" description="Arquivados" />
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
            onClick: () => setMostrarFormulario(true),
            icon: <Plus size={18} />,
            variant: 'primary',
          },
        ]}
        onClear={() => {
          setSearchTerm('');
          setStatusFilter('todos');
          setPrioridadeFilter('todas');
        }}
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
            render: (value) => <span className="text-sm text-gray-600 line-clamp-2">{value}</span>
          },
          { 
            key: 'priority', 
            label: 'Prioridade',
            render: (value) => <PriorityBadge priority={value} />
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (value, row) => (
              <StatusSelect
                value={value}
                onChange={(newStatus) => handleMudarStatus(row.id, newStatus)}
              />
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
            onClick: (ticket) => setTicketParaDeletar(ticket),
            variant: 'danger',
            label: 'Deletar',
          },
        ]}
        emptyMessage="Nenhum ticket encontrado"
        emptyIcon={<TicketIcon size={48} className="text-gray-400" />}
      />

      {/* Info de Resultados */}
      {tickets.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{tickets.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats?.total || 0}</span> tickets
          </p>
        </div>
      )}

      {/* Modal de Formulário */}
      <FormModal
        isOpen={mostrarFormulario}
        title={editandoTicket ? '✏️ Editar Ticket' : '➕ Novo Ticket'}
        subtitle={editandoTicket ? 'Atualize as informações do ticket' : 'Preencha os dados do novo ticket'}
        onClose={resetForm}
        size="lg"
      >
        <TicketForm
          formData={formData}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isCreating || isUpdating}
          isEditing={!!editandoTicket}
        />
      </FormModal>

      {/* Modal de Confirmação de Deleção */}
      <ConfirmDialog
        isOpen={!!ticketParaDeletar}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar o ticket "${ticketParaDeletar?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        onConfirm={handleDeletar}
        onCancel={() => setTicketParaDeletar(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </PageModel>
  );
}