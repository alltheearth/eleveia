// src/components/Documents/DocumentListItem/index.tsx
import { Check, Edit2 } from 'lucide-react';
import type { FileSystemItem } from '../../../hooks/useFileSystem';
import FileIcon from '../../common/FileIcon';
import { formatFileSize } from '../../../utils/fileSystem';

interface DocumentListItemProps {
  item: FileSystemItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
}

/**
 * Componente de item de documento em modo lista
 * @component
 * @example
 * ```tsx
 * <DocumentListItem
 *   item={fileItem}
 *   isSelected={false}
 *   onSelect={(id) => console.log(id)}
 *   onDoubleClick={(item) => navigate(item.id)}
 *   onRename={(item) => setRenaming(item)}
 * />
 * ```
 */
export default function DocumentListItem({
  item,
  isSelected,
  onSelect,
  onDoubleClick,
  onRename,
}: DocumentListItemProps) {
  return (
    <tr
      onClick={() => onSelect(item.id)}
      onDoubleClick={() => onDoubleClick(item)}
      className={`border-b border-gray-100 cursor-pointer transition ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* Name column */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {isSelected && <Check size={16} className="text-blue-600" />}
          
          <FileIcon
            mimeType={item.mimeType}
            isFolder={item.type === 'folder'}
            size={20}
          />
          
          <span className="font-medium text-gray-900">{item.name}</span>
        </div>
      </td>
      
      {/* Size column */}
      <td className="py-3 px-4 text-sm text-gray-600">
        {item.type === 'file' && item.size ? formatFileSize(item.size) : '-'}
      </td>
      
      {/* Modified column */}
      <td className="py-3 px-4 text-sm text-gray-600">
        {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
      </td>
      
      {/* Actions column */}
      <td className="py-3 px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename(item);
          }}
          className="p-2 hover:bg-gray-200 rounded transition"
          title="Renomear"
        >
          <Edit2 size={16} />
        </button>
      </td>
    </tr>
  );
}