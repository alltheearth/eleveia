// src/pages/Campaigns/components/CampaignWizard/index.tsx
// 🧙‍♂️ WIZARD DE CRIAÇÃO DE CAMPANHAS - CONTAINER PRINCIPAL

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// Componentes do Wizard
import WizardNavigation from './WizardNavigation';
import Step1_BasicInfo from './Step1_BasicInfo';
import Step2_Audience from './Step2_Audience';
import Step3_Channels from './Step3_Channels';
import Step4_Message from './Step4_Message';
import Step5_Schedule from './Step5_Schedule';
import Step6_FollowUp from './Step6_FollowUp';
import Step7_Review from './Step7_Review';

// Types
import type { 
  CampaignFormData, 
  CampaignType,
  CampaignChannel,
  AudienceFilter,
  MessageContent,
  FollowUpRule,
  RecurringConfig
} from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  editingCampaign?: any; // Campaign completo se estiver editando
  currentSchoolId: number;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface WizardState {
  // Step 1
  name: string;
  type: CampaignType;
  description: string;
  tags: string[];
  
  // Step 2
  audience_filters: AudienceFilter[];
  manual_contacts: number[];
  audience_count: number;
  
  // Step 3
  channels: CampaignChannel[];
  channel_priority: CampaignChannel[];
  fallback_enabled: boolean;
  
  // Step 4
  message_template_id?: number;
  message_content: MessageContent;
  
  // Step 5
  schedule_type: 'immediate' | 'scheduled' | 'recurring';
  scheduled_at?: string;
  recurring_config?: RecurringConfig;
  
  // Step 6
  follow_ups: FollowUpRule[];
  
  // Meta
  school: number;
}

const STEPS = [
  { number: 1, title: 'Informações Básicas', icon: '📝' },
  { number: 2, title: 'Público-Alvo', icon: '🎯' },
  { number: 3, title: 'Canais', icon: '📱' },
  { number: 4, title: 'Mensagem', icon: '✉️' },
  { number: 5, title: 'Agendamento', icon: '📅' },
  { number: 6, title: 'Follow-ups', icon: '🔄' },
  { number: 7, title: 'Revisão', icon: '✅' },
];

// ============================================
// COMPONENT
// ============================================

export default function CampaignWizard({
  isOpen,
  onClose,
  onSubmit,
  editingCampaign,
  currentSchoolId,
}: CampaignWizardProps) {
  
  // ============================================
  // STATE
  // ============================================
  
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  const [wizardData, setWizardData] = useState<WizardState>({
    // Step 1
    name: editingCampaign?.name || '',
    type: editingCampaign?.type || 'comunicado',
    description: editingCampaign?.description || '',
    tags: editingCampaign?.tags || [],
    
    // Step 2
    audience_filters: editingCampaign?.audience_filters || [],
    manual_contacts: [],
    audience_count: editingCampaign?.audience_count || 0,
    
    // Step 3
    channels: editingCampaign?.channels || ['whatsapp'],
    channel_priority: editingCampaign?.channel_priority || ['whatsapp'],
    fallback_enabled: editingCampaign?.fallback_enabled ?? true,
    
    // Step 4
    message_template_id: editingCampaign?.message_template_id,
    message_content: editingCampaign?.message_content || {
      whatsapp: { text: '' },
    },
    
    // Step 5
    schedule_type: editingCampaign?.schedule_type || 'immediate',
    scheduled_at: editingCampaign?.scheduled_at,
    recurring_config: editingCampaign?.recurring_config,
    
    // Step 6
    follow_ups: editingCampaign?.follow_ups || [],
    
    // Meta
    school: currentSchoolId,
  });

  // ============================================
  // HANDLERS
  // ============================================
  
  const updateWizardData = useCallback((updates: Partial<WizardState>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateStep = (step: WizardStep): { valid: boolean; error?: string } => {
    switch (step) {
      case 1:
        if (!wizardData.name.trim()) {
          return { valid: false, error: 'Nome da campanha é obrigatório' };
        }
        if (wizardData.name.length < 3) {
          return { valid: false, error: 'Nome deve ter no mínimo 3 caracteres' };
        }
        return { valid: true };
        
      case 2:
        if (wizardData.audience_filters.length === 0 && wizardData.manual_contacts.length === 0) {
          return { valid: false, error: 'Selecione pelo menos um destinatário' };
        }
        if (wizardData.audience_count === 0) {
          return { valid: false, error: 'Nenhum contato encontrado com os filtros selecionados' };
        }
        return { valid: true };
        
      case 3:
        if (wizardData.channels.length === 0) {
          return { valid: false, error: 'Selecione pelo menos um canal de envio' };
        }
        return { valid: true };
        
      case 4:
        const hasWhatsApp = wizardData.channels.includes('whatsapp');
        const hasEmail = wizardData.channels.includes('email');
        const hasSMS = wizardData.channels.includes('sms');
        
        if (hasWhatsApp && !wizardData.message_content.whatsapp?.text?.trim()) {
          return { valid: false, error: 'Mensagem do WhatsApp é obrigatória' };
        }
        if (hasEmail && (!wizardData.message_content.email?.subject?.trim() || !wizardData.message_content.email?.body_html?.trim())) {
          return { valid: false, error: 'Assunto e corpo do email são obrigatórios' };
        }
        if (hasSMS && !wizardData.message_content.sms?.text?.trim()) {
          return { valid: false, error: 'Mensagem do SMS é obrigatória' };
        }
        return { valid: true };
        
      case 5:
        if (wizardData.schedule_type === 'scheduled' && !wizardData.scheduled_at) {
          return { valid: false, error: 'Selecione a data e hora do agendamento' };
        }
        if (wizardData.schedule_type === 'recurring' && !wizardData.recurring_config) {
          return { valid: false, error: 'Configure a recorrência' };
        }
        return { valid: true };
        
      case 6:
        // Follow-ups são opcionais
        return { valid: true };
        
      case 7:
        // Revisão final - apenas visualização
        return { valid: true };
        
      default:
        return { valid: true };
    }
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    
    if (!validation.valid) {
      toast.error(validation.error || 'Erro de validação');
      return;
    }
    
    if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step: WizardStep) => {
    // Validar todos os steps anteriores
    for (let i = 1; i < step; i++) {
      const validation = validateStep(i as WizardStep);
      if (!validation.valid) {
        toast.error(`Complete o passo ${i} antes de avançar`);
        return;
      }
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    try {
      const formData: CampaignFormData = {
        ...wizardData,
        // Garantir que manual_contacts seja array mesmo se vazio
        manual_contacts: wizardData.manual_contacts || [],
      };
      
      await onSubmit(formData);
      toast.success('💾 Rascunho salvo com sucesso!');
      onClose();
    } catch (error: any) {
      toast.error(`❌ Erro ao salvar rascunho: ${error.message}`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleFinalSubmit = async () => {
    // Validar todos os steps
    for (let i = 1; i <= 6; i++) {
      const validation = validateStep(i as WizardStep);
      if (!validation.valid) {
        toast.error(`Erro no passo ${i}: ${validation.error}`);
        setCurrentStep(i as WizardStep);
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const formData: CampaignFormData = {
        ...wizardData,
        manual_contacts: wizardData.manual_contacts || [],
      };
      
      await onSubmit(formData);
      toast.success('✅ Campanha criada com sucesso!');
      onClose();
    } catch (error: any) {
      toast.error(`❌ Erro ao criar campanha: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (wizardData.name || wizardData.audience_filters.length > 0) {
      if (confirm('Deseja salvar como rascunho antes de sair?')) {
        handleSaveDraft();
        return;
      }
    }
    onClose();
  };

  // ============================================
  // RENDER STEP CONTENT
  // ============================================
  
  const renderStepContent = () => {
    const stepProps = {
      data: wizardData,
      updateData: updateWizardData,
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <Step1_BasicInfo {...stepProps} />;
      case 2:
        return <Step2_Audience {...stepProps} />;
      case 3:
        return <Step3_Channels {...stepProps} />;
      case 4:
        return <Step4_Message {...stepProps} />;
      case 5:
        return <Step5_Schedule {...stepProps} />;
      case 6:
        return <Step6_FollowUp {...stepProps} />;
      case 7:
        return <Step7_Review {...stepProps} onSubmit={handleFinalSubmit} />;
      default:
        return null;
    }
  };

  // ============================================
  // RENDER
  // ============================================
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
              </h2>
              <p className="text-sm text-white/80">
                {STEPS[currentStep - 1].title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Salvar Rascunho */}
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all border border-white/30 disabled:opacity-50"
            >
              <Save size={18} />
              <span className="hidden sm:inline">
                {isSavingDraft ? 'Salvando...' : 'Salvar Rascunho'}
              </span>
            </button>

            {/* Fechar */}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <WizardNavigation
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => (i + 1) as WizardStep)}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>

            {/* Progress Text */}
            <span className="text-sm text-gray-600 font-semibold">
              Passo {currentStep} de {STEPS.length}
            </span>

            {/* Botão Avançar/Finalizar */}
            {currentStep < 7 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Próximo
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50"
              >
                <Send size={18} />
                {isSubmitting ? 'Criando...' : 'Criar Campanha'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}