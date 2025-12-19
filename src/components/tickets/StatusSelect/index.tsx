// src/components/tickets/StatusSelect/index.tsx
import type { Ticket } from '../../../services';

interface StatusSelectProps {
  value: Ticket['status'];
  onChange: (status: Ticket['status']) => void;
  disabled?: boolean;
}

const STATUS_STYLES = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

export default function StatusSelect({ 
  value, 
  onChange, 
  disabled = false 
}: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Ticket['status'])}
      disabled={disabled}
      className={`${STATUS_STYLES[value]} px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <option value="open">📝 Aberto</option>
      <option value="in_progress">⏳ Em Andamento</option>
      <option value="pending">⏸️ Pendente</option>
      <option value="resolved">✅ Resolvido</option>
      <option value="closed">🔒 Fechado</option>
    </select>
  );
}