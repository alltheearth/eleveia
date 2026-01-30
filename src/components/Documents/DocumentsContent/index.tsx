// src/components/Documents/DocumentsContent/index.tsx
import type { FileSystemItem } from '../../../hooks/useFileSystem';
import DocumentsGrid from '../DocumentsGrid';
import DocumentsList from '../DocumentsList';

interface DocumentsContentProps {
  items: FileSystemItem[];
  selectedItems: string[];
  viewMode: 'grid' | 'list';
  searchTerm: string;
  onSelect: (id: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
}

export default function DocumentsContent({
  items,
  selectedItems,
  viewMode,
  searchTerm,
  onSelect,
  onDoubleClick,
  onRename,
}: DocumentsContentProps) {
  
  const emptyMessage = searchTerm 
    ? 'Nenhum resultado encontrado' 
    : 'Esta pasta está vazia';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {viewMode === 'grid' ? (
        <DocumentsGrid
          items={items}
          selectedItems={selectedItems}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
          onRename={onRename}
          emptyMessage={emptyMessage}
        />
      ) : (
        <DocumentsList
          items={items}
          selectedItems={selectedItems}
          onSelect={onSelect}
          onDoubleClick={onDoubleClick}
          onRename={onRename}
          emptyMessage={emptyMessage}
        />
      )}
    </div>
  );
}