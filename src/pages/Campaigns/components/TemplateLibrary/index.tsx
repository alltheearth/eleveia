// src/pages/Campaigns/components/TemplateLibrary/index.tsx

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, BookOpen } from 'lucide-react';
import TemplateCategoryNav from './TemplateCategoryNav';
import TemplateFilters from './TemplateFilters';
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import TemplateEditor from './TemplateEditor';
import type { MessageTemplate, CampaignType } from '../../types/campaign.types';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MessageTemplate) => void;
  currentType?: CampaignType;
  allowCustom?: boolean;
}

export type TemplateCategory = 
  | 'all'
  | 'matricula'
  | 'rematricula'
  | 'evento'
  | 'reuniao'
  | 'cobranca'
  | 'comunicado'
  | 'custom';

export interface MessageTemplate {
  id: number;
  name: string;
  description: string;
  category: TemplateCategory;
  preview_image?: string;
  content: {
    whatsapp?: {
      text: string;
      buttons?: Array<{
        type: string;
        text: string;
        value: string;
      }>;
    };
    email?: {
      subject: string;
      body_html: string;
      body_text: string;
    };
    sms?: {
      text: string;
    };
  };
  variables: string[];
  tags: string[];
  is_default: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// Mock de templates para demonstração
const MOCK_TEMPLATES: MessageTemplate[] = [
  {
    id: 1,
    name: 'Convite para Matrícula 2025',
    description: 'Template profissional para convidar responsáveis a realizar a matrícula',
    category: 'matricula',
    content: {
      whatsapp: {
        text: `Olá {{nome_responsavel}}! 👋

🎓 As matrículas para 2025 já estão abertas!

Garanta a vaga do(a) {{nome_aluno}} para o {{serie}}. 

✨ Benefícios de matricular agora:
• Desconto de 15% na matrícula
• Kit escolar completo
• Acesso antecipado à plataforma digital

📅 Promoção válida até {{data_limite}}

Clique no link abaixo para iniciar sua matrícula:
{{link_matricula}}

Ficou com dúvidas? Estamos à disposição! 💙`,
      },
      email: {
        subject: 'Matrículas 2025 Abertas - Garanta sua vaga com desconto!',
        body_html: '<html>...</html>',
        body_text: 'Matrículas abertas...',
      },
    },
    variables: ['nome_responsavel', 'nome_aluno', 'serie', 'data_limite', 'link_matricula'],
    tags: ['matricula', 'desconto', 'urgencia'],
    is_default: true,
    usage_count: 234,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
  },
  {
    id: 2,
    name: 'Lembrete de Rematrícula',
    description: 'Lembrete amigável para responsáveis renovarem a matrícula',
    category: 'rematricula',
    content: {
      whatsapp: {
        text: `Oi {{nome_responsavel}}! 😊

Estamos com saudades do(a) {{nome_aluno}}! 

🔄 Chegou a hora de renovar a matrícula para o próximo ano letivo.

Como você já faz parte da nossa família {{nome_escola}}, preparamos condições especiais:

✅ Sem taxa de rematrícula
✅ Desconto de 10% nas mensalidades
✅ Prioridade na escolha de turno

⏰ Garanta essas vantagens até {{data_limite}}!

Renove agora: {{link_rematricula}}

Qualquer dúvida, estamos aqui! 💙`,
      },
    },
    variables: ['nome_responsavel', 'nome_aluno', 'nome_escola', 'data_limite', 'link_rematricula'],
    tags: ['rematricula', 'fidelizacao', 'desconto'],
    is_default: true,
    usage_count: 189,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T14:20:00Z',
  },
  {
    id: 3,
    name: 'Convite para Reunião de Pais',
    description: 'Convite formal para reunião de pais e mestres',
    category: 'reuniao',
    content: {
      whatsapp: {
        text: `Prezado(a) {{nome_responsavel}},

📋 Convidamos você para a Reunião de Pais e Mestres!

📅 Data: {{data_reuniao}}
🕐 Horário: {{horario_reuniao}}
📍 Local: {{local_reuniao}}

📌 Pauta:
• Apresentação do desempenho acadêmico
• Projetos do próximo bimestre
• Alinhamento de expectativas

✨ Sua presença é muito importante para o desenvolvimento do(a) {{nome_aluno}}.

Por favor, confirme sua presença até {{data_confirmacao}}:
{{link_confirmacao}}

Atenciosamente,
{{nome_escola}} 🎓`,
      },
    },
    variables: ['nome_responsavel', 'data_reuniao', 'horario_reuniao', 'local_reuniao', 'nome_aluno', 'data_confirmacao', 'link_confirmacao', 'nome_escola'],
    tags: ['reuniao', 'formal', 'confirmacao'],
    is_default: true,
    usage_count: 156,
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-19T16:45:00Z',
  },
  {
    id: 4,
    name: 'Convite para Festa Junina',
    description: 'Convite animado para evento escolar',
    category: 'evento',
    content: {
      whatsapp: {
        text: `🎉 OI {{nome_responsavel}}! 🎊

Você está convidado(a) para a nossa FESTA JUNINA! 🌽🎪

🗓️ Quando: {{data_evento}}
🕐 Horário: {{horario_evento}}
📍 Onde: {{local_evento}}

🎯 Atrações:
🎵 Quadrilha dos alunos
🍰 Barracas de comidas típicas
🎪 Brincadeiras e jogos
🎁 Sorteios incríveis

👨‍👩‍👧 Traga toda a família!

Ingressos: {{preco_ingresso}}
Compre agora: {{link_ingressos}}

Vai ser ARRAIÁ! 🔥

{{nome_escola}} 💙`,
      },
    },
    variables: ['nome_responsavel', 'data_evento', 'horario_evento', 'local_evento', 'preco_ingresso', 'link_ingressos', 'nome_escola'],
    tags: ['evento', 'festa', 'familia'],
    is_default: true,
    usage_count: 98,
    created_at: '2024-01-14T13:00:00Z',
    updated_at: '2024-01-21T10:15:00Z',
  },
  {
    id: 5,
    name: 'Lembrete de Pagamento',
    description: 'Lembrete educado sobre mensalidade próxima ao vencimento',
    category: 'cobranca',
    content: {
      whatsapp: {
        text: `Olá {{nome_responsavel}},

💰 Lembrete importante sobre a mensalidade do(a) {{nome_aluno}}.

📅 Vencimento: {{data_vencimento}}
💵 Valor: R$ {{valor_mensalidade}}

Para evitar multa e juros, efetue o pagamento até a data de vencimento.

🏦 Formas de pagamento:
• Boleto bancário
• PIX (QR Code)
• Cartão de crédito

Acesse aqui: {{link_pagamento}}

Já pagou? Desconsidere esta mensagem.

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
{{nome_escola}} 🎓`,
      },
    },
    variables: ['nome_responsavel', 'nome_aluno', 'data_vencimento', 'valor_mensalidade', 'link_pagamento', 'nome_escola'],
    tags: ['cobranca', 'pagamento', 'lembrete'],
    is_default: true,
    usage_count: 312,
    created_at: '2024-01-08T08:00:00Z',
    updated_at: '2024-01-22T09:30:00Z',
  },
  {
    id: 6,
    name: 'Comunicado Importante',
    description: 'Template para comunicados gerais',
    category: 'comunicado',
    content: {
      whatsapp: {
        text: `📢 COMUNICADO IMPORTANTE

Prezado(a) {{nome_responsavel}},

{{titulo_comunicado}}

{{corpo_comunicado}}

⚠️ Data de vigência: {{data_vigencia}}

Para mais informações, entre em contato conosco.

Atenciosamente,
{{nome_escola}} 🎓`,
      },
    },
    variables: ['nome_responsavel', 'titulo_comunicado', 'corpo_comunicado', 'data_vigencia', 'nome_escola'],
    tags: ['comunicado', 'avisos', 'geral'],
    is_default: true,
    usage_count: 267,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-20T11:00:00Z',
  },
];

export default function TemplateLibrary({
  isOpen,
  onClose,
  onSelectTemplate,
  currentType,
  allowCustom = true,
}: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrar templates
  const filteredTemplates = useMemo(() => {
    let filtered = MOCK_TEMPLATES;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Filtro por tipo de campanha (se fornecido)
    if (currentType && selectedCategory === 'all') {
      filtered = filtered.filter((t) => t.category === currentType);
    }

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filtro por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((t) =>
        selectedTags.every((tag) => t.tags.includes(tag))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, selectedTags, currentType]);

  // Extrair todas as tags únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_TEMPLATES.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const handleSelectTemplate = (template: MessageTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const handleCreateCustom = () => {
    setEditingTemplate({
      id: 0,
      name: 'Novo Template',
      description: '',
      category: currentType || 'comunicado',
      content: {
        whatsapp: { text: '' },
      },
      variables: [],
      tags: [],
      is_default: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Biblioteca de Templates
              </h2>
              <p className="text-blue-100 text-sm">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} disponíve
                {filteredTemplates.length !== 1 ? 'is' : 'l'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Navegação por categorias */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <TemplateCategoryNav
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Filtros */}
        <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <TemplateFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            allTags={allTags}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCreateCustom={allowCustom ? handleCreateCustom : undefined}
          />
        </div>

        {/* Conteúdo - Grid/List de templates */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {filteredTemplates.length > 0 ? (
              <motion.div
                key="templates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    viewMode={viewMode}
                    onSelect={() => handleSelectTemplate(template)}
                    onPreview={() => setPreviewTemplate(template)}
                    onEdit={() => setEditingTemplate(template)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-gray-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhum template encontrado
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Não encontramos templates que correspondam aos seus critérios de busca.
                  Tente ajustar os filtros ou criar um template personalizado.
                </p>
                {allowCustom && (
                  <button
                    onClick={handleCreateCustom}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Criar Template Personalizado
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreview
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onSelect={() => {
              handleSelectTemplate(previewTemplate);
              setPreviewTemplate(null);
            }}
            onEdit={() => {
              setEditingTemplate(previewTemplate);
              setPreviewTemplate(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingTemplate && (
          <TemplateEditor
            template={editingTemplate}
            onClose={() => setEditingTemplate(null)}
            onSave={(savedTemplate) => {
              // TODO: Implementar save no backend
              console.log('Template salvo:', savedTemplate);
              setEditingTemplate(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}