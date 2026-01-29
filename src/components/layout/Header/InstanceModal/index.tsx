// // src/components/layout/Header/InstanceModal/index.tsx - CORRIGIDO COM loggedIn
// import { X, Smartphone, CheckCircle, RefreshCw } from 'lucide-react';
// import type { StatusResponse } from '../../../../services/uzapiApi';

// interface InstanceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   qrCode: string;
//   instanceStatus?: StatusResponse;
//   isLoading?: boolean;
// }

// const InstanceModal = ({ 
//   isOpen, 
//   onClose, 
//   qrCode, 
//   instanceStatus,
//   isLoading = false 
// }: InstanceModalProps) => {
  
//   // ✅ CORRIGIDO: Usar loggedIn ao invés de connected
//   const isConnected = instanceStatus?.status?.loggedIn || false;
//   console.log(instanceStatus?.status)
//   const isConnecting = instanceStatus?.instance?.status === 'connecting';

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//               isConnected ? 'bg-green-100' : 'bg-green-100'
//             }`}>
//               {isConnected ? (
//                 <CheckCircle className="text-green-600" size={20} />
//               ) : (
//                 <Smartphone className="text-green-600" size={20} />
//               )}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-900">
//                 {isConnected ? 'Conectado!' : 'Ativar Instância'}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {isConnected ? 'WhatsApp conectado com sucesso' : 'Conecte seu WhatsApp'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition"
//             disabled={isLoading}
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {isConnected ? (
//             /* Sucesso - Efetivamente Logado */
//             <div className="text-center py-8">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
//                 <CheckCircle className="text-green-600" size={40} />
//               </div>
//               <h4 className="text-xl font-bold text-gray-900 mb-2">Conectado com sucesso!</h4>
//               <p className="text-gray-600 mb-2">
//                 Sua instância está ativa e pronta para usar
//               </p>
//               {instanceStatus?.instance?.name && (
//                 <p className="text-sm text-gray-500 mt-2">
//                   Conectado como: <strong>{instanceStatus.instance.name}</strong>
//                 </p>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* QR Code */}
//               <div className="flex flex-col items-center mb-6">
//                 <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-md mb-4">
//                   {qrCode ? (
//                     <img 
//                       src={qrCode} 
//                       alt="QR Code WhatsApp" 
//                       className="w-64 h-64"
//                     />
//                   ) : (
//                     <div className="w-64 h-64 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
//                       <RefreshCw className="animate-spin text-green-600 mb-2" size={32} />
//                       <p className="text-sm text-gray-600">Gerando QR Code...</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Status - Aguardando Scan */}
//                 {isConnecting && qrCode && (
//                   <div className="animate-pulse flex items-center gap-2 text-sm text-gray-600">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
//                     <span>Aguardando leitura do QR Code...</span>
//                   </div>
//                 )}
//               </div>

//               {/* Instruções */}
//               <div className="bg-blue-50 rounded-lg p-4 mb-4">
//                 <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                   <Smartphone size={18} className="text-blue-600" />
//                   Como conectar:
//                 </h4>
//                 <ol className="space-y-2 text-sm text-gray-700">
//                   <li className="flex gap-2">
//                     <span className="font-bold text-blue-600">1.</span>
//                     <span>Abra o WhatsApp no seu celular</span>
//                   </li>
//                   <li className="flex gap-2">
//                     <span className="font-bold text-blue-600">2.</span>
//                     <span>Toque em <strong>Mais opções</strong> ou <strong>Configurações</strong></span>
//                   </li>
//                   <li className="flex gap-2">
//                     <span className="font-bold text-blue-600">3.</span>
//                     <span>Selecione <strong>Aparelhos conectados</strong></span>
//                   </li>
//                   <li className="flex gap-2">
//                     <span className="font-bold text-blue-600">4.</span>
//                     <span>Toque em <strong>Conectar um aparelho</strong></span>
//                   </li>
//                   <li className="flex gap-2">
//                     <span className="font-bold text-blue-600">5.</span>
//                     <span>Aponte a câmera para este QR code</span>
//                   </li>
//                 </ol>
//               </div>

//               {/* Aviso de Segurança */}
//               <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
//                 <p className="text-xs text-yellow-800">
//                   <strong>⚠️ Atenção:</strong> Mantenha seu celular com você. Não compartilhe este QR code com ninguém.
//                 </p>
//               </div>

//               {/* Informações da Instância */}
//               {instanceStatus?.instance && (
//                 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                   <p className="text-xs text-gray-600">
//                     <strong>Status:</strong> {instanceStatus.instance.status}
//                   </p>
//                   {instanceStatus.instance.lastDisconnectReason && (
//                     <p className="text-xs text-gray-600 mt-1">
//                       <strong>Última desconexão:</strong> {instanceStatus.instance.lastDisconnectReason}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold disabled:opacity-50"
//           >
//             {isConnected ? 'Fechar' : 'Cancelar'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstanceModal;