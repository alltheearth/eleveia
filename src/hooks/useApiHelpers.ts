// src/hooks/useApiHelpers.ts
// Hooks customizados úteis para trabalhar com RTK Query

import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../services/apiSlice';

// ============================================================================
// HOOK: useApiMutation
// Wrapper para mutations com tratamento de erro automático e toast
// ============================================================================

interface UseApiMutationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showToast?: boolean;
}

export function useApiMutation<T extends (...args: any[]) => any>(
  mutation: T,
  options: UseApiMutationOptions = {}
) {
  const {
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    showToast = true,
  } = options;

  const [mutate, mutationState] = mutation();

  const execute = useCallback(
    async (...args: Parameters<typeof mutate>) => {
      try {
        const result = await mutate(...args).unwrap();

        if (showToast && successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.(result);

        return { success: true, data: result };
      } catch (err) {
        const message = errorMessage || extractErrorMessage(err);

        if (showToast) {
          toast.error(`❌ ${message}`);
        }

        onError?.(err);

        return { success: false, error: err };
      }
    },
    [mutate, successMessage, errorMessage, onSuccess, onError, showToast]
  );

  return [execute, mutationState] as const;
}

// ============================================================================
// HOOK: useConfirmDelete
// Confirmação de delete com toast e callback
// ============================================================================

interface UseConfirmDeleteOptions {
  message?: string;
  successMessage?: string;
}

export function useConfirmDelete<T extends (id: any) => any>(
  deleteMutation: T,
  options: UseConfirmDeleteOptions = {}
) {
  const {
    message = 'Tem certeza que deseja deletar este item?',
    successMessage = '✅ Item deletado com sucesso!',
  } = options;

  const [deleteItem, { isLoading }] = deleteMutation();

  const confirmDelete = useCallback(
    async (id: any) => {
      if (!confirm(message)) {
        return { success: false, cancelled: true };
      }

      try {
        await deleteItem(id).unwrap();
        toast.success(successMessage);
        return { success: true };
      } catch (err) {
        toast.error(`❌ ${extractErrorMessage(err)}`);
        return { success: false, error: err };
      }
    },
    [deleteItem, message, successMessage]
  );

  return [confirmDelete, { isLoading }] as const;
}

// ============================================================================
// HOOK: usePagination
// Gerenciamento de paginação para listas
// ============================================================================

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, pageSize = 10 } = options;

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Reset page quando search muda
  useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  return {
    page,
    pageSize,
    search,
    setSearch,
    nextPage,
    previousPage,
    goToPage,
    resetPage,
  };
}

// ============================================================================
// HOOK: useFilters
// Gerenciamento de múltiplos filtros
// ============================================================================

export function useFilters<T extends Record<string, any>>(
  initialFilters: T
) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
  };
}

// ============================================================================
// HOOK: useDebounce
// Debounce para buscas e inputs
// ============================================================================

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// HOOK: useDebouncedQuery
// Combina debounce com query do RTK
// ============================================================================

export function useDebouncedQuery<T extends (...args: any[]) => any>(
  useQuery: T,
  params: any,
  options: { debounceMs?: number; skip?: boolean } = {}
) {
  const { debounceMs = 500, skip = false } = options;
  const debouncedParams = useDebounce(params, debounceMs);

  return useQuery(debouncedParams, {
    skip: skip || !debouncedParams,
  });
}

// ============================================================================
// HOOK: useInfiniteScroll
// Scroll infinito para listas
// ============================================================================

export function useInfiniteScroll() {
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((p) => p + 1);
    }
  }, [hasMore]);

  const reset = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    page,
    hasMore,
    setHasMore,
    loadMore,
    reset,
  };
}

// ============================================================================
// HOOK: useFormState
// Estado de formulário com validação
// ============================================================================

interface UseFormStateOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<keyof T, string>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useFormState<T extends Record<string, any>>(
  options: UseFormStateOptions<T>
) {
  const { initialValues, validate, onSubmit } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Valida campo individual se houver validador
      if (validate) {
        const fieldErrors = validate({ ...values, [field]: value });
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
      }
    },
    [values, validate]
  );

  const handleBlur = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Valida tudo
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);

        // Se tiver erros, não submete
        if (Object.keys(newErrors).length > 0) {
          return;
        }
      }

      // Marca todos como touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ) as Record<keyof T, boolean>;
      setTouched(allTouched);

      // Submete
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}

// ============================================================================
// HOOK: useApiPolling
// Polling automático com controle manual
// ============================================================================

export function useApiPolling(
  queryHook: any,
  args: any,
  options: {
    interval?: number;
    enabled?: boolean;
    onData?: (data: any) => void;
  } = {}
) {
  const { interval = 30000, enabled = true, onData } = options;

  const result = queryHook(args, {
    pollingInterval: enabled ? interval : undefined,
    skip: !enabled,
  });

  useEffect(() => {
    if (result.data && onData) {
      onData(result.data);
    }
  }, [result.data, onData]);

  return result;
}

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

/**
 * EXEMPLO 1: useApiMutation
 * 
 * const [createCampaign, state] = useApiMutation(
 *   useCreateCampaignMutation,
 *   {
 *     successMessage: '✅ Campanha criada!',
 *     onSuccess: (data) => navigate(`/campaigns/${data.id}`),
 *   }
 * );
 * 
 * await createCampaign(formData);
 */

/**
 * EXEMPLO 2: useConfirmDelete
 * 
 * const [confirmDelete, { isLoading }] = useConfirmDelete(
 *   useDeleteCampaignMutation,
 *   { message: 'Deletar esta campanha?' }
 * );
 * 
 * <button onClick={() => confirmDelete(id)}>Deletar</button>
 */

/**
 * EXEMPLO 3: usePagination
 * 
 * const pagination = usePagination({ pageSize: 20 });
 * const { data } = useGetCampaignsQuery({
 *   page: pagination.page,
 *   search: pagination.search,
 * });
 */

/**
 * EXEMPLO 4: useFilters
 * 
 * const { filters, updateFilter, resetFilters } = useFilters({
 *   status: 'all',
 *   type: '',
 *   search: '',
 * });
 * 
 * const { data } = useGetCampaignsQuery(filters);
 */

/**
 * EXEMPLO 5: useDebouncedQuery
 * 
 * const [searchTerm, setSearchTerm] = useState('');
 * const { data } = useDebouncedQuery(
 *   useGetCampaignsQuery,
 *   { search: searchTerm },
 *   { debounceMs: 300 }
 * );
 */