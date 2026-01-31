// src/components/Dashboard/MetricCard.tsx

import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;  // Percentual de mudança
  period?: string;  // Ex: "vs mês anterior"
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-100',
  },
  green: {
    bg: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    ring: 'ring-green-100',
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    ring: 'ring-orange-100',
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    ring: 'ring-purple-100',
  },
};

export default function MetricCard({
  title,
  value,
  change,
  period = 'vs mês anterior',
  icon,
  color,
  loading = false,
}: MetricCardProps) {
  
  const colors = colorClasses[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${colors.bg} p-6`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${colors.light}`}>
              {isPositive ? (
                <TrendingUp size={16} className={colors.text} />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span className={`text-sm font-bold ${isPositive ? colors.text : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
        
        {loading ? (
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        ) : (
          <>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {period && change !== undefined && (
              <p className="text-xs text-gray-500">{period}</p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// USO:
// <MetricCard
//   title="Leads Capturados"
//   value={245}
//   change={12}
//   icon={<Users className="text-blue-600" size={24} />}
//   color="blue"
// />