// src/components/Dashboard/components.tsx
// 🎨 COMPONENTES AUXILIARES PROFISSIONAIS

import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical,
  ExternalLink,
//   TrendingUp,
//   Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  User
} from 'lucide-react';

// ============================================
// PERFORMANCE COMPARISON CARD
// ============================================
interface PerformanceItem {
  label: string;
  current: number;
  previous: number;
  unit?: string;
}

export function PerformanceComparison({ 
  items 
}: { 
  items: PerformanceItem[] 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Comparativo</h3>
          <p className="text-sm text-gray-500 mt-1">Mês atual vs anterior</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
          Detalhes
          <ExternalLink size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const change = ((item.current - item.previous) / item.previous) * 100;
          const isPositive = change >= 0;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  {item.label}
                </span>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </div>
              </div>

              <div className="flex items-end gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.current}{item.unit}
                  </p>
                  <p className="text-xs text-gray-500">Atual</p>
                </div>
                <div className="pb-1">
                  <p className="text-lg font-semibold text-gray-500">
                    {item.previous}{item.unit}
                  </p>
                  <p className="text-xs text-gray-400">Anterior</p>
                </div>
              </div>

              {/* Barra de progresso visual */}
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(item.current / Math.max(item.current, item.previous)) * 100}%` 
                  }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// UPCOMING TASKS/EVENTS
// ============================================
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  assignee?: string;
}

export function UpcomingTasks({ 
  tasks 
}: { 
  tasks: Task[] 
}) {
  const priorityStyles = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
    medium: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
    },
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Próximas Tarefas</h3>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.filter(t => !t.completed).length} pendentes
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 5).map((task, index) => {
          const styles = priorityStyles[task.priority];

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${styles.border} ${styles.bg} hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {task.completed && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                </button>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h4>
                    <div className={`w-2 h-2 rounded-full ${styles.dot} flex-shrink-0 mt-1.5`} />
                  </div>

                  <p className="text-xs text-gray-600 mb-2">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Calendar size={12} />
                      {task.dueDate}
                    </span>
                    {task.assignee && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <User size={12} />
                        {task.assignee}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
        Ver todas as tarefas
      </button>
    </motion.div>
  );
}

// ============================================
// ALERT BANNER
// ============================================
interface AlertBannerProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export function AlertBanner({
  type,
  title,
  message,
  action,
  onDismiss,
}: AlertBannerProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <AlertCircle className="text-blue-600" size={20} />,
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
      buttonColor: 'text-blue-600 hover:bg-blue-100',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: <AlertCircle className="text-orange-600" size={20} />,
      titleColor: 'text-orange-900',
      messageColor: 'text-orange-700',
      buttonColor: 'text-orange-600 hover:bg-orange-100',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle2 className="text-green-600" size={20} />,
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
      buttonColor: 'text-green-600 hover:bg-green-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="text-red-600" size={20} />,
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
      buttonColor: 'text-red-600 hover:bg-red-100',
    },
  };

  const style = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${style.bg} border ${style.border} rounded-2xl p-4 mb-6`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm mb-1 ${style.titleColor}`}>
            {title}
          </h4>
          <p className={`text-sm ${style.messageColor}`}>
            {message}
          </p>

          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${style.buttonColor}`}
            >
              {action.label}
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XCircle size={18} className="text-gray-500" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MINI STAT CARD (Para seção lateral)
// ============================================
interface MiniStatProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
}

export function MiniStat({ label, value, trend, icon }: MiniStatProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-600 uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ============================================
// PROGRESS BAR
// ============================================
interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

export function ProgressBar({ 
  label, 
  current, 
  target,
  color = 'blue'
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {current} / {target}
        </span>
      </div>
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClasses[color]}`}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        {percentage.toFixed(0)}% da meta mensal
      </p>
    </div>
  );
}

// ============================================
// EXPORT BUTTON
// ============================================
export function ExportButton({ 
  onExport, 
  label = 'Exportar Dados',
  isLoading = false 
}: { 
  onExport: () => void;
  label?: string;
  isLoading?: boolean;
}) {
  return (
    <button
      onClick={onExport}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <ExternalLink size={16} />
          {label}
        </>
      )}
    </button>
  );
}