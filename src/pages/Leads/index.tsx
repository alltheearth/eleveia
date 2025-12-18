// src/pages/Leads/index.tsx - ✅ CORRIGIDO
import { useState, useEffect, type ChangeEvent } from 'react';
import { 
  useGetLeadsQuery, 
  useGetLeadStatsQuery,
  useCreateLeadMutation, 
  useUpdateLeadMutation, 
  useDeleteLeadMutation,
  useChangeLeadStatusMutation,
  useExportLeadsCSVMutation,
  extractErrorMessage,
  type Lead,
  type LeadFilters
} from '../../services';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import { Download, Trash2, Plus, X, AlertCircle, Search, Users as UsersIcon } from 'lucide-react';

interface NovoLead {
  nome: string;
  email: string;
  telefone: string;
  status: 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';
  origem: string;
  observacoes?: string;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

type StatusFilter = 'todos' | 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';

export default function Leads() {
  // ✅ Hook customizado - gerencia escola
  const { 
    currentSchool, 
    currentSchoolId, 
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ✅ Estados
  const [filtroStatus, setFiltroStatus] = useState<StatusFilter>('todos');
  const [buscaTexto, setBuscaTexto] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [editandoLead, setEditandoLead] = useState<Lead | null>(null);
  const [leadParaDeletar, setLeadParaDeletar] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const [novoLead, setNovoLead] = useState<NovoLead>({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo',
    origem: 'site',
    observacoes: '',
  });

  // ✅ Preparar filtros para API
  const filters: LeadFilters = {
    search: buscaTexto || undefined,
    status: filtroStatus !== 'todos' ? filtroStatus : undefined,
  };

  // ✅ RTK Query Hooks
  const { 
    data: leadsData, 
    isLoading: leadsLoading, 
    error: leadsError,
    refetch 
  } = useGetLeadsQuery(filters);

  const { data: stats } = useGetLeadStatsQuery();

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [mudarStatus] = useChangeLeadStatusMutation();
  const [exportarCSV, { isLoading: isExporting }] = useExportLeadsCSVMutation();

  // ✅ Limpar mensagens automaticamente
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // ✅ Reset form
  const resetForm = () => {
    setNovoLead({
      nome: '',
      email: '',
      telefone: '',
      status: 'novo',
      origem: 'site',
      observacoes: '',
    });
    setEditandoLead(null);
    setMostrarFormulario(false);
  };

  // ✅ Carregar dados para edição
  const iniciarEdicao = (lead: Lead) => {
    setNovoLead({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      status: lead.status,
      origem: lead.origem,
      observacoes: lead.observacoes || '',
    });
    setEditandoLead(lead);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Validação
  const validarFormulario = (): string | null => {
    if (!novoLead.nome.trim()) return 'Nome é obrigatório';
    if (novoLead.nome.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
    if (!novoLead.email.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoLead.email)) return 'Email inválido';
    if (!novoLead.telefone.trim()) return 'Telefone é obrigatório';
    return null;
  };

  // ✅ CRIAR novo lead
  const adicionarLead = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await createLead({
        ...novoLead,
        escola: parseInt(currentSchoolId),
      }).unwrap();
      
      setMensagem({ tipo: 'sucesso', texto: '✅ Lead adicionado com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ ATUALIZAR lead
  const atualizarLead = async () => {
    if (!editandoLead) return;

    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await updateLead({ 
        id: editandoLead.id, 
        data: {
          ...novoLead,
          escola: parseInt(currentSchoolId),
        }
      }).unwrap();
      
      setMensagem({ tipo: 'sucesso', texto: '✅ Lead atualizado com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ DELETAR lead
  const confirmarDelecao = (id: number) => {
    setLeadParaDeletar(id);
  };

  const executarDelecao = async () => {
    if (!leadParaDeletar) return;

    try {
      await deleteLead(leadParaDeletar).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Lead deletado com sucesso!' });
      setLeadParaDeletar(null);
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ ATUALIZAR STATUS
  const atualizarStatus = async (id: number, novoStatus: Lead['status']) => {
    try {
      await mudarStatus({ id, status: novoStatus }).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Status atualizado!' });
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ EXPORTAR CSV
  const handleExportarCSV = async () => {
    try {
      const blob = await exportarCSV().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${currentSchool?.nome_escola || 'escola'}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMensagem({ tipo: 'sucesso', texto: '✅ CSV exportado com sucesso!' });
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: '❌ Erro ao exportar CSV' });
    }
  };

  // ✅ Formatar data
  const formatarData = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ Get color do status
  const getStatusColor = (status: Lead['status']): string => {
    const colors: Record<Lead['status'], string> = {
      'novo': 'bg-blue-100 text-blue-700',
      'contato': 'bg-yellow-100 text-yellow-700',
      'qualificado': 'bg-purple-100 text-purple-700',
      'conversao': 'bg-green-100 text-green-700',
      'perdido': 'bg-red-100 text-red-700'
    };
    return colors[status];
  };

  // ✅ LOADING
  if (leadsLoading || schoolsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <UsersIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando leads...</p>
        </div>
      </div>
    );
  }

  // ✅ Sem escola cadastrada
  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <UsersIcon className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma escola cadastrada</h2>
          <p className="text-gray-600">Você precisa cadastrar uma escola antes de gerenciar leads.</p>
        </div>
      </div>
    );
  }

  const leads = leadsData?.results || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

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
            {leadsError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Erro: {extractErrorMessage(leadsError)}</span>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Total" value={stats.total} color="bg-gray-100 text-gray-700" />
                <StatCard label="Novos" value={stats.novo} color="bg-blue-100 text-blue-700" />
                <StatCard label="Em Contato" value={stats.contato} color="bg-yellow-100 text-yellow-700" />
                <StatCard label="Qualificados" value={stats.qualificado} color="bg-purple-100 text-purple-700" />
                <StatCard label="Conversão" value={stats.conversao} color="bg-green-100 text-green-700" />
                <StatCard label="Perdidos" value={stats.perdido} color="bg-red-100 text-red-700" />
              </div>
            )}

            {/* Filtros e Ações */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
                <div className="flex gap-2 flex-1 w-full md:w-auto relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar por nome ou email..." 
                    value={buscaTexto}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBuscaTexto(e.target.value)}
                    className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <select 
                  value={filtroStatus}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFiltroStatus(e.target.value as StatusFilter)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novo</option>
                  <option value="contato">Em Contato</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="conversao">Conversão</option>
                  <option value="perdido">Perdido</option>
                </select>

                <button 
                  onClick={handleExportarCSV}
                  disabled={isExporting || leads.length === 0}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} /> {isExporting ? 'Exportando...' : 'Exportar'}
                </button>

                <button 
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Plus size={20} />
                  Novo Lead
                </button>
              </div>
            </div>

            {/* Formulário Novo/Editar Lead */}
            {mostrarFormulario && (
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editandoLead ? '✏️ Editar Lead' : '➕ Adicionar Novo Lead'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nome *</label>
                    <input 
                      type="text"
                      placeholder="Nome completo"
                      value={novoLead.nome}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoLead({...novoLead, nome: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input 
                      type="email"
                      placeholder="email@example.com"
                      value={novoLead.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoLead({...novoLead, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
                    <input 
                      type="tel"
                      placeholder="(11) 99999-0000"
                      value={novoLead.telefone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoLead({...novoLead, telefone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Origem</label>
                    <select 
                      value={novoLead.origem}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setNovoLead({...novoLead, origem: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="site">Site</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="indicacao">Indicação</option>
                      <option value="ligacao">Ligação</option>
                      <option value="email">Email</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Observações</label>
                  <textarea
                    placeholder="Informações adicionais sobre o lead..."
                    value={novoLead.observacoes}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNovoLead({...novoLead, observacoes: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex gap-2">
                  {editandoLead ? (
                    <button 
                      onClick={atualizarLead}
                      disabled={isUpdating}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                    >
                      {isUpdating ? 'Atualizando...' : 'Atualizar Lead'}
                    </button>
                  ) : (
                    <button 
                      onClick={adicionarLead}
                      disabled={isCreating}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                    >
                      {isCreating ? 'Adicionando...' : 'Salvar Lead'}
                    </button>
                  )}
                  
                  <button 
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabela de Leads */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="p-3 text-left font-bold text-gray-900">#</th>
                    <th className="p-3 text-left font-bold text-gray-900">Nome</th>
                    <th className="p-3 text-left font-bold text-gray-900">Email</th>
                    <th className="p-3 text-left font-bold text-gray-900">Telefone</th>
                    <th className="p-3 text-left font-bold text-gray-900">Status</th>
                    <th className="p-3 text-left font-bold text-gray-900">Origem</th>
                    <th className="p-3 text-left font-bold text-gray-900">Data</th>
                    <th className="p-3 text-left font-bold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-900 font-semibold">{lead.id}</td>
                        <td className="p-3 text-gray-900 font-medium">{lead.nome}</td>
                        <td className="p-3 text-gray-700">{lead.email}</td>
                        <td className="p-3 text-gray-700">{lead.telefone}</td>
                        <td className="p-3">
                          <select 
                            value={lead.status}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                              atualizarStatus(lead.id, e.target.value as Lead['status'])
                            }
                            className={`${getStatusColor(lead.status)} px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none`}
                          >
                            <option value="novo">Novo</option>
                            <option value="contato">Em Contato</option>
                            <option value="qualificado">Qualificado</option>
                            <option value="conversao">Conversão</option>
                            <option value="perdido">Perdido</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {lead.origem_display}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">{formatarData(lead.criado_em)}</td>
                        <td className="p-3 flex gap-2">
                          <button 
                            onClick={() => iniciarEdicao(lead)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => confirmarDelecao(lead.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        <UsersIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                        <p className="font-semibold">Nenhum lead encontrado</p>
                        <p className="text-sm">
                          {buscaTexto || filtroStatus !== 'todos'
                            ? 'Tente ajustar os filtros de busca'
                            : 'Adicione o primeiro lead'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Info de Resultados */}
            {leads.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 font-semibold">
                  Mostrando <span className="text-blue-600 font-bold">{leads.length}</span> de{' '}
                  <span className="text-blue-600 font-bold">{stats?.total || 0}</span> leads
                  {stats && stats.taxa_conversao > 0 && (
                    <span className="ml-4">
                      | Taxa de conversão: <span className="text-green-600 font-bold">{stats.taxa_conversao}%</span>
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Confirmação de Deleção */}
      {leadParaDeletar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar este lead? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLeadParaDeletar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={executarDelecao}
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

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className={`${color} p-3 rounded-lg shadow-md text-center`}>
      <p className="text-xs font-semibold opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}