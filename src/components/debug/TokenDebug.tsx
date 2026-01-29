// // src/components/debug/TokenDebug.tsx - Componente para debug visual do token
// import { useGetSchoolsQuery } from '../../services/schoolApi';
// import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// const TokenDebug = () => {
//   const { data: schoolsData, isLoading: isLoadingSchools } = useGetSchoolsQuery();

//   const school = schoolsData?.results?.[0];
//   const hasSchool = !!school;
//   const hasToken = !!school?.token_mensagens && school.token_mensagens.trim() !== '';
//   const tokenValue = school?.token_mensagens || 'Não configurado';

//   return (
//     <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md z-50">
//       <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
//         <Info size={20} className="text-blue-600" />
//         <h3 className="font-bold text-gray-900">Debug - Token</h3>
//       </div>

//       <div className="space-y-2 text-sm">
//         {/* Escola carregada? */}
//         <div className="flex items-center gap-2">
//           {isLoadingSchools ? (
//             <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//           ) : hasSchool ? (
//             <CheckCircle size={20} className="text-green-600" />
//           ) : (
//             <XCircle size={20} className="text-red-600" />
//           )}
//           <span className="font-medium">Escola carregada:</span>
//           <span className={hasSchool ? 'text-green-700' : 'text-red-700'}>
//             {hasSchool ? school.nome_escola : 'Não encontrada'}
//           </span>
//         </div>

//         {/* Token configurado? */}
//         {hasSchool && (
//           <div className="flex items-start gap-2">
//             {hasToken ? (
//               <CheckCircle size={20} className="text-green-600 mt-0.5" />
//             ) : (
//               <XCircle size={20} className="text-red-600 mt-0.5" />
//             )}
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">Token configurado:</span>
//                 <span className={hasToken ? 'text-green-700' : 'text-red-700'}>
//                   {hasToken ? 'Sim' : 'Não'}
//                 </span>
//               </div>
//               {hasToken && (
//                 <div className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded break-all">
//                   {tokenValue.substring(0, 20)}...
//                 </div>
//               )}
//             </div>
//           </div>
//         )}


//         {/* Instruções */}
//         {!hasToken && hasSchool && (
//           <div className="mt-3 pt-3 border-t border-gray-200">
//             <p className="text-xs text-gray-600 mb-2">
//               <strong>Como configurar:</strong>
//             </p>
//             <ol className="text-xs text-gray-600 space-y-1 pl-4">
//               <li>1. Acesse o Django Admin</li>
//               <li>2. Vá em Eleveai &gt; Escolas</li>
//               <li>3. Edite a escola: <strong>{school.nome_escola}</strong></li>
//               <li>4. Cole o token do uazapi no campo <strong>token_mensagens</strong></li>
//               <li>5. Salve e recarregue a página</li>
//             </ol>
//           </div>
//         )}
//       </div>

//       {/* Botão para copiar comando SQL */}
//       {hasSchool && !hasToken && (
//         <button
//           onClick={() => {
//             const sql = `UPDATE eleveai_escola SET token_mensagens = 'SEU_TOKEN_AQUI' WHERE id = ${school.id};`;
//             navigator.clipboard.writeText(sql);
//             alert('SQL copiado! Cole seu token do uazapi no lugar de SEU_TOKEN_AQUI');
//           }}
//           className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
//         >
//           Copiar SQL de Atualização
//         </button>
//       )}
//     </div>
//   );
// };

// export default TokenDebug;