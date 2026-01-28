// src/components/common/ViewToggle/index.tsx
import { Grid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
  gridLabel?: string;
  listLabel?: string;
  className?: string;
}

export default function ViewToggle({
  viewMode,
  onToggle,
  gridLabel = 'Grid view',
  listLabel = 'List view',
  className = '',
}: ViewToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 hover:bg-gray-100 rounded-lg transition ${className}`}
      title={viewMode === 'grid' ? listLabel : gridLabel}
      aria-label={viewMode === 'grid' ? listLabel : gridLabel}
    >
      {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
    </button>
  );
}