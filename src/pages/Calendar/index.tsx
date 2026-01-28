// src/pages/Calendar/index.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, Calendar as CalendarIcon } from 'lucide-react';

// Componentes de Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { 
  MessageAlert, 
  EmptyState, 
  FormModal, 
  ConfirmDialog,
  LoadingState,
  Badge,
  FilterBar,
  ViewToggle,
  type ViewMode, // ✅ NOVO
} from '../../components/common';

// Componentes Locais
import CalendarView from './components/CalendarView';
import EventsList from './components/EventsList';

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

// ============================================
// TYPES
// ============================================

interface FormData {
  start_date: string;
  end_date: string;
  title: string;
  description: string;
  event_type: 'holiday' | 'exam' | 'graduation' | 'cultural';
  school: number;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

// ============================================
// CONSTANTS
// ============================================

const EVENT_TYPES = {
  holiday: { label: 'Holiday', emoji: '📌', color: 'red' as const },
  exam: { label: 'Exam', emoji: '📝', color: 'blue' as const },
  graduation: { label: 'Graduation', emoji: '🎓', color: 'purple' as const },
  cultural: { label: 'Cultural', emoji: '🎉', color: 'orange' as const },
};

const EVENT_COLORS = {
  holiday: 'bg-red-500',
  exam: 'bg-blue-500',
  graduation: 'bg-purple-500',
  cultural: 'bg-orange-500',
};

// ============================================
// COMPONENT
// ============================================

export default function EventsPage() {
  const { 
    currentSchool, 
    currentSchoolId, 
    hasMultipleSchools, 
    schools, 
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ============================================
  // STATE
  // ============================================

  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // ✅ NOVO
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const [formData, setFormData] = useState<FormData>({
    start_date: '',
    end_date: '',
    title: '',
    description: '',
    event_type: 'holiday',
    school: parseInt(currentSchoolId),
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
    event_type: typeFilter !== 'all' ? typeFilter as any : undefined,
    start_date: startDateFilter || undefined,
    end_date: endDateFilter || undefined,
    search: searchTerm || undefined,
  });

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  // ============================================
  // DERIVED STATE
  // ============================================

  const events = eventsData?.results || [];
  const isLoading = eventsLoading || schoolsLoading;
  
  // Filter events for current school
  const filteredEvents = events.filter(e => e.school.toString() === currentSchoolId);

  // Stats
  const stats = {
    total: filteredEvents.length,
    holiday: filteredEvents.filter(e => e.event_type === 'holiday').length,
    exam: filteredEvents.filter(e => e.event_type === 'exam').length,
    graduation: filteredEvents.filter(e => e.event_type === 'graduation').length,
    cultural: filteredEvents.filter(e => e.event_type === 'cultural').length,
  };

  // ============================================
  // EFFECTS
  // ============================================

  // Update school in form when it changes
  useEffect(() => {
    if (currentSchoolId && !editingEvent) {
      setFormData(prev => ({ ...prev, school: parseInt(currentSchoolId) }));
    }
  }, [currentSchoolId, editingEvent]);

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ============================================
  // HANDLERS
  // ============================================

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const resetForm = () => {
    setFormData({
      start_date: '',
      end_date: '',
      title: '',
      description: '',
      event_type: 'holiday',
      school: parseInt(currentSchoolId),
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const validate = (): string | null => {
    if (!formData.start_date) return 'Start date is required';
    if (!formData.end_date) return 'End date is required';
    if (!formData.title.trim()) return 'Title is required';
    if (formData.title.trim().length < 3) return 'Title must be at least 3 characters';
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      return 'End date cannot be before start date';
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    try {
      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, data: formData }).unwrap();
        setMessage({ type: 'success', text: '✅ Event updated successfully!' });
      } else {
        await createEvent(formData).unwrap();
        setMessage({ type: 'success', text: '✅ Event created successfully!' });
      }
      resetForm();
      refetch();
    } catch (err: any) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      start_date: event.start_date,
      end_date: event.end_date,
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      school: parseInt(currentSchoolId),
    });
    setEditingEvent(event);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteEvent(deleteConfirm.id).unwrap();
      setMessage({ type: 'success', text: '✅ Event deleted successfully!' });
      setDeleteConfirm(null);
      refetch();
    } catch (err: any) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleDayClick = (date: string) => {
    setFormData(prev => ({
      ...prev,
      start_date: date,
      end_date: date,
    }));
    setShowForm(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // ============================================
  // HELPERS
  // ============================================

  const formatDate = (date: string): string => {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getEventBadge = (type: string) => {
    const config = EVENT_TYPES[type as keyof typeof EVENT_TYPES];
    if (!config) return null;
    
    return (
      <Badge variant={config.color} icon={<span>{config.emoji}</span>}>
        {config.label}
      </Badge>
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <LoadingState 
        icon={<CalendarIcon className="h-12 w-12 text-blue-600" />}
        message="Loading events..."
      />
    );
  }

  // ============================================
  // NO SCHOOL STATE
  // ============================================

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<CalendarIcon className="h-16 w-16 text-yellow-600" />}
        title="No School Registered"
        description="Please contact the administrator to set up your school."
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <PageModel>
      {/* Messages */}
      {message && (
        <MessageAlert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Error */}
      {eventsError && (
        <MessageAlert
          type="error"
          message={extractErrorMessage(eventsError)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar & Events</h1>
          <p className="text-gray-600 mt-1">Manage your schedule and events</p>
        </div>
        
        {/* ✅ View Toggle Button */}
        <ViewToggle
          viewMode={viewMode}
          onToggle={toggleViewMode}
          gridLabel="Calendar view"
          listLabel="List view"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-100 text-blue-700 p-4 rounded-lg shadow-md">
          <p className="text-sm font-semibold opacity-80">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          <p className="text-sm font-semibold opacity-80">Holidays</p>
          <p className="text-3xl font-bold">{stats.holiday}</p>
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-lg shadow-md">
          <p className="text-sm font-semibold opacity-80">Exams</p>
          <p className="text-3xl font-bold">{stats.exam}</p>
        </div>
        <div className="bg-purple-100 text-purple-700 p-4 rounded-lg shadow-md">
          <p className="text-sm font-semibold opacity-80">Graduations</p>
          <p className="text-3xl font-bold">{stats.graduation}</p>
        </div>
        <div className="bg-orange-100 text-orange-700 p-4 rounded-lg shadow-md">
          <p className="text-sm font-semibold opacity-80">Cultural</p>
          <p className="text-3xl font-bold">{stats.cultural}</p>
        </div>
      </div>

      {/* ✅ Conditional Rendering: Calendar OR List */}
      {viewMode === 'grid' ? (
        <CalendarView
          events={filteredEvents}
          onDayClick={handleDayClick}
          eventColors={EVENT_COLORS}
        />
      ) : (
        <>
          {/* Filters - Only show in list view */}
          <FilterBar
            fields={[
              {
                type: 'search',
                name: 'search',
                placeholder: 'Search events...',
                value: searchTerm,
                onChange: setSearchTerm,
                icon: <Search className="absolute left-3 top-3 text-gray-400" size={20} />,
              },
              {
                type: 'select',
                name: 'type',
                value: typeFilter,
                onChange: setTypeFilter,
                options: [
                  { label: 'All Types', value: 'all' },
                  { label: '📌 Holiday', value: 'holiday' },
                  { label: '📝 Exam', value: 'exam' },
                  { label: '🎓 Graduation', value: 'graduation' },
                  { label: '🎉 Cultural', value: 'cultural' },
                ],
              },
              {
                type: 'date',
                name: 'start_date',
                value: startDateFilter,
                onChange: setStartDateFilter,
              },
              {
                type: 'date',
                name: 'end_date',
                value: endDateFilter,
                onChange: setEndDateFilter,
              },
            ]}
            actions={[
              {
                label: 'New Event',
                onClick: () => setShowForm(true),
                icon: <Plus size={18} />,
                variant: 'primary',
              },
            ]}
            onClear={handleClearFilters}
          />

          {/* Events List */}
          <EventsList
            events={filteredEvents}
            onEdit={handleEdit}
            onDelete={setDeleteConfirm}
            formatDate={formatDate}
            getEventBadge={getEventBadge}
          />
        </>
      )}

      {/* Form Modal */}
      {showForm && (
        <FormModal
          isOpen={showForm}
          title={editingEvent ? '✏️ Edit Event' : '➕ New Event'}
          onClose={resetForm}
          size="lg"
        >
          <EventForm
            formData={formData}
            setFormData={setFormData}
            hasMultipleSchools={hasMultipleSchools}
            schools={schools}
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
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </PageModel>
  );
}

// ============================================
// EVENT FORM COMPONENT
// ============================================

interface EventFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  hasMultipleSchools: boolean;
  schools: any[];
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

function EventForm({
  formData,
  setFormData,
  hasMultipleSchools,
  schools,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}: EventFormProps) {
  return (
    <div className="space-y-4">
      {/* School Selection (if multiple) */}
      {hasMultipleSchools && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">School *</label>
          <select
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: parseInt(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            {schools.map(school => (
              <option key={school.id} value={school.id}>
                {school.school_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">End Date *</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Title *</label>
        <input
          type="text"
          placeholder="Ex: Final Exams"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          placeholder="Event details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Type *</label>
        <select
          value={formData.event_type}
          onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="holiday">📌 Holiday</option>
          <option value="exam">📝 Exam</option>
          <option value="graduation">🎓 Graduation</option>
          <option value="cultural">🎉 Cultural Event</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}