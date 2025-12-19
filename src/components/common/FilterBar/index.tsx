import { Search, X } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  type: 'search' | 'select' | 'date' | 'daterange';
  name: string;
  placeholder?: string;
  options?: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
}

interface FilterBarProps {
  fields: FilterField[];
  actions?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    loading?: boolean;
  }[];
  onClear?: () => void;
  showClearButton?: boolean;
}

export default function FilterBar({ fields, actions, onClear, showClearButton = true }: FilterBarProps) {
  const hasActiveFilters = fields.some(field => field.value && field.value !== 'todos');

  const getButtonClasses = (variant: string = 'primary') => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
        {/* Campos de Filtro */}
        <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap">
          {fields.map((field, index) => (
            <div key={index} className={`${field.type === 'search' ? 'flex-1 min-w-[200px]' : ''} relative`}>
              {field.type === 'search' && (
                <>
                  {field.icon || <Search className="absolute left-3 top-3 text-gray-400" size={20} />}
                  <input
                    type="text"
                    placeholder={field.placeholder || 'Buscar...'}
                    value={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </>
              )}

              {field.type === 'select' && (
                <select
                  value={field.value}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-w-[150px]"
                >
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  value={field.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              )}
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          {showClearButton && hasActiveFilters && onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              <X size={18} />
              Limpar
            </button>
          )}

          {actions?.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 ${getButtonClasses(action.variant)}`}
            >
              {action.icon}
              {action.loading ? 'Processando...' : action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
