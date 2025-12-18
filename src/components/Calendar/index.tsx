// src/components/Calendar/index.tsx - ✅ CORRIGIDO
import { useState, useEffect } from "react";
import { 
  useGetEventsQuery, 
  useCreateEventMutation, 
  useUpdateEventMutation, 
  useDeleteEventMutation,
  extractErrorMessage,
  type Event
} from "../../services";
import { Trash2, Edit2, Plus, Save, X, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useCurrentSchool } from "../../hooks/useCurrentSchool";

interface EventFormData {
  escola: number;
  data: string;
  evento: string;
  tipo: 'feriado' | 'prova' | 'formatura' | 'evento_cultural';
}

export default function Calendar() {
  const { 
    currentSchoolId, 
    currentSchool,
    hasMultipleSchools,
    schools,
    isLoading: schoolsLoading
  } = useCurrentSchool();

  // ✅ RTK Query Hooks
  const { data: eventsData, isLoading: eventsIsLoading, error: eventsError, refetch } = useGetEventsQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  // ✅ Estados
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoEvento, setEditandoEvento] = useState<Event | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [eventoParaDeletar, setEventoParaDeletar] = useState<number | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    escola: parseInt(currentSchoolId),
    data: '',
    evento: '',
    tipo: 'feriado',
  });

  // ✅ Atualizar escola quando mudar
  useEffect(() => {
    if (currentSchoolId && !editandoEvento) {
      setFormData(prev => ({ 
        ...prev, 
        escola: parseInt(currentSchoolId)
      }));
    }
  }, [currentSchoolId, editandoEvento]);

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
      data: '',
      evento: '',
      tipo: 'feriado',
    });
    setEditandoEvento(null);
    setMostrarFormulario(false);
  };

  // ✅ Carregar dados para edição
  const iniciarEdicao = (evento: Event) => {
    setFormData({
      escola: evento.escola,
      data: evento.data,
      evento: evento.evento,
      tipo: evento.tipo,
    });
    setEditandoEvento(evento);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Validação
  const validarFormulario = (): string | null => {
    if (!formData.data) return 'A data é obrigatória';
    if (!formData.evento.trim()) return 'O nome do evento é obrigatório';
    if (formData.evento.trim().length < 3) return 'O nome do evento deve ter no mínimo 3 caracteres';
    return null;
  };

  // ✅ CRIAR novo evento
  const adicionarEvento = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await createEvent(formData).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Evento adicionado com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('Erro ao adicionar evento:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ ATUALIZAR evento
  const atualizarEvento = async () => {
    if (!editandoEvento) return;

    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await updateEvent({ 
        id: editandoEvento.id, 
        data: formData 
      }).unwrap();
      
      setMensagem({ tipo: 'sucesso', texto: '✅ Evento atualizado com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('Erro ao atualizar evento:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ DELETAR evento
  const confirmarDelecao = (id: number) => {
    setEventoParaDeletar(id);
  };

  const deletarEvento = async () => {
    if (!eventoParaDeletar) return;

    try {
      await deleteEvent(eventoParaDeletar).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Evento deletado com sucesso!' });
      setEventoParaDeletar(null);
      refetch();
    } catch (error: any) {
      console.error('Erro ao deletar evento:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ ${extractErrorMessage(error)}` 
      });
    }
  };

  // ✅ Formatar data brasileira
  const formatarDataBrasileira = (data: string): string => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // ✅ Get emoji do tipo
  const getEmojiTipo = (tipo: string): string => {
    const emojis: Record<string, string> = {
      'feriado': '📌',
      'prova': '📝',
      'formatura': '🎓',
      'evento_cultural': '🎉',
    };
    return emojis[tipo] || '📌';
  };

  // ✅ Get label do tipo
  const getLabelTipo = (tipo: string): string => {
    const labels: Record<string, string> = {
      'feriado': 'Feriado',
      'prova': 'Prova/Avaliação',
      'formatura': 'Formatura',
      'evento_cultural': 'Evento Cultural',
    };
    return labels[tipo] || tipo;
  };

  // ✅ Filtrar eventos da escola atual
  const eventosFiltrados = eventsData?.results.filter(
    e => e.escola.toString() === currentSchoolId
  ) || [];

  // ✅ LOADING STATE
  if (eventsIsLoading || schoolsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <CalendarIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  // ✅ Sem escola cadastrada
  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <CalendarIcon className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma escola cadastrada</h2>
          <p className="text-gray-600 mb-6">
            Entre em contato com o administrador.
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

            {/* Mensagens de Sucesso/Erro */}
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
            {eventsError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Erro: {extractErrorMessage(eventsError)}</span>
                </div>
              </div>
            )}

            {/* Botão para adicionar evento */}
            {!mostrarFormulario && (
              <div className="flex justify-end">
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
                >
                  <Plus size={20} />
                  Adicionar Evento
                </button>
              </div>
            )}

            {/* Formulário de Adicionar/Editar */}
            {mostrarFormulario && (
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editandoEvento ? '✏️ Editar Evento' : '➕ Adicionar Novo Evento'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Data *</label>
                      <input
                        type="date"
                        value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Evento *</label>
                      <input
                        type="text"
                        placeholder="Ex: Prova Bimestral"
                        value={formData.evento}
                        onChange={(e) => setFormData({ ...formData, evento: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Tipo *</label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="feriado">📌 Feriado</option>
                        <option value="prova">📝 Prova/Avaliação</option>
                        <option value="formatura">🎓 Formatura</option>
                        <option value="evento_cultural">🎉 Evento Cultural</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {editandoEvento ? (
                      <button
                        onClick={atualizarEvento}
                        disabled={isUpdating}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={20} />
                        {isUpdating ? 'Atualizando...' : 'Atualizar Evento'}
                      </button>
                    ) : (
                      <button
                        onClick={adicionarEvento}
                        disabled={isCreating}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allow"
                      >
                        <Plus size={20} />
                        {isCreating ? 'Adicionando...' : 'Adicionar Evento'}
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

            {/* Tabela de Eventos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="p-4 text-left font-bold text-gray-900">Data</th>
                      <th className="p-4 text-left font-bold text-gray-900">Evento</th>
                      <th className="p-4 text-left font-bold text-gray-900">Tipo</th>
                      <th className="p-4 text-left font-bold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventosFiltrados.length > 0 ? (
                      eventosFiltrados.map((evento) => (
                        <tr key={evento.id} className="border-b hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-900">
                            {formatarDataBrasileira(evento.data)}
                          </td>
                          <td className="p-4 text-gray-700">{evento.evento}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {getEmojiTipo(evento.tipo)} {getLabelTipo(evento.tipo)}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => iniciarEdicao(evento)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm transition"
                            >
                              <Edit2 size={16} />
                              Editar
                            </button>
                            <button
                              onClick={() => confirmarDelecao(evento.id)}
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
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          <CalendarIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                          <p className="font-semibold">Nenhum evento cadastrado</p>
                          <p className="text-sm">Adicione o primeiro evento ao calendário</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info */}
            {eventosFiltrados.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 font-semibold">
                  Total de eventos: <span className="text-blue-600 font-bold">{eventosFiltrados.length}</span>
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Confirmação de Deleção */}
      {eventoParaDeletar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar este evento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEventoParaDeletar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={deletarEvento}
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