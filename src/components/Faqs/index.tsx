// src/components/Faqs/index.tsx - ✅ CORRIGIDO
import { useState, useEffect } from "react";
import { 
  useGetFAQsQuery, 
  useCreateFAQMutation, 
  useUpdateFAQMutation, 
  useDeleteFAQMutation,
  extractErrorMessage,
  type FAQ
} from "../../services";
import { useCurrentSchool } from "../../hooks/useCurrentSchool";
import { Trash2, Edit2, Plus, Save, X, MessageSquare, AlertCircle, School, Search } from 'lucide-react';

interface FaqFormData {
  escola: number;
  pergunta: string;
  resposta: string;
  categoria: string;
  status: 'ativa' | 'inativa';
}

const CATEGORIAS = [
  'Admissão',
  'Valores',
  'Uniforme',
  'Horários',
  'Documentação',
  'Atividades',
  'Alimentação',
  'Transporte',
  'Pedagógico',
  'Geral'
];

export default function Faqs() {
  // ✅ Hook customizado - gerencia escola
  const { 
    currentSchool, 
    currentSchoolId, 
    hasMultipleSchools, 
    schools,
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ✅ RTK Query Hooks para FAQs
  const { data: faqsData, isLoading: faqsIsLoading, error: faqsError, refetch } = useGetFAQsQuery({});
  const [createFaq, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFAQMutation();

  // ✅ Estados
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoFaq, setEditandoFaq] = useState<FAQ | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [faqParaDeletar, setFaqParaDeletar] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'inativa'>('todas');

  const [formData, setFormData] = useState<FaqFormData>({
    escola: parseInt(currentSchoolId),
    pergunta: '',
    resposta: '',
    categoria: 'Geral',
    status: 'ativa',
  });

  // ✅ Atualizar escola no form quando mudar
  useEffect(() => {
    if (currentSchoolId && !editandoFaq) {
      setFormData(prev => ({ 
        ...prev, 
        escola: parseInt(currentSchoolId)
      }));
    }
  }, [currentSchoolId, editandoFaq]);

  // ✅ Limpar mensagens automaticamente
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      escola: parseInt(currentSchoolId),
      pergunta: '',
      resposta: '',
      categoria: 'Geral',
      status: 'ativa',
    });
    setEditandoFaq(null);
    setMostrarFormulario(false);
  };

  // ✅ Carregar dados para edição
  const iniciarEdicao = (faq: FAQ) => {
    setFormData({
      escola: faq.escola,
      pergunta: faq.pergunta,
      resposta: faq.resposta,
      categoria: faq.categoria,
      status: faq.status,
    });
    setEditandoFaq(faq);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Validação
  const validarFormulario = (): string | null => {
    if (!formData.pergunta.trim()) return 'A pergunta é obrigatória';
    if (formData.pergunta.trim().length < 10) return 'A pergunta deve ter no mínimo 10 caracteres';
    if (!formData.resposta.trim()) return 'A resposta é obrigatória';
    if (formData.resposta.trim().length < 20) return 'A resposta deve ter no mínimo 20 caracteres';
    return null;
  };

  // ✅ CRIAR FAQ
  const adicionarFaq = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await createFaq(formData).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ FAQ adicionada com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(error)}` });
    }
  };

  // ✅ ATUALIZAR FAQ
  const atualizarFaq = async () => {
    if (!editandoFaq) return;

    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await updateFaq({ id: editandoFaq.id, data: formData }).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ FAQ atualizada com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(error)}` });
    }
  };

  // ✅ DELETAR FAQ
  const deletarFaq = async () => {
    if (!faqParaDeletar) return;

    try {
      await deleteFaq(faqParaDeletar).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ FAQ deletada com sucesso!' });
      setFaqParaDeletar(null);
      refetch();
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(error)}` });
    }
  };

  // ✅ FILTRAR FAQs
  const faqsFiltradas = faqsData?.results
    .filter(f => f.escola.toString() === currentSchoolId)
    .filter(f => {
      const matchBusca = f.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
                         f.resposta.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = filtroCategoria === 'todas' || f.categoria === filtroCategoria;
      const matchStatus = filtroStatus === 'todas' || f.status === filtroStatus;
      return matchBusca && matchCategoria && matchStatus;
    }) || [];

  // ✅ Estatísticas
  const stats = {
    total: faqsData?.results.filter(f => f.escola.toString() === currentSchoolId).length || 0,
    ativas: faqsData?.results.filter(f => f.escola.toString() === currentSchoolId && f.status === 'ativa').length || 0,
    inativas: faqsData?.results.filter(f => f.escola.toString() === currentSchoolId && f.status === 'inativa').length || 0,
  };

  // ✅ LOADING
  if (faqsIsLoading || schoolsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando FAQs...</p>
        </div>
      </div>
    );
  }

  // ✅ Sem escola cadastrada
  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <School className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma escola cadastrada</h2>
          <p className="text-gray-600 mb-6">
            Você precisa cadastrar uma escola antes de adicionar FAQs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Mensagens */}
            {mensagem && (
              <div className={`p-4 rounded-lg border-l-4 ${
                mensagem.tipo === 'sucesso' 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{mensagem.texto}</span>
                  <button onClick={() => setMensagem(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Erro ao carregar */}
            {faqsError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Erro: {extractErrorMessage(faqsError)}</span>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 text-blue-700 p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold opacity-80">Total de FAQs</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-green-100 text-green-700 p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold opacity-80">FAQs Ativas</p>
                <p className="text-3xl font-bold">{stats.ativas}</p>
              </div>
              <div className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold opacity-80">FAQs Inativas</p>
                <p className="text-3xl font-bold">{stats.inativas}</p>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar FAQs..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="todas">Todas as Categorias</option>
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="todas">Todos os Status</option>
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
            </div>

            {/* Botão adicionar */}
            {!mostrarFormulario && (
              <div className="flex justify-end">
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
                >
                  <Plus size={20} />
                  Nova FAQ
                </button>
              </div>
            )}

            {/* Formulário */}
            {mostrarFormulario && (
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editandoFaq ? '✏️ Editar FAQ' : '➕ Nova FAQ'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Campo Escola - só mostra se tiver múltiplas */}
                  {hasMultipleSchools && (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Escola *</label>
                      <select
                        value={formData.escola}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          escola: parseInt(e.target.value)
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      >
                        {schools.map(escola => (
                          <option key={escola.id} value={escola.id}>
                            {escola.nome_escola}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Categoria *</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      >
                        {CATEGORIAS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Status *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="ativa">✅ Ativa</option>
                        <option value="inativa">⛔ Inativa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Pergunta * (mín. 10 caracteres)</label>
                    <input
                      type="text"
                      placeholder="Ex: Como é feita a admissão?"
                      value={formData.pergunta}
                      onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.pergunta.length} caracteres</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Resposta * (mín. 20 caracteres)</label>
                    <textarea
                      placeholder="Digite a resposta completa..."
                      value={formData.resposta}
                      onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.resposta.length} caracteres</p>
                  </div>

                  <div className="flex gap-3">
                    {editandoFaq ? (
                      <button
                        onClick={atualizarFaq}
                        disabled={isUpdating}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                      >
                        <Save size={20} />
                        {isUpdating ? 'Atualizando...' : 'Atualizar'}
                      </button>
                    ) : (
                      <button
                        onClick={adicionarFaq}
                        disabled={isCreating}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                      >
                        <Plus size={20} />
                        {isCreating ? 'Adicionando...' : 'Adicionar'}
                      </button>
                    )}

                    <button
                      onClick={resetForm}
                      className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de FAQs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="p-4 text-left font-bold text-gray-900">#</th>
                      <th className="p-4 text-left font-bold text-gray-900">Pergunta</th>
                      <th className="p-4 text-left font-bold text-gray-900">Categoria</th>
                      <th className="p-4 text-left font-bold text-gray-900">Status</th>
                      <th className="p-4 text-left font-bold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqsFiltradas.length > 0 ? (
                      faqsFiltradas.map((faq) => (
                        <tr key={faq.id} className="border-b hover:bg-gray-50 transition">
                          <td className="p-4 font-semibold text-gray-900">{faq.id}</td>
                          <td className="p-4 text-gray-700 font-medium max-w-md">
                            <p className="truncate">{faq.pergunta}</p>
                            <p className="text-sm text-gray-500 truncate mt-1">{faq.resposta}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {faq.categoria}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              faq.status === 'ativa' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {faq.status === 'ativa' ? '✅ Ativa' : '⛔ Inativa'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => iniciarEdicao(faq)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm transition"
                            >
                              <Edit2 size={16} />
                              Editar
                            </button>
                            <button
                              onClick={() => setFaqParaDeletar(faq.id)}
                              disabled={isDeleting}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:underline font-semibold text-sm transition disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          <MessageSquare className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                          <p className="font-semibold">Nenhuma FAQ encontrada</p>
                          <p className="text-sm">
                            {busca || filtroCategoria !== 'todas' || filtroStatus !== 'todas'
                              ? 'Tente ajustar os filtros de busca'
                              : 'Adicione a primeira FAQ'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info de Resultados */}
            {faqsFiltradas.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 font-semibold">
                  Mostrando <span className="text-blue-600 font-bold">{faqsFiltradas.length}</span> de{' '}
                  <span className="text-blue-600 font-bold">{stats.total}</span> FAQs
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Confirmação */}
      {faqParaDeletar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar esta FAQ? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setFaqParaDeletar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={deletarFaq}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}