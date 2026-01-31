// src/pages/Calendar/index.tsx
// 📅 PÁGINA DE EVENTOS - PROFISSIONAL E MODERNA

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';

// Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { 
  FormModal, 
  ConfirmDialog,
  LoadingState,
} from '../../components/common';

// Componentes Locais
import EventStats from './components/EventStats';
import EventFilters, { type EventFiltersData } from './components/EventFilters';
import EventGridView from './components/EventGridView';
import EventListView from './components/EventListView';
import CalendarView from './components/CalendarView';

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

interface FormState extends EventFormData {
  id?: number;
  school: number;
  start_date: string;
  end_date: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EventsPage() {
  
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
  
  const [filters, setFilters] = useState<EventFiltersData>({
    search: '',
    eventType: 'all',
    startDate: '',
    endDate: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);

  const [formData, setFormData] = useState<FormState>({
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
    error: eventsError,
    refetch 
  } = useGetEventsQuery({
    event_type: filters.eventType !== 'all' ? filters.eventType as any : undefined,
    start_date: filters.startDate || undefined,
    end_date: filters.endDate || undefined,
    search: filters.search || undefined,
  });

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  // ============================================
  // DERIVED STATE
  // ============================================

  const events = eventsData?.results || [];
  const isLoading = eventsLoading || schoolsLoading;
  
  // Filtrar eventos da escola atual
  const filteredEvents = useMemo(() => {
    return events.filter(e => e.school.toString() === currentSchoolId);
  }, [events, currentSchoolId]);

  // Estatísticas
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return {
      total: filteredEvents.length,
      holiday: filteredEvents.filter(e => e.event_type === 'holiday').length,
      exam: filteredEvents.filter(e => e.event_type === 'exam').length,
      graduation: filteredEvents.filter(e => e.event_type === 'graduation').length,
      cultural: filteredEvents.filter(e => e.event_type === 'cultural').length,
      upcoming: filteredEvents.filter(e => {
        const eventDate = new Date(e.start_date);
        return eventDate >= now;
      }).length,
      thisMonth: filteredEvents.filter(e => {
        const eventDate = new Date(e.start_date);
        return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
      }).length,
    };
  }, [filteredEvents]);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (currentSchoolId && !editingEvent) {
      setFormData(prev => ({ ...prev, school: parseInt(currentSchoolId) }));
    }
  }, [currentSchoolId, editingEvent]);

  // ============================================
  // HANDLERS
  // ============================================

  const resetForm = () => {
    setFormData({
      school: parseInt(currentSchoolId),
      start_date: '',
      end_date: '',
      title: '',
      description: '',
      event_type: 'holiday',
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const validate = (): string | null => {
    if (!formData.start_date) return 'Data inicial é obrigatória';
    if (!formData.end_date) return 'Data final é obrigatória';
    if (!formData.title.trim()) return 'Título é obrigatório';
    if (formData.title.trim().length < 3) return 'Título deve ter no mínimo 3 caracteres';
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      return 'Data final não pode ser anterior à data inicial';
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (editingEvent) {
        const { id, ...data } = formData;
        await updateEvent({ id: editingEvent.id, data }).unwrap();
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

  const handleEdit = (event: Event) => {
    setFormData({
      school: parseInt(currentSchoolId),
      start_date: event.start_date,
      end_date: event.end_date,
      title: event.title,
      description: event.description,
      event_type: event.event_type,
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteEvent(deleteConfirm.id).unwrap();
      toast.success('✅ Evento deletado com sucesso!');
      setDeleteConfirm(null);
      refetch();
    } catch (err: any) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      eventType: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const handleExport = () => {
    toast.success('Exportação iniciada!');
    // Implementar lógica de exportação
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Dados atualizados!');
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
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Calendário de Eventos
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar size={16} />
              Gerencie os eventos e datas importantes da sua escola
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <EventStats stats={stats} loading={eventsLoading} />

      {/* Filtros */}
      <EventFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClear={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewEvent={() => setShowForm(true)}
        onExport={handleExport}
        loading={eventsLoading}
      />

      {/* Conteúdo por visualização */}
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
              eventColors={{
                holiday: 'bg-red-500',
                exam: 'bg-blue-500',
                graduation: 'bg-purple-500',
                cultural: 'bg-orange-500',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          isOpen={showForm}
          title={editingEvent ? '✏️ Editar Evento' : '➕ Novo Evento'}
          subtitle={editingEvent ? 'Atualize as informações do evento' : 'Preencha os dados do novo evento'}
          onClose={resetForm}
          size="lg"
        >
          <EventFormContent
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isLoading={isCreating || isUpdating}
            isEditing={!!editingEvent}
          />
        </FormModal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar o evento "${deleteConfirm.title}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={isDeleting}
          variant="danger"
          confirmLabel="Deletar"
          cancelLabel="Cancelar"
        />
      )}
    </PageModel>
  );
}

// ============================================
// EVENT FORM COMPONENT
// ============================================

interface EventFormContentProps {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

function EventFormContent({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}: EventFormContentProps) {
  return (
    <div className="space-y-6">
      
      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Inicial *
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Final *
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Título do Evento *
        </label>
        <input
          type="text"
          placeholder="Ex: Provas Finais do 1º Semestre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          placeholder="Detalhes sobre o evento..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de Evento *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'holiday', label: 'Feriado', emoji: '📌', color: 'red' },
            { value: 'exam', label: 'Prova', emoji: '📝', color: 'blue' },
            { value: 'graduation', label: 'Formatura', emoji: '🎓', color: 'purple' },
            { value: 'cultural', label: 'Cultural', emoji: '🎭', color: 'orange' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, event_type: type.value as any })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.event_type === type.value
                  ? `border-${type.color}-500 bg-${type.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{type.emoji}</div>
              <div className="text-sm font-semibold text-gray-900">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar Evento' : 'Criar Evento'}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}