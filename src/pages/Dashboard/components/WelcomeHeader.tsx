// src/pages/Dashboard/components/WelcomeHeader.tsx
// 👋 HEADER DE BOAS-VINDAS DA DASHBOARD

import { motion } from 'framer-motion';
import { Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function WelcomeHeader() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simular refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Pegar hora do dia para saudação personalizada
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Data formatada
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Saudação */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {getGreeting()}! 👋
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar size={16} />
            {currentDate}
          </p>
        </div>

        {/* Botão de Atualizar */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>
    </motion.div>
  );
}