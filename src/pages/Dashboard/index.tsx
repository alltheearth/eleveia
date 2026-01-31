// src/pages/Dashboard/index.tsx
// 🎯 DASHBOARD PROFISSIONAL - ELEVE.IA

import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  UserPlus,
  Phone,
  // Mail,
  CheckCircle2,
  XCircle,
  // Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  // LineChart,
  // Line,
  // BarChart,
  // Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { useGetContactsQuery, useGetEventsQuery, useGetLeadsQuery } from '../../services';
// import { useGetLeadsQuery } from '../../services/leadsApi';
// import { useGetContactsQuery } from '../../services/contactsApi';
// import { useGetEventsQuery } from '../../services/eventsApi';

// ============================================
// METRIC CARD COMPONENT
// ============================================
interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  period?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  loading?: boolean;
  subtitle?: string;
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-100',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    ring: 'ring-green-100',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    ring: 'ring-orange-100',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    ring: 'ring-purple-100',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    ring: 'ring-red-100',
  },
};

function MetricCard({
  title,
  value,
  change,
  period = 'vs mês anterior',
  icon,
  color,
  loading = false,
  subtitle,
}: MetricCardProps) {
  const colors = colorClasses[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-6 pt-6 pb-4`}>
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 ${colors.light} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${colors.light} shadow-sm`}>
              {isPositive ? (
                <ArrowUpRight size={16} className={colors.text} />
              ) : (
                <ArrowDownRight size={16} className="text-red-600" />
              )}
              <span className={`text-sm font-bold ${isPositive ? colors.text : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-5">
        <p className="text-sm text-gray-600 font-medium mb-2 uppercase tracking-wide">
          {title}
        </p>
        
        {loading ? (
          <div className="space-y-3">
            <div className="h-9 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <>
            <p className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
              {value}
            </p>
            {subtitle ? (
              <p className="text-sm text-gray-500">{subtitle}</p>
            ) : (
              period && change !== undefined && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {period}
                </p>
              )
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIVITY FEED COMPONENT
// ============================================
interface Activity {
  id: string;
  type: 'lead' | 'contact' | 'event' | 'conversion';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Atividades Recentes</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
          Ver todas
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex gap-4 items-start p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm mb-1">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// QUICK STATS COMPONENT
// ============================================
interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function QuickStats({ stats }: { stats: QuickStat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// CHART COMPONENT - CONVERSÃO DE LEADS
// ============================================
function LeadConversionChart({ data }: { data: any[] }) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Funil de Conversão</h3>
          <p className="text-sm text-gray-500 mt-1">Status dos leads ativos</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda personalizada */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700">
              {item.name}: <span className="font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// CHART COMPONENT - TENDÊNCIA MENSAL
// ============================================
function MonthlyTrendChart({ data }: { data: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Tendência Mensal</h3>
          <p className="text-sm text-gray-500 mt-1">Leads captados nos últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConversoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="mes" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="leads" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorLeads)"
              name="Leads Capturados"
            />
            <Area 
              type="monotone" 
              dataKey="conversoes" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorConversoes)"
              name="Conversões"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function Dashboard() {
  const { data: leads = [], isLoading: leadsLoading } = useGetLeadsQuery({});
  const { data: contacts = []} = useGetContactsQuery({});
  const { data: events = []} = useGetEventsQuery({});

  // Ensure leads, contacts and events are arrays
  const leadsArray = Array.isArray(leads) ? leads : [];
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const eventsArray = Array.isArray(events) ? events : [];

  // Calcular métricas
  const totalLeads = leadsArray.length;
  const leadsNovos = leadsArray.filter((l: any) => l.status === 'novo').length;
  const leadsConversao = leadsArray.filter((l: any) => l.status === 'conversao').length;
  const taxaConversao = totalLeads > 0 ? ((leadsConversao / totalLeads) * 100).toFixed(1) : 0;

  // Dados do funil
  const funnelData = [
    { name: 'Novo', value: leadsArray.filter((l: any) => l.status === 'novo').length },
    { name: 'Contato', value: leadsArray.filter((l: any) => l.status === 'contato').length },
    { name: 'Qualificado', value: leadsArray.filter((l: any) => l.status === 'qualificado').length },
    { name: 'Conversão', value: leadsArray.filter((l: any) => l.status === 'conversao').length },
    { name: 'Perdido', value: leadsArray.filter((l: any) => l.status === 'perdido').length },
  ];

  // Dados de tendência mensal (mock - substituir por dados reais)
  const trendData = [
    { mes: 'Jul', leads: 65, conversoes: 28 },
    { mes: 'Ago', leads: 89, conversoes: 42 },
    { mes: 'Set', leads: 78, conversoes: 35 },
    { mes: 'Out', leads: 94, conversoes: 51 },
    { mes: 'Nov', leads: 112, conversoes: 67 },
    { mes: 'Dez', leads: 98, conversoes: 58 },
  ];

  // Atividades recentes (mock - substituir por dados reais)
  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'lead',
      title: 'Novo Lead Capturado',
      description: 'Maria Silva entrou em contato via WhatsApp',
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
      description: 'Pedro Oliveira - telefone alterado',
      time: 'há 3 horas',
      icon: <Phone size={20} className="text-orange-600" />,
      color: 'bg-orange-50',
    },
  ];

  // Quick stats
  const quickStats: QuickStat[] = [
    {
      label: 'Leads Hoje',
      value: leadsNovos,
      icon: <TrendingUp size={20} className="text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      label: 'Contatos',
      value: contactsArray.length,
      icon: <Users size={20} className="text-green-600" />,
      color: 'bg-green-50',
    },
    {
      label: 'Eventos',
      value: eventsArray.length,
      icon: <Calendar size={20} className="text-purple-600" />,
      color: 'bg-purple-50',
    },
    {
      label: 'Taxa Conv.',
      value: `${taxaConversao}%`,
      icon: <CheckCircle2 size={20} className="text-orange-600" />,
      color: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar size={16} />
              Bem-vindo de volta! Aqui está o resumo de hoje.
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all">
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="mb-6">
        <QuickStats stats={quickStats} />
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total de Leads"
          value={totalLeads}
          change={12}
          icon={<Users className="text-blue-600" size={28} />}
          color="blue"
          loading={leadsLoading}
          subtitle="Captados este mês"
        />
        
        <MetricCard
          title="Em Conversão"
          value={leadsConversao}
          change={8}
          icon={<TrendingUp className="text-green-600" size={28} />}
          color="green"
          loading={leadsLoading}
        />
        
        <MetricCard
          title="Taxa de Sucesso"
          value={`${taxaConversao}%`}
          change={5}
          icon={<CheckCircle2 className="text-purple-600" size={28} />}
          color="purple"
          loading={leadsLoading}
        />
        
        <MetricCard
          title="Mensagens"
          value={342}
          change={-3}
          icon={<MessageSquare className="text-orange-600" size={28} />}
          color="orange"
          subtitle="Este mês"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LeadConversionChart data={funnelData} />
        <ActivityFeed activities={recentActivities} />
      </div>

      {/* Monthly Trend */}
      <MonthlyTrendChart data={trendData} />
    </div>
  );
}