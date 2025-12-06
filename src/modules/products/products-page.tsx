import { useState, useCallback, useMemo } from 'react'
import { PageHeader } from '../../ui-components/page-header'
import { Alert, AlertDescription, AlertTitle } from '../../ui-components/alert'
import { Skeleton } from '../../ui-components/skeleton'
import { ProductsTable } from './components/products-table'
import { StatusFilterTabs } from './components/status-filter'
import { TablePagination } from './components/table-pagination'
import { ProductFiltersBar, type ProductFilters } from './components/product-filters'
import {
  useAllProducts,
  processProducts,
  paginateProducts,
  type StatusFilter,
  type SortField,
  type SortOrder,
} from './hooks/useProductsData'

const ITEMS_PER_PAGE = 10

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  packaging: 'all',
  volume: 'all',
  deposit: 'all',
}

export function ProductsPage() {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('registeredAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS)

  // Fetch ALL products once
  const { data: allProducts, isLoading, isError } = useAllProducts()

  // Process products: filter, search, sort (all client-side on full dataset)
  const processedProducts = useMemo(() => {
    if (!allProducts) return []
    return processProducts(allProducts, {
      search: filters.search,
      status,
      packaging: filters.packaging,
      volume: filters.volume,
      deposit: filters.deposit,
      sortField,
      sortOrder,
    })
  }, [allProducts, filters, status, sortField, sortOrder])

  // Paginate the processed results
  const {
    data: pageProducts,
    totalPages,
    totalItems,
  } = useMemo(() => {
    return paginateProducts(processedProducts, page, ITEMS_PER_PAGE)
  }, [processedProducts, page])

  // Create pagination info for the pagination component
  const paginationInfo = useMemo(
    () => ({
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }),
    [page, totalPages, totalItems]
  )

  // Reset to page 1 when any filter changes
  const handleStatusChange = useCallback((newStatus: StatusFilter) => {
    setStatus(newStatus)
    setPage(1)
  }, [])

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortOrder(field === 'registeredAt' ? 'desc' : 'asc')
      }
      setPage(1)
    },
    [sortField]
  )

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.packaging !== 'all' ||
    filters.volume !== 'all' ||
    filters.deposit !== 'all' ||
    status !== 'all'

  return (
    <div>
      <PageHeader
        title="Registered products"
        description="View and manage your registered products."
      />

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please make sure the API server is running on port 3001.
          </AlertDescription>
        </Alert>
      )}

      {/* Status filter + count */}
      <div className="mb-4 flex items-center justify-between">
        <StatusFilterTabs value={status} onChange={handleStatusChange} />
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : hasActiveFilters ? (
            <>
              <span className="font-medium text-foreground">{totalItems}</span> of{' '}
              {allProducts?.length ?? 0} products
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{allProducts?.length ?? 0}</span>{' '}
              products
            </>
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-4">
        <ProductFiltersBar filters={filters} onChange={handleFiltersChange} />
      </div>

      {/* Products table with sorting */}
      <ProductsTable
        products={pageProducts}
        isLoading={isLoading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Pagination */}
      <TablePagination pagination={paginationInfo} onPageChange={setPage} isLoading={isLoading} />
    </div>
  )
}
