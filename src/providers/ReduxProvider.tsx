// src/providers/ReduxProvider.tsx

import { Provider } from 'react-redux';
import { store } from '../store/store'; // Named import

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Provider do Redux para a aplicação
 * Deve envolver toda a árvore de componentes no App.tsx ou main.tsx
 * 
 * @example
 * // src/main.tsx
 * import ReduxProvider from './providers/ReduxProvider';
 * 
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <ReduxProvider>
 *     <App />
 *   </ReduxProvider>
 * );
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;