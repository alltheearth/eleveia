// Crie um arquivo de design tokens
// src/styles/designTokens.ts

export const designTokens = {
  colors: {
    // Cores primárias com significado emocional para educação
    primary: {
      50: '#E3F2FD',   // Azul claro - confiança
      100: '#BBDEFB',
      500: '#2196F3',  // Azul médio - sua cor principal
      600: '#1E88E5',  // Mais escuro
      900: '#0D47A1',  // Muito escuro
    },
    success: {
      50: '#E8F5E9',
      500: '#4CAF50',  // Verde - aprovação, sucesso
      600: '#43A047',
    },
    warning: {
      50: '#FFF3E0',
      500: '#FF9800',  // Laranja - atenção
      600: '#FB8C00',
    },
    // COR EXCLUSIVA DA MARCA (escolha uma!)
    brand: {
      purple: '#7C3AED',  // Roxa - criatividade, educação
      teal: '#14B8A6',    // Verde-água - inovação
      indigo: '#6366F1',  // Índigo - inteligência
    }
  },
  
  // Tipografia hierárquica
  typography: {
    fontFamily: {
      display: "'Poppins', sans-serif",  // Para títulos
      body: "'Inter', sans-serif",        // Para corpo
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
  },
  
  // Espaçamentos consistentes
  spacing: {
    section: '2rem',      // Entre seções
    component: '1.5rem',  // Entre componentes
    element: '1rem',      // Entre elementos
  },
  
  // Sombras profissionais
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',  // Para cards
  },
  
  // Bordas arredondadas
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',  // Circular
  },
};