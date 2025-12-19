// src/components/tickets/StatusBadge/index.tsx
import Badge from '../../common/Badge';
import type { FAQ } from '../../../services';

interface StatusBadgeProps {
  status: FAQ['status'];
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
  ativa: { variant: 'green' as const, label: '📝 Ativa' },
  inativa: { variant: 'orange' as const, label: '⏳ Inativa' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}