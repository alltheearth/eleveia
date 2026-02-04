// src/pages/Contacts/index.tsx - ✅ REFATORADO
import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Users as UsersIcon, Phone, Mail } from 'lucide-react';

// Componentes de Layout
import PageModel from '../../components/layout/PageModel';


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
   <div>
    Hello
    </div>
  );
}