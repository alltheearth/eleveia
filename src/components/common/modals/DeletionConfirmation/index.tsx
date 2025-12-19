import { AlertCircle } from "lucide-react";

const DeletionConfirmation = ({ info, onConfirm, onCancel, isDeleting }: { info?: string; onConfirm: () => void; onCancel: () => void; isDeleting: boolean }) => {


    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-red-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  {info || 'Tem certeza que deseja deletar este item? Esta ação não pode ser desfeita.'}
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                  >
                    {isDeleting ? 'Deletando...' : 'Deletar'}
                  </button>
                </div>
              </div>
            </div>
    );
};

export default DeletionConfirmation;
