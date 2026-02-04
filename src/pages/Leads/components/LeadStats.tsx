// EXEMPLO: LeadStats.tsx REFATORADO
// src/pages/Leads/components/LeadStats.tsx

import { StatCard } from '../../../components/common';
import { 
  Users, 
  TrendingUp, 
  Phone,
  UserCheck,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================

interface LeadStatsProps {
  stats: {
    total: number;
    novo: number;
    contato: number;
    qualificado: number;
    conversao: number;
    perdido: number;
    taxa_conversao: number;
    novos_hoje: number;
  };
  loading?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function LeadStats({ stats, loading = false }: LeadStatsProps) {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="bg-gray-200 h-24" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalAtivos = stats.total - stats.perdido;

  return (
    <div className="space-y-6 mb-6">
      
      {/* ========================================== */}
      {/* STATS PRINCIPAIS - Linha 1 */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total de Leads */}
        <StatCard
          label="Total de Leads"
          value={stats.total}
          icon={<Users size={24} className="text-blue-600" />}
          color="blue"
          subtitle="Todos os leads cadastrados"
        />

        {/* Novos Leads */}
        <StatCard
          label="Novos Leads"
          value={stats.novo}
          change={12}
          icon={<Sparkles size={24} className="text-yellow-600" />}
          color="yellow"
          subtitle={`${stats.novos_hoje} novos hoje`}
        />

        {/* Em Contato */}
        <StatCard
          label="Em Contato"
          value={stats.contato}
          icon={<Phone size={24} className="text-purple-600" />}
          color="purple"
          subtitle="Sendo trabalhados"
        />

        {/* Qualificados */}
        <StatCard
          label="Qualificados"
          value={stats.qualificado}
          change={8}
          icon={<UserCheck size={24} className="text-orange-600" />}
          color="orange"
          subtitle="Prontos para conversão"
        />
      </div>

      {/* ========================================== */}
      {/* STATS PRINCIPAIS - Linha 2 */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Convertidos */}
        <StatCard
          label="Convertidos"
          value={stats.conversao}
          change={15}
          icon={<CheckCircle2 size={24} className="text-green-600" />}
          color="green"
          subtitle="Matrículas confirmadas"
        />

        {/* Taxa de Conversão */}
        <StatCard
          label="Taxa de Conversão"
          value={stats.taxa_conversao}
          percentage
          change={3}
          icon={<TrendingUp size={24} className="text-blue-600" />}
          color="blue"
          subtitle={`${stats.conversao} de ${stats.total}`}
        />

        {/* Leads Ativos */}
        <StatCard
          label="Leads Ativos"
          value={totalAtivos}
          icon={<Users size={24} className="text-purple-600" />}
          color="purple"
          subtitle="Em processo"
        />

        {/* Perdidos */}
        <StatCard
          label="Perdidos"
          value={stats.perdido}
          change={-5}
          icon={<XCircle size={24} className="text-red-600" />}
          color="red"
          subtitle={`${((stats.perdido / stats.total) * 100).toFixed(1)}% do total`}
        />
      </div>

      {/* ========================================== */}
      {/* FUNIL VISUAL (Permanece específico) */}
      {/* ========================================== */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Funil de Conversão
            </h3>
            <p className="text-sm text-gray-500 mt-1">Pipeline de leads ativo</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-semibold">Total Ativo</p>
            <p className="text-2xl font-bold text-gray-900">{totalAtivos}</p>
          </div>
        </div>

        {/* Funil visual */}
        <div className="space-y-3">
          {[
            { label: 'Novos', value: stats.novo, color: 'from-blue-500 to-blue-600', width: 100, icon: '🆕' },
            { label: 'Em Contato', value: stats.contato, color: 'from-yellow-500 to-yellow-600', width: 75, icon: '📞' },
            { label: 'Qualificados', value: stats.qualificado, color: 'from-purple-500 to-purple-600', width: 50, icon: '⭐' },
            { label: 'Convertidos', value: stats.conversao, color: 'from-green-500 to-green-600', width: 30, icon: '✅' },
          ].map((stage, index) => (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-lg">{stage.icon}</span>
                  {stage.label}
                </span>
                <span className="text-sm font-bold text-gray-900">{stage.value}</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.width}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-10 bg-gradient-to-r ${stage.color} rounded-xl flex items-center justify-end px-4 shadow-md`}
              >
                <span className="text-white font-bold">
                  {totalAtivos > 0 ? ((stage.value / totalAtivos) * 100).toFixed(0) : 0}%
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}