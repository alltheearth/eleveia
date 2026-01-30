// src/components/Documents/DeleteConfirmModal/index.tsx
import { AlertCircle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  count,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Confirmar Exclusão
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            Tem certeza que deseja deletar{' '}
            <strong>{count}</strong> {count === 1 ? 'item' : 'itens'}?
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Esta ação não pode ser desfeita. Pastas serão deletadas junto com todo seu conteúdo.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}