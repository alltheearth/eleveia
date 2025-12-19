// src/components/FAQs/StatusSelect/index.tsx

import type { FAQ,} from '../../../services';

interface StatusSelectProps {
  value: FAQ['status'];
  onChange: (status: FAQ['status']) => void;
  disabled?: boolean;
}

const STATUS_STYLES = {
  inativa: 'bg-orange-100 text-orange-700',
  ativa: 'bg-green-100 text-green-700',
};

export default function StatusSelect({ 
  value, 
  onChange, 
  disabled = false 
}: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FAQ['status'])}
      disabled={disabled}
      className={`${STATUS_STYLES[value]} px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <option value="ativa"> Ativa</option>
      <option value="inativa"> Inativa</option>
    </select>
  );
}