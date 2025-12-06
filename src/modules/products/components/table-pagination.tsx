import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '../../../ui-components/button'
import { Input } from '../../../ui-components/input'
import type { PaginationInfo } from '../../../types/api'

interface TablePaginationProps {
  pagination: PaginationInfo | undefined
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function TablePagination({ pagination, onPageChange, isLoading }: TablePaginationProps) {
  const [pageInput, setPageInput] = useState('')

  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '')
    setPageInput(value)
  }

  const applyPageInput = () => {
    const pageNum = pageInput ? parseInt(pageInput, 10) : currentPage
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      onPageChange(pageNum)
    }
    setPageInput('')
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyPageInput()
  }

  const handlePageInputBlur = () => {
    applyPageInput()
  }

  const handlePageInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Set the current page value so it can be selected
    setPageInput(currentPage.toString())
    // Use setTimeout to ensure the value is set before selecting
    setTimeout(() => e.target.select(), 0)
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} products
      </div>
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        {/* Previous page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page indicator with input */}
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 px-2">
          <Input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onFocus={handlePageInputFocus}
            placeholder={String(currentPage)}
            className="h-8 w-12 text-center text-sm"
            disabled={isLoading}
          />
          <span className="text-sm text-muted-foreground">of</span>
          <span className="text-sm font-medium">{totalPages}</span>
        </form>

        {/* Next page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
