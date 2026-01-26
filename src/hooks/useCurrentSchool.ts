// src/hooks/useCurrentSchool.ts - ✅ VERSÃO CORRIGIDA
import { useState, useEffect, useCallback } from 'react';
import { useGetSchoolsQuery, type School } from '../services';

const STORAGE_KEY = 'eleve_current_school_id';

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

  // Inicializa com localStorage
  const [currentSchoolId, setCurrentSchoolId] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🏫 [HOOK] ID inicial do localStorage:', stored);
    return stored || '';
  });

  // Sincroniza com localStorage
  useEffect(() => {
    if (currentSchoolId) {
      localStorage.setItem(STORAGE_KEY, currentSchoolId);
      console.log('💾 [HOOK] ID salvo:', currentSchoolId);
    }
  }, [currentSchoolId]);

  // Seleciona escola automaticamente
  useEffect(() => {
    if (!schoolsData?.results || schoolsData.results.length === 0) {
      console.log('⚠️ [HOOK] Nenhuma escola disponível');
      return;
    }

    const schools = schoolsData.results;
    console.log('🏫 [HOOK] Escolas carregadas:', schools.length);

    // Se já tem ID válido, mantém
    if (currentSchoolId) {
      const exists = schools.some(s => s.id.toString() === currentSchoolId);
      if (exists) {
        console.log('✅ [HOOK] ID válido:', currentSchoolId);
        return;
      }
    }

    // Seleciona a primeira
    const firstSchool = schools[0];
    const newId = firstSchool.id.toString();
    
    console.log('🎯 [HOOK] Selecionando primeira escola:', {
      id: newId,
      name: firstSchool.school_name // ✅ CORRIGIDO
    });
    
    setCurrentSchoolId(newId);
  }, [schoolsData, currentSchoolId]);

  // Memoiza escola atual
  const currentSchool = schoolsData?.results.find(
    school => school.id.toString() === currentSchoolId
  ) || null;

  // Log quando escola muda
  useEffect(() => {
    if (currentSchool) {
      console.log('✅ [HOOK] Escola atual:', {
        id: currentSchool.id,
        name: currentSchool.school_name // ✅ CORRIGIDO
      });
    } else if (!isLoading) {
      console.log('❌ [HOOK] Nenhuma escola selecionada');
    }
  }, [currentSchool, isLoading]);

  const schools = schoolsData?.results || [];
  const hasMultipleSchools = schools.length > 1;
  const isError = !!error;

  const setCurrentSchoolById = useCallback((id: string) => {
    console.log('🔄 [HOOK] Mudando escola para ID:', id);
    setCurrentSchoolId(id);
  }, []);

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

export function clearCurrentSchool(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🧹 [HOOK] localStorage limpo');
}