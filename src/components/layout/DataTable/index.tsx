import { ChevronLeft, ChevronRight } from "lucide-react";
import  { type ReactNode, useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableAction<T> {
  label?: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  variant?: 'primary' | 'danger' | 'success';
  show?: (row: T) => boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string | number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalItems: number;
  };
}

export default function DataTable<T>({ 
  columns, 
  data, 
  actions, 
  loading,
  emptyMessage = 'Nenhum dado encontrado',
  emptyIcon,
  onRowClick,
  keyExtractor,
  pagination
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      })
    : data;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              {columns.map(column => (
                <th 
                  key={column.key}
                  className={`p-3 text-left font-bold text-gray-900 ${column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="p-3 text-left font-bold text-gray-900">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr 
                  key={keyExtractor(row)}
                  className={`border-b hover:bg-gray-50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(column => (
                    <td key={column.key} className="p-3 text-gray-700">
                      {column.render 
                        ? column.render((row as any)[column.key], row)
                        : String((row as any)[column.key] || '-')
                      }
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="p-3">
                      <div className="flex gap-2">
                        {actions.map((action, index) => {
                          if (action.show && !action.show(row)) return null;
                          
                          const variantClasses = {
                            primary: 'text-blue-600 hover:text-blue-800',
                            danger: 'text-red-600 hover:text-red-800',
                            success: 'text-green-600 hover:text-green-800',
                          };

                          return (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              className={`${variantClasses[action.variant || 'primary']} hover:underline font-semibold text-sm transition`}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center text-gray-500">
                  {emptyIcon && <div className="flex justify-center mb-2">{emptyIcon}</div>}
                  <p className="font-semibold">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {((pagination.currentPage - 1) * pagination.pageSize) + 1} até{' '}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} de{' '}
            {pagination.totalItems} resultados
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => pagination.onPageChange(page)}
                className={`px-3 py-1 border rounded ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}