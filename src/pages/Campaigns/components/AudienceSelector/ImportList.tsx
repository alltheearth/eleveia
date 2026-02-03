// src/pages/Campaigns/components/AudienceSelector/ImportList.tsx
// 📤 IMPORTAR LISTA DE CONTATOS VIA CSV

import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImportListProps {
  onImportComplete: (contactIds: number[]) => void;
  schoolId: number;
}

export default function ImportList({
  onImportComplete,
}: ImportListProps) {
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    // Validar tipo
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Apenas arquivos CSV são aceitos');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const processImport = async () => {
    if (!file) return;

    setIsProcessing(true);

    // Simular processamento
    setTimeout(() => {
      const mockResult = {
        success: 45,
        errors: [
          'Linha 3: Email inválido',
          'Linha 12: Contato duplicado',
        ],
      };

      setResult(mockResult);
      setIsProcessing(false);

      // Retornar IDs dos contatos importados
      onImportComplete([1, 2, 3, 4, 5]); // Mock IDs
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-2">📋 Como importar:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
          <li>Prepare um arquivo CSV com colunas: <code className="bg-white px-2 py-0.5 rounded">nome, email, telefone</code></li>
          <li>Faça o upload do arquivo abaixo</li>
          <li>Aguarde o processamento</li>
          <li>Revise os resultados e confirme</li>
        </ol>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
        />

        {!file ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center"
          >
            <Upload className="text-gray-400 mb-3" size={48} />
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Clique para selecionar arquivo CSV
            </p>
            <p className="text-sm text-gray-500">
              ou arraste e solte aqui
            </p>
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={20} className="text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Process Button */}
      {file && !result && (
        <button
          onClick={processImport}
          disabled={isProcessing}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Processando...' : 'Processar Importação'}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-green-900">
                {result.success} contatos importados com sucesso!
              </p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                <p className="font-semibold text-yellow-900">
                  {result.errors.length} erro{result.errors.length !== 1 ? 's' : ''} encontrado{result.errors.length !== 1 ? 's' : ''}:
                </p>
              </div>
              <ul className="text-sm text-yellow-900 space-y-1">
                {result.errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}