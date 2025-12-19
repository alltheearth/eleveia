// src/components/common/LoadingState/index.tsx
import type { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
  icon?: ReactNode;
  fullScreen?: boolean;
}

export default function LoadingState({ 
  message = 'Carregando...', 
  icon,
  fullScreen = true 
}: LoadingStateProps) {
  const content = (
    <div className="text-center">
      {icon ? (
        <div className="mx-auto mb-4 animate-pulse">
          {icon}
        </div>
      ) : (
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      )}
      <p className="text-gray-600 font-semibold">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      {content}
    </div>
  );
}