// src/components/Documents/DocumentItem/index.tsx
import { Folder, Check, Edit2 } from 'lucide-react';
import FileIcon from '../../common/FileIcon';  // ✅ IMPORTADO
import { formatFileSize } from '../../../utils/fileSystem';  // ✅ IMPORTADO
import type { FileSystemItem } from '../../../hooks/useFileSystem';

interface DocumentItemProps {
  item: FileSystemItem;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
  onSelect: (id: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
}

export default function DocumentItem({
  item,
  isSelected,
  viewMode,
  onSelect,
  onDoubleClick,
  onRename,
}: DocumentItemProps) {
  
  // ============================================
  // GRID VIEW
  // ============================================
  
  if (viewMode === 'grid') {
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
        {/* ✅ Checkbox de seleção */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {/* ✅ Ícone do arquivo/pasta */}
          <div className="mb-3">
            {item.type === 'folder' ? (
              <Folder size={48} className="text-blue-500" />
            ) : (
              <FileIcon mimeType={item.mimeType} size={48} />
            )}
          </div>

          {/* ✅ Nome do arquivo */}
          <p className="text-sm font-medium text-gray-900 truncate w-full mb-1">
            {item.name}
          </p>

          {/* ✅ Tamanho (apenas para arquivos) */}
          {item.type === 'file' && item.size !== undefined && (
            <p className="text-xs text-gray-500">
              {formatFileSize(item.size)}
            </p>
          )}
        </div>

        {/* ✅ Botão de renomear (aparece no hover) */}
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

  // ============================================
  // LIST VIEW
  // ============================================
  
  return (
    <tr
      onClick={() => onSelect(item.id)}
      onDoubleClick={() => onDoubleClick(item)}
      className={`border-b border-gray-100 cursor-pointer transition ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* ✅ Coluna: Nome */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {/* Checkbox visual */}
          {isSelected && <Check size={16} className="text-blue-600" />}
          
          {/* Ícone */}
          {item.type === 'folder' ? (
            <Folder size={20} className="text-blue-500" />
          ) : (
            <FileIcon mimeType={item.mimeType} size={20} />
          )}
          
          {/* Nome */}
          <span className="font-medium text-gray-900">{item.name}</span>
        </div>
      </td>
      
      {/* ✅ Coluna: Tamanho */}
      <td className="py-3 px-4 text-sm text-gray-600">
        {item.type === 'file' && item.size !== undefined 
          ? formatFileSize(item.size) 
          : '-'
        }
      </td>
      
      {/* ✅ Coluna: Data de Modificação */}
      <td className="py-3 px-4 text-sm text-gray-600">
        {new Date(item.updatedAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </td>
      
      {/* ✅ Coluna: Ações */}
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