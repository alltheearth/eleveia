// src/components/Documents/DocumentsBreadcrumb/index.tsx
import { Home, ChevronRight } from 'lucide-react';
import type { FileSystemItem } from '../../../hooks/useFileSystem';

interface DocumentsBreadcrumbProps {
  path: FileSystemItem[];
  onNavigate: (folderId: string | null) => void;
}

export default function DocumentsBreadcrumb({ 
  path, 
  onNavigate 
}: DocumentsBreadcrumbProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => onNavigate(null)}
          className="flex items-center gap-2 hover:text-blue-600 transition"
        >
          <Home size={16} />
          <span className="font-medium">Início</span>
        </button>

        {path.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
            <button
              onClick={() => onNavigate(folder.id)}
              className={`hover:text-blue-600 transition ${
                index === path.length - 1 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700'
              }`}
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}