// src/pages/Login/index.tsx - VERSÃO PROFISSIONAL

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, Shield, Zap, Users } from 'lucide-react';
import { useLoginMutation } from '../../../services';

export default function LoginProfessional() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* ========== LADO ESQUERDO: Hero Section ========== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        
        {/* Padrão decorativo de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          
          {/* Logo + Nome */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">ELEVE.IA</h1>
                <p className="text-blue-200 text-sm">Gestão Escolar Inteligente</p>
              </div>
            </div>
          </div>

          {/* Proposta de valor */}
          <div className="mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
              Transforme a gestão da sua escola com inteligência artificial
            </h2>
            <p className="text-xl text-blue-100">
              Automatize processos, melhore a comunicação e tome decisões baseadas em dados.
            </p>
          </div>

          {/* Features visuais */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Segurança e conformidade com LGPD' },
              { icon: Zap, text: 'Respostas automáticas 24/7 com IA' },
              { icon: Users, text: 'Comunicação eficiente com responsáveis' },
              { icon: CheckCircle2, text: 'Gestão completa de leads e matrículas' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                  <feature.icon size={20} />
                </div>
                <span className="text-lg font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-blue-200 text-sm">Escolas conectadas</p>
              </div>
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-blue-200 text-sm">Satisfação</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-blue-200 text-sm">Suporte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== LADO DIREITO: Formulário ========== */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ELEVE.IA</h1>
            </div>
          </div>

          {/* Card de login */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            
            {/* Cabeçalho */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-gray-600">
                Acesse sua conta para continuar
              </p>
            </div>

            {/* Erro */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs">✕</span>
                </div>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email/Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email ou Usuário
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="seu@email.com"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Lembrar-me + Esqueci senha */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Lembrar-me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão de login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Registro */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  Solicite uma demonstração
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 ELEVE.IA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}