// src/pages/Boards/components/Board/BoardStats.tsx
// 📊 ESTATÍSTICAS DO BOARD

import { motion } from 'framer-motion';
import { 
  Layout, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

// Types
import type { BoardCard } from '../../../../types/boards';

// ============================================
// TYPES
// ============================================

interface BoardStatsProps {
  cards: BoardCard[];
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  percentage: number;
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({ label, value, total, icon, color, percentage }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${color} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            {icon}
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <ArrowUpRight size={14} className="text-white" />
            <span className="text-xs font-bold text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">/ {total}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${color}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardStats({ cards, loading = false }: BoardStatsProps) {
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

  const activeCards = cards.filter(c => !c.is_archived);
  const total = activeCards.length;

  // Calculate stats
  const withPriority = activeCards.filter(c => c.priority).length;
  const withDueDate = activeCards.filter(c => c.due_date).length;
  const overdue = activeCards.filter(c => {
    if (!c.due_date) return false;
    const dueDate = new Date(c.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;
  const withLabels = activeCards.filter(c => c.labels && c.labels.length > 0).length;

  const priorityPercentage = total > 0 ? Math.round((withPriority / total) * 100) : 0;
  const dueDatePercentage = total > 0 ? Math.round((withDueDate / total) * 100) : 0;
  const overduePercentage = withDueDate > 0 ? Math.round((overdue / withDueDate) * 100) : 0;
  const labelsPercentage = total > 0 ? Math.round((withLabels / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total de Cards"
        value={total}
        total={total}
        percentage={100}
        icon={<Layout className="text-white" size={24} />}
        color="from-blue-500 to-blue-600"
      />

      <StatCard
        label="Com Prioridade"
        value={withPriority}
        total={total}
        percentage={priorityPercentage}
        icon={<TrendingUp className="text-white" size={24} />}
        color="from-purple-500 to-purple-600"
      />

      <StatCard
        label="Com Prazo"
        value={withDueDate}
        total={total}
        percentage={dueDatePercentage}
        icon={<Clock className="text-white" size={24} />}
        color="from-green-500 to-green-600"
      />

      <StatCard
        label="Atrasados"
        value={overdue}
        total={withDueDate || total}
        percentage={overduePercentage}
        icon={<AlertTriangle className="text-white" size={24} />}
        color="from-red-500 to-red-600"
      />
    </div>
  );
}