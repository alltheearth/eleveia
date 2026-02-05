// src/pages/Campaigns/components/CampaignAnalytics/index.tsx
// 📊 ANALYTICS DA CAMPANHA
// Componente para exibir gráficos e métricas de performance

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  MessageSquare, 
  Send,
  Eye,
  MousePointer,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import type { Campaign } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignAnalyticsProps {
  campaign: Campaign;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_TIMELINE_DATA = [
  { date: '01/02', enviadas: 1200, entregues: 1150, abertas: 890, cliques: 340 },
  { date: '02/02', enviadas: 1350, entregues: 1300, abertas: 980, cliques: 420 },
  { date: '03/02', enviadas: 1100, entregues: 1050, abertas: 820, cliques: 310 },
  { date: '04/02', enviadas: 1450, entregues: 1400, abertas: 1050, cliques: 480 },
  { date: '05/02', enviadas: 1250, entregues: 1200, abertas: 930, cliques: 390 },
];

const MOCK_FUNNEL_DATA = [
  { name: 'Enviadas', value: 6350, color: '#3B82F6' },
  { name: 'Entregues', value: 6100, color: '#10B981' },
  { name: 'Abertas', value: 4670, color: '#F59E0B' },
  { name: 'Cliques', value: 1940, color: '#8B5CF6' },
  { name: 'Conversões', value: 485, color: '#EF4444' },
];

const MOCK_CHANNEL_DATA = [
  { name: 'Email', value: 3500, color: '#3B82F6' },
  { name: 'WhatsApp', value: 1800, color: '#10B981' },
  { name: 'SMS', value: 750, color: '#F59E0B' },
  { name: 'Push', value: 300, color: '#8B5CF6' },
];

// ============================================
// COMPONENT
// ============================================

export default function CampaignAnalytics({ campaign }: CampaignAnalyticsProps) {
  
  // Se não houver analytics, mostrar placeholder
  if (!campaign.analytics || campaign.analytics.messages_sent === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="text-gray-400" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Sem Dados Ainda
        </h3>
        <p className="text-gray-600 mb-6">
          Esta campanha ainda não tem dados de analytics disponíveis.
        </p>
        <p className="text-sm text-gray-500">
          Os dados aparecerão assim que a campanha começar a enviar mensagens.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ========================================== */}
      {/* PERFORMANCE OVER TIME */}
      {/* ========================================== */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Performance ao Longo do Tempo
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Evolução das métricas principais durante a campanha
          </p>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MOCK_TIMELINE_DATA}>
              <defs>
                <linearGradient id="colorEnviadas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAbertas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
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
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area 
                type="monotone" 
                dataKey="enviadas" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEnviadas)"
                name="Enviadas"
              />
              <Area 
                type="monotone" 
                dataKey="abertas" 
                stroke="#10B981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAbertas)"
                name="Abertas"
              />
              <Area 
                type="monotone" 
                dataKey="cliques" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCliques)"
                name="Cliques"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* CONVERSION FUNNEL */}
      {/* ========================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Funnel Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              📊 Funil de Conversão
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Jornada do usuário na campanha
            </p>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_FUNNEL_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {MOCK_FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Channel Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              📱 Distribuição por Canal
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Mensagens enviadas por tipo de canal
            </p>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={MOCK_CHANNEL_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {MOCK_CHANNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* DETAILED METRICS */}
      {/* ========================================== */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            📈 Métricas Detalhadas
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Enviadas */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Send className="text-blue-600" size={28} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {campaign.analytics.messages_sent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Enviadas</p>
            </div>

            {/* Abertas */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="text-green-600" size={28} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {campaign.analytics.messages_opened.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Abertas ({campaign.analytics.open_rate.toFixed(1)}%)
              </p>
            </div>

            {/* Cliques */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MousePointer className="text-purple-600" size={28} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {campaign.analytics.messages_clicked.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Cliques ({campaign.analytics.click_rate.toFixed(1)}%)
              </p>
            </div>

            {/* Conversões */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="text-orange-600" size={28} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {campaign.analytics.conversions.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Conversões ({campaign.analytics.conversion_rate.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}