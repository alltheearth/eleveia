// src/components/common/Calendar/index.tsx - VERSÃO OTIMIZADA
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================

export interface CalendarEvent {
  id: number;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  title: string;
  event_type: string;
}

export interface CalendarProps {
  events: CalendarEvent[];
  onDayClick?: (date: string) => void;
  highlightToday?: boolean;
  eventColors?: Record<string, string>;
  className?: string;
}

interface DayInfo {
  date: number;
  dateString: string;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

// ============================================
// CALENDAR COMPONENT - OTIMIZADO
// ============================================

export default function Calendar({
  events = [],
  onDayClick,
  highlightToday = true,
  eventColors = {
    holiday: 'bg-red-500',
    exam: 'bg-blue-500',
    graduation: 'bg-purple-500',
    cultural: 'bg-orange-500',
  },
  className = '',
}: CalendarProps) {
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ============================================
  // CONSTANTS
  // ============================================

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ============================================
  // HELPERS
  // ============================================

  const getFirstDayOfMonth = (): number => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  };

  const getDaysInMonth = (): number => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  };

  const getDaysInPrevMonth = (): number => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  };

  const formatDateString = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const todayString = formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
    return dateString === todayString;
  };

  const getEventsForDate = (dateString: string): CalendarEvent[] => {
    return events.filter(event => {
      return dateString >= event.start_date && dateString <= event.end_date;
    });
  };

  // ============================================
  // NAVIGATION
  // ============================================

  const goToPreviousMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = (): void => {
    setCurrentMonth(new Date());
  };

  // ============================================
  // GENERATE CALENDAR DAYS
  // ============================================

  const generateCalendarDays = (): DayInfo[] => {
    const days: DayInfo[] = [];
    const firstDay = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();
    const daysInPrevMonth = getDaysInPrevMonth();
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateString = formatDateString(prevYear, prevMonth, day);
      
      days.push({
        date: day,
        dateString,
        events: getEventsForDate(dateString),
        isToday: highlightToday && isToday(dateString),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(year, month, day);
      
      days.push({
        date: day,
        dateString,
        events: getEventsForDate(dateString),
        isToday: highlightToday && isToday(dateString),
        isCurrentMonth: true,
      });
    }

    // Next month days (to complete the grid)
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateString = formatDateString(nextYear, nextMonth, day);
      
      days.push({
        date: day,
        dateString,
        events: getEventsForDate(dateString),
        isToday: highlightToday && isToday(dateString),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold"
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-sm py-1.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - ✅ OTIMIZADO: altura fixa reduzida */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayInfo, index) => {
          const hasEvents = dayInfo.events.length > 0;
          
          return (
            <button
              key={index}
              onClick={() => onDayClick?.(dayInfo.dateString)}
              disabled={!dayInfo.isCurrentMonth}
              className={`
                h-20 p-2 border transition-all relative group
                ${dayInfo.isToday 
                  ? 'border-blue-500 bg-blue-50 font-bold ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
                ${hasEvents ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white'}
                ${!dayInfo.isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                rounded-md
              `}
            >
              {/* Day number */}
              <div className={`text-sm font-medium ${
                dayInfo.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {dayInfo.date}
              </div>

              {/* Event indicators - ✅ OTIMIZADO: menores */}
              {hasEvents && (
                <div className="absolute bottom-0.5 left-0.5 right-0.5 flex justify-center gap-0.5">
                  {dayInfo.events.slice(0, 3).map((event, idx) => (
                    <div
                      key={idx}
                      className={`w-1 h-1 rounded-full ${
                        eventColors[event.event_type] || 'bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Tooltip - ✅ OTIMIZADO: menor */}
              {hasEvents && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded py-1.5 px-2.5 whitespace-nowrap shadow-lg">
                    {dayInfo.events.length} event{dayInfo.events.length > 1 ? 's' : ''}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend - ✅ OTIMIZADO: mais compacta */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200"></div>
          <span className="text-gray-600">Today</span>
        </div>
        {Object.entries(eventColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-gray-600 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}