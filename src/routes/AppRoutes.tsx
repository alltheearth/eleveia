import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Login from '../components/Auth/Login';
import Dashboard from '../components/Dashboard';
import Leads from '../components/Leads';
import Contatos from '../components/Contacts';
import Eventos from '../components/Calendar';
import FAQs from '../components/FAQs';
import Tickets from '../components/Tickets';
// import Documentos from '../components/Documentos';
// import Relatorios from '../pages/Relatorios';
// import Configuracoes from '../pages/Configuracoes';

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
          <Route path='/tickets' element={<Tickets />} />
          {/* <Route path="/documentos" element={<Documentos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />*/}
        </Route> 
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
