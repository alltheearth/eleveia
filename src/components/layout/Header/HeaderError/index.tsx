// src/components/layout/Header/HeaderError/index.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';

interface HeaderErrorProps {
  error?: any;
}

const HeaderError = ({ error }: HeaderErrorProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 border-l-4 border-red-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={20} />
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Erro ao carregar dados do usuário
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {error?.message || 'Não foi possível carregar suas informações'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
        >
          <RefreshCw size={16} />
          Recarregar
        </button>
      </div>
    </header>
  );
};

export default HeaderError;