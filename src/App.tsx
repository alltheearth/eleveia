// src/App.tsx - ✅ SOLUÇÃO FINAL - SEM buscar perfil no App
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  // ✅ SIMPLES - Apenas renderiza as rotas
  // O perfil será buscado pelo Header quando necessário
  
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;