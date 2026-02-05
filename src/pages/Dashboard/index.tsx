// src/pages/Dashboard/index.REFATORADO.tsx
// 🏠 DASHBOARD REFATORADA - DESIGN PROFISSIONAL E MODULAR

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  MessageSquare,
  Phone,
  UserPlus,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';

// Componentes Reutilizáveis
import { StatCard } from '../../components/common';

// Componentes Locais da Dashboard
import WelcomeHeader from './components/WelcomeHeader';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import LeadsFunnelChart from './components/LeadsFunnelChart';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import UpcomingEvents from './components/UpcomingEvents';

// Hooks e Services
import {
  useGetLeadsQuery,
  useGetContactsQuery,
  useGetEventsQuery,
} from '../../services';
import PageModel from '../../components/layout/PageModel';

// ============================================
// TYPES
// ============================================

interface Activity {
  id: string;
  type: 'lead' | 'conversion' | 'event' | 'contact';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Dashboard() {
  
  // ============================================
  // DATA FETCHING
  // ============================================
  
  const { data: leads = [], isLoading: leadsLoading } = useGetLeadsQuery({});
  const { data: contacts = [] } = useGetContactsQuery({});
  const { data: events = [] } = useGetEventsQuery({});

  // Ensure arrays
  const leadsArray = Array.isArray(leads) ? leads : [];
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const eventsArray = Array.isArray(events) ? events : [];

  // ============================================
  // MÉTRICAS COMPUTADAS
  // ============================================
  
  const metrics = useMemo(() => {
    const total = leadsArray.length;
    const novos = leadsArray.filter((l: any) => l.status === 'novo').length;
    const contato = leadsArray.filter((l: any) => l.status === 'contato').length;
    const qualificado = leadsArray.filter((l: any) => l.status === 'qualificado').length;
    const conversao = leadsArray.filter((l: any) => l.status === 'conversao').length;
    const perdido = leadsArray.filter((l: any) => l.status === 'perdido').length;
    
    const taxaConversao = total > 0 ? Number(((conversao / total) * 100).toFixed(1)) : 0;
    const ativos = total - perdido;

    return {
      total,
      novos,
      contato,
      qualificado,
      conversao,
      perdido,
      taxaConversao,
      ativos,
      contatos: contactsArray.length,
      eventos: eventsArray.length,
    };
  }, [leadsArray, contactsArray, eventsArray]);

  // Dados do funil
  const funnelData = useMemo(() => [
    { name: 'Novo', value: metrics.novos, color: '#3B82F6' },
    { name: 'Contato', value: metrics.contato, color: '#F59E0B' },
    { name: 'Qualificado', value: metrics.qualificado, color: '#8B5CF6' },
    { name: 'Conversão', value: metrics.conversao, color: '#10B981' },
  ], [metrics]);

  // Dados de tendência mensal (mock - substituir por API)
  const trendData = useMemo(() => [
    { mes: 'Jul', leads: 65, conversoes: 28 },
    { mes: 'Ago', leads: 89, conversoes: 42 },
    { mes: 'Set', leads: 78, conversoes: 35 },
    { mes: 'Out', leads: 94, conversoes: 51 },
    { mes: 'Nov', leads: 112, conversoes: 67 },
    { mes: 'Dez', leads: 98, conversoes: 58 },
  ], []);

  // Atividades recentes (mock - substituir por API)
  const activities: Activity[] = useMemo(() => [
    {
      id: '1',
      type: 'lead',
      title: 'Novo Lead Capturado',
      description: 'Maria Silva via WhatsApp',
      time: 'há 5 minutos',
      icon: <UserPlus size={20} className="text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      id: '2',
      type: 'conversion',
      title: 'Conversão Realizada',
      description: 'João Santos confirmou matrícula',
      time: 'há 1 hora',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
      color: 'bg-green-50',
    },
    {
      id: '3',
      type: 'event',
      title: 'Evento Agendado',
      description: 'Reunião com pais - Turma A',
      time: 'há 2 horas',
      icon: <Calendar size={20} className="text-purple-600" />,
      color: 'bg-purple-50',
    },
    {
      id: '4',
      type: 'contact',
      title: 'Contato Atualizado',
      description: 'Pedro Oliveira',
      time: 'há 3 horas',
      icon: <Phone size={20} className="text-orange-600" />,
      color: 'bg-orange-50',
    },
  ], []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageModel>
      {/* ========================================== */}
      {/* WELCOME HEADER */}
      {/* ========================================== */}
      
      <WelcomeHeader />

      {/* ========================================== */}
      {/* MÉTRICAS PRINCIPAIS */}
      {/* ========================================== */}
      
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-600" />
          Visão Geral
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total de Leads */}
          <StatCard
            label="Total de Leads"
            value={metrics.total}
            change={12}
            icon={<Users size={24} className="text-blue-600" />}
            color="blue"
            subtitle="Captados este mês"
          />

          {/* Leads Ativos */}
          <StatCard
            label="Leads Ativos"
            value={metrics.ativos}
            change={8}
            icon={<Target size={24} className="text-purple-600" />}
            color="purple"
            subtitle="Em processo"
          />

          {/* Taxa de Conversão */}
          <StatCard
            label="Taxa de Conversão"
            value={metrics.taxaConversao}
            percentage
            change={5}
            icon={<TrendingUp size={24} className="text-green-600" />}
            color="green"
            subtitle={`${metrics.conversao} convertidos`}
          />

          {/* Contatos */}
          <StatCard
            label="Total de Contatos"
            value={metrics.contatos}
            icon={<Phone size={24} className="text-orange-600" />}
            color="orange"
            subtitle="Na base de dados"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* FUNIL DE LEADS */}
      {/* ========================================== */}
      
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Pipeline de Leads
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Novos */}
          <StatCard
            label="Novos Leads"
            value={metrics.novos}
            change={15}
            icon={<UserPlus size={24} className="text-blue-600" />}
            color="blue"
            subtitle="Aguardando contato"
            variant="compact"
          />

          {/* Em Contato */}
          <StatCard
            label="Em Contato"
            value={metrics.contato}
            icon={<Phone size={24} className="text-yellow-600" />}
            color="yellow"
            subtitle="Sendo trabalhados"
            variant="compact"
          />

          {/* Qualificados */}
          <StatCard
            label="Qualificados"
            value={metrics.qualificado}
            change={10}
            icon={<CheckCircle2 size={24} className="text-purple-600" />}
            color="purple"
            subtitle="Prontos p/ conversão"
            variant="compact"
          />

          {/* Convertidos */}
          <StatCard
            label="Convertidos"
            value={metrics.conversao}
            change={20}
            icon={<CheckCircle2 size={24} className="text-green-600" />}
            color="green"
            subtitle="Matrículas confirmadas"
            variant="compact"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* AÇÕES RÁPIDAS */}
      {/* ========================================== */}
      
      <QuickActions />

      {/* ========================================== */}
      {/* GRÁFICOS E ATIVIDADES */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Funil */}
        <LeadsFunnelChart data={funnelData} loading={leadsLoading} />
        
        {/* Feed de Atividades */}
        <ActivityFeed activities={activities} />
      </div>

      {/* ========================================== */}
      {/* TENDÊNCIA MENSAL E EVENTOS */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Tendência (2 colunas) */}
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={trendData} />
        </div>
        
        {/* Próximos Eventos (1 coluna) */}
        <div className="lg:col-span-1">
          <UpcomingEvents events={eventsArray.slice(0, 5)} />
        </div>
      </div>
    </PageModel>
    </div>
  );
}