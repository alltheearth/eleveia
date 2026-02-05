// src/pages/FAQs/index.tsx
// 💬 PÁGINA DE FAQs - VERSÃO PROFISSIONAL

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  extractErrorMessage,
  type FAQ,
} from '../../services';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import FAQStats from './components/FAQStats';
import FAQFilters from './components/FAQFilters';
import FAQGridView from './components/FAQGridView';
import FAQListView from './components/FAQListView';
import FAQAccordionView from './components/FAQAccordionView';
import { ListPageHeader } from '../../components/layout/PageHeader';
import PageModel from '../../components/layout/PageModel';

// ============================================
// CONSTANTS
// ============================================

const CATEGORIES: FAQ['category'][] = [
  'General',
  'Admission',
  'Pricing',
  'Uniform',
  'Schedule',
  'Documentation',
  'Activities',
  'Meals',
  'Transport',
  'Pedagogical',
];

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

// ============================================
// MAIN COMPONENT
// ============================================

export default function FAQsPage() {
  const { currentSchool, currentSchoolId, isLoading: schoolsLoading } = useCurrentSchool();

  // ============================================
  // STATE
  // ============================================

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FAQ['status']>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FAQ['category']>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'accordion'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: 'General',
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
    refetch,
  } = useGetFAQsQuery({});

  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  // ============================================
  // COMPUTED
  // ============================================

  const filteredFAQs = useMemo(() => {
    if (!faqsData?.results) return [];

    return faqsData.results.filter((faq) => {
      const matchesSearch =
        searchTerm === '' ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || faq.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [faqsData?.results, searchTerm, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const allFAQs = faqsData?.results || [];
    
    // Calcular distribuição por categoria
    const byCategory = allFAQs.reduce((acc, faq) => {
      acc[faq.category] = (acc[faq.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // FAQs atualizadas nos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyUpdated = allFAQs.filter(
      (faq) => new Date(faq.updated_at) > sevenDaysAgo
    ).length;

    return {
      total: allFAQs.length,
      active: allFAQs.filter((f) => f.status === 'active').length,
      inactive: allFAQs.filter((f) => f.status === 'inactive').length,
      byCategory,
      recentlyUpdated,
    };
  }, [faqsData?.results]);

  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'all' || statusFilter !== 'all';

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (currentSchoolId && !editingFAQ) {
      setFormData((prev) => ({ ...prev, school: parseInt(currentSchoolId) }));
    }
  }, [currentSchoolId, editingFAQ]);

  // ============================================
  // HANDLERS
  // ============================================

  const resetForm = (): void => {
    setFormData({
      question: '',
      answer: '',
      category: 'General',
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
      toast.error(error);
      return;
    }

    try {
      if (editingFAQ) {
        await updateFAQ({ id: editingFAQ.id, data: formData }).unwrap();
        toast.success('✅ FAQ atualizada com sucesso!');
      } else {
        await createFAQ(formData).unwrap();
        toast.success('✅ FAQ criada com sucesso!');
      }
      resetForm();
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
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
      toast.success('✅ FAQ deletada com sucesso!');
      setFaqToDelete(null);
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleStatusChange = async (faq: FAQ, newStatus: FAQ['status']): Promise<void> => {
    try {
      await updateFAQ({
        id: faq.id,
        data: { ...faq, status: newStatus },
      }).unwrap();
      toast.success('✅ Status atualizado!');
      refetch();
    } catch (err) {
      toast.error(`❌ ${extractErrorMessage(err)}`);
    }
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const handleRefresh = (): void => {
    refetch();
    toast.success('🔄 Dados atualizados!');
  };

  // ============================================
  // RENDER - LOADING
  // ============================================

  if (faqsLoading || schoolsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando FAQs...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - NO SCHOOL
  // ============================================

  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <HelpCircle className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma escola cadastrada</h2>
          <p className="text-gray-600">Entre em contato com o administrador.</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - MAIN
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">


    <PageModel>

      <ListPageHeader
        title="Gestão de FAQs"
        subtitle="Gerencie perguntas frequentes da sua escola"
        icon={<HelpCircle size={16} />}
        // onExport={handleExport}
        // onRefresh={handleRefresh}
        // isExporting={isExporting}
        // isRefreshing={isLoading}
      />
        {/* Stats */}
        <FAQStats stats={stats} loading={faqsLoading} />

        {/* Filters */}
        <FAQFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewFAQ={() => setShowForm(true)}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Views */}
        {viewMode === 'grid' && (
          <FAQGridView
            faqs={filteredFAQs}
            onEdit={handleEdit}
            onDelete={setFaqToDelete}
            onStatusChange={handleStatusChange}
            loading={faqsLoading}
          />
        )}

        {viewMode === 'list' && (
          <FAQListView
            faqs={filteredFAQs}
            onEdit={handleEdit}
            onDelete={setFaqToDelete}
            onStatusChange={handleStatusChange}
            loading={faqsLoading}
          />
        )}

        {viewMode === 'accordion' && (
          <FAQAccordionView
            faqs={filteredFAQs}
            onEdit={handleEdit}
            onDelete={setFaqToDelete}
            onStatusChange={handleStatusChange}
            loading={faqsLoading}
          />
        )}

        {/* Results Info */}
        {filteredFAQs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 p-4 rounded-lg border border-blue-200"
          >
            <p className="text-gray-700 font-semibold">
              Mostrando <span className="text-blue-600 font-bold">{filteredFAQs.length}</span> de{' '}
              <span className="text-blue-600 font-bold">{stats.total}</span> FAQs
              {hasActiveFilters && <span className="text-gray-600 text-sm ml-2">(filtrado)</span>}
            </p>
          </motion.div>
        )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingFAQ ? '✏️ Editar FAQ' : '➕ Nova FAQ'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingFAQ ? 'Atualize as informações' : 'Preencha os dados'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Question */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Pergunta * (mín. 10 caracteres)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Como funciona a matrícula?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-sm text-gray-500 mt-1">{formData.question.length} caracteres</p>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Resposta * (mín. 20 caracteres)
                </label>
                <textarea
                  placeholder="Digite a resposta completa..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-sm text-gray-500 mt-1">{formData.answer.length} caracteres</p>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as FAQ['category'] })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as FAQ['status'] })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="active">✅ Ativa</option>
                    <option value="inactive">⛔ Inativa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? editingFAQ
                    ? 'Atualizando...'
                    : 'Criando...'
                  : editingFAQ
                  ? 'Atualizar'
                  : 'Criar FAQ'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {faqToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar a FAQ "<strong>{faqToDelete.question}</strong>"? Esta
              ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setFaqToDelete(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </PageModel>
    </div>
  );
}