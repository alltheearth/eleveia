import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar as Cal, ChevronLeft, ChevronRight, AlertCircle, X, Save } from 'lucide-react';
import Calendar from '../../components/common/Calendar';

// ============================================
// TYPES
// ============================================

interface Event {
  id: number;
  school: number;
  school_name: string;
  start_date: string;
  end_date: string;
  title: string;
  description: string;
  event_type: 'holiday' | 'exam' | 'graduation' | 'cultural';
  event_type_display: string;
  duration_days: number;
  is_single_day: boolean;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

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

// Mock hooks (replace with real ones)
const useCurrentSchool = () => ({
  currentSchool: { id: 1, school_name: 'School ABC' },
  currentSchoolId: '1',
  schools: [{ id: 1, school_name: 'School ABC' }],
  hasMultipleSchools: false,
  isLoading: false,
  isError: false,
  error: null,
  setCurrentSchoolById: (_id: string) => {},
  refetch: () => {},
});

const mockEvents: Event[] = [
  {
    id: 1,
    school: 1,
    school_name: 'School ABC',
    start_date: '2026-02-01',
    end_date: '2026-02-01',
    title: 'Winter Break',
    description: 'School holiday',
    event_type: 'holiday',
    event_type_display: '📌 Holiday',
    duration_days: 1,
    is_single_day: true,
    created_by: 1,
    created_by_name: 'admin',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 2,
    school: 1,
    school_name: 'School ABC',
    start_date: '2026-02-15',
    end_date: '2026-02-17',
    title: 'Final Exams',
    description: 'Math, Science, English',
    event_type: 'exam',
    event_type_display: '📝 Exam',
    duration_days: 3,
    is_single_day: false,
    created_by: 1,
    created_by_name: 'admin',
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
  },
];

export default function EventsPage() {
  const { currentSchool, currentSchoolId, hasMultipleSchools, schools } = useCurrentSchool();

  // State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [formData, setFormData] = useState<FormData>({
    start_date: '',
    end_date: '',
    title: '',
    description: '',
    event_type: 'holiday',
    school: parseInt(currentSchoolId),
  });

  // Mock data (replace with real API calls)
  const events: Event[] = mockEvents;
  const isLoading = false;

  const calendarEvents = events.filter(e => {
    const eventStart = new Date(e.start_date);
    const eventEnd = new Date(e.end_date);
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return eventStart <= monthEnd && eventEnd >= monthStart;
  });

  // Stats
  const stats = {
    total: events.length,
    holiday: events.filter(e => e.event_type === 'holiday').length,
    exam: events.filter(e => e.event_type === 'exam').length,
    graduation: events.filter(e => e.event_type === 'graduation').length,
    cultural: events.filter(e => e.event_type === 'cultural').length,
  };

  // Clear message after 5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Reset form
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

  // Validate
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

  // Submit
  const handleSubmit = (): void => {
    const error = validate();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    if (editingEvent) {
      setMessage({ type: 'success', text: '✅ Event updated successfully!' });
    } else {
      setMessage({ type: 'success', text: '✅ Event created successfully!' });
    }
    resetForm();
  };

  // Edit
  const handleEdit = (event: Event): void => {
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
  };

  // Delete
  const handleDelete = (): void => {
    setMessage({ type: 'success', text: '✅ Event deleted successfully!' });
    setDeleteConfirm(null);
  };

  // Format date
  const formatDate = (date: string): string => {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

   {/* Calendar */}
      <Calendar 
        events={calendarEvents}
        onDayClick={handleDayClick}
      />

  // Handle day click on calendar
  function handleDayClick(date: string) {
    // Example: open the form modal with the selected date pre-filled
    setFormData(prev => ({
      ...prev,
      start_date: date,
      end_date: date,
    }));
    setShowForm(true);
  }

  // Filter events
  const filteredEvents: Event[] = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || e.event_type === typeFilter;
    
    let matchDateRange = true;
    if (startDateFilter) {
      matchDateRange = matchDateRange && e.end_date >= startDateFilter;
    }
    if (endDateFilter) {
      matchDateRange = matchDateRange && e.start_date <= endDateFilter;
    }
    
    return matchSearch && matchType && matchDateRange;
  });

  // Calendar
  const monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getEventsOnDate = (date: number): Event[] => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(e => {
      return dateStr >= e.start_date && dateStr <= e.end_date;
    });
  };



  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Cal className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Messages */}
            {message && (
              <div className={`p-4 rounded-lg border-l-4 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{message.text}</span>
                  <button onClick={() => setMessage(null)}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

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

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="all">All Types</option>
                  <option value="holiday">Holiday</option>
                  <option value="exam">Exam</option>
                  <option value="graduation">Graduation</option>
                  <option value="cultural">Cultural</option>
                </select>

                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  placeholder="Start Date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />

                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  placeholder="End Date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />

                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Plus size={18} />
                  New Event
                </button>
              </div>
            </div>

            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingEvent ? '✏️ Edit Event' : '➕ New Event'}
                    </h3>
                    <button onClick={resetForm}>
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
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

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Type *</label>
                      <select
                        value={formData.event_type}
                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value as 'holiday' | 'exam' | 'graduation' | 'cultural' })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        <option value="holiday">📌 Holiday</option>
                        <option value="exam">📝 Exam</option>
                        <option value="graduation">🎓 Graduation</option>
                        <option value="cultural">🎉 Cultural Event</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        <Save size={20} />
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="p-4 text-left font-bold text-gray-900">Start Date</th>
                    <th className="p-4 text-left font-bold text-gray-900">End Date</th>
                    <th className="p-4 text-left font-bold text-gray-900">Title</th>
                    <th className="p-4 text-left font-bold text-gray-900">Type</th>
                    <th className="p-4 text-left font-bold text-gray-900">Duration</th>
                    <th className="p-4 text-left font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{formatDate(event.start_date)}</td>
                        <td className="p-4 font-medium">{formatDate(event.end_date)}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            {event.description && (
                              <p className="text-sm text-gray-600">{event.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {event.event_type_display}
                          </span>
                        </td>
                        <td className="p-4">
                          {event.duration_days} {event.duration_days === 1 ? 'day' : 'days'}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(event)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        <Cal className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                        <p className="font-semibold">No events found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="text-red-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}