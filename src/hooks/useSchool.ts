// // src/hooks/useSchool.ts - Hook customizado para facilitar uso do RTK Query
// import { useEffect } from 'react';
// import { 
//   useGetSchoolsQuery, 
//   useGetSchoolByIdQuery,
//   useCreateSchoolMutation,
//   useUpdateSchoolMutation,
//   useDeleteSchoolMutation,
//   type School 
// } from '../services/schoolApi';

// interface UseSchoolReturn {
//   // Dados
//   schools: School[];
//   currentSchool: School | null;
  
//   // Estados
//   isLoading: boolean;
//   isError: boolean;
//   error: any;
  
//   // Mutations
//   createSchool: (data: Partial<School>) => Promise<School>;
//   updateSchool: (id: number, data: Partial<School>) => Promise<School>;
//   deleteSchool: (id: number) => Promise<void>;
  
//   // Utilitários
//   refetch: () => void;
//   hasSchools: boolean;
//   schoolCount: number;
// }

// /**
//  * Hook customizado para gerenciar escolas usando RTK Query
//  * 
//  * @example
//  * ```tsx
//  * function MyComponent() {
//  *   const { 
//  *     currentSchool, 
//  *     isLoading, 
//  *     updateSchool 
//  *   } = useSchool();
//  *   
//  *   if (isLoading) return <Loading />;
//  *   
//  *   return (
//  *     <div>
//  *       <h1>{currentSchool?.nome_escola}</h1>
//  *       <button onClick={() => updateSchool(currentSchool.id, { nome_escola: 'Novo Nome' })}>
//  *         Atualizar
//  *       </button>
//  *     </div>
//  *   );
//  * }
//  * ```
//  */
// export function useSchool(schoolId?: number): UseSchoolReturn {
//   // Query para buscar todas as escolas
//   const { 
//     data: schoolsData, 
//     isLoading: isLoadingSchools, 
//     error: errorSchools,
//     refetch 
//   } = useGetSchoolsQuery();

//   // Query condicional para buscar escola específica por ID
//   const { 
//     data: specificSchool, 
//     isLoading: isLoadingSpecific 
//   } = useGetSchoolByIdQuery(schoolId!, {
//     skip: !schoolId, // Pula a query se não houver schoolId
//   });

//   // Mutations
//   const [createMutation, { isLoading: isCreating }] = useCreateSchoolMutation();
//   const [updateMutation, { isLoading: isUpdating }] = useUpdateSchoolMutation();
//   const [deleteMutation, { isLoading: isDeleting }] = useDeleteSchoolMutation();

//   // Processar dados
//   const schools = schoolsData?.results || [];
//   const currentSchool = specificSchool || (schools.length > 0 ? schools[0] : null);
//   const isLoading = isLoadingSchools || isLoadingSpecific || isCreating || isUpdating || isDeleting;
//   const isError = !!errorSchools;
//   const hasSchools = schools.length > 0;
//   const schoolCount = schoolsData?.count || 0;

//   // Wrapper functions para as mutations
//   const createSchool = async (data: Partial<School>): Promise<School> => {
//     try {
//       const result = await createMutation(data).unwrap();
//       console.log('✅ Escola criada:', result);
//       return result;
//     } catch (error: any) {
//       console.error('❌ Erro ao criar escola:', error);
//       throw error;
//     }
//   };

//   const updateSchool = async (id: number, data: Partial<School>): Promise<School> => {
//     try {
//       const result = await updateMutation({ id, data }).unwrap();
//       console.log('✅ Escola atualizada:', result);
//       return result;
//     } catch (error: any) {
//       console.error('❌ Erro ao atualizar escola:', error);
//       throw error;
//     }
//   };

//   const deleteSchool = async (id: number): Promise<void> => {
//     try {
//       await deleteMutation(id).unwrap();
//       console.log('✅ Escola deletada');
//     } catch (error: any) {
//       console.error('❌ Erro ao deletar escola:', error);
//       throw error;
//     }
//   };

//   // Log útil para debug
//   useEffect(() => {
//     if (currentSchool) {
//       console.log('📚 Escola atual:', currentSchool.nome_escola);
//     }
//   }, [currentSchool]);

//   return {
//     schools,
//     currentSchool,
//     isLoading,
//     isError,
//     error: errorSchools,
//     createSchool,
//     updateSchool,
//     deleteSchool,
//     refetch,
//     hasSchools,
//     schoolCount,
//   };
// }

// // Hook adicional para pegar apenas dados de uma escola específica
// export function useCurrentSchool() {
//   const { 
//     currentSchool, 
//     isLoading, 
//     isError, 
//     updateSchool 
//   } = useSchool();

//   return {
//     school: currentSchool,
//     isLoading,
//     isError,
//     updateSchool: (data: Partial<School>) => 
//       currentSchool ? updateSchool(currentSchool.id, data) : Promise.reject('Nenhuma escola selecionada'),
//   };
// }