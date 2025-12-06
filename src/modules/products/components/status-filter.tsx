import type { StatusFilter } from '../hooks/useProductsData'
import { Button } from '../../../ui-components/button'
import { cn } from '../../../lib/utils'

interface StatusFilterProps {
  value: StatusFilter
  onChange: (status: StatusFilter) => void
}

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export function StatusFilterTabs({ value, onChange }: StatusFilterProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
      {FILTER_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium transition-colors',
            value === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
