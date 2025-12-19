// src/pages/Perfil/index.tsx - ✅ ARQUIVO COMPLETO
import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Building2, Shield, Save, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useGetProfileQuery, useUpdateProfileMutation, extractErrorMessage } from '../../services';

export default function Perfil() {
  const { data: profile, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  // ✅ Carregar dados quando disponível
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  // ✅ Limpar mensagens automaticamente
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // ✅ Validação
  const validarFormulario = (): string | null => {
    if (!formData.first_name.trim()) return 'Nome é obrigatório';
    if (!formData.last_name.trim()) return 'Sobrenome é obrigatório';
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido';
    return null;
  };

  // ✅ Salvar alterações
  const handleSalvar = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await updateProfile(formData).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Perfil atualizado com sucesso!' });
      refetch();
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: `❌ ${extractErrorMessage(err)}` });
    }
  };

  // ✅ LOADING
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-semibold">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} />
            <p className="font-bold">❌ Erro ao carregar perfil</p>
          </div>
          <p className="text-sm mt-2">{extractErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  const user = profile;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
              {user?.last_name?.[0]?.toUpperCase() || ''}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">@{user?.username}</p>
            </div>
          </div>
        </div>

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

        {/* Informações da Conta */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield size={24} className="text-blue-600" />
            Informações da Conta
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Username - Somente leitura */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                ℹ️ Nome de usuário não pode ser alterado
              </p>
            </div>

            {/* Email - Editável */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Nome - Editável */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="João"
              />
            </div>

            {/* Sobrenome - Editável */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Sobrenome *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Silva"
              />
            </div>
          </div>

          {/* Botão Salvar */}
          <button
            onClick={handleSalvar}
            disabled={isUpdating}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            <Save size={20} />
            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        {/* Informações da Escola */}
        {user?.perfil && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 size={24} className="text-blue-600" />
              Informações da Escola
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Escola</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.perfil.escola_nome}
                  </p>
                </div>
                <Building2 className="text-gray-400" size={32} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Tipo de Acesso</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.perfil.tipo_display}
                  </p>
                </div>
                <Shield className="text-gray-400" size={32} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.perfil.ativo ? (
                      <>
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-lg font-semibold text-green-600">Ativo</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-red-600" size={20} />
                        <span className="text-lg font-semibold text-red-600">Inativo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informações do Sistema */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações do Sistema</h2>
          
          <div className="space-y-2 text-sm">
            {user?.is_superuser && (
              <div className="flex items-center gap-2 text-purple-600">
                <Shield size={16} />
                <span className="font-semibold">Superusuário</span>
              </div>
            )}
            
            {user?.is_staff && (
              <div className="flex items-center gap-2 text-blue-600">
                <Shield size={16} />
                <span className="font-semibold">Staff</span>
              </div>
            )}

            <p className="text-gray-600">
              ID do Usuário: <span className="font-mono">{user?.id}</span>
            </p>
            
            {user?.perfil && (
              <p className="text-gray-600">
                ID da Escola: <span className="font-mono">{user.perfil.escola}</span>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}