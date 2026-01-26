// src/hooks/useHeaderData.ts
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useGetProfileQuery, useGetSchoolsQuery } from '../services';

interface HeaderData {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    initials: string;
    isActive: boolean;
  } | null;

  profile: {
    id: number;
    role: string;
    roleDisplay: string;
    isManager: boolean;
    isOperator: boolean;
    isActive: boolean;
  } | null;

  school: {
    id: number;
    name: string;
    logo: string | null;
  } | null;

  isLoading: boolean;
  isError: boolean;
  error: any;

  permissions: {
    canManageUsers: boolean;
    canEditSchool: boolean;
    canViewReports: boolean;
  };
}

export function useHeaderData(): HeaderData {
  const { user: reduxUser, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const { 
    data: apiUser, 
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  const { 
    data: schoolsData, 
    isLoading: isLoadingSchool,
  } = useGetSchoolsQuery({}, {
    skip: !isAuthenticated || !token,
  });

  const activeUser = apiUser || reduxUser;
  const currentSchool = schoolsData?.results?.[0] || null;

  const userData = useMemo(() => {
    if (!activeUser) return null;

    const firstName = activeUser.first_name || '';
    const lastName = activeUser.last_name || '';
    const username = activeUser.username || '';

    const fullName = firstName && lastName
      ? `${firstName} ${lastName}`
      : username;

    const initials = firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : username.substring(0, 2).toUpperCase();

    return {
      id: activeUser.id,
      username: activeUser.username,
      email: activeUser.email,
      firstName,
      lastName,
      fullName,
      initials,
      isActive: true,
    };
  }, [activeUser]);

  const profileData = useMemo(() => {
    if (!activeUser?.perfil) return null;

    const perfil = activeUser.perfil;

    return {
      id: perfil.id,
      role: perfil.tipo,
      roleDisplay: perfil.tipo_display,
      isManager: perfil.tipo === 'gestor',
      isOperator: perfil.tipo === 'operador',
      isActive: perfil.ativo,
    };
  }, [activeUser?.perfil]);

  const schoolData = useMemo(() => {
    if (!currentSchool) return null;

    return {
      id: currentSchool.id,
      name: currentSchool.nome_escola,
      logo: currentSchool.logo,
    };
  }, [currentSchool]);

  const permissions = useMemo(() => {
    const isSuperuser = activeUser?.is_superuser || activeUser?.is_staff || false;
    const isManager = profileData?.isManager || false;

    return {
      canManageUsers: isSuperuser || isManager,
      canEditSchool: isSuperuser || isManager,
      canViewReports: isSuperuser || isManager,
    };
  }, [activeUser, profileData]);

  return {
    user: userData,
    profile: profileData,
    school: schoolData,
    isLoading: isLoadingProfile || isLoadingSchool,
    isError: isErrorProfile,
    error: errorProfile,
    permissions,
  };
}