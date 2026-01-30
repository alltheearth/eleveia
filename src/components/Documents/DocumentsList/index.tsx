// src/components/Documents/DocumentsList/index.tsx
import { Folder } from 'lucide-react';
import type { FileSystemItem } from '../../../hooks/useFileSystem';
import DocumentItem from '../DocumentItem';

interface DocumentsListProps {
  items: FileSystemItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
  emptyMessage?: string;
}

export default function DocumentsList({
  items,
  selectedItems,
  onSelect,
  onDoubleClick,
  onRename,
  emptyMessage = 'Esta pasta está vazia',
}: DocumentsListProps) {
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 font-semibold">{emptyMessage}</p>
        <p className="text-sm text-gray-500 mt-2">
          Crie uma pasta ou faça upload de arquivos
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              Nome
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              Tamanho
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              Modificado
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <DocumentItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              viewMode="list"
              onSelect={onSelect}
              onDoubleClick={onDoubleClick}
              onRename={onRename}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}