// src/pages/Campaigns/components/MessageEditor/VariableInserter.tsx
// 🔤 INSERTOR DE VARIÁVEIS DINÂMICAS

import { motion } from 'framer-motion';
import { Variable, X, User, Mail, Phone, Calendar, MapPin, Hash } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface VariableInserterProps {
  onInsert: (variable: string) => void;
  onClose: () => void;
}

// ============================================
// AVAILABLE VARIABLES
// ============================================

const VARIABLES = [
  {
    key: 'nome',
    label: 'Nome do Contato',
    icon: <User size={16} />,
    example: 'Maria Silva',
    color: 'text-blue-600',
  },
  {
    key: 'email',
    label: 'Email',
    icon: <Mail size={16} />,
    example: 'maria@email.com',
    color: 'text-green-600',
  },
  {
    key: 'telefone',
    label: 'Telefone',
    icon: <Phone size={16} />,
    example: '(11) 99999-0000',
    color: 'text-purple-600',
  },
  {
    key: 'nome_aluno',
    label: 'Nome do Aluno',
    icon: <User size={16} />,
    example: 'João Silva',
    color: 'text-orange-600',
  },
  {
    key: 'serie',
    label: 'Série/Turma',
    icon: <Hash size={16} />,
    example: '5º Ano A',
    color: 'text-pink-600',
  },
  {
    key: 'escola_nome',
    label: 'Nome da Escola',
    icon: <MapPin size={16} />,
    example: 'Escola ABC',
    color: 'text-indigo-600',
  },
  {
    key: 'data_atual',
    label: 'Data Atual',
    icon: <Calendar size={16} />,
    example: '05/02/2026',
    color: 'text-red-600',
  },
];

// ============================================
// COMPONENT
// ============================================

export default function VariableInserter({
  onInsert,
  onClose,
}: VariableInserterProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-purple-200 shadow-lg p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Variable className="text-purple-600" size={20} />
          <h4 className="font-bold text-gray-900">Inserir Variável</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
        <p className="text-xs text-purple-900">
          <strong>💡 Dica:</strong> As variáveis serão substituídas automaticamente pelos dados reais de cada destinatário ao enviar a campanha.
        </p>
      </div>

      {/* Variables Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {VARIABLES.map((variable) => (
          <motion.button
            key={variable.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onInsert(variable.key)}
            className="flex flex-col items-start p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${variable.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                {variable.icon}
              </div>
              <span className="text-xs font-bold text-gray-900">
                {`{{${variable.key}}}`}
              </span>
            </div>
            
            <p className="text-xs text-gray-700 font-medium mb-1">
              {variable.label}
            </p>
            
            <p className="text-xs text-gray-500 italic">
              Ex: {variable.example}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}