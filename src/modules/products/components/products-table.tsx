import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { Product } from '../../../types/api'
import type { SortField, SortOrder } from '../hooks/useProductsData'
import { Badge } from '../../../ui-components/badge'
import { Button } from '../../../ui-components/button'
import { Skeleton } from '../../../ui-components/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui-components/table'

interface ProductsTableProps {
  products: Product[] | undefined
  isLoading: boolean
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

/**
 * Format deposit amount from cents to currency string
 */
function formatDeposit(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

/**
 * Format volume in ml to readable format
 */
function formatVolume(ml: number): string {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(ml % 1000 === 0 ? 0 : 1)}L`
  }
  return `${ml}ml`
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Capitalize first letter of packaging type
 */
function formatPackaging(packaging: string): string {
  return packaging.charAt(0).toUpperCase() + packaging.slice(1)
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-14" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20" />
      </TableCell>
    </TableRow>
  )
}

interface SortableHeaderProps {
  field: SortField
  currentField: SortField
  currentOrder: SortOrder
  onSort: (field: SortField) => void
  children: React.ReactNode
}

function SortableHeader({
  field,
  currentField,
  currentOrder,
  onSort,
  children,
}: SortableHeaderProps) {
  const isActive = field === currentField

  return (
    <Button
      variant="ghost"
      className="-ml-4 h-8 font-medium hover:bg-transparent"
      onClick={() => onSort(field)}
    >
      {children}
      {isActive ? (
        currentOrder === 'asc' ? (
          <ArrowUp className="ml-1 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-1 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </Button>
  )
}

export function ProductsTable({
  products,
  isLoading,
  sortField,
  sortOrder,
  onSort,
}: ProductsTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                field="name"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSort}
              >
                Product Name
              </SortableHeader>
            </TableHead>
            <TableHead>Packaging</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Deposit</TableHead>
            <TableHead>
              <SortableHeader
                field="registeredAt"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSort}
              >
                Registered
              </SortableHeader>
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => <TableRowSkeleton key={index} />)
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatPackaging(product.packaging)}</TableCell>
                <TableCell>{formatVolume(product.volume)}</TableCell>
                <TableCell>{formatDeposit(product.deposit)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(product.registeredAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={product.active ? 'default' : 'secondary'}>
                    {product.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
