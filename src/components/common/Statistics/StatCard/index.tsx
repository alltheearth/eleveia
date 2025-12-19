import type { ReactNode } from "react";

// ============================================
export interface StatCardProps {
  label: string;
  value: number | string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';
  icon?: ReactNode;
  description?: string;
  onClick?: () => void;
  loading?: boolean;
}

export default function StatCard({ 
  label, 
  value, 
  color = 'blue', 
  icon, 
  description,
  onClick,
  loading = false
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <div 
      className={`${colorClasses[color]} p-4 rounded-lg shadow-md ${onClick ? 'cursor-pointer hover:shadow-lg transition' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold opacity-80">{label}</p>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-current opacity-20 rounded w-20"></div>
        </div>
      ) : (
        <p className="text-3xl font-bold">{value}</p>
      )}
      
      {description && (
        <p className="text-xs opacity-70 mt-1">{description}</p>
      )}
    </div>
  );
}