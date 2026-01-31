// src/App.tsx - ✅ CORRIGIDO - Removendo lógica desnecessária
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster 
  position="top-right"
  toastOptions={{
    success: {
      style: {
        background: '#10B981',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    },
  }}
/>
    </BrowserRouter>
  );
}

export default App;