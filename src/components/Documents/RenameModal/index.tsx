// src/components/Documents/RenameModal/index.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { FileSystemItem } from '../../../hooks/useFileSystem';
import { validateFileName } from '../../../utils/fileSystem';

interface RenameModalProps {
  isOpen: boolean;
  item: FileSystemItem | null;
  onClose: () => void;
  onConfirm: (id: string, newName: string) => void;
}

export default function RenameModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}: RenameModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    const validation = validateFileName(name);
    
    if (!validation.valid) {
      setError(validation.error || 'Nome inválido');
      return;
    }

    if (name === item.name) {
      handleClose();
      return;
    }

    onConfirm(item.id, name);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Renomear</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Novo Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            Renomear
          </button>
        </div>
      </div>
    </div>
  );
}