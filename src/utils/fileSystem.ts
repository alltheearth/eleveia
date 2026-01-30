// src/utils/fileSystem.ts

/**
 * ============================================
 * FILE SYSTEM UTILITIES
 * ============================================
 * 
 * Funções auxiliares para manipulação de arquivos
 */

// ============================================
// FORMATAÇÃO DE TAMANHO DE ARQUIVO
// ============================================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// ============================================
// VALIDAÇÃO DE NOME DE ARQUIVO
// ============================================

export const validateFileName = (name: string): { valid: boolean; error?: string } => {
  // Vazio
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Nome não pode ser vazio' };
  }
  
  // Muito longo
  if (name.length > 255) {
    return { valid: false, error: 'Nome muito longo (máximo 255 caracteres)' };
  }
  
  // Caracteres inválidos: < > : " / \ | ? * e caracteres de controle
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/g;
  if (invalidChars.test(name)) {
    return { 
      valid: false, 
      error: 'Nome contém caracteres inválidos (< > : " / \\ | ? *)' 
    };
  }
  
  // Nomes reservados do Windows
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 
                         'COM4', 'LPT1', 'LPT2', 'LPT3'];
  if (reservedNames.includes(name.toUpperCase())) {
    return { valid: false, error: 'Nome reservado pelo sistema' };
  }
  
  // Não pode terminar com ponto ou espaço
  if (name.endsWith('.') || name.endsWith(' ')) {
    return { valid: false, error: 'Nome não pode terminar com ponto ou espaço' };
  }
  
  return { valid: true };
};

// ============================================
// EXTENSÃO DE ARQUIVO
// ============================================

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

// ============================================
// MIME TYPE POR EXTENSÃO
// ============================================

export const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    
    // Media - Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'm4a': 'audio/mp4',
    
    // Media - Video
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    
    // Code
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'py': 'text/x-python',
    'java': 'text/x-java',
    'cpp': 'text/x-c++src',
    'c': 'text/x-csrc',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};