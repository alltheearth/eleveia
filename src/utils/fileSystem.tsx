// src/utils/fileSystem.ts
import { FileText, Video, Music, Archive, Image, File } from 'lucide-react';

/**
 * Formata bytes para tamanho legível
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formata data para string legível
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Retorna ícone apropriado baseado no tipo de arquivo
 */
export const getFileIcon = (mimeType?: string, size: number = 20) => {
  if (!mimeType) return <File size={size} className="text-gray-500" />;
  
  if (mimeType.startsWith('image/')) 
    return <Image size={size} className="text-purple-500" />;
  if (mimeType.startsWith('video/')) 
    return <Video size={size} className="text-red-500" />;
  if (mimeType.startsWith('audio/')) 
    return <Music size={size} className="text-pink-500" />;
  if (mimeType.includes('pdf')) 
    return <FileText size={size} className="text-red-600" />;
  if (mimeType.includes('zip') || mimeType.includes('rar')) 
    return <Archive size={size} className="text-orange-500" />;
  
  return <FileText size={size} className="text-gray-600" />;
};

/**
 * Valida nome de arquivo/pasta
 */
export const validateFileName = (name: string): { valid: boolean; error?: string } => {
  if (!name.trim()) {
    return { valid: false, error: 'Nome não pode estar vazio' };
  }
  
  if (name.length > 255) {
    return { valid: false, error: 'Nome muito longo (máximo 255 caracteres)' };
  }
  
  const invalidChars = /[<>:"/\\|?*]/g;
  if (invalidChars.test(name)) {
    return { valid: false, error: 'Nome contém caracteres inválidos' };
  }
  
  return { valid: true };
};