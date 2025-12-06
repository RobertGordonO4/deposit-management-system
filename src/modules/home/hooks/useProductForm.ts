import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCompanies, getUsers, createProduct } from '../../../lib/api'

/**
 * Hook to fetch companies list
 */
export function useCompanies(enabled = true) {
  return useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    select: (response) => response.data,
    enabled,
  })
}

/**
 * Hook to fetch users list
 */
export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    select: (response) => response.data,
    enabled,
  })
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate products queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
