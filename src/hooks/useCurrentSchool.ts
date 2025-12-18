// ✅ CORRETO - src/hooks/useCurrentSchool.ts
import { useState, useEffect } from 'react';
import { useGetSchoolsQuery, type School } from '../services'; // ✅ Importar do index

interface UseCurrentSchoolReturn {
  currentSchool: School | null;
  currentSchoolId: string;
  schools: School[];
  hasMultipleSchools: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  setCurrentSchoolById: (id: string) => void;
  refetch: () => void;
}

export function useCurrentSchool(): UseCurrentSchoolReturn {
  const { 
    data: schoolsData, 
    isLoading, 
    error,
    refetch 
  } = useGetSchoolsQuery({});

  const [currentSchoolId, setCurrentSchoolId] = useState<string>('');

  // ✅ Pegar primeira escola automaticamente quando carregar
  useEffect(() => {
    if (schoolsData && schoolsData.results.length > 0 && !currentSchoolId) {
      const primeiraEscola = schoolsData.results[0];
      setCurrentSchoolId(primeiraEscola.id.toString());
      console.log('✅ Escola inicial selecionada:', primeiraEscola.nome_escola);
    }
  }, [schoolsData, currentSchoolId]);

  // ✅ Pegar escola atual baseada no ID
  const currentSchool = schoolsData?.results.find(
    escola => escola.id.toString() === currentSchoolId
  ) || schoolsData?.results[0] || null;

  const schools = schoolsData?.results || [];
  const hasMultipleSchools = schools.length > 1;
  const isError = !!error;

  const setCurrentSchoolById = (id: string) => {
    console.log('🔄 Mudando escola para ID:', id);
    setCurrentSchoolId(id);
  };

  return {
    currentSchool,
    currentSchoolId,
    schools,
    hasMultipleSchools,
    isLoading,
    isError,
    error,
    setCurrentSchoolById,
    refetch,
  };
}

export function useCurrentSchoolId(): string {
  const { currentSchoolId } = useCurrentSchool();
  return currentSchoolId;
}