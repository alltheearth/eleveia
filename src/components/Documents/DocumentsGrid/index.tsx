// src/components/Documents/DocumentsGrid/index.tsx
import { Folder } from 'lucide-react';
import type { FileSystemItem } from '../../../hooks/useFileSystem';
import DocumentGridItem from '../DocumentGridItem';

interface DocumentsGridProps {
  items: FileSystemItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
  emptyMessage?: string;
}

export default function DocumentsGrid({
  items,
  selectedItems,
  onSelect,
  onDoubleClick,
  onRename,
  emptyMessage = 'Esta pasta está vazia',
}: DocumentsGridProps) {
  
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map(item => (
        <DocumentGridItem
          key={item.id}
          item={item}
          isSelected={selectedItems.includes(item.id)}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
          onRename={onRename}
        />
      ))}
    </div>
  );
}