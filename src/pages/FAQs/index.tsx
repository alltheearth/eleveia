import PageModel from "../../components/layout/PageModel"
import { Edit2, HelpCircle, Plus, Ticket as TicketIcon, Trash2 } from "lucide-react"

import { Badge, ConfirmDialog, DataTable, EmptyState, FilterBar, FormModal, LoadingState, MessageAlert, ResultsInformation, StatCard }  from "../../components/common"

import { 
        useGetFAQsQuery,
        useGetFAQByIdQuery,
        useCreateFAQMutation,
        useUpdateFAQMutation,
        useDeleteFAQMutation,
        extractErrorMessage,
        type FAQ, 
        type FAQsResponse,
        type FAQFilters,
        type Ticket,
    } from '../../services';


import { useCurrentSchool } from "../../hooks/useCurrentSchool";
import { useEffect, useState } from "react";
import { StatusSelect } from "../../components/FAQs";
import CategoryBadge from "../../components/FAQs/CategoryBadge";
import FAQForm from "../../components/FAQs/FAQForm";

const FAQs = () => {

    const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
    } = useCurrentSchool();
    
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [categoriaFilter, setCategoriaFilter] = useState('todas');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoFAQ, setEditandoFAQ] = useState<FAQ | null>(null);
    const [FAQParaDeletar, setFAQParaDeletar] = useState<FAQ | null>(null);
    const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

    const [formData, setFormData] = useState({
    pergunta: "",
    resposta: "",
    categoria: "Geral",
    status: 'ativa' as FAQ['status'],
    school: parseInt(currentSchoolId),
    });    

    const filters: FAQFilters = {
        search: searchTerm || undefined,
        status: statusFilter === 'ativa' ? 'ativa' : 'inativa',
    };
    
    const { 
    data: faqsData, 
    isLoading: faqsLoading, 
    error: fetchError,
    refetch 
    } = useGetFAQsQuery(filters);


    const converteStats = () => {
    let total = 0;
    let ativa = 0;
    let inativa = 0;
    let pending = 0;
    let resolved = 0;
    let closed = 0;

    faqsData?.results.forEach(faq => {
      total += 1;
      if (faq.status === 'ativa') ativa += 1;
      if (faq.status === 'inativa') inativa += 1;
    });

    return { total, ativa, inativa, pending, resolved, closed };
  }

    const stats = converteStats();

     const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
      const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
      const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();
    //   const [changeStatus] = useChangeFAQStatusMutation();
    //   const [exportCSV, { isLoading: isExporting }] = useExportFAQsCSVMutation();
    
    const faqs = faqsData?.results || [];

    useEffect(() => {
        if (currentSchoolId && !editandoFAQ) {
          setFormData(prev => ({ ...prev, school: parseInt(currentSchoolId) }));
        }
      }, [currentSchoolId, editandoFAQ]);
    
      useEffect(() => {
        if (mensagem) {
          const timer = setTimeout(() => setMensagem(null), 5000);
          return () => clearTimeout(timer);
        }
      }, [mensagem]);

      const resetForm = () => {
    setFormData({
        pergunta: "",
        resposta: "",
        categoria: "Geral" as const,
        status: 'ativa' as FAQ['status'],
        school: parseInt(currentSchoolId),
    });
    setEditandoFAQ(null);
    setMostrarFormulario(false);
  };

   const validarFormulario = (): string | null => {
      if (!formData.pergunta.trim()) return 'Título é obrigatório';
      if (formData.pergunta.trim().length < 5) return 'Título deve ter no mínimo 15 caracteres';
      if (!formData.resposta.trim()) return 'Descrição é obrigatória';
      if (formData.resposta.trim().length < 10) return 'Descrição deve ter no mínimo 10 caracteres';
      return null;
    };
  
    const handleSubmit = async () => {
      const erro = validarFormulario();
      if (erro) {
        setMensagem({ tipo: 'error', texto: erro });
        return;
      }
  
      try {
        if (editandoFAQ) {
          await updateFAQ({ id: editandoFAQ.id, data: { ...formData, categoria: formData.categoria as any } }).unwrap();
          setMensagem({ tipo: 'success', texto: '✅ FAQ atualizado com sucesso!' });
        } else {
          await createFAQ({ ...formData, categoria: formData.categoria as any }).unwrap();
          setMensagem({ tipo: 'success', texto: '✅ FAQ criado com sucesso!' });
        }
        resetForm();
        refetch();
      } catch (err) {
        setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
      }
    };
  
    const handleEditar = (faq: FAQ) => {
      setFormData({
        pergunta: faq.pergunta,
        resposta: faq.resposta,
        categoria: faq.categoria,
        status: faq.status,
        school: parseInt(currentSchoolId),
      });
      setEditandoFAQ(faq);
      setMostrarFormulario(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    const handleDeletar = async () => {
      if (!FAQParaDeletar) return;
  
      try {
        await deleteFAQ(FAQParaDeletar.id).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ FAQ deletada com sucesso!' });
        setFAQParaDeletar(null);
        refetch();
      } catch (err) {
        setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
      }
    };
  
    // const handleMudarStatus = async (id: number, novoStatus: FAQ['status']) => {
    //   try {
    //     await changeStatus({ id, status: novoStatus }).unwrap();
    //     setMensagem({ tipo: 'success', texto: '✅ Status atualizado!' });
    //     refetch();
    //   } catch (err) {
    //     setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    //   }
    // };
  
    // const handleExportar = async () => {
    //   try {
    //     const blob = await exportCSV(filters).unwrap();
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `tickets_${currentSchool?.nome_escola || 'escola'}_${new Date().toISOString().split('T')[0]}.csv`;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     setMensagem({ tipo: 'success', texto: '✅ CSV exportado!' });
    //   } catch (err) {
    //     setMensagem({ tipo: 'error', texto: '❌ Erro ao exportar CSV' });
    //   }
    // };
    
  
    const formatarData = (data: string) => {
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
    
    // ============================================
      // LOADING & ERROR STATES
      // ============================================
      
      if (faqsLoading || schoolsLoading) {
        return (
          <LoadingState 
            message="Carregando FAQs..."
            icon={<HelpCircle size={48} className="text-blue-600" />}
          />
        );
      }
    
      if (!currentSchool) {
        return (
          <EmptyState
            icon={<HelpCircle size={64} className="text-yellow-600" />}
            title="Nenhuma FAQ cadastrada"
            description="Entre em contato com o administrador."
          />
        );
      }

    return (
        <PageModel>
            {/* Mensagens */}
      {mensagem && (
        <MessageAlert
          type={mensagem.tipo}
          message={mensagem.texto}
          onClose={() => setMensagem(null)}
        />
      )}

      {/* Erro ao carregar */}
      {fetchError && (
        <MessageAlert
          type="error"
          message={`Erro: ${extractErrorMessage(fetchError)}`}
          dismissible={false}
        />
      )}

       {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard label="Total" value={stats.total} color="blue" icon={<HelpCircle size={24} />} />
          <StatCard label="Ativas" value={stats.ativa} color="green" description="Aguardando" />
          <StatCard label="Inativas" value={stats.inativa} color="yellow" description="Processando" />
        </div>
      )}

      {/* Filtros */}
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
            name: 'categoria',
            value: categoriaFilter,
            onChange: setCategoriaFilter,
            options: [
              { label: 'Todas as Categorias', value: 'todas' },
                { label: 'Admissão', value: 'Admissão' },
                { label: 'Valores', value: 'Valores' },
                { label: 'Uniforme', value: 'Uniforme' },
                { label: 'Horários', value: 'Horários' },
                { label: 'Documentação', value: 'Documentação' },
                { label: 'Atividades', value: 'Atividades' },
                { label: 'Alimentação', value: 'Alimentação' },
                { label: 'Transporte', value: 'Transporte' },
                { label: 'Pedagógico', value: 'Pedagógico' },
                { label: 'Geral', value: 'Geral' },
            ],
          },
          {
            type: 'select',
            name: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Todos os Status', value: 'todos' },
              { label: 'Ativo', value: 'ativa' },
              { label: 'Inativo', value: 'inativa' }
            ],
          }
        ]}
        actions={[
        //   {
        //     label: 'Exportar',
        //     onClick: handleExportar,
        //     icon: <Download size={18} />,
        //     variant: 'success',
        //     loading: isExporting,
        //   },
          {
            label: 'Nova FAQ',
            onClick: () => setMostrarFormulario(true),
            icon: <Plus size={18} />,
            variant: 'primary',
          },
        ]}
        onClear={() => {
          setSearchTerm('');
          setStatusFilter('todos');
        }}
      />

        {/* Tabela */}
              <DataTable
                columns={[
                  { key: 'id', label: '#', width: '80px', sortable: true },
                  { 
                    key: 'pergunta', 
                    label: 'Pergunta', 
                    sortable: true,
                    render: (value) => <span className="font-medium text-gray-900">{value}</span>
                  },
                  { 
                    key: 'resposta', 
                    label: 'Resposta',
                    render: (value) => <span className="text-sm text-gray-600 line-clamp-2">{value}</span>
                  },
                  { key: 'categoria', label: 'Categoria', 
                    render: (value) => <CategoryBadge category={value} /> 
                  },
                  { 
                    key: 'status', 
                    label: 'Status',
                    render: (value, row) => (
                      <StatusSelect
                        value={value}
                        onChange={async (novoStatus: FAQ['status']) => {
                          try {
                            await updateFAQ({ id: row.id, data: { ...row, status: novoStatus } }).unwrap();
                            setMensagem({ tipo: 'success', texto: '✅ Status atualizado!' });
                            refetch();
                          } catch (err) {
                            setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
                          }
                        }}            
                      />
                    )
                  },
                  { 
                    key: 'created_at', 
                    label: 'Criado em',
                    sortable: true,
                    render: (value) => <span className="text-sm">{formatarData(value)}</span>
                  },
                ]}
                data={faqs}
                keyExtractor={(faq) => faq.id.toString()}
                actions={[
                  {
                    icon: <Edit2 size={18} />,
                    onClick: handleEditar,
                    variant: 'primary',
                    label: 'Editar',
                  },
                  {
                    icon: <Trash2 size={18} />,
                    onClick: (faq) => setFAQParaDeletar(faq),
                    variant: 'danger',
                    label: 'Deletar',
                  },
                ]}
                emptyMessage="Nenhuma FAQ encontrada"
                emptyIcon={<HelpCircle size={48} className="text-gray-400" />}
              />
        
              {/* Info de Resultados */}
              {faqs.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 font-semibold">
                    Mostrando <span className="text-blue-600 font-bold">{faqs.length}</span> de{' '}
                    <span className="text-blue-600 font-bold">{stats?.total || 0}</span> FAQs
                  </p>
                </div>
              )}
        
              {/* Modal de Formulário */}
              <FormModal
                isOpen={mostrarFormulario}
                title={editandoFAQ ? '✏️ Editar FAQ' : '➕ Novo FAQ'}
                subtitle={editandoFAQ ? 'Atualize as informações do FAQ' : 'Preencha os dados do novo FAQ'}
                onClose={resetForm}
                size="lg"
              >
                <FAQForm
                  formData={{ ...formData, categoria: formData.categoria as "Geral" | "Admissão" | "Valores" | "Uniforme" | "Horários" | "Documentação" | "Atividades" | "Alimentação" | "Transporte" | "Pedagógico" }}
                  onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))}
                  onSubmit={handleSubmit}
                  onCancel={resetForm}
                  isLoading={isCreating || isUpdating}
                  isEditing={!!editandoFAQ}
                />
              </FormModal>
        
              {/* Modal de Confirmação de Deleção */}
              <ConfirmDialog
                isOpen={!!FAQParaDeletar}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja deletar o FAQ "${FAQParaDeletar?.pergunta}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Deletar"
                cancelLabel="Cancelar"
                onConfirm={handleDeletar}
                onCancel={() => setFAQParaDeletar(null)}
                isLoading={isDeleting}
                variant="danger"
              />

        </PageModel>
    )
}

export default FAQs;
