// src/components/Auth/Login/index.tsx - ✅ CORRIGIDO COM LOGS
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { 
  useLoginMutation, 
  useRegisterMutation,
  extractErrorMessage 
} from '../../../services';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  console.log('🔐 [LOGIN] Componente renderizado, isAuthenticated:', isAuthenticated);

  // ✅ RTK Query Hooks
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const [telaAtual, setTelaAtual] = useState<'login' | 'registro'>('login');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirm] = useState(false);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registroData, setRegistroData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    termo: false
  });

  const [erro, setErro] = useState('');

  // ✅ Redirecionar quando autenticado
  useEffect(() => {
    console.log('🔍 [LOGIN] useEffect autenticação, isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('✅ [LOGIN] Usuário autenticado, redirecionando para /dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ✅ Handler de Login
  const handleLogin = async () => {
    setErro('');

    // Validação
    if (!loginData.username || !loginData.password) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      console.log('🔐 [LOGIN] Tentando login com:', loginData.username);
      
      const result = await login({
        username: loginData.username,
        password: loginData.password,
      }).unwrap();

      console.log('✅ [LOGIN] Login bem-sucedido!');
      console.log('📦 [LOGIN] Dados recebidos:', result);
      
      // Verificar se token foi salvo
      const tokenSalvo = localStorage.getItem('eleve_token');
      console.log('💾 [LOGIN] Token no localStorage:', tokenSalvo ? tokenSalvo.substring(0, 20) + '...' : 'NÃO ENCONTRADO!');
      
      // Não precisa fazer navigate manualmente, o useEffect acima fará isso
      
    } catch (err: any) {
      console.error('❌ [LOGIN] Erro no login:', err);
      setErro(extractErrorMessage(err));
    }
  };

  // ✅ Handler de Registro
  const handleRegistro = async () => {
    setErro('');

    // Validação
    if (!registroData.first_name || !registroData.last_name || 
        !registroData.username || !registroData.email || !registroData.password) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    if (registroData.password !== registroData.password2) {
      setErro('As senhas não coincidem');
      return;
    }

    if (registroData.password.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (!registroData.termo) {
      setErro('Você deve aceitar os termos de uso');
      return;
    }

    try {
      console.log('📝 [LOGIN] Tentando registro...');
      
      await register({
        first_name: registroData.first_name,
        last_name: registroData.last_name,
        username: registroData.username,
        email: registroData.email,
        password: registroData.password,
        password2: registroData.password2,
      }).unwrap();

      console.log('✅ [LOGIN] Registro bem-sucedido');
      // Redirecionamento acontece pelo useEffect acima
      
    } catch (err: any) {
      console.error('❌ [LOGIN] Erro no registro:', err);
      setErro(extractErrorMessage(err));
    }
  };

  // ✅ TELA DE LOGIN
  if (telaAtual === 'login') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        {/* Lado Esquerdo - Informações */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center text-white p-12">
          <div className="max-w-md">
            <div className="text-5xl font-bold mb-6">🎓</div>
            <h1 className="text-4xl font-bold mb-4">ELEVE.IA</h1>
            <p className="text-xl mb-8 opacity-90">
              Transforme sua escola com um agente de IA inteligente
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Responda dúvidas automaticamente 24/7</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Capture leads de interessados</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Melhore a comunicação com pais e alunos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-md">
            {/* Logo Mobile */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-4xl mb-2">🎓</div>
              <h1 className="text-3xl font-bold text-white">ELEVE.IA</h1>
            </div>

            {/* Card de Login */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h2>
              <p className="text-gray-600 mb-8">Faça login para acessar sua conta</p>

              {/* Mensagem de Erro */}
              {erro && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  ❌ {erro}
                </div>
              )}

              <div className="space-y-4">
                {/* Usuário */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Usuário</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="seu_usuario"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      disabled={isLoggingIn}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      disabled={isLoggingIn}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Botão Login */}
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

              {/* Link para Registro */}
              <p className="text-center text-gray-600 mt-6">
                Não tem conta?{' '}
                <button
                  onClick={() => setTelaAtual('registro')}
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  Registre-se aqui
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ TELA DE REGISTRO
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="w-full flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h2>
          <p className="text-gray-600 mb-6">Preencha os dados para se registrar</p>

          {erro && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              ❌ {erro}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Nome *</label>
                <input
                  type="text"
                  placeholder="João"
                  value={registroData.first_name}
                  onChange={(e) => setRegistroData({ ...registroData, first_name: e.target.value })}
                  disabled={isRegistering}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Sobrenome *</label>
                <input
                  type="text"
                  placeholder="Silva"
                  value={registroData.last_name}
                  onChange={(e) => setRegistroData({ ...registroData, last_name: e.target.value })}
                  disabled={isRegistering}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Usuário *</label>
              <input
                type="text"
                placeholder="seu_usuario"
                value={registroData.username}
                onChange={(e) => setRegistroData({ ...registroData, username: e.target.value })}
                disabled={isRegistering}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email *</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={registroData.email}
                onChange={(e) => setRegistroData({ ...registroData, email: e.target.value })}
                disabled={isRegistering}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Senha *</label>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={registroData.password}
                onChange={(e) => setRegistroData({ ...registroData, password: e.target.value })}
                disabled={isRegistering}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirmar Senha *</label>
              <input
                type={mostrarSenhaConfirm ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={registroData.password2}
                onChange={(e) => setRegistroData({ ...registroData, password2: e.target.value })}
                disabled={isRegistering}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              />
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={registroData.termo}
                onChange={(e) => setRegistroData({ ...registroData, termo: e.target.checked })}
                disabled={isRegistering}
                className="w-4 h-4 mt-1 disabled:opacity-50"
              />
              <span className="text-gray-700 text-sm">
                Concordo com os Termos de Uso *
              </span>
            </label>

            <button
              onClick={handleRegistro}
              disabled={isRegistering}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg disabled:opacity-50"
            >
              {isRegistering ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Já tem conta?{' '}
            <button
              onClick={() => setTelaAtual('login')}
              className="text-blue-600 hover:text-blue-700 font-bold"
            >
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}