// src/pages/Contacts/index.tsx
// 👨‍👩‍👧‍👦 PÁGINA DE CONTATOS - GESTÃO DE PAIS E RESPONSÁVEIS

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RefreshCw, Download, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

// Layout
import PageModel from '../../components/layout/PageModel';

// Componentes Comuns
import { 
  ConfirmDialog,
  FormModal,
  LoadingState,
} from '../../components/common';

// Componentes Locais
import ContactStats from './components/ContactStats';
import ContactFilters, { type ContactViewMode } from './components/ContactFilters';
import ContactGridView from './components/ContactGridView';
import ContactListView from './components/ContactListView';
import ContactDetails from './components/ContactDetails';

// ============================================
// TYPES
// ============================================

export interface Student {
  id: number;
  nome: string;
  turma: string;
  serie: string;
  periodo: 'manha' | 'tarde' | 'integral';
  status: 'ativo' | 'inativo' | 'transferido';
}

export interface Document {
  id: number;
  tipo: string;
  nome: string;
  status: 'pendente' | 'entregue' | 'aprovado' | 'rejeitado';
  data_entrega?: string;
  observacoes?: string;
}

export interface Interaction {
  id: number;
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'presencial' | 'reuniao';
  assunto: string;
  descricao: string;
  data: string;
  responsavel: string;
}

export interface Request {
  id: number;
  tipo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  data_criacao: string;
  data_conclusao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface Contact {
  id: number;
  
  // Dados Principais
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  telefone_secundario?: string;
  whatsapp: string;
  
  // Endereço
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  
  // Relacionamento
  parentesco: 'pai' | 'mae' | 'avo' | 'ava' | 'tio' | 'tia' | 'responsavel_legal';
  parentesco_display: string;
  responsavel_financeiro: boolean;
  responsavel_pedagogico: boolean;
  
  // Filhos
  filhos: Student[];
  
  // Documentação
  documentos: Document[];
  documentacao_completa: boolean;
  
  // Financeiro
  mensalidades_em_dia: boolean;
  debitos_pendentes: number;
  
  // Histórico
  interacoes: Interaction[];
  solicitacoes: Request[];
  
  // Metadata
  data_cadastro: string;
  ultima_interacao?: string;
  escola: number;
  escola_nome?: string;
  
  // Status geral
  status: 'ativo' | 'inativo';
  observacoes?: string;
}

// ============================================
// DADOS MOCK
// ============================================

const MOCK_CONTACTS: Contact[] = [
  {
    id: 1,
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    email: 'maria.silva@email.com',
    telefone: '(11) 99999-8888',
    telefone_secundario: '(11) 3333-4444',
    whatsapp: '(11) 99999-8888',
    endereco: {
      cep: '01234-567',
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Jardim Primavera',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    parentesco: 'mae',
    parentesco_display: 'Mãe',
    responsavel_financeiro: true,
    responsavel_pedagogico: true,
    filhos: [
      {
        id: 1,
        nome: 'João Pedro Santos',
        turma: '3º Ano A',
        serie: '3º Ano',
        periodo: 'manha',
        status: 'ativo',
      },
      {
        id: 2,
        nome: 'Ana Clara Santos',
        turma: '1º Ano B',
        serie: '1º Ano',
        periodo: 'manha',
        status: 'ativo',
      },
    ],
    documentos: [
      {
        id: 1,
        tipo: 'RG',
        nome: 'RG do Responsável',
        status: 'aprovado',
        data_entrega: '2026-01-15',
      },
      {
        id: 2,
        tipo: 'CPF',
        nome: 'CPF do Responsável',
        status: 'aprovado',
        data_entrega: '2026-01-15',
      },
      {
        id: 3,
        tipo: 'Comprovante de Residência',
        nome: 'Conta de Luz',
        status: 'aprovado',
        data_entrega: '2026-01-20',
      },
      {
        id: 4,
        tipo: 'Certidão de Nascimento',
        nome: 'Certidão - João Pedro',
        status: 'pendente',
      },
    ],
    documentacao_completa: false,
    mensalidades_em_dia: true,
    debitos_pendentes: 0,
    interacoes: [
      {
        id: 1,
        tipo: 'whatsapp',
        assunto: 'Dúvida sobre uniforme',
        descricao: 'Perguntou sobre tamanhos disponíveis',
        data: '2026-01-30T14:30:00',
        responsavel: 'Ana Coordenadora',
      },
      {
        id: 2,
        tipo: 'presencial',
        assunto: 'Reunião pedagógica',
        descricao: 'Discussão sobre desenvolvimento do João',
        data: '2026-01-25T10:00:00',
        responsavel: 'Prof. Carlos',
      },
    ],
    solicitacoes: [
      {
        id: 1,
        tipo: 'Declaração de Matrícula',
        descricao: 'Solicitou declaração para João Pedro',
        status: 'concluido',
        data_criacao: '2026-01-20',
        data_conclusao: '2026-01-22',
        prioridade: 'media',
      },
      {
        id: 2,
        tipo: 'Atestado de Frequência',
        descricao: 'Necessário para Ana Clara',
        status: 'pendente',
        data_criacao: '2026-01-29',
        prioridade: 'alta',
      },
    ],
    data_cadastro: '2025-12-15',
    ultima_interacao: '2026-01-30T14:30:00',
    escola: 1,
    escola_nome: 'Escola ABC',
    status: 'ativo',
  },
  {
    id: 2,
    nome: 'Carlos Eduardo Costa',
    cpf: '987.654.321-00',
    email: 'carlos.costa@email.com',
    telefone: '(11) 98888-7777',
    whatsapp: '(11) 98888-7777',
    endereco: {
      cep: '02345-678',
      logradouro: 'Av. Principal',
      numero: '456',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    parentesco: 'pai',
    parentesco_display: 'Pai',
    responsavel_financeiro: true,
    responsavel_pedagogico: false,
    filhos: [
      {
        id: 3,
        nome: 'Lucas Costa',
        turma: '5º Ano A',
        serie: '5º Ano',
        periodo: 'tarde',
        status: 'ativo',
      },
    ],
    documentos: [
      {
        id: 5,
        tipo: 'RG',
        nome: 'RG do Responsável',
        status: 'aprovado',
        data_entrega: '2026-01-10',
      },
      {
        id: 6,
        tipo: 'CPF',
        nome: 'CPF do Responsável',
        status: 'aprovado',
        data_entrega: '2026-01-10',
      },
      {
        id: 7,
        tipo: 'Comprovante de Residência',
        nome: 'Conta de Água',
        status: 'aprovado',
        data_entrega: '2026-01-10',
      },
      {
        id: 8,
        tipo: 'Certidão de Nascimento',
        nome: 'Certidão - Lucas',
        status: 'aprovado',
        data_entrega: '2026-01-10',
      },
    ],
    documentacao_completa: true,
    mensalidades_em_dia: false,
    debitos_pendentes: 2,
    interacoes: [
      {
        id: 3,
        tipo: 'email',
        assunto: 'Boleto em atraso',
        descricao: 'Enviado lembrete de pagamento',
        data: '2026-01-28T09:00:00',
        responsavel: 'Financeiro',
      },
    ],
    solicitacoes: [],
    data_cadastro: '2025-11-20',
    ultima_interacao: '2026-01-28T09:00:00',
    escola: 1,
    escola_nome: 'Escola ABC',
    status: 'ativo',
  },
  {
    id: 3,
    nome: 'Ana Paula Oliveira',
    cpf: '456.789.123-00',
    email: 'ana.oliveira@email.com',
    telefone: '(11) 97777-6666',
    whatsapp: '(11) 97777-6666',
    endereco: {
      cep: '03456-789',
      logradouro: 'Rua das Acácias',
      numero: '789',
      complemento: 'Casa 2',
      bairro: 'Vila Nova',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    parentesco: 'mae',
    parentesco_display: 'Mãe',
    responsavel_financeiro: false,
    responsavel_pedagogico: true,
    filhos: [
      {
        id: 4,
        nome: 'Beatriz Oliveira',
        turma: '2º Ano B',
        serie: '2º Ano',
        periodo: 'integral',
        status: 'ativo',
      },
    ],
    documentos: [
      {
        id: 9,
        tipo: 'RG',
        nome: 'RG do Responsável',
        status: 'aprovado',
        data_entrega: '2026-01-05',
      },
      {
        id: 10,
        tipo: 'CPF',
        nome: 'CPF do Responsável',
        status: 'pendente',
      },
      {
        id: 11,
        tipo: 'Comprovante de Residência',
        nome: 'Conta de Luz',
        status: 'rejeitado',
        observacoes: 'Documento ilegível',
      },
    ],
    documentacao_completa: false,
    mensalidades_em_dia: true,
    debitos_pendentes: 0,
    interacoes: [
      {
        id: 4,
        tipo: 'ligacao',
        assunto: 'Atestado médico',
        descricao: 'Informou sobre ausência da Beatriz',
        data: '2026-01-31T08:30:00',
        responsavel: 'Secretaria',
      },
      {
        id: 5,
        tipo: 'reuniao',
        assunto: 'Adaptação escolar',
        descricao: 'Reunião sobre progresso da Beatriz',
        data: '2026-01-15T16:00:00',
        responsavel: 'Prof. Mariana',
      },
    ],
    solicitacoes: [
      {
        id: 3,
        tipo: 'Segunda via de boleto',
        descricao: 'Boleto extraviado',
        status: 'em_andamento',
        data_criacao: '2026-01-30',
        prioridade: 'media',
      },
    ],
    data_cadastro: '2026-01-02',
    ultima_interacao: '2026-01-31T08:30:00',
    escola: 1,
    escola_nome: 'Escola ABC',
    status: 'ativo',
    observacoes: 'Solicitar reenvio de comprovante de residência',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function ContactsPage() {
  
  // ============================================
  // STATE
  // ============================================
  
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ContactViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [docStatusFilter, setDocStatusFilter] = useState('todos');
  const [financeFilter, setFinanceFilter] = useState('todos');
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // ============================================
  // COMPUTED
  // ============================================
  
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        searchTerm === '' ||
        contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.telefone.includes(searchTerm) ||
        contact.cpf.includes(searchTerm) ||
        contact.filhos.some(f => f.nome.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'todos' || contact.status === statusFilter;
      
      const matchesDocStatus = 
        docStatusFilter === 'todos' ||
        (docStatusFilter === 'completa' && contact.documentacao_completa) ||
        (docStatusFilter === 'incompleta' && !contact.documentacao_completa);
      
      const matchesFinance =
        financeFilter === 'todos' ||
        (financeFilter === 'em_dia' && contact.mensalidades_em_dia) ||
        (financeFilter === 'pendente' && !contact.mensalidades_em_dia);

      return matchesSearch && matchesStatus && matchesDocStatus && matchesFinance;
    });
  }, [contacts, searchTerm, statusFilter, docStatusFilter, financeFilter]);

  const stats = useMemo(() => {
    const total = contacts.length;
    const ativos = contacts.filter(c => c.status === 'ativo').length;
    const docCompleta = contacts.filter(c => c.documentacao_completa).length;
    const mensalidadesEmDia = contacts.filter(c => c.mensalidades_em_dia).length;
    const comDebitos = contacts.filter(c => c.debitos_pendentes > 0).length;
    const solicitacoesPendentes = contacts.reduce((sum, c) => 
      sum + c.solicitacoes.filter(s => s.status === 'pendente').length, 0
    );

    return {
      total,
      ativos,
      inativos: total - ativos,
      doc_completa: docCompleta,
      doc_incompleta: total - docCompleta,
      mensalidades_em_dia: mensalidadesEmDia,
      com_debitos: comDebitos,
      solicitacoes_pendentes: solicitacoesPendentes,
      taxa_documentacao: total > 0 ? Number(((docCompleta / total) * 100).toFixed(1)) : 0,
      taxa_adimplencia: total > 0 ? Number(((mensalidadesEmDia / total) * 100).toFixed(1)) : 0,
    };
  }, [contacts]);

  const hasActiveFilters = 
    searchTerm !== '' || 
    statusFilter !== 'todos' || 
    docStatusFilter !== 'todos' ||
    financeFilter !== 'todos';

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleDelete = (): void => {
    if (!contactToDelete) return;
    setContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
    toast.success('✅ Contato removido com sucesso!');
    setContactToDelete(null);
  };

  const handleExport = (): void => {
    const csv = convertToCSV(filteredContacts);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('✅ CSV exportado com sucesso!');
  };

  const handleRefresh = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('🔄 Dados atualizados!');
    }, 1000);
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('todos');
    setDocStatusFilter('todos');
    setFinanceFilter('todos');
  };

  const convertToCSV = (data: Contact[]): string => {
    const headers = ['ID', 'Nome', 'CPF', 'Email', 'Telefone', 'Parentesco', 'Status', 'Doc. Completa', 'Mensalidades'];
    const rows = data.map(c => [
      c.id,
      c.nome,
      c.cpf,
      c.email,
      c.telefone,
      c.parentesco_display,
      c.status,
      c.documentacao_completa ? 'Sim' : 'Não',
      c.mensalidades_em_dia ? 'Em dia' : 'Pendente',
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (isLoading && contacts.length === 0) {
    return (
      <LoadingState 
        message="Carregando contatos..."
        icon={<Users size={48} className="text-blue-600" />}
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <PageModel>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestão de Contatos
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Users size={16} />
              Gerencie pais, responsáveis e toda comunicação com as famílias
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <ContactStats stats={stats} loading={false} />

      {/* Filters */}
      <ContactFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        docStatusFilter={docStatusFilter}
        onDocStatusFilterChange={setDocStatusFilter}
        financeFilter={financeFilter}
        onFinanceFilterChange={setFinanceFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewContact={() => toast.info('Funcionalidade em desenvolvimento')}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        isExporting={false}
        isRefreshing={isLoading}
      />

      {/* Views */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ContactGridView
              contacts={filteredContacts}
              onViewDetails={setSelectedContact}
              onDelete={setContactToDelete}
              loading={false}
            />
          </motion.div>
        )}

        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ContactListView
              contacts={filteredContacts}
              onViewDetails={setSelectedContact}
              onDelete={setContactToDelete}
              loading={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      {filteredContacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{filteredContacts.length}</span> de{' '}
            <span className="text-blue-600 font-bold">{stats.total}</span> contatos
            {hasActiveFilters && (
              <span className="text-gray-600 text-sm ml-2">(filtrado)</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <FormModal
          isOpen={!!selectedContact}
          title={`👤 ${selectedContact.nome}`}
          subtitle="Informações completas do contato"
          onClose={() => setSelectedContact(null)}
          size="xl"
        >
          <ContactDetails 
            contact={selectedContact} 
            onClose={() => setSelectedContact(null)}
          />
        </FormModal>
      )}

      {/* Delete Confirmation */}
      {contactToDelete && (
        <ConfirmDialog
          isOpen={!!contactToDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja remover o contato "${contactToDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Remover"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setContactToDelete(null)}
          isLoading={false}
          variant="danger"
        />
      )}
    </PageModel>
  );
}