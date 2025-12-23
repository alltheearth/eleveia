// src/pages/Contacts/index.tsx - ✅ REFATORADO
import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Users as UsersIcon, Phone, Mail } from 'lucide-react';

// Componentes de Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns (reutilizáveis)
import { 
  StatCard,
  FilterBar,
  DataTable,
  MessageAlert,
  LoadingState,
  EmptyState,
  ConfirmDialog,
  FormModal,
  Badge
} from '../../components/common';

// Hooks e Services
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import {
  useGetContactsQuery,
  useGetContactStatsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useRegisterInteractionMutation,
  extractErrorMessage,
  type Contact,
  type ContactFilters
} from '../../services';

interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  status: Contact['status'];
  origem: Contact['origem'];
  observacoes: string;
  tags: string;
}

export default function Contacts() {
  // ============================================
  // HOOKS
  // ============================================
  
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // ============================================
  // ESTADOS
  // ============================================
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoContato, setEditandoContato] = useState<Contact | null>(null);
  const [contatoParaDeletar, setContatoParaDeletar] = useState<Contact | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    status: 'ativo',
    origem: 'whatsapp',
    observacoes: '',
    tags: '',
  });

  // ============================================
  // RTK QUERY
  // ============================================
  
  const filters: ContactFilters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'todos' ? (statusFilter as 'ativo' | 'inativo') : undefined,
  };

  const { 
    data: contactsData, 
    isLoading: contactsLoading, 
    error: fetchError,
    refetch 
  } = useGetContactsQuery(filters);

  const { data: stats } = useGetContactStatsQuery();

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [registerInteraction] = useRegisterInteractionMutation();

  const contacts = contactsData?.results || [];

  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // ============================================
  // HANDLERS
  // ============================================
  
  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      status: 'ativo',
      origem: 'whatsapp',
      observacoes: '',
      tags: '',
    });
    setEditandoContato(null);
    setMostrarFormulario(false);
  };

  const validarFormulario = (): string | null => {
    if (!formData.telefone.trim()) return 'Telefone é obrigatório';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Email inválido';
    }
    return null;
  };

  const handleSubmit = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'error', texto: erro });
      return;
    }

    try {
      if (editandoContato) {
        await updateContact({ 
          id: editandoContato.id, 
          data: {
            ...formData,
            escola: parseInt(currentSchoolId),
          }
        }).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ Contato atualizado com sucesso!' });
      } else {
        await createContact({
          ...formData,
          escola: parseInt(currentSchoolId),
        }).unwrap();
        setMensagem({ tipo: 'success', texto: '✅ Contato criado com sucesso!' });
      }
      resetForm();
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleEditar = (contact: Contact) => {
    setFormData({
      nome: contact.nome,
      email: contact.email,
      telefone: contact.telefone,
      data_nascimento: contact.data_nascimento || '',
      status: contact.status,
      origem: contact.origem,
      observacoes: contact.observacoes || '',
      tags: contact.tags || '',
    });
    setEditandoContato(contact);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = async () => {
    if (!contatoParaDeletar) return;

    try {
      await deleteContact(contatoParaDeletar.id).unwrap();
      setMensagem({ tipo: 'success', texto: '✅ Contato deletado com sucesso!' });
      setContatoParaDeletar(null);
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const handleRegistrarInteracao = async (id: number) => {
    try {
      await registerInteraction(id).unwrap();
      setMensagem({ tipo: 'success', texto: '✅ Interação registrada!' });
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  const formatarDataHora = (data: string): string => {
    return new Date(data).toLocaleDateString('pt-BR', {
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
  
  if (contactsLoading || schoolsLoading) {
    return (
      <LoadingState 
        message="Carregando contatos..."
        icon={<UsersIcon size={48} className="text-blue-600" />}
      />
    );
  }

  if (!currentSchool) {
    return (
      <EmptyState
        icon={<UsersIcon size={64} className="text-yellow-600" />}
        title="Nenhuma escola cadastrada"
        description="Entre em contato com o administrador."
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total" 
            value={stats.total} 
            color="blue" 
            icon={<UsersIcon size={24} />} 
          />
          <StatCard 
            label="Ativos" 
            value={stats.ativos} 
            color="green" 
            description="Contatos ativos" 
          />
          <StatCard 
            label="Inativos" 
            value={stats.inativos} 
            color="gray" 
            description="Contatos inativos" 
          />
          <StatCard 
            label="Novos Hoje" 
            value={stats.novos_hoje} 
            color="orange" 
            description="Adicionados hoje" 
          />
        </div>
      )}

      {/* Filtros */}
      <FilterBar
        fields={[
          {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar por nome, email ou telefone...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            name: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Todos os Status', value: 'todos' },
              { label: 'Ativo', value: 'ativo' },
              { label: 'Inativo', value: 'inativo' },
            ],
          },
        ]}
        actions={[
          {
            label: 'Novo Contato',
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
            key: 'nome', 
            label: 'Nome', 
            sortable: true,
            render: (value) => <span className="font-medium text-gray-900">{value || '-'}</span>
          },
          { 
            key: 'email', 
            label: 'Email',
            render: (value) => (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm">{value || '-'}</span>
              </div>
            )
          },
          { 
            key: 'telefone', 
            label: 'Telefone',
            render: (value) => (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm">{value}</span>
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (value) => (
              <Badge variant={value === 'ativo' ? 'green' : 'gray'}>
                {value === 'ativo' ? '✅ Ativo' : '⛔ Inativo'}
              </Badge>
            )
          },
          { 
            key: 'origem', 
            label: 'Origem',
            render: (_value, row) => (
              <Badge variant="blue">
                {row.origem_display}
              </Badge>
            )
          },
          { 
            key: 'ultima_interacao', 
            label: 'Última Interação',
            render: (value) => (
              <span className="text-sm text-gray-600">
                {value ? formatarDataHora(value) : '-'}
              </span>
            )
          },
        ]}
        data={contacts}
        keyExtractor={(contact) => contact.id.toString()}
        actions={[
          {
            icon: <span className="text-lg">📞</span>,
            onClick: (contact) => handleRegistrarInteracao(contact.id),
            variant: 'success',
            label: 'Registrar Interação',
          },
          {
            icon: <Edit2 size={18} />,
            onClick: handleEditar,
            variant: 'primary',
            label: 'Editar',
          },
          {
            icon: <Trash2 size={18} />,
            onClick: (contact) => setContatoParaDeletar(contact),
            variant: 'danger',
            label: 'Deletar',
          },
        ]}
        emptyMessage="Nenhum contato encontrado"
        emptyIcon={<UsersIcon size={48} className="text-gray-400" />}
      />

      {/* Info de Resultados */}
      {contacts.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{contacts.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats?.total || 0}</span> contatos
          </p>
        </div>
      )}

      {/* Modal de Formulário */}
      <FormModal
        isOpen={mostrarFormulario}
        title={editandoContato ? '✏️ Editar Contato' : '➕ Novo Contato'}
        subtitle={editandoContato ? 'Atualize as informações do contato' : 'Preencha os dados do novo contato'}
        onClose={resetForm}
        size="lg"
      >
        <ContactForm
          formData={formData}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isLoading={isCreating || isUpdating}
          isEditing={!!editandoContato}
        />
      </FormModal>

      {/* Modal de Confirmação de Deleção */}
      <ConfirmDialog
        isOpen={!!contatoParaDeletar}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar o contato "${contatoParaDeletar?.nome || contatoParaDeletar?.telefone}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        onConfirm={handleDeletar}
        onCancel={() => setContatoParaDeletar(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </PageModel>
  );
}

// ============================================
// COMPONENTE DE FORMULÁRIO
// ============================================

interface ContactFormProps {
  formData: ContactFormData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

function ContactForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: ContactFormProps) {
  return (
    <div className="space-y-4">
      {/* Nome e Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nome</label>
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => onChange('nome', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Telefone e Data de Nascimento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
          <input
            type="tel"
            placeholder="(11) 99999-0000"
            value={formData.telefone}
            onChange={(e) => onChange('telefone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Data de Nascimento</label>
          <input
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => onChange('data_nascimento', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Origem e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Origem</label>
          <select
            value={formData.origem}
            onChange={(e) => onChange('origem', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="site">Site</option>
            <option value="telefone">Telefone</option>
            <option value="presencial">Presencial</option>
            <option value="email">Email</option>
            <option value="indicacao">Indicação</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          >
            <option value="ativo">✅ Ativo</option>
            <option value="inativo">⛔ Inativo</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Tags (separadas por vírgula)
        </label>
        <input
          type="text"
          placeholder="interessado, aguardando, urgente"
          value={formData.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Observações */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Observações</label>
        <textarea
          placeholder="Informações adicionais..."
          value={formData.observacoes}
          onChange={(e) => onChange('observacoes', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
        >
          <Plus size={20} />
          {isLoading 
            ? (isEditing ? 'Atualizando...' : 'Criando...')
            : (isEditing ? 'Atualizar' : 'Criar Contato')
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
}