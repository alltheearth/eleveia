// src/components/tickets/StatusBadge/index.tsx
import Badge from '../../common/Badge';
import type { Ticket } from '../../../services';

interface StatusBadgeProps {
  status: Ticket['status'];
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
  open: { variant: 'blue' as const, label: '📝 Aberto' },
  in_progress: { variant: 'yellow' as const, label: '⏳ Em Andamento' },
  pending: { variant: 'orange' as const, label: '⏸️ Pendente' },
  resolved: { variant: 'green' as const, label: '✅ Resolvido' },
  closed: { variant: 'gray' as const, label: '🔒 Fechado' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}