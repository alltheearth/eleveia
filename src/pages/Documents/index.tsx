import React, { useState } from 'react';
import { 
  FolderPlus, 
  Upload, 
  Trash2, 
  Edit2,
  Folder,
  File,
  FileText,
  Video,
  Music,
  Archive,
  ChevronRight,
  Home,
  Check,
  X,
  Search,
  Grid,
  List,
  Image
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type FileSystemItemType = 'folder' | 'file';

interface FileSystemItem {
  id: string;
  name: string;
  type: FileSystemItemType;
  parentId: string | null;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// MOCK DATA & UTILITIES
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 11);

const initialItems: FileSystemItem[] = [
  {
    id: '1',
    name: 'Documentos Administrativos',
    type: 'folder',
    parentId: null,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Materiais Didáticos',
    type: 'folder',
    parentId: null,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'Relatórios 2024',
    type: 'folder',
    parentId: null,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    name: 'Guia de Matrícula.pdf',
    type: 'file',
    parentId: '1',
    size: 2450000,
    mimeType: 'application/pdf',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '5',
    name: 'Regimento Escolar.docx',
    type: 'file',
    parentId: '1',
    size: 1200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: '6',
    name: 'Matemática',
    type: 'folder',
    parentId: '2',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '7',
    name: 'Exercícios - Álgebra.pdf',
    type: 'file',
    parentId: '6',
    size: 850000,
    mimeType: 'application/pdf',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: '8',
    name: 'Relatório Q1.xlsx',
    type: 'file',
    parentId: '3',
    size: 3200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
  },
  {
    id: '9',
    name: 'Logo Escola.png',
    type: 'file',
    parentId: null,
    size: 450000,
    mimeType: 'image/png',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getFileIcon = (mimeType?: string, isFolder?: boolean) => {
  if (isFolder) return <Folder className="text-blue-500" size={20} />;
  
  if (!mimeType) return <File className="text-gray-500" size={20} />;
  
  if (mimeType.startsWith('image/')) return <Image className="text-purple-500" size={20} />;
  if (mimeType.startsWith('video/')) return <Video className="text-red-500" size={20} />;
  if (mimeType.startsWith('audio/')) return <Music className="text-pink-500" size={20} />;
  if (mimeType.includes('pdf')) return <FileText className="text-red-600" size={20} />;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="text-orange-500" size={20} />;
  
  return <FileText className="text-gray-600" size={20} />;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DocumentsPage() {
  const [items, setItems] = useState<FileSystemItem[]>(initialItems);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [renamingItem, setRenamingItem] = useState<FileSystemItem | null>(null);
  const [newName, setNewName] = useState('');
  const [folderName, setFolderName] = useState('');

  // ============================================
  // COMPUTED
  // ============================================

  const currentItems = items
    .filter(item => item.parentId === currentFolderId)
    .filter(item => 
      searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  const currentFolder = currentFolderId 
    ? items.find(item => item.id === currentFolderId) 
    : null;

  const breadcrumbPath: FileSystemItem[] = [];
  let current = currentFolder;
  while (current) {
    breadcrumbPath.unshift(current);
    current = items.find(item => item.id === current!.parentId) || null;
  }

  const selectedCount = selectedItems.length;

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateFolder = () => {
    if (!folderName.trim()) return;
    
    const newFolder: FileSystemItem = {
      id: generateId(),
      name: folderName,
      type: 'folder',
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, newFolder]);
    setFolderName('');
    setShowCreateFolder(false);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: FileSystemItem = {
        id: generateId(),
        name: file.name,
        type: 'file',
        parentId: currentFolderId,
        size: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setItems(prev => [...prev, newFile]);
    });

    e.target.value = '';
  };

  const handleRename = () => {
    if (!renamingItem || !newName.trim()) return;

    setItems(prev => prev.map(item =>
      item.id === renamingItem.id
        ? { ...item, name: newName, updatedAt: new Date().toISOString() }
        : item
    ));

    setShowRename(false);
    setRenamingItem(null);
    setNewName('');
  };

  const handleDelete = () => {
    const idsToDelete = new Set(selectedItems);

    const getAllChildIds = (parentId: string): string[] => {
      const children = items.filter(item => item.parentId === parentId);
      const childIds = children.map(child => child.id);
      const grandChildIds = children
        .filter(child => child.type === 'folder')
        .flatMap(folder => getAllChildIds(folder.id));
      
      return [...childIds, ...grandChildIds];
    };

    selectedItems.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item?.type === 'folder') {
        getAllChildIds(id).forEach(childId => idsToDelete.add(childId));
      }
    });

    setItems(prev => prev.filter(item => !idsToDelete.has(item.id)));
    setSelectedItems([]);
    setShowDelete(false);
  };

  const openRenameModal = (item: FileSystemItem) => {
    setRenamingItem(item);
    setNewName(item.name);
    setShowRename(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedItems([]);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
                <p className="text-gray-600 mt-1">Gerencie seus arquivos e pastas</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title={viewMode === 'grid' ? 'Visualização em lista' : 'Visualização em grade'}
                >
                  {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
                </button>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => {
                    setCurrentFolderId(null);
                    setSelectedItems([]);
                  }}
                  className="flex items-center gap-2 hover:text-blue-600 transition"
                >
                  <Home size={16} />
                  <span className="font-medium">Início</span>
                </button>

                {breadcrumbPath.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <ChevronRight size={16} className="text-gray-400" />
                    <button
                      onClick={() => {
                        setCurrentFolderId(folder.id);
                        setSelectedItems([]);
                      }}
                      className={`hover:text-blue-600 transition ${
                        index === breadcrumbPath.length - 1 ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {folder.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateFolder(true)}
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
                      onChange={handleUploadFile}
                      className="hidden"
                    />
                  </label>

                  {selectedCount > 0 && (
                    <>
                      <button
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        <Trash2 size={18} />
                        Deletar ({selectedCount})
                      </button>

                      <button
                        onClick={() => setSelectedItems([])}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
                      >
                        Limpar Seleção
                      </button>
                    </>
                  )}
                </div>

                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar arquivos e pastas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {currentItems.length === 0 ? (
                <div className="text-center py-12">
                  <Folder size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-semibold">
                    {searchTerm ? 'Nenhum resultado encontrado' : 'Esta pasta está vazia'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {searchTerm ? 'Tente buscar por outro termo' : 'Crie uma pasta ou faça upload de arquivos'}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {currentItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      onDoubleClick={() => handleDoubleClick(item)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all group ${
                        selectedItems.includes(item.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {selectedItems.includes(item.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center">
                        <div className="mb-3">
                          {item.type === 'folder' ? (
                            <Folder size={48} className="text-blue-500" />
                          ) : (
                            <div className="text-gray-600">
                              {getFileIcon(item.mimeType, false)}
                            </div>
                          )}
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

                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRenameModal(item);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Renomear"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Tamanho</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Modificado</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => toggleSelect(item.id)}
                          onDoubleClick={() => handleDoubleClick(item)}
                          className={`border-b border-gray-100 cursor-pointer transition ${
                            selectedItems.includes(item.id)
                              ? 'bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {selectedItems.includes(item.id) && (
                                <Check size={16} className="text-blue-600" />
                              )}
                              {getFileIcon(item.mimeType, item.type === 'folder')}
                              <span className="font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {item.type === 'file' && item.size ? formatFileSize(item.size) : '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(item.updatedAt)}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRenameModal(item);
                              }}
                              className="p-2 hover:bg-gray-200 rounded transition"
                              title="Renomear"
                            >
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Nova Pasta</h3>
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setFolderName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Nome da Pasta
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Digite o nome da pasta"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                autoFocus
              />
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setFolderName('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRename && renamingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Renomear</h3>
              <button
                onClick={() => {
                  setShowRename(false);
                  setRenamingItem(null);
                  setNewName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Novo Nome
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                autoFocus
              />
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowRename(false);
                  setRenamingItem(null);
                  setNewName('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleRename}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                Renomear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
              <button
                onClick={() => setShowDelete(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Tem certeza que deseja deletar <strong>{selectedCount}</strong> {selectedCount === 1 ? 'item' : 'itens'}?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}