// src/components/Auth/Login/index.tsx - CORRIGIDO
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { loginUser, registerUser } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [telaAtual, setTelaAtual] = useState<'login' | 'registro'>('login');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirm, setMostrarSenhaConfirm] = useState(false);
  
  const [login, setLogin] = useState({
    username: '',
    password: '',
  });

  const [registro, setRegistro] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    termo: false
  });

  const [erroLocal, setErroLocal] = useState('');

  // ✅ REDIRECIONAR quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Usuário autenticado, redirecionando...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    setErroLocal('');

    if (!login.username || !login.password) {
      setErroLocal('Preencha todos os campos');
      return;
    }

    try {
      console.log('🔐 Tentando login...');
      
      const result = await dispatch(
        loginUser({
          username: login.username,
          password: login.password,
        })
      ).unwrap();

      console.log('✅ Login bem-sucedido:', result);
      // O redirecionamento acontecerá pelo useEffect acima
      
    } catch (err: any) {
      console.error('❌ Erro no login:', err);
      setErroLocal(err || 'Erro ao fazer login');
    }
  };

  const handleRegistro = async () => {
    setErroLocal('');

    if (!registro.first_name || !registro.last_name || !registro.username || 
        !registro.email || !registro.password) {
      setErroLocal('Preencha todos os campos obrigatórios');
      return;
    }

    if (registro.password !== registro.password2) {
      setErroLocal('As senhas não coincidem');
      return;
    }

    if (!registro.termo) {
      setErroLocal('Você deve aceitar os termos de uso');
      return;
    }

    try {
      console.log('📝 Tentando registro...');
      
      await dispatch(
        registerUser({
          first_name: registro.first_name,
          last_name: registro.last_name,
          username: registro.username,
          email: registro.email,
          password: registro.password,
          password2: registro.password2,
        })
      ).unwrap();

      console.log('✅ Registro bem-sucedido');
      // O redirecionamento acontecerá pelo useEffect acima
      
    } catch (err: any) {
      console.error('❌ Erro no registro:', err);
      setErroLocal(err || 'Erro ao registrar');
    }
  };

  // Mostrar erro global se existir
  const displayError = erroLocal || error;

  if (telaAtual === 'login') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-600 to-blue-900">
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

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <div className="text-4xl mb-2">🎓</div>
              <h1 className="text-3xl font-bold text-blue-600">ELEVE.IA</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h2>
              <p className="text-gray-600 mb-8">Faça login para acessar sua conta</p>

              {displayError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  ❌ {displayError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Usuário</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="seu_usuario"
                      value={login.username}
                      onChange={(e) => setLogin({ ...login, username: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={login.password}
                      onChange={(e) => setLogin({ ...login, password: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      disabled={loading}
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

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar'} <ArrowRight size={20} />
                </button>
              </div>

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

  // TELA DE REGISTRO
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center text-white p-12">
        <div className="max-w-md">
          <div className="text-5xl font-bold mb-6">🎓</div>
          <h1 className="text-4xl font-bold mb-4">ELEVE.IA</h1>
          <p className="text-xl mb-8 opacity-90">Crie sua conta e comece agora</p>

          <div className="bg-white bg-opacity-20 rounded-lg p-6 space-y-3">
            <div className="flex gap-3">
              <CheckCircle size={24} className="flex-shrink-0" />
              <span>Sem necessidade de configuração técnica</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle size={24} className="flex-shrink-0" />
              <span>Teste gratuito por 14 dias</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">🎓</div>
            <h1 className="text-3xl font-bold text-blue-600">ELEVE.IA</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</h2>
            <p className="text-gray-600 mb-8">Teste gratuito por 14 dias</p>

            {displayError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                ❌ {displayError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Nome *</label>
                  <input
                    type="text"
                    placeholder="João"
                    value={registro.first_name}
                    onChange={(e) => setRegistro({ ...registro, first_name: e.target.value })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Sobrenome *</label>
                  <input
                    type="text"
                    placeholder="Silva"
                    value={registro.last_name}
                    onChange={(e) => setRegistro({ ...registro, last_name: e.target.value })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Usuário *</label>
                <input
                  type="text"
                  placeholder="seu_usuario"
                  value={registro.username}
                  onChange={(e) => setRegistro({ ...registro, username: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={registro.email}
                  onChange={(e) => setRegistro({ ...registro, email: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Senha *</label>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={registro.password}
                  onChange={(e) => setRegistro({ ...registro, password: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Confirmar Senha *</label>
                <input
                  type={mostrarSenhaConfirm ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={registro.password2}
                  onChange={(e) => setRegistro({ ...registro, password2: e.target.value })}
                  onFocus={() => setMostrarSenhaConfirm(true)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                />
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={registro.termo}
                  onChange={(e) => setRegistro({ ...registro, termo: e.target.checked })}
                  disabled={loading}
                  className="w-4 h-4 mt-1 disabled:opacity-50"
                />
                <span className="text-gray-700 text-sm">
                  Concordo com os Termos de Uso *
                </span>
              </label>

              <button
                onClick={handleRegistro}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
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
    </div>
  );
}