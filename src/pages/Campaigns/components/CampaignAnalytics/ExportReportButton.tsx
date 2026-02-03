// src/pages/Campaigns/components/CampaignAnalytics/ExportReportButton.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, FileImage, Check } from 'lucide-react';
import type { Campaign, CampaignAnalytics } from '../../types/campaign.types';

interface ExportReportButtonProps {
  campaign: Campaign;
  analytics: CampaignAnalytics;
}

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'png';

export default function ExportReportButton({
  campaign,
  analytics,
}: ExportReportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<ExportFormat | null>(null);

  const exportOptions: Array<{
    format: ExportFormat;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      format: 'pdf',
      label: 'Relatório PDF',
      description: 'Relatório completo formatado',
      icon: <FileText size={20} />,
      color: 'text-red-600',
    },
    {
      format: 'excel',
      label: 'Planilha Excel',
      description: 'Dados em tabela editável',
      icon: <FileSpreadsheet size={20} />,
      color: 'text-green-600',
    },
    {
      format: 'csv',
      label: 'Arquivo CSV',
      description: 'Dados brutos para análise',
      icon: <FileText size={20} />,
      color: 'text-blue-600',
    },
    {
      format: 'png',
      label: 'Imagem PNG',
      description: 'Screenshot do dashboard',
      icon: <FileImage size={20} />,
      color: 'text-purple-600',
    },
  ];

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setExportedFormat(null);

    // Simular exportação
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: Implementar exportação real
    switch (format) {
      case 'pdf':
        console.log('Exportando PDF...');
        // Usar jsPDF ou similar
        break;
      case 'excel':
        console.log('Exportando Excel...');
        // Usar SheetJS ou similar
        break;
      case 'csv':
        console.log('Exportando CSV...');
        exportCSV();
        break;
      case 'png':
        console.log('Exportando PNG...');
        // Usar html2canvas ou similar
        break;
    }

    setIsExporting(false);
    setExportedFormat(format);
    setShowMenu(false);

    // Reset success state
    setTimeout(() => setExportedFormat(null), 3000);
  };

  const exportCSV = () => {
    // Dados simplificados para CSV
    const csvData = [
      ['Campanha', campaign.name],
      ['Tipo', campaign.type],
      ['Status', campaign.status],
      [''],
      ['Métrica', 'Valor'],
      ['Total de Destinatários', analytics.total_recipients],
      ['Mensagens Enviadas', analytics.messages_sent],
      ['Mensagens Entregues', analytics.messages_delivered],
      ['Mensagens Abertas', analytics.messages_opened],
      ['Mensagens Clicadas', analytics.messages_clicked],
      ['Conversões', analytics.conversions],
      [''],
      ['Taxa de Entrega (%)', analytics.delivery_rate.toFixed(2)],
      ['Taxa de Abertura (%)', analytics.open_rate.toFixed(2)],
      ['Taxa de Cliques (%)', analytics.click_rate.toFixed(2)],
      ['Taxa de Conversão (%)', analytics.conversion_rate.toFixed(2)],
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `relatorio_${campaign.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`p-2 rounded-lg transition-colors relative ${
          isExporting
            ? 'bg-white/10 cursor-wait'
            : exportedFormat
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-white/20 hover:bg-white/30'
        }`}
        title="Exportar relatório"
      >
        {isExporting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : exportedFormat ? (
          <Check className="text-white" size={20} />
        ) : (
          <Download className="text-white" size={20} />
        )}
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50"
            >
              {/* Menu header */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="font-bold text-gray-900 text-sm">Exportar Relatório</p>
                <p className="text-xs text-gray-600">Escolha o formato desejado</p>
              </div>

              {/* Options */}
              <div className="p-2">
                {exportOptions.map((option) => (
                  <button
                    key={option.format}
                    onClick={() => handleExport(option.format)}
                    disabled={isExporting}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`${option.color} flex-shrink-0`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer info */}
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Os dados serão exportados com data de hoje
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {exportedFormat && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -10, x: '-50%' }}
            className="fixed bottom-8 left-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3"
          >
            <Check size={20} />
            <div>
              <p className="font-bold text-sm">Exportação concluída!</p>
              <p className="text-xs text-green-100">
                Arquivo {exportedFormat.toUpperCase()} baixado com sucesso
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}