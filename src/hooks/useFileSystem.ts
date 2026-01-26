// src/hooks/useFileSystem.ts
import { useState, useCallback, useMemo } from 'react';

// ============================================
// TYPES
// ============================================

export type FileSystemItemType = 'folder' | 'file';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileSystemItemType;
  parentId: string | null;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseFileSystemReturn {
  // State
  items: FileSystemItem[];
  currentFolderId: string | null;
  selectedItems: string[];
  
  // Computed
  currentItems: FileSystemItem[];
  breadcrumbPath: FileSystemItem[];
  currentFolder: FileSystemItem | null;
  
  // Actions
  createFolder: (name: string) => void;
  uploadFile: (name: string, size: number, mimeType: string) => void;
  deleteItems: (ids: string[]) => void;
  renameItem: (id: string, newName: string) => void;
  navigateToFolder: (folderId: string | null) => void;
  toggleSelectItem: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  moveItems: (itemIds: string[], targetFolderId: string | null) => void;
}

// ============================================
// MOCK DATA
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
    name: 'Português',
    type: 'folder',
    parentId: '2',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '8',
    name: 'Exercícios - Álgebra.pdf',
    type: 'file',
    parentId: '6',
    size: 850000,
    mimeType: 'application/pdf',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: '9',
    name: 'Relatório Q1.xlsx',
    type: 'file',
    parentId: '3',
    size: 3200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
  },
  {
    id: '10',
    name: 'Apresentação Resultados.pptx',
    type: 'file',
    parentId: '3',
    size: 5600000,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
  },
];

// ============================================
// HOOK
// ============================================

export function useFileSystem(): UseFileSystemReturn {
  const [items, setItems] = useState<FileSystemItem[]>(initialItems);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const currentItems = useMemo(() => {
    return items
      .filter(item => item.parentId === currentFolderId)
      .sort((a, b) => {
        // Pastas primeiro
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        // Depois alfabético
        return a.name.localeCompare(b.name);
      });
  }, [items, currentFolderId]);

  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return items.find(item => item.id === currentFolderId) || null;
  }, [items, currentFolderId]);

  const breadcrumbPath = useMemo(() => {
    const path: FileSystemItem[] = [];
    let current = currentFolder;

    while (current) {
      path.unshift(current);
      current = items.find(item => item.id === current!.parentId) || null;
    }

    return path;
  }, [currentFolder, items]);

  // ============================================
  // ACTIONS
  // ============================================

  const createFolder = useCallback((name: string) => {
    const newFolder: FileSystemItem = {
      id: generateId(),
      name,
      type: 'folder',
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, newFolder]);
  }, [currentFolderId]);

  const uploadFile = useCallback((name: string, size: number, mimeType: string) => {
    const newFile: FileSystemItem = {
      id: generateId(),
      name,
      type: 'file',
      parentId: currentFolderId,
      size,
      mimeType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, newFile]);
  }, [currentFolderId]);

  const deleteItems = useCallback((ids: string[]) => {
    // Recursivamente deleta pastas e seus conteúdos
    const getAllChildIds = (parentId: string): string[] => {
      const children = items.filter(item => item.parentId === parentId);
      const childIds = children.map(child => child.id);
      const grandChildIds = children
        .filter(child => child.type === 'folder')
        .flatMap(folder => getAllChildIds(folder.id));
      
      return [...childIds, ...grandChildIds];
    };

    const idsToDelete = new Set(ids);
    
    // Adiciona todos os filhos das pastas selecionadas
    ids.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item?.type === 'folder') {
        getAllChildIds(id).forEach(childId => idsToDelete.add(childId));
      }
    });

    setItems(prev => prev.filter(item => !idsToDelete.has(item.id)));
    setSelectedItems([]);
  }, [items]);

  const renameItem = useCallback((id: string, newName: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, name: newName, updatedAt: new Date().toISOString() }
        : item
    ));
  }, []);

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedItems([]);
  }, []);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(currentItems.map(item => item.id));
  }, [currentItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const moveItems = useCallback((itemIds: string[], targetFolderId: string | null) => {
    setItems(prev => prev.map(item =>
      itemIds.includes(item.id)
        ? { ...item, parentId: targetFolderId, updatedAt: new Date().toISOString() }
        : item
    ));
    setSelectedItems([]);
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    items,
    currentFolderId,
    selectedItems,
    currentItems,
    breadcrumbPath,
    currentFolder,
    createFolder,
    uploadFile,
    deleteItems,
    renameItem,
    navigateToFolder,
    toggleSelectItem,
    selectAll,
    clearSelection,
    moveItems,
  };
}