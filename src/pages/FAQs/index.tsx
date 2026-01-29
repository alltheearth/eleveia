// src/pages/FAQs/index.tsx - ✅ VERSÃO FINAL COM TIPOS CORRIGIDOS
import { Edit2, HelpCircle, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { 
  ConfirmDialog, 
  DataTable, 
  EmptyState, 
  FilterBar, 
  FormModal, 
  LoadingState, 
  MessageAlert 
} from "../../components/common";
import StatCard from "../../components/common/Statistics/StatCard";
import PageModel from "../../components/layout/PageModel";
import { useCurrentSchool } from "../../hooks/useCurrentSchool";
import { 
  extractErrorMessage,
  useCreateFAQMutation,
  useDeleteFAQMutation,
  useGetFAQsQuery,
  useUpdateFAQMutation,
  type FAQ, 
} from '../../services';

// ============================================
// UTILS
// ============================================

const FAQ_STATUS_STYLES: Record<FAQ['status'], string> = {
  active: 'bg-green-100 text-green-700 border-green-300',
  inactive: 'bg-orange-100 text-orange-700 border-orange-300',
};

const FAQ_STATUS_LABELS: Record<FAQ['status'], string> = {
  active: 'Ativa',
  inactive: 'Inativa',
};

const CATEGORY_COLORS: Record<FAQ['category'], 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange'> = {
  General: 'gray',
  Admission: 'blue',
  Pricing: 'green',
  Uniform: 'purple',
  Schedule: 'orange',
  Documentation: 'blue',
  Activities: 'yellow',
  Meals: 'orange',
  Transport: 'purple',
  Pedagogical: 'red',
};

// ============================================
// TYPES
// ============================================

interface FAQFormData {
  question: string;
  answer: string;
  category: FAQ['category'];
  status: FAQ['status'];
  school: number;
}

interface StatusSelectProps {
  value: FAQ['status'];
  onChange: (status: FAQ['status']) => void;
  disabled?: boolean;
}

interface CategoryBadgeProps {
  category: FAQ['category'];
}

interface FAQFormProps {
  formData: FAQFormData;
  onChange: (field: keyof FAQFormData, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

// ============================================
// SUB-COMPONENTS
// ============================================

const StatusSelect: React.FC<StatusSelectProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FAQ['status'])}
      disabled={disabled}
      className={`
        ${FAQ_STATUS_STYLES[value]}
        px-3 py-1 rounded-full font-semibold text-sm 
        border-2 cursor-pointer 
        focus:outline-none focus:ring-2 focus:ring-blue-300 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all
      `}
    >
      <option value="active">✅ {FAQ_STATUS_LABELS.active}</option>
      <option value="inactive">⛔ {FAQ_STATUS_LABELS.inactive}</option>
    </select>
  );
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const color = CATEGORY_COLORS[category];
  
  const colorClasses: Record<typeof color, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold px-3 py-1 text-sm ${colorClasses[color]}`}>
      {category}
    </span>
  );
};

const FAQForm: React.FC<FAQFormProps> = ({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  isEditing = false 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Pergunta * (mín. 10 caracteres)
        </label>
        <input
          type="text"
          placeholder="Ex: Como funciona a matrícula?"
          value={formData.question}
          onChange={(e) => onChange('question', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <p className="text-sm text-gray-500 mt-1">{formData.question.length} caracteres</p>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Resposta * (mín. 20 caracteres)
        </label>
        <textarea
          placeholder="Digite a resposta completa..."
          value={formData.answer}
          onChange={(e) => onChange('answer', e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <p className="text-sm text-gray-500 mt-1">{formData.answer.length} caracteres</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value as FAQ['category'])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="General">Geral</option>
            <option value="Admission">Matrícula</option>
            <option value="Pricing">Mensalidade</option>
            <option value="Uniform">Uniforme</option>
            <option value="Schedule">Horários</option>
            <option value="Documentation">Documentação</option>
            <option value="Activities">Atividades</option>
            <option value="Meals">Alimentação</option>
            <option value="Transport">Transporte</option>
            <option value="Pedagogical">Pedagógico</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => onChange('status', e.target.value as FAQ['status'])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="active">✅ Ativa</option>
            <option value="inactive">⛔ Inativa</option>
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
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar' : 'Criar FAQ')
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
};

// ============================================
// MAIN COMPONENT
// ============================================

const FAQsPage: React.FC = () => {
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FAQ['status']>('all');
  // const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "General",
    status: 'active',
    school: parseInt(currentSchoolId) || 0,
  });

  // ============================================
  // API
  // ============================================

  const { 
    data: faqsData, 
    isLoading: faqsLoading, 
    error: fetchError,
    refetch 
  } = useGetFAQsQuery({
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();
  
  // ============================================
  // COMPUTED
  // ============================================

  const faqs = faqsData?.results || [];

  const stats = {
    total: faqs.length,
    active: faqs.filter(f => f.status === 'active').length,
    inactive: faqs.filter(f => f.status === 'inactive').length,
  };

  // ============================================
  // EFFECTS
  // ============================================

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

  // ============================================
  // HANDLERS
  // ============================================

  const resetForm = (): void => {
    setFormData({
      question: "",
      answer: "",
      category: "General",
      status: 'active',
      school: parseInt(currentSchoolId) || 0,
    });
    setEditingFAQ(null);
    setShowForm(false);
  };

  const validate = (): string | null => {
    if (!formData.question.trim()) return 'Pergunta é obrigatória';
    if (formData.question.trim().length < 10) return 'Pergunta deve ter no mínimo 10 caracteres';
    if (!formData.answer.trim()) return 'Resposta é obrigatória';
    if (formData.answer.trim().length < 20) return 'Resposta deve ter no mínimo 20 caracteres';
    return null;
  };

  const handleSubmit = async (): Promise<void> => {
    const error = validate();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    try {
      if (editingFAQ) {
        await updateFAQ({ id: editingFAQ.id, data: formData }).unwrap();
        setMessage({ type: 'success', text: '✅ FAQ atualizada com sucesso!' });
      } else {
        await createFAQ(formData).unwrap();
        setMessage({ type: 'success', text: '✅ FAQ criada com sucesso!' });
      }
      resetForm();
      refetch();
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleEdit = (faq: FAQ): void => {
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

  const handleDelete = async (): Promise<void> => {
    if (!faqToDelete) return;

    try {
      await deleteFAQ(faqToDelete.id).unwrap();
      setMessage({ type: 'success', text: '✅ FAQ deletada com sucesso!' });
      setFaqToDelete(null);
      refetch();
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleStatusChange = async (faq: FAQ, newStatus: FAQ['status']): Promise<void> => {
    try {
      await updateFAQ({ 
        id: faq.id, 
        data: { status: newStatus } 
      }).unwrap();
      setMessage({ type: 'success', text: '✅ Status atualizado!' });
      refetch();
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================
  // RENDER - LOADING
  // ============================================

  if (faqsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Carregando FAQs..."
        icon={<HelpCircle size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // RENDER - NO SCHOOL
  // ============================================

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<HelpCircle size={64} className="text-yellow-600" />}
        title="Nenhuma escola cadastrada"
        description="Entre em contato com o administrador."
      />
    );
  }

  // ============================================
  // RENDER - MAIN
  // ============================================

  return (
    <PageModel>
      {/* Alerts */}
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
          message={`Erro: ${extractErrorMessage(fetchError)}`}
          dismissible={false}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-600 mt-1">Gerencie perguntas frequentes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="Total" 
          value={stats.total} 
          color="blue" 
          icon={<HelpCircle size={24} />} 
        />
        <StatCard 
          label="Ativas" 
          value={stats.active} 
          color="green" 
        />
        <StatCard 
          label="Inativas" 
          value={stats.inactive} 
          color="yellow" 
        />
      </div>

      {/* Filters */}
      <FilterBar
        fields={[
          {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar por pergunta ou resposta...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            name: 'status',
            value: statusFilter,
            onChange: (value) => setStatusFilter(value as 'all' | FAQ['status']),
            options: [
              { label: 'Todos os Status', value: 'all' },
              { label: 'Ativas', value: 'active' },
              { label: 'Inativas', value: 'inactive' }
            ],
          }
        ]}
        actions={[
          {
            label: 'Nova FAQ',
            onClick: () => setShowForm(true),
            icon: <Plus size={18} />,
            variant: 'primary',
          },
        ]}
        onClear={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
      />

      {/* Table */}
      <DataTable<FAQ>
        columns={[
          { 
            key: 'id', 
            label: '#', 
            width: '80px', 
            sortable: true 
          },
          { 
            key: 'question', 
            label: 'Pergunta', 
            sortable: true,
            render: (value) => (
              <span className="font-medium text-gray-900">
                {String(value)}
              </span>
            )
          },
          { 
            key: 'answer', 
            label: 'Resposta',
            render: (value) => (
              <span className="text-sm text-gray-600 line-clamp-2">
                {String(value)}
              </span>
            )
          },
          { 
            key: 'category', 
            label: 'Categoria', 
            render: (value) => <CategoryBadge category={value as FAQ['category']} /> 
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (value, row) => (
              <StatusSelect
                value={value as FAQ['status']}
                onChange={(newStatus) => handleStatusChange(row, newStatus)}
              />
            )
          },
          { 
            key: 'created_at', 
            label: 'Criado em',
            sortable: true,
            render: (value) => (
              <span className="text-sm">
                {formatDate(String(value))}
              </span>
            )
          },
        ]}
        data={faqs}
        keyExtractor={(faq) => faq.id.toString()}
        actions={[
          {
            icon: <Edit2 size={18} />,
            onClick: handleEdit,
            variant: 'primary',
            label: 'Editar',
          },
          {
            icon: <Trash2 size={18} />,
            onClick: (faq) => setFaqToDelete(faq),
            variant: 'danger',
            label: 'Deletar',
          },
        ]}
        emptyMessage="Nenhuma FAQ encontrada"
        emptyIcon={<HelpCircle size={48} className="text-gray-400" />}
      />

      {/* Results Info */}
      {faqs.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{faqs.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats.total}</span> FAQs
          </p>
        </div>
      )}

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        title={editingFAQ ? '✏️ Editar FAQ' : '➕ Nova FAQ'}
        subtitle={editingFAQ ? 'Atualize as informações da FAQ' : 'Preencha os dados da nova FAQ'}
        onClose={resetForm}
        size="lg"
      >
        <FAQForm
          formData={formData}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isCreating || isUpdating}
          isEditing={!!editingFAQ}
        />
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!faqToDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar a FAQ "${faqToDelete?.question}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setFaqToDelete(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </PageModel>
  );
};

export default FAQsPage;