// src/pages/Campaigns/components/TemplateLibrary/TemplateCategoryNav.tsx

import { motion } from 'framer-motion';
import type { TemplateCategory } from './index';

interface TemplateCategoryNavProps {
  selectedCategory: TemplateCategory;
  onSelectCategory: (category: TemplateCategory) => void;
}

interface CategoryTab {
  value: TemplateCategory;
  label: string;
  icon: string;
  color: string;
}

const CATEGORIES: CategoryTab[] = [
  {
    value: 'all',
    label: 'Todos',
    icon: '📚',
    color: 'text-gray-700',
  },
  {
    value: 'matricula',
    label: 'Matrícula',
    icon: '🎓',
    color: 'text-blue-600',
  },
  {
    value: 'rematricula',
    label: 'Rematrícula',
    icon: '🔄',
    color: 'text-green-600',
  },
  {
    value: 'evento',
    label: 'Eventos',
    icon: '🎉',
    color: 'text-pink-600',
  },
  {
    value: 'reuniao',
    label: 'Reuniões',
    icon: '📅',
    color: 'text-orange-600',
  },
  {
    value: 'cobranca',
    label: 'Cobrança',
    icon: '💰',
    color: 'text-red-600',
  },
  {
    value: 'comunicado',
    label: 'Comunicados',
    icon: '📢',
    color: 'text-purple-600',
  },
  {
    value: 'custom',
    label: 'Personalizados',
    icon: '⚙️',
    color: 'text-gray-600',
  },
];

export default function TemplateCategoryNav({
  selectedCategory,
  onSelectCategory,
}: TemplateCategoryNavProps) {
  return (
    <div className="px-6 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.value;

          return (
            <motion.button
              key={category.value}
              onClick={() => onSelectCategory(category.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{category.icon}</span>
                <span>{category.label}</span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-blue-50 rounded-xl border-2 border-blue-200"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}