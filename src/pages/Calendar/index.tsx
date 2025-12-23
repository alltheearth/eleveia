// src/pages/Eventos/index.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// Componentes de Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import StatCard from '../../components/common/Statistics/StatCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import MessageAlert from '../../components/common/MessageAlert';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormModal from '../../components/common/FormModal';
import Badge from '../../components/common/Badge';

// Hooks e Services
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  extractErrorMessage,
  type Event
} from '../../services';

// Componente EventForm
interface EventFormProps {
  formData: {
    data: string;
    evento: string;
    tipo: Event['tipo'];
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

function EventForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: EventFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Data do Evento *
          </label>
          <input
            type="date"
            value={formData.data}
            onChange={(e) => onChange('data', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Tipo de Evento *
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => onChange('tipo', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="feriado">📌 Feriado</option>
            <option value="prova">📝 Prova/Avaliação</option>
            <option value="formatura">🎓 Formatura</option>
            <option value="evento_cultural">🎉 Evento Cultural</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Descrição do Evento * (mín. 3 caracteres)
        </label>
        <input
          type="text"
          placeholder="Ex: Prova Bimestral de Matemática"
          value={formData.evento}
          onChange={(e) => onChange('evento', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.evento.length} caracteres
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          <Plus size={20} />
          {isLoading 
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar Evento' : 'Criar Evento')
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

// Componente TipoBadge
interface TipoBadgeProps {
  tipo: Event['tipo'];
}

function TipoBadge({ tipo }: TipoBadgeProps) {
  const CONFIG = {
    feriado: { variant: 'red' as const, label: '📌 Feriado' },
    prova: { variant: 'blue' as const, label: '📝 Prova' },
    formatura: { variant: 'purple' as const, label: '🎓 Formatura' },
    evento_cultural: { variant: 'orange' as const, label: '🎉 Evento Cultural' },
  };

  const config = CONFIG[tipo];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Componente Calendário
interface CalendarioProps {
  eventos: Event[];
  mesAtual: Date;
  onMesAnterior: () => void;
  onProximoMes: () => void;
  onDiaClick: (data: string) => void;
}

function Calendario({ eventos, mesAtual, onMesAnterior, onProximoMes, onDiaClick }: CalendarioProps) {
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
  const ultimoDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
  const diasNoMes = ultimoDia.getDate();
  const primeiroDiaSemana = primeiroDia.getDay();

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getEventosNoDia = (dia: number) => {
    const data = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return eventos.filter(e => e.data === data);
  };

  const renderDias = () => {
    const dias = [];
    
    // Dias vazios antes do início do mês
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(
        <div key={`empty-${i}`} className="aspect-square p-2 bg-gray-50 rounded-lg"></div>
      );
    }

    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const eventosNoDia = getEventosNoDia(dia);
      const temEventos = eventosNoDia.length > 0;
      const dataStr = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const isHoje = new Date().toDateString() === new Date(dataStr).toDateString();

      dias.push(
        <button
          key={dia}
          onClick={() => onDiaClick(dataStr)}
          className={`aspect-square p-2 border transition-all ${
            isHoje 
              ? 'border-blue-500 bg-blue-50 font-bold ring-2 ring-blue-200' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          } ${
            temEventos ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white'
          } rounded-lg relative group`}
        >
          <div className="text-sm font-medium">{dia}</div>
          
          {temEventos && (
            <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-1">
              {eventosNoDia.slice(0, 3).map((evento, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    evento.tipo === 'feriado' ? 'bg-red-500' :
                    evento.tipo === 'prova' ? 'bg-blue-500' :
                    evento.tipo === 'formatura' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Tooltip */}
          {temEventos && (
            <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none">
              <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-lg">
                {eventosNoDia.length} evento{eventosNoDia.length > 1 ? 's' : ''}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </button>
      );
    }

    return dias;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onMesAnterior}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <h3 className="text-xl font-bold text-gray-900">
          {mesesNomes[mesAtual.getMonth()]} {mesAtual.getFullYear()}
        </h3>

        <button
          onClick={onProximoMes}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Próximo mês"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7 gap-2">
        {/* Dias da semana */}
        {diasDaSemana.map(dia => (
          <div key={dia} className="text-center font-semibold text-gray-600 text-sm py-2">
            {dia}
          </div>
        ))}
        
        {/* Dias do mês */}
        {renderDias()}
      </div>

      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200"></div>
          <span className="text-gray-600">Hoje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Feriado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Prova</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-600">Formatura</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">Evento Cultural</span>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export default function Eventos() {
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoEvento, setEditandoEvento] = useState<Event | null>(null);
  const [eventoParaDeletar, setEventoParaDeletar] = useState<Event | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    data: '',
    evento: '',
    tipo: 'feriado' as Event['tipo'],
    escola: parseInt(currentSchoolId),
  });

  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    error: fetchError,
    refetch 
  } = useGetEventsQuery();

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const eventos = eventsData?.results || [];

  // Estatísticas
  const stats = {
    total: eventos.length,
    feriado: eventos.filter(e => e.tipo === 'feriado').length,
    prova: eventos.filter(e => e.tipo === 'prova').length,
    formatura: eventos.filter(e => e.tipo === 'formatura').length,
    cultural: eventos.filter(e => e.tipo === 'evento_cultural').length,
  };

  useEffect(() => {
    if (currentSchoolId && !editandoEvento) {
      setFormData(prev => ({ ...prev, escola: parseInt(currentSchoolId) }));
    }
  }, [currentSchoolId, editandoEvento]);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const resetForm = () => {
    setFormData({
      data: '',
      evento: '',
      tipo: 'feriado',
      escola: parseInt(currentSchoolId),
    });
    setEditandoEvento(null);
    setMostrarFormulario(false);
    setDiaSelecionado(null);
  };

  const validarFormulario = (): string | null => {
    if (!formData.data) return 'Data é obrigatória';
    if (!formData.evento.trim()) return 'Descrição do evento é obrigatória';
    if (formData.evento.trim().length < 3) return 'Descrição deve ter no mínimo 3 caracteres';
    return null;
  };

  const handleSubmit = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'error', texto: erro });
      return;
    }

    try {
      if (editandoEvento) {
        await updateEvent({ id: editandoEvento.id, data: formData }).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ Evento atualizado com sucesso!' });
      } else {
        await createEvent(formData).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ Evento criado com sucesso!' });
      }
      resetForm();
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleEditar = (evento: Event) => {
    setFormData({
      data: evento.data,
      evento: evento.evento,
      tipo: evento.tipo,
      escola: parseInt(currentSchoolId),
    });
    setEditandoEvento(evento);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = async () => {
    if (!eventoParaDeletar) return;

    try {
      await deleteEvent(eventoParaDeletar.id).unwrap();
      setMensagem({ tipo: 'success', texto: '✅ Evento deletado com sucesso!' });
      setEventoParaDeletar(null);
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleDiaClick = (data: string) => {
    setDiaSelecionado(data);
    setFormData(prev => ({ ...prev, data }));
    setMostrarFormulario(true);
  };

  const handleMesAnterior = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1));
  };

  const handleProximoMes = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1));
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filtrar eventos
  const eventosFiltrados = eventos.filter(e => {
    const matchSearch = e.evento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFilter === 'todos' || e.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  if (eventsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Carregando eventos..."
        icon={<Calendar size={48} className="text-blue-600" />}
      />
    );
  }

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<Calendar size={64} className="text-yellow-600" />}
        title="Nenhuma escola cadastrada"
        description="Entre em contato com o administrador."
      />
    );
  }

  return (
    <PageModel>
      {mensagem && (
        <MessageAlert
          type={mensagem.tipo}
          message={mensagem.texto}
          onClose={() => setMensagem(null)}
        />
      )}

      {fetchError && (
        <MessageAlert
          type="error"
          message={`Erro: ${extractErrorMessage(fetchError)}`}
          dismissible={false}
        />
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} color="blue" icon={<Calendar size={24} />} />
        <StatCard label="Feriados" value={stats.feriado} color="red" />
        <StatCard label="Provas" value={stats.prova} color="blue" />
        <StatCard label="Formaturas" value={stats.formatura} color="purple" />
        <StatCard label="Culturais" value={stats.cultural} color="orange" />
      </div>

      {/* Calendário */}
      <Calendario
        eventos={eventos}
        mesAtual={mesAtual}
        onMesAnterior={handleMesAnterior}
        onProximoMes={handleProximoMes}
        onDiaClick={handleDiaClick}
      />

      {/* Filtros */}
      <FilterBar
        fields={[
          {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar eventos...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            name: 'tipo',
            value: tipoFilter,
            onChange: setTipoFilter,
            options: [
              { label: 'Todos os Tipos', value: 'todos' },
              { label: 'Feriado', value: 'feriado' },
              { label: 'Prova', value: 'prova' },
              { label: 'Formatura', value: 'formatura' },
              { label: 'Evento Cultural', value: 'evento_cultural' },
            ],
          },
        ]}
        actions={[
          {
            label: 'Novo Evento',
            onClick: () => setMostrarFormulario(true),
            icon: <Plus size={18} />,
            variant: 'primary',
          },
        ]}
        onClear={() => {
          setSearchTerm('');
          setTipoFilter('todos');
        }}
      />

      {/* Tabela */}
      <DataTable
        columns={[
          { key: 'id', label: '#', width: '80px' },
          { 
            key: 'data', 
            label: 'Data',
            render: (value) => <span className="font-medium">{formatarData(value)}</span>
          },
          { 
            key: 'evento', 
            label: 'Evento',
            render: (value) => <span className="text-gray-900">{value}</span>
          },
          { 
            key: 'tipo', 
            label: 'Tipo',
            render: (value) => <TipoBadge tipo={value} />
          },
        ]}
        data={eventosFiltrados}
        keyExtractor={(evento) => evento.id.toString()}
        actions={[
          {
            icon: <Edit2 size={18} />,
            onClick: handleEditar,
            variant: 'primary',
            label: 'Editar',
          },
          {
            icon: <Trash2 size={18} />,
            onClick: (evento) => setEventoParaDeletar(evento),
            variant: 'danger',
            label: 'Deletar',
          },
        ]}
        emptyMessage="Nenhum evento encontrado"
        emptyIcon={<Calendar size={48} className="text-gray-400" />}
      />

      {/* Modal de Formulário */}
      <FormModal
        isOpen={mostrarFormulario}
        title={editandoEvento ? '✏️ Editar Evento' : '➕ Novo Evento'}
        subtitle={diaSelecionado ? `Data selecionada: ${formatarData(diaSelecionado)}` : undefined}
        onClose={resetForm}
        size="md"
      >
        <EventForm
          formData={formData}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isCreating || isUpdating}
          isEditing={!!editandoEvento}
        />
      </FormModal>

      {/* Modal de Confirmação */}
      <ConfirmDialog
        isOpen={!!eventoParaDeletar}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar o evento "${eventoParaDeletar?.evento}"?`}
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        onConfirm={handleDeletar}
        onCancel={() => setEventoParaDeletar(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </PageModel>
  );
}