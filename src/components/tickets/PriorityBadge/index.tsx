// src/components/tickets/PriorityBadge/index.tsx
import Badge from '../../common/Badge';
import type { Ticket } from '../../../services';

interface PriorityBadgeProps {
  priority: Ticket['priority'];
  size?: 'sm' | 'md' | 'lg';
}

const PRIORITY_CONFIG = {
  medium: { variant: 'blue' as const, label: '🔵 Média' },
  high: { variant: 'orange' as const, label: '🟠 Alta' },
  urgent: { variant: 'red' as const, label: '🔴 Urgente' },
};

export default function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}