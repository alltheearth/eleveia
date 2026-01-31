// src/components/layout/Breadcrumbs/index.tsx - 🎨 VERSÃO PROFISSIONAL
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================
// ROUTE LABELS
// ============================================

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  contatos: 'Contatos',
  eventos: 'Calendário',
  faqs: 'FAQs',
  documentos: 'Documentos',
  configuracoes: 'Configurações',
  perfil: 'Meu Perfil',
};

// ============================================
// BREADCRUMBS COMPONENT
// ============================================

export default function Breadcrumbs() {
  const location = useLocation();
  
  // Dividir pathname em segmentos
  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '');

  // Se estiver na home, não mostrar breadcrumbs
  if (pathSegments.length === 0) return null;

  // Construir breadcrumbs
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = ROUTE_LABELS[segment] || segment;
    const isLast = index === pathSegments.length - 1;

    return {
      label,
      path,
      isLast,
    };
  });

  return (
    <nav className="flex items-center gap-2 text-sm">
      {/* Home */}
      <Link 
        to="/dashboard"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
      >
        <Home size={16} className="group-hover:scale-110 transition-transform" />
        <span className="font-medium">Home</span>
      </Link>

      {/* Breadcrumb Items */}
      {breadcrumbs.map((crumb, index) => (
        <motion.div
          key={crumb.path}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          {/* Separator */}
          <ChevronRight size={16} className="text-gray-400" />

          {/* Link ou texto */}
          {crumb.isLast ? (
            <span className="font-semibold text-gray-900">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  );
}