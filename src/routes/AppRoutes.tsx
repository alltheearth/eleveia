// src/routes/AppRoutes.tsx - ✅ ATUALIZADO COM NOVAS ROTAS
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Login from '../components/Auth/Login';
import Dashboard from '../components/Dashboard';
import Leads from '../pages/Leads';
import Contatos from '../components/Contacts';
import Eventos from '../components/Calendar';
import FAQs from '../pages/FAQs';
import Tickets from '../pages/Tickets';
import Perfil from '../pages/Perfil';
import InformacoesEscola from '../components/Information';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      
      {/* Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/tickets" element={<Tickets />} />
          
          {/* ✅ NOVAS ROTAS */}
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/informacoes-escola" element={<InformacoesEscola />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;