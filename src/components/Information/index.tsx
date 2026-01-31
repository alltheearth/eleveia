// src/components/Information/index.tsx - 🎨 REDESIGN PROFISSIONAL
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useGetSchoolsQuery, 
  useUpdateSchoolMutation,
  extractErrorMessage
} from '../../services';
import {
  Building2,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Lock,
  GraduationCap,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  Shield,
  Info,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================

interface FormData {
  school_name: string;
  tax_id: string;
  phone: string;
  email: string;
  website: string;
  postal_code: string;
  street_address: string;
  city: string;
  state: string;
  address_complement: string;
  about: string;
  teaching_levels: {
    elementary: boolean;
    high_school: boolean;
    preschool: boolean;
  };
}

type TabType = 'identity' | 'contact' | 'location' | 'about' | 'teaching';

// ============================================
// TABS CONFIG
// ============================================

const TABS = [
  { id: 'identity' as TabType, label: 'Identificação', icon: Building2 },
  { id: 'contact' as TabType, label: 'Contato', icon: Phone },
  { id: 'location' as TabType, label: 'Localização', icon: MapPin },
  { id: 'about' as TabType, label: 'Sobre', icon: FileText },
  { id: 'teaching' as TabType, label: 'Ensino', icon: GraduationCap },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function Information() {
  // ============================================
  // API HOOKS
  // ============================================
  
  const { data: schoolsData, isLoading, error, refetch } = useGetSchoolsQuery({});
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  // ============================================
  // STATE
  // ============================================
  
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [escolaAtualId, setEscolaAtualId] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    school_name: '',
    tax_id: '',
    phone: '',
    email: '',
    website: '',
    postal_code: '',
    street_address: '',
    city: '',
    state: '',
    address_complement: '',
    about: '',
    teaching_levels: {
      elementary: false,
      high_school: false,
      preschool: false,
    }
  });

  const [originalData, setOriginalData] = useState<FormData>(formData);

  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    if (schoolsData?.results && schoolsData.results.length > 0) {
      const escola = schoolsData.results[0];
      setEscolaAtualId(escola.id);
      
      const loadedData: FormData = {
        school_name: escola.school_name || '',
        tax_id: escola.tax_id || '',
        phone: escola.phone || '',
        email: escola.email || '',
        website: escola.website || '',
        postal_code: escola.postal_code || '',
        street_address: escola.street_address || '',
        city: escola.city || '',
        state: escola.state || '',
        address_complement: escola.address_complement || '',
        about: escola.about || '',
        teaching_levels: {
          elementary: escola.teaching_levels?.elementary || false,
          high_school: escola.teaching_levels?.high_school || false,
          preschool: escola.teaching_levels?.preschool || false,
        }
      };
      
      setFormData(loadedData);
      setOriginalData(loadedData);
    }
  }, [schoolsData]);

  // Detect changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData['teaching_levels']): void => {
    setFormData(prev => ({
      ...prev,
      teaching_levels: {
        ...prev.teaching_levels,
        [field]: !prev.teaching_levels[field]
      }
    }));
  };

  const handleSave = async (): Promise<void> => {
    if (!escolaAtualId) {
      toast.error('Nenhuma escola selecionada');
      return;
    }

    try {
      const dataToUpdate = {
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        postal_code: formData.postal_code,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        address_complement: formData.address_complement,
        about: formData.about,
        teaching_levels: formData.teaching_levels,
      };

      await updateSchool({
        id: escolaAtualId,
        data: dataToUpdate
      }).unwrap();

      toast.success('✅ Dados salvos com sucesso!');
      setOriginalData(formData);
      refetch();
      
    } catch (err: any) {
      toast.error(`❌ Erro ao salvar: ${extractErrorMessage(err)}`);
    }
  };

  const handleReset = (): void => {
    setFormData(originalData);
    toast.success('Alterações descartadas');
  };

  const handleRefresh = (): void => {
    refetch();
    toast.success('🔄 Dados atualizados!');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando informações da escola...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-md text-center"
        >
          <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
          <h3 className="text-xl font-bold text-red-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-red-700 mb-4">{extractErrorMessage(error)}</p>
          <button 
            onClick={() => refetch()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
          >
            Tentar Novamente
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  
  if (!schoolsData?.results || schoolsData.results.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 max-w-md text-center"
        >
          <AlertCircle className="mx-auto mb-4 text-yellow-600" size={48} />
          <h3 className="text-xl font-bold text-yellow-900 mb-2">Nenhuma escola cadastrada</h3>
          <p className="text-yellow-700">Entre em contato com o administrador.</p>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  
  const school = schoolsData.results[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* ============================================
            HEADER COM INFO DA ESCOLA
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Logo/Avatar */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-2xl flex items-center justify-center shadow-2xl">
                <Building2 className="text-white" size={40} />
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {school.school_name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  {school.tax_id && (
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>CNPJ: {school.tax_id}</span>
                    </div>
                  )}
                  {school.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{school.city}/{school.state}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center border border-white/20">
                <Users className="mx-auto mb-2 text-white" size={24} />
                <p className="text-2xl font-bold text-white">
                  {Object.values(school.teaching_levels || {}).filter(Boolean).length}
                </p>
                <p className="text-sm text-white/80 mt-1">Níveis</p>
              </div>
              
              <button
                onClick={handleRefresh}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 hover:bg-white/20 transition group"
              >
                <RefreshCw className="mx-auto mb-2 text-white group-hover:rotate-180 transition-transform duration-500" size={24} />
                <p className="text-sm text-white/80">Atualizar</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ============================================
            TABS NAVIGATION
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2"
        >
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ============================================
            ALERT DE MUDANÇAS NÃO SALVAS
        ============================================ */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-orange-600" size={24} />
                  <div>
                    <p className="font-semibold text-orange-900">Você tem alterações não salvas</p>
                    <p className="text-sm text-orange-700">Salve suas alterações para não perdê-las</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-white border-2 border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition font-semibold"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={18} />
                    {isUpdating ? 'Salvando...' : 'Salvar Agora'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================
            TAB CONTENT
        ============================================ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'identity' && <IdentityTab formData={formData} />}
            {activeTab === 'contact' && (
              <ContactTab 
                formData={formData} 
                onChange={handleInputChange}
              />
            )}
            {activeTab === 'location' && (
              <LocationTab 
                formData={formData} 
                onChange={handleInputChange}
              />
            )}
            {activeTab === 'about' && (
              <AboutTab 
                formData={formData} 
                onChange={handleInputChange}
              />
            )}
            {activeTab === 'teaching' && (
              <TeachingTab 
                formData={formData} 
                onChange={handleCheckboxChange}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ============================================
            BOTÃO DE SALVAR FIXO
        ============================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sticky bottom-6 z-10"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Save className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Configurações da Escola</p>
                  <p className="text-sm text-gray-600">
                    {hasChanges ? 'Alterações pendentes' : 'Tudo salvo'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {hasChanges && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                  >
                    Descartar
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={isUpdating || !hasChanges}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  <Save size={20} />
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// ============================================
// IDENTITY TAB (Read-only)
// ============================================

interface IdentityTabProps {
  formData: FormData;
}

function IdentityTab({ formData }: IdentityTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* School Name */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Nome da Escola</h3>
            <p className="text-sm text-gray-500">Identificação oficial</p>
          </div>
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.school_name}
            disabled
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold cursor-not-allowed"
          />
        </div>
        
        <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-800">
              O nome da escola é um campo protegido. Entre em contato com o suporte para alterações.
            </p>
          </div>
        </div>
      </div>

      {/* Tax ID (CNPJ) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Shield className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">CNPJ</h3>
            <p className="text-sm text-gray-500">Cadastro Nacional</p>
          </div>
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={formData.tax_id}
            disabled
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold cursor-not-allowed"
          />
        </div>
        
        <div className="mt-4 bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start gap-3">
            <Shield className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-purple-800">
              Documento fiscal protegido. Alterações requerem validação administrativa.
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="text-white" size={28} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Informações de Identificação
              </h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Os dados de identificação (nome e CNPJ) são campos protegidos que não podem ser alterados 
                diretamente através desta interface. Isso garante a integridade dos dados cadastrais e 
                conformidade com regulamentações educacionais.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-indigo-200">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm font-semibold text-gray-700">Dados Verificados</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-indigo-200">
                  <Shield className="text-blue-600" size={16} />
                  <span className="text-sm font-semibold text-gray-700">Protegido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTACT TAB
// ============================================

interface ContactTabProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

function ContactTab({ formData, onChange }: ContactTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Phone */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Phone className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Telefone</h3>
            <p className="text-sm text-gray-500">Contato principal</p>
          </div>
        </div>
        
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="(11) 98765-4321"
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Mail className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">E-mail</h3>
            <p className="text-sm text-gray-500">Contato institucional</p>
          </div>
        </div>
        
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="contato@escola.com"
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Website */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Globe className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Website</h3>
              <p className="text-sm text-gray-500">Endereço do site oficial</p>
            </div>
          </div>
          
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="url"
              value={formData.website}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://www.escola.com.br"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
          <div className="flex items-start gap-4">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Dicas de Preenchimento</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Mantenha seus dados de contato sempre atualizados para facilitar a comunicação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>O telefone deve incluir DDD e estar no formato correto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Use um e-mail institucional para maior credibilidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>O website deve começar com https:// ou http://</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOCATION TAB
// ============================================

interface LocationTabProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

function LocationTab({ formData, onChange }: LocationTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <MapPin className="text-orange-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Endereço Completo</h3>
            <p className="text-sm text-gray-500">Localização da escola</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CEP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CEP
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => onChange('postal_code', e.target.value)}
              placeholder="12345-678"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Endereço */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={formData.street_address}
              onChange={(e) => onChange('street_address', e.target.value)}
              placeholder="Rua das Flores, 123"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="São Paulo"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="SP"
              maxLength={2}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all uppercase"
            />
          </div>

          {/* Complemento */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complemento (Opcional)
            </label>
            <input
              type="text"
              value={formData.address_complement}
              onChange={(e) => onChange('address_complement', e.target.value)}
              placeholder="Sala 10, Andar 2"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="text-orange-600" size={24} />
          <h4 className="font-bold text-gray-900">Localização no Mapa</h4>
        </div>
        <div className="bg-white rounded-xl border-2 border-orange-200 h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-orange-400" size={48} />
            <p className="text-gray-600">Visualização de mapa em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ABOUT TAB
// ============================================

interface AboutTabProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

function AboutTab({ formData, onChange }: AboutTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <FileText className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sobre a Escola</h3>
            <p className="text-sm text-gray-500">História, missão e valores</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Descrição Institucional
          </label>
          <textarea
            value={formData.about}
            onChange={(e) => onChange('about', e.target.value)}
            placeholder="Conte a história da sua escola, sua missão, visão e valores. Esta informação será exibida para pais e responsáveis..."
            rows={10}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none"
          />
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">
              {formData.about.length} caracteres
            </p>
            <p className="text-gray-400">
              Recomendado: 200-500 palavras
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
        <div className="flex items-start gap-4">
          <Sparkles className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Sugestões de Conteúdo</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span><strong>História:</strong> Quando a escola foi fundada e por quem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span><strong>Missão:</strong> Qual o propósito educacional da instituição</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span><strong>Valores:</strong> Princípios que norteiam as atividades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span><strong>Diferenciais:</strong> O que torna sua escola única</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span><strong>Metodologia:</strong> Abordagem pedagógica utilizada</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TEACHING TAB
// ============================================

interface TeachingTabProps {
  formData: FormData;
  onChange: (field: keyof FormData['teaching_levels']) => void;
}

function TeachingTab({ formData, onChange }: TeachingTabProps) {
  const levels = [
    {
      id: 'preschool' as keyof FormData['teaching_levels'],
      title: 'Educação Infantil',
      description: 'Creche e pré-escola (0 a 5 anos)',
      icon: '👶',
      color: 'from-pink-500 to-rose-600',
      checked: formData.teaching_levels.preschool,
    },
    {
      id: 'elementary' as keyof FormData['teaching_levels'],
      title: 'Ensino Fundamental',
      description: '1º ao 9º ano (6 a 14 anos)',
      icon: '📚',
      color: 'from-blue-500 to-indigo-600',
      checked: formData.teaching_levels.elementary,
    },
    {
      id: 'high_school' as keyof FormData['teaching_levels'],
      title: 'Ensino Médio',
      description: '1º ao 3º ano (15 a 17 anos)',
      icon: '🎓',
      color: 'from-purple-500 to-violet-600',
      checked: formData.teaching_levels.high_school,
    },
  ];

  const activeCount = Object.values(formData.teaching_levels).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Níveis de Ensino</h3>
              <p className="text-sm text-gray-500">Selecione os níveis oferecidos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-green-50 rounded-xl border-2 border-green-200">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-xs text-green-700 font-semibold">Ativo{activeCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <label
              className={`block cursor-pointer group ${
                level.checked ? 'ring-4 ring-offset-2 ring-green-200' : ''
              }`}
            >
              <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                level.checked
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${level.color} p-6 rounded-t-xl`}>
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border border-white/30">
                      {level.icon}
                    </div>
                    <input
                      type="checkbox"
                      checked={level.checked}
                      onChange={() => onChange(level.id)}
                      className="w-7 h-7 rounded-lg border-2 border-white checked:bg-white checked:text-green-600 focus:ring-4 focus:ring-white/50 transition cursor-pointer"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {level.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {level.description}
                  </p>

                  {level.checked && (
                    <div className="mt-4 flex items-center gap-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="text-sm font-semibold">Nível Ativo</span>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Info className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Sobre os Níveis de Ensino
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Selecione todos os níveis de ensino que sua escola oferece. Esta informação ajuda 
              pais e responsáveis a encontrar a escola adequada para seus filhos e aparece nos 
              resultados de busca e perfil institucional.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-blue-600" size={16} />
              <span className="text-gray-600">
                Você pode alterar essas configurações a qualquer momento
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}