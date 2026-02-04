// src/pages/Calendar/index.tsx
// 📅 PÁGINA DE EVENTOS - REFATORADA COM COMPONENTES COMUNS

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

// Layout
import PageModel from '../../components/layout/PageModel';

// ============================================
// COMPONENTES COMUNS (REUTILIZÁVEIS)
// ============================================
import { 
  StatCard,
  PageFilters,
  FormModal, 
  ConfirmDialog,
  LoadingState,
  ResultsInformation,
} from '../../components/common';

// ============================================
// COMPONENTES LOCAIS (ESPECÍFICOS DE EVENTOS)
// ============================================
import EventGridView from './components/EventGridView';
import EventListView from './components/EventListView';
import CalendarView from './components/CalendarView';
import EventForm from './components/EventForm';

// Hooks e Services
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  extractErrorMessage,
  type Event,
  type EventFormData
} from '../../services';

// ============================================
// TYPES
// ============================================

type ViewMode = 'grid' | 'list' | 'calendar';

interface EventFiltersData {
  search: string;
  eventType: string;
  startDate: string;
  endDate: string;
}

// ============================================
// VIEW MODES CONFIG
// ============================================

import { Grid3x3, List as ListIcon, Calendar as CalendarIcon } from 'lucide-react';

const VIEW_MODES = [
  { value: 'grid', icon: <Grid3x3 size={18} />, label: 'Grade' },
  { value: 'list', icon: <ListIcon size={18} />, label: 'Lista' },
  { value: 'calendar', icon: <CalendarIcon size={18} />, label: 'Calendário' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function EventsPage() {
  
  // ============================================
  // HOOKS
  // ============================================
  
  const { 
    currentSchoolId, 
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ============================================
  // STATE
  // ============================================
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState<EventFiltersData>({
    search: '',
    eventType: 'all',
    startDate: '',
    endDate: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    school: parseInt(currentSchoolId),
    start_date: '',
    end_date: '',
    title: '',
    description: '',
    event_type: 'holiday',
  });

  // ============================================
  // API
  // ============================================

  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    refetch 
  } = useGetEventsQuery({
    event_type: filters.eventType !== 'all' ? filters.eventType : undefined,
  });

  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();

  // ============================================
  // COMPUTED DATA
  // ============================================

  const events = useMemo(() => {
    return Array.isArray(eventsData) ? eventsData : [];
  }, [eventsData]);

  // Filtros aplicados
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Busca por texto
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo
      const matchesType = filters.eventType === 'all' || 
        event.event_type === filters.eventType;

      // Filtro por data inicial
      const matchesStartDate = !filters.startDate || 
        new Date(event.start_date) >= new Date(filters.startDate);

      // Filtro por data final
      const matchesEndDate = !filters.endDate || 
        new Date(event.end_date) <= new Date(filters.endDate);

      return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
    });
  }, [events, searchTerm, filters]);

  // Estatísticas
  const stats = useMemo(() => {
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return {
      total: events.length,
      upcoming: events.filter(e => new Date(e.start_date) > now && new Date(e.start_date) <= nextMonth).length,
      thisMonth: events.filter(e => {
        const eventDate = new Date(e.start_date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      }).length,
      holiday: events.filter(e => e.event_type === 'holiday').length,
      exam: events.filter(e => e.event_type === 'exam').length,
      graduation: events.filter(e => e.event_type === 'graduation').length,
      cultural: events.filter(e => e.event_type === 'cultural').length,
    };
  }, [events]);

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return filters.eventType !== 'all' || 
           filters.startDate !== '' || 
           filters.endDate !== '';
  }, [filters]);

  const isLoading = schoolsLoading || eventsLoading;
  const isSaving = creating || updating;

  // ============================================
  // HANDLERS
  // ============================================

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      school: event.school,
      start_date: event.start_date,
      end_date: event.end_date,
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, data: formData }).unwrap();
        toast.success('✅ Evento atualizado com sucesso!');
      } else {
        await createEvent(formData).unwrap();
        toast.success('✅ Evento criado com sucesso!');
      }
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteEvent(deleteConfirm.id).unwrap();
      toast.success('🗑️ Evento deletado com sucesso!');
      setDeleteConfirm(null);
      refetch();
    } catch (err: any) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      school: parseInt(currentSchoolId),
      start_date: '',
      end_date: '',
      title: '',
      description: '',
      event_type: 'holiday',
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      search: '',
      eventType: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const handleExport = () => {
    toast.success('📥 Exportação iniciada!');
    // TODO: Implementar lógica de exportação
  };

  const handleRefresh = () => {
    refetch();
    toast.success('🔄 Dados atualizados!');
  };

  const handleDayClick = (date: string) => {
    setFormData(prev => ({
      ...prev,
      start_date: date,
      end_date: date,
    }));
    setShowForm(true);
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <LoadingState 
        icon={<Calendar className="h-12 w-12 text-blue-600" />}
        message="Carregando eventos..."
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <PageModel>
      
      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📅 Calendário de Eventos
        </h1>
        <p className="text-gray-600">
          Gerencie os eventos e datas importantes da sua escola
        </p>
      </motion.div>

      {/* ========================================== */}
      {/* STATS (USANDO STATCARD COMUM) */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          label="Total de Eventos"
          value={stats.total}
          icon={<Calendar className="text-blue-600" size={24} />}
          color="blue"
          subtitle="Cadastrados no sistema"
        />

        <StatCard
          label="Próximos Eventos"
          value={stats.upcoming}
          change={12}
          icon={<Calendar className="text-green-600" size={24} />}
          color="green"
          subtitle="Nos próximos 30 dias"
        />

        <StatCard
          label="Este Mês"
          value={stats.thisMonth}
          icon={<Calendar className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Eventos agendados"
        />

        <StatCard
          label="Tipos Diferentes"
          value={4}
          icon={<Calendar className="text-orange-600" size={24} />}
          color="orange"
          subtitle="Categorias ativas"
        />
      </div>

      {/* ========================================== */}
      {/* FILTROS (USANDO PAGEFILTERS COMUM) */}
      {/* ========================================== */}
      
      <PageFilters
        // Busca
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar eventos por título..."
        
        // View Mode
        viewMode={viewMode}
        viewModes={VIEW_MODES}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
        
        // Ações
        onNew={() => setShowForm(true)}
        newLabel="Novo Evento"
        onExport={handleExport}
        onRefresh={handleRefresh}
        
        // Filtros avançados
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        loading={eventsLoading}
        
        // Slot de filtros customizados
        advancedFilters={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo de evento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Evento
              </label>
              <select
                value={filters.eventType}
                onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="all">Todos os tipos</option>
                <option value="holiday">📌 Feriado</option>
                <option value="exam">📝 Prova</option>
                <option value="graduation">🎓 Formatura</option>
                <option value="cultural">🎭 Cultural</option>
              </select>
            </div>

            {/* Data inicial */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Data final */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        }
      />

      {/* ========================================== */}
      {/* CONTEÚDO POR VISUALIZAÇÃO */}
      {/* ========================================== */}
      
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EventGridView
              events={filteredEvents}
              onEdit={handleEdit}
              onDelete={setDeleteConfirm}
              loading={eventsLoading}
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
            <EventListView
              events={filteredEvents}
              onEdit={handleEdit}
              onDelete={setDeleteConfirm}
              loading={eventsLoading}
            />
          </motion.div>
        )}

        {viewMode === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CalendarView
              events={filteredEvents}
              onDayClick={handleDayClick}
              onEventClick={handleEdit}
              loading={eventsLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* RESULTS INFO (USANDO COMPONENTE COMUM) */}
      {/* ========================================== */}
      
      {filteredEvents.length > 0 && (
        <ResultsInformation
          showing={filteredEvents.length}
          total={stats.total}
          filtered={hasActiveFilters}
        />
      )}

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}
      
      {/* Form Modal (USANDO FORMMODAL COMUM) */}
      {showForm && (
        <FormModal
          isOpen={showForm}
          title={editingEvent ? '✏️ Editar Evento' : '➕ Novo Evento'}
          subtitle={editingEvent ? 'Atualize as informações do evento' : 'Preencha os dados do novo evento'}
          onClose={resetForm}
          size="lg"
        >
          <EventForm
            formData={formData}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isLoading={isSaving}
            isEditing={!!editingEvent}
          />
        </FormModal>
      )}

      {/* Delete Confirmation (USANDO CONFIRMDIALOG COMUM) */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar o evento "${deleteConfirm.title}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Deletar"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={deleting}
          variant="danger"
        />
      )}
    </PageModel>
  );
}