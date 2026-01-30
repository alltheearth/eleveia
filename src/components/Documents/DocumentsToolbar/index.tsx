// src/components/Documents/DocumentsToolbar/index.tsx
import { FolderPlus, Upload, Trash2, Search } from 'lucide-react';

interface DocumentsToolbarProps {
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateFolder: () => void;
  onUpload: (files: FileList) => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export default function DocumentsToolbar({
  selectedCount,
  searchTerm,
  onSearchChange,
  onCreateFolder,
  onUpload,
  onDelete,
  onClearSelection,
}: DocumentsToolbarProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateFolder}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <FolderPlus size={18} />
            Nova Pasta
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold cursor-pointer">
            <Upload size={18} />
            Upload
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedCount > 0 && (
            <>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                <Trash2 size={18} />
                Deletar ({selectedCount})
              </button>

              <button
                onClick={onClearSelection}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Limpar Seleção
              </button>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar arquivos e pastas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
}