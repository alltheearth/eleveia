// src/routes/AppRoutes.tsx - ✅ CORRIGIDO COM BOARDS
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Login from '../components/Auth/Login';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import Contatos from '../pages/Contacts';
import Eventos from '../pages/Calendar';
import FAQs from '../pages/FAQs';
// import Tickets from '../pages/Tickets';
import Perfil from '../pages/Perfil';
import InformacoesEscola from '../components/Information';
import DocumentsPage from '../pages/Documents';

// ✅ BOARDS - Importações adicionadas
import BoardsPage from '../pages/Boards';
// import BoardView from '../pages/Boards/BoardView';
import BoardViewDnD from '../pages/Boards/BoardViewDnD';
import CampaignsPage from '../pages/Campaigns';
import CampaignView from '../pages/Campaigns/CampaignView';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  console.log('🗺️ [APP ROUTES] Renderizando rotas, isAuthenticated:', isAuthenticated);

  return (
    <Routes>
      {/* ✅ Rota Pública - Login */}
      <Route path="/login" element={<Login />} />
      
      {/* ✅ Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/faqs" element={<FAQs />} />
          {/* <Route path="/tickets" element={<Tickets />} /> */}
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<InformacoesEscola />} />
          <Route path="/documentos" element={<DocumentsPage />} />
          
          {/* ✅ BOARDS - Rotas Kanban */}
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/boards/:id" element={<BoardViewDnD />} />
          <Route path="/campanhas" element={<CampaignsPage />} />
          <Route path="/campanha/:id" element={<CampaignView />} />
          
        </Route>
      </Route>

      {/* ✅ 404 - Redireciona baseado em autenticação */}
      <Route 
        path="*" 
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" replace /> 
            : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;