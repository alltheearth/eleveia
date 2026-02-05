// src/pages/Dashboard/components/LeadsFunnelChart.tsx
// 📊 GRÁFICO DE FUNIL DE LEADS

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface FunnelData {
  name: string;
  value: number;
  color: string;
}

interface LeadsFunnelChartProps {
  data: FunnelData[];
  loading?: boolean;
}

export default function LeadsFunnelChart({ data, loading = false }: LeadsFunnelChartProps) {
  
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Funil de Conversão
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Distribuição de leads por estágio
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 font-semibold">Total Ativo</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
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
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda com percentuais */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.map((item) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
          return (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{item.name}</p>
                <p className="text-sm font-bold text-gray-900">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}