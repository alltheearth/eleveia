import React, { useState, type ReactNode, type ChangeEvent } from 'react';
import { Search, Plus, Download, Filter, X, Edit2, Trash2, ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import StatCard from '../layout/StatCard';
import FilterBar from '../layout/FilterBar';
import DataTable from '../layout/DataTable';



interface TicketData {
  id: number;
  titulo: string;
  usuario: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'pendente' | 'resolvido' | 'fechado';
  criado_em: string;
  atualizado_em: string;
}

function TicketsExample() {
  // Estados
  const [tickets] = useState<TicketData[]>([
    {
      id: 1,
      titulo: 'Problema no login',
      usuario: 'João Silva',
      prioridade: 'alta',
      status: 'aberto',
      criado_em: '2025-01-15T10:30:00',
      atualizado_em: '2025-01-15T10:30:00',
    },
    {
      id: 2,
      titulo: 'Dúvida sobre matrícula',
      usuario: 'Maria Santos',
      prioridade: 'media',
      status: 'em_andamento',
      criado_em: '2025-01-14T14:20:00',
      atualizado_em: '2025-01-15T09:15:00',
    },
    {
      id: 3,
      titulo: 'Erro ao gerar relatório',
      usuario: 'Pedro Costa',
      prioridade: 'urgente',
      status: 'pendente',
      criado_em: '2025-01-13T16:45:00',
      atualizado_em: '2025-01-14T11:30:00',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' || ticket.status === statusFilter;
    const matchPrioridade = prioridadeFilter === 'todas' || ticket.prioridade === prioridadeFilter;
    return matchSearch && matchStatus && matchPrioridade;
  });

  // Estatísticas
  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'aberto').length,
    em_andamento: tickets.filter(t => t.status === 'em_andamento').length,
    pendentes: tickets.filter(t => t.status === 'pendente').length,
    resolvidos: tickets.filter(t => t.status === 'resolvido').length,
  };

  // Funções
  const handleNovoTicket = () => {
    alert('Abrir formulário de novo ticket');
  };

  const handleExportar = () => {
    alert('Exportar tickets para CSV');
  };

  const handleEditar = (ticket: TicketData) => {
    alert(`Editar ticket: ${ticket.titulo}`);
  };

  const handleDeletar = (ticket: TicketData) => {
    alert(`Deletar ticket: ${ticket.titulo}`);
  };

  const handleLimparFiltros = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setPrioridadeFilter('todas');
  };

  // Formatadores
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
      baixa: 'bg-gray-100 text-gray-700',
      media: 'bg-blue-100 text-blue-700',
      alta: 'bg-orange-100 text-orange-700',
      urgente: 'bg-red-100 text-red-700',
    };
    const labels = {
      baixa: '🟢 Baixa',
      media: '🔵 Média',
      alta: '🟠 Alta',
      urgente: '🔴 Urgente',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[prioridade as keyof typeof badges]}`}>
        {labels[prioridade as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      aberto: 'bg-blue-100 text-blue-700',
      em_andamento: 'bg-yellow-100 text-yellow-700',
      pendente: 'bg-orange-100 text-orange-700',
      resolvido: 'bg-green-100 text-green-700',
      fechado: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      aberto: '📝 Aberto',
      em_andamento: '⏳ Em Andamento',
      pendente: '⏸️ Pendente',
      resolvido: '✅ Resolvido',
      fechado: '🔒 Fechado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
      </div>

      {/* Filtros */}
      <FilterBar
        fields={[
          {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar por título ou usuário...',
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
              { label: 'Aberto', value: 'aberto' },
              { label: 'Em Andamento', value: 'em_andamento' },
              { label: 'Pendente', value: 'pendente' },
              { label: 'Resolvido', value: 'resolvido' },
              { label: 'Fechado', value: 'fechado' },
            ],
          },
          {
            type: 'select',
            name: 'prioridade',
            value: prioridadeFilter,
            onChange: setPrioridadeFilter,
            options: [
              { label: 'Todas as Prioridades', value: 'todas' },
              { label: 'Baixa', value: 'baixa' },
              { label: 'Média', value: 'media' },
              { label: 'Alta', value: 'alta' },
              { label: 'Urgente', value: 'urgente' },
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
            key: 'titulo', 
            label: 'Título', 
            sortable: true,
            render: (value) => <span className="font-medium text-gray-900">{value}</span>
          },
          { key: 'usuario', label: 'Usuário', sortable: true },
          { 
            key: 'prioridade', 
            label: 'Prioridade',
            render: (value) => getPrioridadeBadge(value)
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (value) => getStatusBadge(value)
          },
          { 
            key: 'criado_em', 
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
            onClick: handleDeletar,
            variant: 'danger',
            label: 'Deletar',
          },
        ]}
        emptyMessage="Nenhum ticket encontrado"
        emptyIcon={<Ticket size={48} className="text-gray-400" />}
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
    </div>
  );
}

export default TicketsExample;