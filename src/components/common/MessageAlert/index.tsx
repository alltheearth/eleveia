// src/components/common/MessageAlert/index.tsx
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface MessageAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const CONFIG = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-700',
    icon: CheckCircle,
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    icon: AlertCircle,
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700',
    icon: AlertTriangle,
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    icon: Info,
  },
};

export default function MessageAlert({ 
  type, 
  message, 
  onClose,
  dismissible = true 
}: MessageAlertProps) {
  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.textColor} p-4 rounded-lg border-l-4 ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        
        <p className="flex-1 font-semibold">{message}</p>
        
        {dismissible && onClose && (
          <button 
            onClick={onClose}
            className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}