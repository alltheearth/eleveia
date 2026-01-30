// src/hooks/useFileSystem.ts

import { useState, useCallback, useMemo } from 'react';

/**
 * ============================================
 * FILE SYSTEM TYPES
 * ============================================
 */

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ============================================
 * USE FILE SYSTEM HOOK
 * ============================================
 * 
 * Hook customizado para gerenciar sistema de arquivos
 * 
 * @example
 * ```tsx
 * const {
 *   currentItems,
 *   createFolder,
 *   uploadFile,
 * } = useFileSystem();
 * ```
 */
export const useFileSystem = () => {
  
  // ============================================
  // STATE
  // ============================================
  
  // Todos os items (arquivos e pastas)
  const [items, setItems] = useState<FileSystemItem[]>(() => {
    // Tenta carregar do localStorage
    const saved = localStorage.getItem('fileSystem');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar fileSystem do localStorage', e);
      }
    }
    
    // Estrutura inicial
    return [
      {
        id: 'folder-1',
        name: 'Documentos',
        type: 'folder',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'folder-2',
        name: 'Imagens',
        type: 'folder',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'folder-3',
        name: 'Vídeos',
        type: 'folder',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'file-1',
        name: 'exemplo.pdf',
        type: 'file',
        parentId: 'folder-1',
        size: 245680,
        mimeType: 'application/pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'file-2',
        name: 'foto.jpg',
        type: 'file',
        parentId: 'folder-2',
        size: 1024000,
        mimeType: 'image/jpeg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });
  
  // Pasta atual (null = raiz)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  // Items selecionados
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // ============================================
  // PERSIST TO LOCALSTORAGE
  // ============================================
  
  const persistItems = useCallback((newItems: FileSystemItem[]) => {
    try {
      localStorage.setItem('fileSystem', JSON.stringify(newItems));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  }, []);
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  // Items da pasta atual
  const currentItems = useMemo(() => {
    return items.filter(item => item.parentId === currentFolderId);
  }, [items, currentFolderId]);
  
  // Breadcrumb path (caminho de navegação)
  const breadcrumbPath = useMemo((): FileSystemItem[] => {
    const path: FileSystemItem[] = [];
    let tempFolderId = currentFolderId;
    
    while (tempFolderId) {
      const folder = items.find(i => i.id === tempFolderId && i.type === 'folder');
      if (folder) {
        path.unshift(folder); // Adiciona no início
        tempFolderId = folder.parentId;
      } else {
        break;
      }
    }
    
    return path;
  }, [items, currentFolderId]);
  
  // ============================================
  // NAVIGATION
  // ============================================
  
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedItems([]); // Limpa seleção ao navegar
  }, []);
  
  // ============================================
  // SELECTION
  // ============================================
  
  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }, []);
  
  const selectAllItems = useCallback(() => {
    setSelectedItems(currentItems.map(item => item.id));
  }, [currentItems]);
  
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);
  
  // ============================================
  // CREATE FOLDER
  // ============================================
  
  const createFolder = useCallback((name: string) => {
    const newFolder: FileSystemItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const newItems = [...items, newFolder];
    setItems(newItems);
    persistItems(newItems);
    
    console.log('✅ Pasta criada:', name);
  }, [items, currentFolderId, persistItems]);
  
  // ============================================
  // UPLOAD FILE
  // ============================================
  
  const uploadFile = useCallback((name: string, size: number, mimeType: string) => {
    const newFile: FileSystemItem = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      parentId: currentFolderId,
      size,
      mimeType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const newItems = [...items, newFile];
    setItems(newItems);
    persistItems(newItems);
    
    console.log('✅ Arquivo enviado:', name, `(${size} bytes)`);
  }, [items, currentFolderId, persistItems]);
  
  // ============================================
  // DELETE ITEMS
  // ============================================
  
  const deleteItems = useCallback((ids: string[]) => {
    // Função recursiva para deletar pasta e todo seu conteúdo
    const getAllChildrenIds = (parentId: string): string[] => {
      const children = items.filter(item => item.parentId === parentId);
      let allIds = children.map(child => child.id);
      
      children.forEach(child => {
        if (child.type === 'folder') {
          allIds = [...allIds, ...getAllChildrenIds(child.id)];
        }
      });
      
      return allIds;
    };
    
    // Coletar IDs de todos os items a deletar (incluindo filhos)
    let idsToDelete = [...ids];
    ids.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item && item.type === 'folder') {
        idsToDelete = [...idsToDelete, ...getAllChildrenIds(id)];
      }
    });
    
    const newItems = items.filter(item => !idsToDelete.includes(item.id));
    setItems(newItems);
    persistItems(newItems);
    setSelectedItems([]);
    
    console.log('✅ Items deletados:', idsToDelete.length);
  }, [items, persistItems]);
  
  // ============================================
  // RENAME ITEM
  // ============================================
  
  const renameItem = useCallback((id: string, newName: string) => {
    const newItems = items.map(item =>
      item.id === id
        ? { ...item, name: newName, updatedAt: new Date().toISOString() }
        : item
    );
    
    setItems(newItems);
    persistItems(newItems);
    
    console.log('✅ Item renomeado:', newName);
  }, [items, persistItems]);
  
  // ============================================
  // MOVE ITEMS (para futura implementação)
  // ============================================
  
  const moveItems = useCallback((ids: string[], targetFolderId: string | null) => {
    const newItems = items.map(item =>
      ids.includes(item.id)
        ? { ...item, parentId: targetFolderId, updatedAt: new Date().toISOString() }
        : item
    );
    
    setItems(newItems);
    persistItems(newItems);
    setSelectedItems([]);
    
    console.log('✅ Items movidos:', ids.length);
  }, [items, persistItems]);
  
  // ============================================
  // STATISTICS
  // ============================================
  
  const statistics = useMemo(() => {
    const totalFiles = items.filter(i => i.type === 'file').length;
    const totalFolders = items.filter(i => i.type === 'folder').length;
    const totalSize = items
      .filter(i => i.type === 'file' && i.size)
      .reduce((acc, item) => acc + (item.size || 0), 0);
    
    return {
      totalFiles,
      totalFolders,
      totalSize,
      totalItems: items.length,
    };
  }, [items]);
  
  // ============================================
  // RETURN
  // ============================================
  
  return {
    // State
    currentItems,
    breadcrumbPath,
    selectedItems,
    currentFolderId,
    statistics,
    
    // Navigation
    navigateToFolder,
    
    // Selection
    toggleSelectItem,
    selectAllItems,
    clearSelection,
    
    // CRUD
    createFolder,
    uploadFile,
    deleteItems,
    renameItem,
    moveItems,
  };
};