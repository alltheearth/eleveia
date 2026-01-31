// src/pages/Documents/index.tsx
// 📂 GESTÃO DE DOCUMENTOS - VERSÃO PROFISSIONAL

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  X,
  MoreVertical,
  Grid3x3,
  List,
  Home,
  ChevronRight,
  File,
  Folder,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  FileCode,
  Archive,
  Music,
  Video,
  Star,
  StarOff,
  Edit2,
  Copy,
  Share2,
  Eye,
  RefreshCw,
  Check,
  AlertCircle,
  Calendar,
  HardDrive,
  TrendingUp,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================

type FileType = 'folder' | 'file';
type ViewMode = 'grid' | 'list';

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: number;
  mimeType?: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  color?: string;
}

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_FILES: FileItem[] = [
  {
    id: '1',
    name: 'Documentos',
    type: 'folder',
    parentId: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    starred: true,
    color: 'blue',
  },
  {
    id: '2',
    name: 'Fotos',
    type: 'folder',
    parentId: null,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    starred: false,
    color: 'purple',
  },
  {
    id: '3',
    name: 'Planilhas',
    type: 'folder',
    parentId: null,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    starred: true,
    color: 'green',
  },
  {
    id: '4',
    name: 'Relatório Anual 2024.pdf',
    type: 'file',
    size: 2547896,
    mimeType: 'application/pdf',
    parentId: '1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    starred: false,
  },
  {
    id: '5',
    name: 'Apresentação.pptx',
    type: 'file',
    size: 5847236,
    mimeType: 'application/vnd.ms-powerpoint',
    parentId: '1',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19'),
    starred: true,
  },
  {
    id: '6',
    name: 'foto-turma-2024.jpg',
    type: 'file',
    size: 3254789,
    mimeType: 'image/jpeg',
    parentId: '2',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    starred: false,
  },
  {
    id: '7',
    name: 'Notas Finais.xlsx',
    type: 'file',
    size: 458963,
    mimeType: 'application/vnd.ms-excel',
    parentId: '3',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    starred: true,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatFileSize(bytes?: number): string {
  if (!bytes) return '-';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getFileIcon(item: FileItem, size = 24) {
  if (item.type === 'folder') {
    return <Folder size={size} className="text-blue-500" />;
  }

  const mime = item.mimeType || '';
  if (mime.startsWith('image/')) return <ImageIcon size={size} className="text-purple-500" />;
  if (mime.includes('pdf')) return <FileText size={size} className="text-red-500" />;
  if (mime.includes('sheet') || mime.includes('excel'))
    return <FileSpreadsheet size={size} className="text-green-500" />;
  if (mime.includes('presentation') || mime.includes('powerpoint'))
    return <FileText size={size} className="text-orange-500" />;
  if (mime.includes('zip') || mime.includes('rar'))
    return <Archive size={size} className="text-yellow-500" />;
  if (mime.startsWith('audio/')) return <Music size={size} className="text-pink-500" />;
  if (mime.startsWith('video/')) return <Video size={size} className="text-indigo-500" />;
  if (mime.includes('code') || mime.includes('json') || mime.includes('xml'))
    return <FileCode size={size} className="text-cyan-500" />;

  return <File size={size} className="text-gray-500" />;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ============================================
// STATS COMPONENT
// ============================================

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

function StatsCard({ label, value, icon, color, change }: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${color} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            {icon}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {isPositive ? (
                <TrendingUp size={14} className="text-white" />
              ) : (
                <TrendingUp size={14} className="text-white rotate-180" />
              )}
              <span className="text-xs font-bold text-white">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// BREADCRUMB COMPONENT
// ============================================

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onNavigate: (id: string | null) => void;
}

function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => onNavigate(null)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-semibold"
        >
          <Home size={16} />
          <span>Início</span>
        </button>

        {path.map((item, index) => (
          <div key={item.id || index} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
            <button
              onClick={() => onNavigate(item.id)}
              className={`hover:text-blue-600 transition font-semibold ${
                index === path.length - 1 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// TOOLBAR COMPONENT
// ============================================

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onCreateFolder: () => void;
  onUpload: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
  onRefresh: () => void;
}

function Toolbar({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  selectedCount,
  onCreateFolder,
  onUpload,
  onDelete,
  onClearSelection,
  onRefresh,
}: ToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* Primeira linha */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar arquivos e pastas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          {/* Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-semibold ${
              showFilters
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>

          {/* View Mode */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
              }`}
              title="Grade"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
              }`}
              title="Lista"
            >
              <List size={18} />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="p-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition"
            title="Atualizar"
          >
            <RefreshCw size={18} />
          </button>

          {/* Upload */}
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Nova Pasta */}
          <button
            onClick={onCreateFolder}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            <FolderPlus size={18} />
            <span className="hidden sm:inline">Nova Pasta</span>
          </button>
        </div>
      </div>

      {/* Seleção ativa */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-2">
            <Check size={18} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
            >
              <Trash2 size={16} />
              Deletar
            </button>
            <button
              onClick={onClearSelection}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
            >
              Limpar
            </button>
          </div>
        </motion.div>
      )}

      {/* Filtros avançados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-200 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                  <option>Todos</option>
                  <option>Pastas</option>
                  <option>Documentos</option>
                  <option>Imagens</option>
                  <option>Planilhas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Modificação
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                  <option>Qualquer data</option>
                  <option>Hoje</option>
                  <option>Última semana</option>
                  <option>Último mês</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                  <option>Nome</option>
                  <option>Data</option>
                  <option>Tamanho</option>
                  <option>Tipo</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FILE ITEM COMPONENT (Grid)
// ============================================

interface FileItemGridProps {
  item: FileItem;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function FileItemGrid({
  item,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
}: FileItemGridProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all group ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
      }`}
    >
      {/* Checkbox */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Check size={16} className="text-white" />
        </div>
      )}

      {/* Star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast.success(item.starred ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
        }}
        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {item.starred ? (
          <Star size={18} className="text-yellow-500 fill-yellow-500" />
        ) : (
          <StarOff size={18} className="text-gray-400" />
        )}
      </button>

      <div className="flex flex-col items-center text-center">
        {/* Ícone */}
        <div className="mb-4 transform group-hover:scale-110 transition-transform">
          {getFileIcon(item, 56)}
        </div>

        {/* Nome */}
        <p className="text-sm font-semibold text-gray-900 truncate w-full mb-2">{item.name}</p>

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          {item.type === 'file' && <p>{formatFileSize(item.size)}</p>}
          <p>{formatDate(item.updatedAt)}</p>
        </div>
      </div>

      {/* Options Menu */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <MoreVertical size={16} />
        </button>

        {showOptions && (
          <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[160px]">
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left">
              <Eye size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Visualizar</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left">
              <Edit2 size={16} className="text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">Renomear</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left">
              <Download size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Download</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left">
              <Copy size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Copiar</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left">
              <Share2 size={16} className="text-cyan-600" />
              <span className="text-sm font-semibold text-gray-700">Compartilhar</span>
            </button>
            <div className="border-t border-gray-200 my-2" />
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-left">
              <Trash2 size={16} className="text-red-600" />
              <span className="text-sm font-semibold text-red-600">Deletar</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// FILE ITEM COMPONENT (List)
// ============================================

interface FileItemListProps {
  item: FileItem;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function FileItemList({
  item,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
}: FileItemListProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={`border-b border-gray-100 cursor-pointer transition group ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* Checkbox */}
      <td className="py-4 px-4 w-12">
        {isSelected && (
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        )}
      </td>

      {/* Nome */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {getFileIcon(item, 24)}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{item.name}</span>
            {item.starred && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
          </div>
        </div>
      </td>

      {/* Tamanho */}
      <td className="py-4 px-4 text-sm text-gray-600">{formatFileSize(item.size)}</td>

      {/* Tipo */}
      <td className="py-4 px-4 text-sm text-gray-600">
        {item.type === 'folder' ? 'Pasta' : 'Arquivo'}
      </td>

      {/* Data */}
      <td className="py-4 px-4 text-sm text-gray-600">{formatDate(item.updatedAt)}</td>

      {/* Ações */}
      <td className="py-4 px-4">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Visualizar');
            }}
            className="p-2 hover:bg-blue-100 rounded-lg transition"
            title="Visualizar"
          >
            <Eye size={16} className="text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Download iniciado');
            }}
            className="p-2 hover:bg-green-100 rounded-lg transition"
            title="Download"
          >
            <Download size={16} className="text-green-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Compartilhar');
            }}
            className="p-2 hover:bg-purple-100 rounded-lg transition"
            title="Compartilhar"
          >
            <Share2 size={16} className="text-purple-600" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DocumentsPage() {
  // State
  const [files] = useState<FileItem[]>(MOCK_FILES);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileItem } | null>(
    null
  );

  // Computed
  const currentItems = useMemo(() => {
    let items = files.filter((f) => f.parentId === currentFolderId);

    if (searchTerm) {
      items = items.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return items;
  }, [files, currentFolderId, searchTerm]);

  const breadcrumbPath = useMemo(() => {
    const path: BreadcrumbItem[] = [];
    let currentId = currentFolderId;

    while (currentId) {
      const folder = files.find((f) => f.id === currentId);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return path;
  }, [currentFolderId, files]);

  const stats = useMemo(() => {
    const totalSize = files
      .filter((f) => f.type === 'file')
      .reduce((acc, f) => acc + (f.size || 0), 0);

    return {
      totalFiles: files.filter((f) => f.type === 'file').length,
      totalFolders: files.filter((f) => f.type === 'folder').length,
      totalSize: formatFileSize(totalSize),
      recentUploads: files.filter((f) => {
        const daysDiff = Math.floor(
          (new Date().getTime() - f.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff <= 7;
      }).length,
    };
  }, [files]);

  // Handlers
  const handleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedItems([]);
    } else {
      toast.success(`Abrindo ${item.name}...`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleNavigate = (id: string | null) => {
    setCurrentFolderId(id);
    setSelectedItems([]);
  };

  const handleDelete = () => {
    toast.success(`${selectedItems.length} item(s) deletado(s)`);
    setSelectedItems([]);
  };

  const handleRefresh = () => {
    toast.success('Atualizado!');
  };

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <HardDrive className="text-blue-600" size={40} />
              Meus Documentos
            </h1>
            <p className="text-gray-600 mt-2">Gerencie todos os seus arquivos e pastas</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            label="Total de Arquivos"
            value={stats.totalFiles}
            icon={<File className="text-white" size={24} />}
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            label="Total de Pastas"
            value={stats.totalFolders}
            icon={<Folder className="text-white" size={24} />}
            color="from-purple-500 to-purple-600"
          />
          <StatsCard
            label="Espaço Usado"
            value={stats.totalSize}
            icon={<HardDrive className="text-white" size={24} />}
            color="from-green-500 to-green-600"
            change={12}
          />
          <StatsCard
            label="Uploads Recentes"
            value={stats.recentUploads}
            icon={<Clock className="text-white" size={24} />}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb path={breadcrumbPath} onNavigate={handleNavigate} />

        {/* Toolbar */}
        <Toolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCount={selectedItems.length}
          onCreateFolder={() => toast.success('Criar nova pasta')}
          onUpload={() => toast.success('Upload de arquivo')}
          onDelete={handleDelete}
          onClearSelection={() => setSelectedItems([])}
          onRefresh={handleRefresh}
        />

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {currentItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Folder size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Esta pasta está vazia'}
              </h3>
              <p className="text-gray-600 max-w-md">
                {searchTerm
                  ? 'Tente ajustar sua busca'
                  : 'Crie uma nova pasta ou faça upload de arquivos'}
              </p>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentItems.map((item) => (
                <FileItemGrid
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={() => handleSelect(item.id)}
                  onDoubleClick={() => handleDoubleClick(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 w-12"></th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tamanho</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Modificado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <FileItemList
                      key={item.id}
                      item={item}
                      isSelected={selectedItems.includes(item.id)}
                      onSelect={() => handleSelect(item.id)}
                      onDoubleClick={() => handleDoubleClick(item)}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 9999,
              }}
              className="bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[200px]"
            >
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                <Eye size={16} className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Visualizar</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                <Edit2 size={16} className="text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">Renomear</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                <Download size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-700">Download</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                <Copy size={16} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Copiar</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                <Share2 size={16} className="text-cyan-600" />
                <span className="text-sm font-semibold text-gray-700">Compartilhar</span>
              </button>
              <div className="border-t border-gray-200 my-2" />
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-left">
                <Trash2 size={16} className="text-red-600" />
                <span className="text-sm font-semibold text-red-600">Deletar</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}