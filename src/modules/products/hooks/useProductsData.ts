import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../../lib/api'
import type { Product } from '../../../types/api'

// Filter and sort types
export type StatusFilter = 'all' | 'active' | 'inactive'
export type SortField = 'name' | 'registeredAt'
export type SortOrder = 'asc' | 'desc'

// Filter thresholds (in original units)
const VOLUME_SMALL_MAX = 350 // ml
const VOLUME_MEDIUM_MAX = 750 // ml
const DEPOSIT_LOW_MAX = 100 // cents ($1.00)
const DEPOSIT_MEDIUM_MAX = 200 // cents ($2.00)
const MIN_SEARCH_LENGTH = 3

/**
 * Hook to fetch ALL products at once for full client-side control.
 * This enables search, filtering, sorting, and pagination to work across the entire dataset.
 *
 * Strategy: First fetch page 1 to get totalItems, then fetch all in one request.
 */
export function useAllProducts() {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      // First, fetch page 1 with minimal data to get the total count
      const firstResponse = await getProducts({ limit: 1, page: 1 })
      const totalItems = firstResponse.pagination?.totalItems ?? 0

      if (totalItems === 0) {
        return []
      }

      // Now fetch ALL products in one request using the actual total
      const fullResponse = await getProducts({ limit: totalItems, page: 1 })
      return fullResponse.data
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}

/**
 * Apply all filters, search, and sorting to products array
 */
export function processProducts(
  products: Product[],
  options: {
    search: string
    status: StatusFilter
    packaging: string
    volume: string
    deposit: string
    sortField: SortField
    sortOrder: SortOrder
  }
): Product[] {
  let result = [...products]

  // 1. Search filter
  if (options.search.length >= MIN_SEARCH_LENGTH) {
    const searchLower = options.search.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(searchLower))
  }

  // 2. Status filter
  if (options.status !== 'all') {
    const isActive = options.status === 'active'
    result = result.filter((p) => p.active === isActive)
  }

  // 3. Packaging filter
  if (options.packaging !== 'all') {
    result = result.filter((p) => p.packaging === options.packaging)
  }

  // 4. Volume filter
  if (options.volume !== 'all') {
    result = result.filter((p) => {
      switch (options.volume) {
        case 'small':
          return p.volume <= VOLUME_SMALL_MAX
        case 'medium':
          return p.volume > VOLUME_SMALL_MAX && p.volume <= VOLUME_MEDIUM_MAX
        case 'large':
          return p.volume > VOLUME_MEDIUM_MAX
        default:
          return true
      }
    })
  }

  // 5. Deposit filter
  if (options.deposit !== 'all') {
    result = result.filter((p) => {
      switch (options.deposit) {
        case 'low':
          return p.deposit <= DEPOSIT_LOW_MAX
        case 'medium':
          return p.deposit > DEPOSIT_LOW_MAX && p.deposit <= DEPOSIT_MEDIUM_MAX
        case 'high':
          return p.deposit > DEPOSIT_MEDIUM_MAX
        default:
          return true
      }
    })
  }

  // 6. Sort
  result.sort((a, b) => {
    let comparison = 0
    if (options.sortField === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else {
      comparison = new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
    }
    return options.sortOrder === 'asc' ? comparison : -comparison
  })

  return result
}

/**
 * Paginate an array of products
 */
export function paginateProducts(
  products: Product[],
  page: number,
  itemsPerPage: number
): { data: Product[]; totalPages: number; totalItems: number } {
  const totalItems = products.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const data = products.slice(startIndex, startIndex + itemsPerPage)

  return { data, totalPages, totalItems }
}
