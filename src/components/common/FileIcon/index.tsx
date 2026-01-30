// src/components/common/FileIcon/index.tsx
import {
  File,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  Folder,
} from 'lucide-react';

interface FileIconProps {
  mimeType?: string;
  isFolder?: boolean;
  size?: number;
  className?: string;
}

export default function FileIcon({ 
  mimeType, 
  isFolder = false, 
  size = 20,
  className = '' 
}: FileIconProps) {
  if (isFolder) {
    return <Folder size={size} className={`text-blue-500 ${className}`} />;
  }
  
  if (!mimeType) {
    return <File size={size} className={`text-gray-500 ${className}`} />;
  }
  
  // Imagens
  if (mimeType.startsWith('image/')) {
    return <Image size={size} className={`text-purple-500 ${className}`} />;
  }
  
  // Vídeos
  if (mimeType.startsWith('video/')) {
    return <Video size={size} className={`text-red-500 ${className}`} />;
  }
  
  // Áudios
  if (mimeType.startsWith('audio/')) {
    return <Music size={size} className={`text-pink-500 ${className}`} />;
  }
  
  // PDFs
  if (mimeType.includes('pdf')) {
    return <FileText size={size} className={`text-red-600 ${className}`} />;
  }
  
  // Arquivos compactados
  if (mimeType.includes('zip') || mimeType.includes('rar')) {
    return <Archive size={size} className={`text-orange-500 ${className}`} />;
  }
  
  // Word
  if (mimeType.includes('word')) {
    return <FileText size={size} className={`text-blue-600 ${className}`} />;
  }
  
  // Excel
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return <FileText size={size} className={`text-green-600 ${className}`} />;
  }
  
  // PowerPoint
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
    return <FileText size={size} className={`text-orange-600 ${className}`} />;
  }
  
  // Default
  return <File size={size} className={`text-gray-600 ${className}`} />;
}