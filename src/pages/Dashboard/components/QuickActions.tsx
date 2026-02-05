// src/pages/Dashboard/components/QuickActions.tsx
// ⚡ AÇÕES RÁPIDAS DA DASHBOARD

import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Calendar, 
  MessageSquare, 
  FileText,
  Users,
  Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
  action: () => void;
}

export default function QuickActions() {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'new-lead',
      label: 'Novo Lead',
      icon: <UserPlus size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      action: () => navigate('/leads'),
    },
    {
      id: 'new-event',
      label: 'Novo Evento',
      icon: <Calendar size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      action: () => navigate('/calendar'),
    },
    {
      id: 'new-campaign',
      label: 'Nova Campanha',
      icon: <MessageSquare size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      action: () => navigate('/campaigns'),
    },
    {
      id: 'view-contacts',
      label: 'Ver Contatos',
      icon: <Users size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      action: () => navigate('/contacts'),
    },
    {
      id: 'send-email',
      label: 'Enviar Email',
      icon: <Mail size={24} />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100',
      action: () => navigate('/campaigns'),
    },
    {
      id: 'view-reports',
      label: 'Relatórios',
      icon: <FileText size={24} />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      action: () => navigate('/reports'),
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Ações Rápidas
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`${action.bgColor} ${action.hoverColor} rounded-2xl p-6 border-2 border-transparent hover:border-gray-200 transition-all shadow-sm hover:shadow-md`}
          >
            <div className={`${action.color} mb-3 flex justify-center`}>
              {action.icon}
            </div>
            <p className="text-sm font-bold text-gray-900 text-center">
              {action.label}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}