// src/components/layout/PageHeader/index.tsx
// 📄 HEADER PADRÃO PARA PÁGINAS
// 
// Componente reutilizável que padroniza os headers de todas as páginas,
// seguindo o design da página Leads/Contatos.
//
// USO BÁSICO:
// <PageHeader
//   title="Gestão de Leads"
//   subtitle="Gerencie seu funil de captação e conversão"
//   icon={<Users size={16} />}
// />
//
// COM AÇÕES:
// <PageHeader
//   title="Dashboard"
//   subtitle="Bem-vindo de volta!"
//   icon={<Calendar size={16} />}
//   actions={
//     <>
//       <button>Exportar</button>
//       <button>Atualizar</button>
//     </>
//   }
// />

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================

interface PageHeaderProps {
  /**
   * Título principal da página
   * @example "Gestão de Leads"
   */
  title: string | ReactNode;
  
  /**
   * Subtítulo/descrição da página
   * @example "Gerencie seu funil de captação e conversão de alunos"
   */
  subtitle?: string | ReactNode;
  
  /**
   * Ícone exibido ao lado do subtítulo
   * @example <Users size={16} />
   */
  icon?: ReactNode;
  
  /**
   * Ícone grande exibido ao lado do título (estilo Boards)
   * @example <Layout className="text-blue-600" size={40} />
   */
  titleIcon?: ReactNode;
  
  /**
   * Botões de ação exibidos no lado direito
   * @example <button>Exportar</button>
   */
  actions?: ReactNode;
  
  /**
   * Classes CSS adicionais para o wrapper
   */
  className?: string;
  
  /**
   * Desabilita a animação de entrada
   * @default false
   */
  disableAnimation?: boolean;
  
  /**
   * Margem inferior
   * @default '8' (2rem / 32px)
   */
  marginBottom?: '4' | '6' | '8' | '10' | '12';
}

// ============================================
// COMPONENT
// ============================================

export default function PageHeader({
  title,
  subtitle,
  icon,
  titleIcon,
  actions,
  className = '',
  disableAnimation = false,
  marginBottom = '8',
}: PageHeaderProps) {
  
  const marginClass = `mb-${marginBottom}`;
  
  const content = (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Left side: Title + Subtitle */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          {titleIcon && titleIcon}
          <span className="truncate">{title}</span>
        </h1>
        
        {/* Subtitle */}
        {subtitle && (
          <div className="text-gray-600 flex items-center gap-2">
            {icon && icon}
            {typeof subtitle === 'string' ? (
              <p className="text-base">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
        )}
      </div>

      {/* Right side: Actions */}
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );

  // Com animação
  if (!disableAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={marginClass}
      >
        {content}
      </motion.div>
    );
  }

  // Sem animação
  return <div className={marginClass}>{content}</div>;
}

// ============================================
// VARIAÇÕES PRÉ-CONFIGURADAS (OPCIONAL)
// ============================================

/**
 * Header para páginas de listagem (Leads, Contatos, etc)
 */
export function ListPageHeader({
  title,
  subtitle,
  icon,
  onExport,
  onRefresh,
  onNew,
  isExporting = false,
  isRefreshing = false,
  exportLabel = 'Exportar',
  refreshLabel = 'Atualizar',
  newLabel = 'Novo',
  ...props
}: Omit<PageHeaderProps, 'actions'> & {
  onExport?: () => void;
  onRefresh?: () => void;
  onNew?: () => void;
  isExporting?: boolean;
  isRefreshing?: boolean;
  exportLabel?: string;
  refreshLabel?: string;
  newLabel?: string;
}) {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      icon={icon}
      actions={
        <>
          {onExport && (
            <button
              onClick={onExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">{isExporting ? 'Exportando...' : exportLabel}</span>
            </button>
          )}
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">{refreshLabel}</span>
            </button>
          )}

          {onNew && (
            <button
              onClick={onNew}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{newLabel}</span>
            </button>
          )}
        </>
      }
      {...props}
    />
  );
}

/**
 * Header para Dashboard (apenas refresh)
 */
export function DashboardHeader({
  title = 'Dashboard',
  subtitle,
  icon,
  onRefresh,
  isRefreshing = false,
  ...props
}: Omit<PageHeaderProps, 'actions' | 'title'> & {
  title?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      icon={icon}
      actions={
        onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
        )
      }
      {...props}
    />
  );
}