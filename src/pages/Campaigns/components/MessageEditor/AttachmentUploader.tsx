// src/pages/Campaigns/components/MessageEditor/AttachmentUploader.tsx
// 📎 UPLOADER DE ANEXOS

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video,
  Upload,
  AlertCircle
} from 'lucide-react';
import type { Attachment } from '../../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface AttachmentUploaderProps {
  value: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

// ============================================
// CONSTANTS
// ============================================

const ACCEPTED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  video: ['video/mp4', 'video/quicktime'],
};

const ALL_ACCEPTED = Object.values(ACCEPTED_TYPES).flat().join(',');

// ============================================
// COMPONENT
// ============================================

export default function AttachmentUploader({
  value = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: AttachmentUploaderProps) {
  
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    setError(null);

    // Validar número de arquivos
    if (value.length + files.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivo${maxFiles > 1 ? 's' : ''} permitido${maxFiles > 1 ? 's' : ''}`);
      return;
    }

    // Processar arquivos
    const newAttachments: Attachment[] = [];

    Array.from(files).forEach((file) => {
      // Validar tamanho
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo ${maxSizeMB}MB`);
        return;
      }

      // Determinar tipo
      let type: Attachment['type'] = 'document';
      if (ACCEPTED_TYPES.image.includes(file.type)) type = 'image';
      else if (ACCEPTED_TYPES.video.includes(file.type)) type = 'video';

      // Simular upload (em produção, fazer upload real)
      const attachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        url: URL.createObjectURL(file),
        filename: file.name,
        size: file.size,
      };

      newAttachments.push(attachment);
    });

    onChange([...value, ...newAttachments]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(a => a.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // ============================================
  // HELPERS
  // ============================================
  
  const getFileIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={20} className="text-blue-600" />;
      case 'video':
        return <Video size={20} className="text-purple-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-3">
      
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALL_ACCEPTED}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 text-center"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="text-blue-600" size={24} />
          </div>
          
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Clique ou arraste arquivos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Imagens, PDFs, vídeos até {maxSizeMB}MB ({value.length}/{maxFiles})
            </p>
          </div>
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={16} />
            <p className="text-sm text-red-900">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments List */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {value.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 transition-colors"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(attachment.type)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(attachment.id)}
                  className="flex-shrink-0 p-1 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} className="text-red-600" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}