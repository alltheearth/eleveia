// src/pages/Contacts/components/ContactStats.tsx
// 📊 ESTATÍSTICAS DE CONTATOS

import { motion } from 'framer-motion';
import { 
  Users, 
  FileCheck, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  UserCheck
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface ContactStatsProps {
  stats: {
    total: number;
    ativos: number;
    inativos: number;
    doc_completa: number;
    doc_incompleta: number;
    mensalidades_em_dia: number;
    com_debitos: number;
    solicitacoes_pendentes: number;
    taxa_documentacao: number;
    taxa_adimplencia: number;
  };
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  subtitle?: string;
  percentage?: number;
}

// ============================================
// COLOR CONFIG
// ============================================

const colorConfigs = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
  },
};

// ============================================
// STAT CARD
// ============================================

function StatCard({
  label,
  value,
  change,
  icon,
  color,
  subtitle,
  percentage,
}: StatCardProps) {
  const config = colorConfigs[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${config.gradient} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 ${config.light} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.light}`}>
              {isPositive ? (
                <ArrowUpRight size={14} className={config.text} />
              ) : (
                <ArrowDownRight size={14} className="text-red-600" />
              )}
              <span className={`text-xs font-bold ${isPositive ? config.text : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-4xl font-bold text-gray-900 mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        
        {percentage !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Do total</span>
              <span className="text-xs font-bold text-gray-700">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.gradient}`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ContactStats({ stats, loading = false }: ContactStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Stats principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total de Contatos"
          value={stats.total}
          icon={<Users className="text-blue-600" size={24} />}
          color="blue"
          subtitle={`${stats.ativos} ativos`}
        />

        <StatCard
          label="Documentação Completa"
          value={stats.doc_completa}
          icon={<FileCheck className="text-green-600" size={24} />}
          color="green"
          subtitle={`${stats.taxa_documentacao}% do total`}
          percentage={stats.taxa_documentacao}
        />

        <StatCard
          label="Mensalidades em Dia"
          value={stats.mensalidades_em_dia}
          icon={<DollarSign className="text-purple-600" size={24} />}
          color="purple"
          subtitle={`${stats.taxa_adimplencia}% adimplentes`}
          percentage={stats.taxa_adimplencia}
        />

        <StatCard
          label="Solicitações Pendentes"
          value={stats.solicitacoes_pendentes}
          icon={<ClipboardList className="text-orange-600" size={24} />}
          color="orange"
          subtitle="Aguardando atendimento"
        />
      </div>

      {/* Cards de alerta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="text-white" size={24} />
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Documentação Pendente
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.doc_incompleta}
          </p>
          <p className="text-xs text-gray-500">
            Contatos com documentação incompleta
          </p>

          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs font-semibold text-orange-700">
              ⚠️ Requer atenção
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Com Débitos
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.com_debitos}
          </p>
          <p className="text-xs text-gray-500">
            Contatos com pendências financeiras
          </p>

          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs font-semibold text-red-700">
              🔴 Ação necessária
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="text-white" size={24} />
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Contatos Ativos
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.ativos}
          </p>
          <p className="text-xs text-gray-500">
            {((stats.ativos / stats.total) * 100).toFixed(1)}% do total
          </p>

          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-green-700">
              ✅ Status positivo
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}