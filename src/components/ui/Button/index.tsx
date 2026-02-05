// src/components/ui/Button/index.tsx
// 🔘 SISTEMA DE BOTÕES REUTILIZÁVEL
//
// Unifica todos os botões do projeto com variantes consistentes.
// Baseado nos padrões encontrados em Dashboard, Leads e Boards.
//
// VARIANTES DISPONÍVEIS:
// - primary: Botão principal (gradient blue)
// - secondary: Botão secundário (gray)
// - outline: Botão com borda (white)
// - danger: Botão de ação destrutiva (red)
// - ghost: Botão sem background (apenas hover)
//
// USO BÁSICO:
// <Button variant="primary" onClick={handleClick}>
//   Salvar
// </Button>
//
// COM ÍCONE:
// <Button variant="primary" icon={<Plus size={20} />}>
//   Novo Lead
// </Button>
//
// LOADING:
// <Button variant="primary" loading={isLoading}>
//   Salvando...
// </Button>

import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante visual do botão
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Tamanho do botão
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Ícone a ser exibido (antes do texto)
   */
  icon?: ReactNode;
  
  /**
   * Estado de loading (mostra spinner e desabilita)
   * @default false
   */
  loading?: boolean;
  
  /**
   * Texto alternativo quando em loading
   */
  loadingText?: string;
  
  /**
   * Se true, o botão ocupa 100% da largura
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Conteúdo do botão
   */
  children?: ReactNode;
}

// ============================================
// VARIANT STYLES
// ============================================

const variantStyles: Record<ButtonVariant, string> = {
  // Gradiente azul - Botão principal de ação
  primary: `
    bg-gradient-to-r from-blue-600 to-blue-700 
    hover:from-blue-700 hover:to-blue-800 
    text-white 
    shadow-lg shadow-blue-500/30 
    hover:shadow-xl hover:shadow-blue-500/40
    disabled:from-blue-400 disabled:to-blue-500
    disabled:shadow-none
  `,
  
  // Cinza - Botão secundário
  secondary: `
    bg-gray-100 
    hover:bg-gray-200 
    text-gray-700
    disabled:bg-gray-50
    disabled:text-gray-400
  `,
  
  // Branco com borda - Botão terciário
  outline: `
    bg-white 
    hover:bg-gray-50 
    border border-gray-200 
    text-gray-700 
    shadow-sm 
    hover:shadow
    disabled:bg-gray-50
    disabled:text-gray-400
    disabled:border-gray-100
  `,
  
  // Vermelho - Ações destrutivas
  danger: `
    bg-red-600 
    hover:bg-red-700 
    text-white
    shadow-sm
    disabled:bg-red-400
  `,
  
  // Transparente - Apenas hover
  ghost: `
    bg-transparent 
    hover:bg-gray-100 
    text-gray-600
    hover:text-gray-900
    disabled:text-gray-400
    disabled:hover:bg-transparent
  `,
};

// ============================================
// SIZE STYLES
// ============================================

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  sm: {
    button: 'px-3 py-2 text-sm',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'px-4 py-3 text-base',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'px-6 py-3 text-base',
    icon: 'w-5 h-5',
  },
};

// ============================================
// COMPONENT
// ============================================

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  loadingText,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  
  const isDisabled = disabled || loading;
  
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    rounded-xl
    font-semibold
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:cursor-not-allowed
    disabled:opacity-50
  `;
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size].button}
    ${widthStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      {/* Loading Spinner */}
      {loading ? (
        <Loader2 className={`${sizeStyles[size].icon} animate-spin`} />
      ) : icon ? (
        <span className={sizeStyles[size].icon}>{icon}</span>
      ) : null}
      
      {/* Button Text */}
      {loading && loadingText ? (
        <span>{loadingText}</span>
      ) : (
        children
      )}
    </button>
  );
}

// ============================================
// VARIAÇÕES PRÉ-CONFIGURADAS (OPCIONAL)
// ============================================

/**
 * Botão para criar/adicionar novos itens
 */
export function CreateButton({ children = 'Criar', icon, ...props }: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="primary" icon={icon} {...props}>
      {children}
    </Button>
  );
}

/**
 * Botão para exportar dados
 */
export function ExportButton({ children = 'Exportar', loading, ...props }: Omit<ButtonProps, 'variant' | 'icon'>) {
  return (
    <Button 
      variant="outline" 
      loading={loading}
      loadingText="Exportando..."
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * Botão para atualizar/refresh
 */
export function RefreshButton({ children = 'Atualizar', loading, ...props }: Omit<ButtonProps, 'variant' | 'icon'>) {
  return (
    <Button 
      variant="outline" 
      loading={loading}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * Botão de cancelar
 */
export function CancelButton({ children = 'Cancelar', ...props }: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="secondary" {...props}>
      {children}
    </Button>
  );
}

/**
 * Botão de deletar/remover
 */
export function DeleteButton({ children = 'Deletar', ...props }: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="danger" {...props}>
      {children}
    </Button>
  );
}

// ============================================
// BUTTON GROUP
// ============================================

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

/**
 * Agrupa botões com espaçamento consistente
 */
export function ButtonGroup({ children, className = '' }: ButtonGroupProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}