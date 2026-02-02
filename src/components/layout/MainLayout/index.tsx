// src/components/layout/MainLayout/index.tsx - 🎨 VERSÃO RESPONSIVA PROFISSIONAL
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Breadcrumbs from '../Breadcrumbs';
import { useSidebar } from '../../../hooks/useSidebar';

// ============================================
// MAIN LAYOUT
// ============================================

export default function MainLayout() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <motion.div
        initial={false}
        animate={{
          // Desktop: ajusta margem baseado no estado do sidebar
          // Mobile: sem margem (sidebar é overlay)
          marginLeft: window.innerWidth >= 1024 ? (isCollapsed ? 80 : 280) : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="pt-20 px-6 pb-8">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Breadcrumbs />
          </motion.div>

          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}