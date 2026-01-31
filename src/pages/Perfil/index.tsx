// src/pages/Profile/index.tsx - 🎨 VERSÃO PROFISSIONAL
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Bell,
  Camera,
  Save,
  Lock,
  Key,
  Globe,
  Palette,
  Clock,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================

type TabType = 'profile' | 'security' | 'preferences' | 'activity';

interface UserData {
  name: string;
  email: string;
  phone: string;
  school: string;
  role: string;
  avatar?: string;
}

// ============================================
// TABS CONFIGURATION
// ============================================

const TABS = [
  { id: 'profile' as TabType, label: 'Perfil', icon: User },
  { id: 'security' as TabType, label: 'Segurança', icon: Shield },
  { id: 'preferences' as TabType, label: 'Preferências', icon: Bell },
  { id: 'activity' as TabType, label: 'Atividade', icon: Activity },
];

// ============================================
// PROFILE PAGE COMPONENT
// ============================================

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<UserData>({
    name: 'João Silva',
    email: 'joao.silva@escola.com',
    phone: '(11) 98765-4321',
    school: 'Colégio Exemplo',
    role: 'Administrador',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast.success('Foto carregada! Clique em Salvar para confirmar.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* ============================================
          HEADER WITH AVATAR
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl"
      >
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-white" size={48} />
              )}
            </div>
            
            {/* Upload Button */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span>{userData.school}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span>{userData.role}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center border border-white/20">
              <p className="text-3xl font-bold text-white">127</p>
              <p className="text-sm text-white/80 mt-1">Ações este mês</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center border border-white/20">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-white/80 mt-1">Taxa de resposta</p>
            </div>
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
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6"
      >
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
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
          TAB CONTENT
      ============================================ */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'profile' && <ProfileTab userData={userData} setUserData={setUserData} onSave={handleSave} />}
        {activeTab === 'security' && <SecurityTab showPassword={showPassword} setShowPassword={setShowPassword} />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'activity' && <ActivityTab />}
      </motion.div>
    </div>
  );
}

// ============================================
// PROFILE TAB
// ============================================

interface ProfileTabProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onSave: () => void;
}

function ProfileTab({ userData, setUserData, onSave }: ProfileTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          Informações Pessoais
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="text-blue-600" size={24} />
          Informações da Escola
        </h3>

        <div className="space-y-4">
          {/* School */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Escola
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={userData.school}
                onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="Nome da escola"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Entre em contato com o suporte para alterar
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cargo
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={userData.role}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                disabled
              />
            </div>
          </div>

          {/* Permissions Badge */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Permissões Administrativas</p>
                <p className="text-sm text-gray-600">
                  Você possui acesso total a todas as funcionalidades do sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="lg:col-span-2">
        <button
          onClick={onSave}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

// ============================================
// SECURITY TAB
// ============================================

interface SecurityTabProps {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

function SecurityTab({ showPassword, setShowPassword }: SecurityTabProps) {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('As senhas não coincidem!');
      return;
    }
    toast.success('Senha alterada com sucesso!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lock className="text-blue-600" size={24} />
          Alterar Senha
        </h3>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="Digite sua senha atual"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="Digite sua nova senha"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="Confirme sua nova senha"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="text-blue-600" size={24} />
          Autenticação em Duas Etapas
        </h3>

        <div className="space-y-4">
          {/* 2FA Status */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-900 mb-1">2FA Ativado</p>
                <p className="text-sm text-gray-600">
                  Sua conta está protegida com autenticação de dois fatores.
                </p>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3">Dicas de Segurança</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Use uma senha forte com letras, números e símbolos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Não compartilhe sua senha com outras pessoas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Ative a autenticação em duas etapas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Altere sua senha regularmente</span>
              </li>
            </ul>
          </div>

          <button className="w-full border-2 border-red-500 text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-all">
            Desativar 2FA
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PREFERENCES TAB
// ============================================

function PreferencesTab() {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'pt-BR',
    notifications: {
      email: true,
      push: true,
      leads: true,
      events: true,
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Palette className="text-blue-600" size={24} />
          Aparência
        </h3>

        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tema
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  preferences.theme === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-12 bg-white rounded-lg mb-2 border border-gray-200"></div>
                <p className="font-semibold text-gray-900">Claro</p>
              </button>
              <button
                onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-12 bg-gray-800 rounded-lg mb-2"></div>
                <p className="font-semibold text-gray-900">Escuro</p>
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Idioma
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none bg-white"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="text-blue-600" size={24} />
          Notificações
        </h3>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">E-mail</p>
                <p className="text-sm text-gray-600">Receber notificações por e-mail</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, email: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Push</p>
                <p className="text-sm text-gray-600">Notificações no navegador</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, push: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Leads Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Novos Leads</p>
                <p className="text-sm text-gray-600">Quando um novo lead entrar</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.leads}
                onChange={(e) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, leads: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Events Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className="text-gray-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Eventos</p>
                <p className="text-sm text-gray-600">Lembretes de eventos próximos</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.events}
                onChange={(e) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, events: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="lg:col-span-2">
        <button
          onClick={() => toast.success('Preferências salvas!')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Salvar Preferências
        </button>
      </div>
    </div>
  );
}

// ============================================
// ACTIVITY TAB
// ============================================

function ActivityTab() {
  const activities = [
    {
      id: 1,
      action: 'Criou um novo evento',
      description: 'Reunião de Pais - Ensino Fundamental',
      time: '2 horas atrás',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: 2,
      action: 'Editou um lead',
      description: 'Maria Santos - Status alterado para "Em negociação"',
      time: '5 horas atrás',
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 3,
      action: 'Fez upload de documento',
      description: 'Regimento_Interno_2024.pdf',
      time: '1 dia atrás',
      icon: CheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      id: 4,
      action: 'Alterou configurações',
      description: 'Preferências de notificação atualizadas',
      time: '2 dias atrás',
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="text-blue-600" size={24} />
        Atividade Recente
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={activity.color} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      <button className="w-full mt-6 border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all">
        Ver Todas as Atividades
      </button>
    </div>
  );
}