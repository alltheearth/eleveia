// src/pages/Calendar/components/EventsList.tsx
import { Edit2, Trash2 } from 'lucide-react';
import { DataTable} from '../../../components/common';
import type { Event } from '../../../services';
import type { JSX } from 'react';

interface EventsListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  formatDate: (date: string) => string;
  getEventBadge: (type: string) => JSX.Element | null;
}

export default function EventsList({
  events,
  onEdit,
  onDelete,
  formatDate,
  getEventBadge,
}: EventsListProps) {
  return (
    <DataTable
      columns={[
        { 
          key: 'start_date', 
          label: 'Start Date',
          render: (val) => formatDate(val),
          sortable: true,
          width: '120px',
        },
        { 
          key: 'end_date', 
          label: 'End Date',
          render: (val) => formatDate(val),
          sortable: true,
          width: '120px',
        },
        { 
          key: 'title', 
          label: 'Title',
          render: (val, row) => (
            <div>
              <p className="font-semibold text-gray-900">{val}</p>
              {row.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {row.description}
                </p>
              )}
            </div>
          ),
          sortable: true,
        },
        { 
          key: 'event_type', 
          label: 'Type',
          render: (val) => getEventBadge(val),
          width: '140px',
        },
        { 
          key: 'duration_days', 
          label: 'Duration',
          render: (val) => (
            <span className="text-sm text-gray-600">
              {val} {val === 1 ? 'day' : 'days'}
            </span>
          ),
          width: '100px',
        },
      ]}
      data={events}
      keyExtractor={(row) => row.id.toString()}
      actions={[
        {
          label: 'Edit',
          icon: <Edit2 size={16} />,
          onClick: onEdit,
          variant: 'primary',
        },
        {
          label: 'Delete',
          icon: <Trash2 size={16} />,
          onClick: onDelete,
          variant: 'danger',
        },
      ]}
      emptyMessage="No events found"
    />
  );
}