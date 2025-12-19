// src/components/tickets/PriorityBadge/index.tsx
import Badge from '../../common/Badge';
import type { FAQ } from '../../../services';

interface CategoryBadgeProps {
  category: FAQ['categoria'];
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_CONFIG = {
  'Admissão': { variant: 'blue' as const, label: '📋 Admissão' },
  'Valores': { variant: 'orange' as const, label: '💰 Valores' },
  'Uniforme': { variant: 'blue' as const, label: '👔 Uniforme' },
  'Horários': { variant: 'blue' as const, label: '⏰ Horários' },
  'Documentação': { variant: 'orange' as const, label: '📄 Documentação' },
  'Atividades': { variant: 'blue' as const, label: '🎯 Atividades' },
  'Alimentação': { variant: 'blue' as const, label: '🍽️ Alimentação' },
  'Transporte': { variant: 'blue' as const, label: '🚌 Transporte' },
  'Pedagógico': { variant: 'orange' as const, label: '📚 Pedagógico' },
  'Geral': { variant: 'red' as const, label: '❓ Geral' },
} as const;

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}