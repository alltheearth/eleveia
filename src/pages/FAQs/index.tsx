import PageModel from "../../components/layout/PageModel"
import { Edit2, HelpCircle, Plus, Trash2 } from "lucide-react"
import { Badge, ConfirmDialog, DataTable, EmptyState, FilterBar, FormModal, LoadingState, MessageAlert, StatCard } from "../../components/common"
import { 
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  extractErrorMessage,
  type FAQ, 
  type FAQFilters,
} from '../../services';
import { useCurrentSchool } from "../../hooks/useCurrentSchool";
import { useEffect, useState } from "react";

// Componentes locais
const StatusSelect = ({ value, onChange, disabled = false }: { 
  value: FAQ['status']; 
  onChange: (status: FAQ['status']) => void;
  disabled?: boolean;
}) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-orange-100 text-orange-700',
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FAQ['status'])}
      disabled={disabled}
      className={`${styles[value]} px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50`}
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
};

const CategoryBadge = ({ category }: { category: FAQ['category'] }) => {
  return (
    <Badge variant="blue" size="md">
      {category}
    </Badge>
  );
};

const FAQForm = ({ formData, onChange, onSubmit, onCancel, isLoading, isEditing }: {
  formData: {
    question: string;
    answer: string;
    category: FAQ['category'];
    status: FAQ['status'];
  };
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Question * (min. 10 characters)
        </label>
        <input
          type="text"
          placeholder="Ex: How does admission work?"
          value={formData.question}
          onChange={(e) => onChange('question', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <p className="text-sm text-gray-500 mt-1">{formData.question.length} characters</p>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Answer * (min. 20 characters)
        </label>
        <textarea
          placeholder="Enter the complete answer..."
          value={formData.answer}
          onChange={(e) => onChange('answer', e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <p className="text-sm text-gray-500 mt-1">{formData.answer.length} characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="General">General</option>
            <option value="Admission">Admission</option>
            <option value="Pricing">Pricing</option>
            <option value="Uniform">Uniform</option>
            <option value="Schedule">Schedule</option>
            <option value="Documentation">Documentation</option>
            <option value="Activities">Activities</option>
            <option value="Meals">Meals</option>
            <option value="Transport">Transport</option>
            <option value="Pedagogical">Pedagogical</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="active">✅ Active</option>
            <option value="inactive">⛔ Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
          {isLoading 
            ? (isEditing ? 'Updating...' : 'Creating...')
            : (isEditing ? 'Update' : 'Create FAQ')
          }
        </button>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Componente Principal
const FAQs = () => {
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General" as FAQ['category'],
    status: 'active' as FAQ['status'],
    school: parseInt(currentSchoolId),
  });    

  const filters: FAQFilters = {
    search: searchTerm || undefined,
    status: statusFilter === 'active' ? 'active' : statusFilter === 'inactive' ? 'inactive' : undefined,
  };
  
  const { 
    data: faqsData, 
    isLoading: faqsLoading, 
    error: fetchError,
    refetch 
  } = useGetFAQsQuery(filters);

  const stats = {
    total: faqsData?.results.length || 0,
    active: faqsData?.results.filter(f => f.status === 'active').length || 0,
    inactive: faqsData?.results.filter(f => f.status === 'inactive').length || 0,
  };

  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();
  
  const faqs = faqsData?.results || [];

  useEffect(() => {
    if (currentSchoolId && !editingFAQ) {
      setFormData(prev => ({ ...prev, school: parseInt(currentSchoolId) }));
    }
  }, [currentSchoolId, editingFAQ]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "General",
      status: 'active',
      school: parseInt(currentSchoolId),
    });
    setEditingFAQ(null);
    setShowForm(false);
  };

  const validate = (): string | null => {
    if (!formData.question.trim()) return 'Question is required';
    if (formData.question.trim().length < 10) return 'Question must be at least 10 characters';
    if (!formData.answer.trim()) return 'Answer is required';
    if (formData.answer.trim().length < 20) return 'Answer must be at least 20 characters';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    try {
      if (editingFAQ) {
        await updateFAQ({ id: editingFAQ.id, data: formData }).unwrap();
        setMessage({ type: 'success', text: '✅ FAQ updated successfully!' });
      } else {
        await createFAQ(formData).unwrap();
        setMessage({ type: 'success', text: '✅ FAQ created successfully!' });
      }
      resetForm();
      refetch();
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      status: faq.status,
      school: faq.school,
    });
    setEditingFAQ(faq);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      await deleteFAQ(faqToDelete.id).unwrap();
      setMessage({ type: 'success', text: '✅ FAQ deleted successfully!' });
      setFaqToDelete(null);
      refetch();
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (faqsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Loading FAQs..."
        icon={<HelpCircle size={48} className="text-blue-600" />}
      />
    );
  }

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<HelpCircle size={64} className="text-yellow-600" />}
        title="No FAQs registered"
        description="Contact the administrator."
      />
    );
  }

  return (
    <PageModel>
      {message && (
        <MessageAlert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {fetchError && (
        <MessageAlert
          type="error"
          message={`Error: ${extractErrorMessage(fetchError)}`}
          dismissible={false}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.total} color="blue" icon={<HelpCircle size={24} />} />
        <StatCard label="Active" value={stats.active} color="green" />
        <StatCard label="Inactive" value={stats.inactive} color="yellow" />
      </div>

      <FilterBar
        fields={[
          {
            type: 'search',
            name: 'search',
            placeholder: 'Search by question or answer...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            name: 'category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              { label: 'Admission', value: 'Admission' },
              { label: 'Pricing', value: 'Pricing' },
              { label: 'Uniform', value: 'Uniform' },
              { label: 'Schedule', value: 'Schedule' },
              { label: 'Documentation', value: 'Documentation' },
              { label: 'Activities', value: 'Activities' },
              { label: 'Meals', value: 'Meals' },
              { label: 'Transport', value: 'Transport' },
              { label: 'Pedagogical', value: 'Pedagogical' },
              { label: 'General', value: 'General' },
            ],
          },
          {
            type: 'select',
            name: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ],
          }
        ]}
        actions={[
          {
            label: 'New FAQ',
            onClick: () => setShowForm(true),
            icon: <Plus size={18} />,
            variant: 'primary',
          },
        ]}
        onClear={() => {
          setSearchTerm('');
          setStatusFilter('all');
          setCategoryFilter('all');
        }}
      />

      <DataTable
        columns={[
          { key: 'id', label: '#', width: '80px', sortable: true },
          { 
            key: 'question', 
            label: 'Question', 
            sortable: true,
            render: (value) => <span className="font-medium text-gray-900">{value}</span>
          },
          { 
            key: 'answer', 
            label: 'Answer',
            render: (value) => <span className="text-sm text-gray-600 line-clamp-2">{value}</span>
          },
          { 
            key: 'category', 
            label: 'Category', 
            render: (value) => <CategoryBadge category={value} /> 
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (value, row) => (
              <StatusSelect
                value={value}
                onChange={async (newStatus: FAQ['status']) => {
                  try {
                    await updateFAQ({ id: row.id, data: { ...row, status: newStatus } }).unwrap();
                    setMessage({ type: 'success', text: '✅ Status updated!' });
                    refetch();
                  } catch (err) {
                    setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
                  }
                }}            
              />
            )
          },
          { 
            key: 'created_at', 
            label: 'Created at',
            sortable: true,
            render: (value) => <span className="text-sm">{formatDate(value)}</span>
          },
        ]}
        data={faqs}
        keyExtractor={(faq) => faq.id.toString()}
        actions={[
          {
            icon: <Edit2 size={18} />,
            onClick: handleEdit,
            variant: 'primary',
            label: 'Edit',
          },
          {
            icon: <Trash2 size={18} />,
            onClick: (faq) => setFaqToDelete(faq),
            variant: 'danger',
            label: 'Delete',
          },
        ]}
        emptyMessage="No FAQs found"
        emptyIcon={<HelpCircle size={48} className="text-gray-400" />}
      />

      {faqs.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-semibold">
            Showing <span className="text-blue-600 font-bold">{faqs.length}</span> of{' '}
            <span className="text-blue-600 font-bold">{stats.total}</span> FAQs
          </p>
        </div>
      )}

      <FormModal
        isOpen={showForm}
        title={editingFAQ ? '✏️ Edit FAQ' : '➕ New FAQ'}
        subtitle={editingFAQ ? 'Update FAQ information' : 'Fill in new FAQ data'}
        onClose={resetForm}
        size="lg"
      >
        <FAQForm
          formData={formData}
          onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isCreating || isUpdating}
          isEditing={!!editingFAQ}
        />
      </FormModal>

      <ConfirmDialog
        isOpen={!!faqToDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the FAQ "${faqToDelete?.question}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setFaqToDelete(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </PageModel>
  )
}

export default FAQs;