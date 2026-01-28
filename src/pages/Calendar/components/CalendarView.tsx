// src/pages/Calendar/components/CalendarView.tsx
import Calendar from '../../../components/common/Calendar';
import type { Event } from '../../../services';

interface CalendarViewProps {
  events: Event[];
  onDayClick: (date: string) => void;
  eventColors: Record<string, string>;
}

export default function CalendarView({
  events,
  onDayClick,
  eventColors,
}: CalendarViewProps) {
  // Transformar eventos para o formato do componente Calendar
  const calendarEvents = events.map(e => ({
    id: e.id,
    start_date: e.start_date,
    end_date: e.end_date,
    title: e.title,
    event_type: e.event_type,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Calendar
        events={calendarEvents}
        onDayClick={onDayClick}
        eventColors={eventColors}
        highlightToday
      />
    </div>
  );
}