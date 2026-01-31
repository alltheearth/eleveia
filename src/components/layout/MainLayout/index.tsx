// src/components/layout/MainLayout/index.tsx - 🎨 VERSÃO PROFISSIONAL
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Breadcrumbs from '../Breadcrumbs';

// ============================================
// MAIN LAYOUT
// ============================================

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:ml-[280px]">
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
      </div>
    </div>
  );
}