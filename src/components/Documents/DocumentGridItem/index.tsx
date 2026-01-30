// src/components/Documents/DocumentGridItem/index.tsx
import { Check, Edit2 } from 'lucide-react';
import type { FileSystemItem } from '../../../hooks/useFileSystem';
import FileIcon from '../../common/FileIcon';
import { formatFileSize } from '../../../utils/fileSystem';

interface DocumentGridItemProps {
  item: FileSystemItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
}

/**
 * Componente de item de documento em modo grid
 * @component
 * @example
 * ```tsx
 * <DocumentGridItem
 *   item={fileItem}
 *   isSelected={false}
 *   onSelect={(id) => console.log(id)}
 *   onDoubleClick={(item) => navigate(item.id)}
 *   onRename={(item) => setRenaming(item)}
 * />
 * ```
 */
export default function DocumentGridItem({
  item,
  isSelected,
  onSelect,
  onDoubleClick,
  onRename,
}: DocumentGridItemProps) {
  return (
    <div
      onClick={() => onSelect(item.id)}
      onDoubleClick={() => onDoubleClick(item)}
      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all group ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-3">
          <FileIcon
            mimeType={item.mimeType}
            isFolder={item.type === 'folder'}
            size={48}
          />
        </div>

        <p className="text-sm font-medium text-gray-900 truncate w-full mb-1">
          {item.name}
        </p>

        {item.type === 'file' && item.size && (
          <p className="text-xs text-gray-500">
            {formatFileSize(item.size)}
          </p>
        )}
      </div>

      {/* Rename button */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename(item);
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="Renomear"
        >
          <Edit2 size={14} />
        </button>
      </div>
    </div>
  );
}