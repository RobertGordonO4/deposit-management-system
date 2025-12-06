import { Filter, Search, X } from 'lucide-react'
import type { PackagingType } from '../../../types/api'
import { Button } from '../../../ui-components/button'
import { Input } from '../../../ui-components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui-components/select'

export type VolumeFilter = 'all' | 'small' | 'medium' | 'large'
export type DepositFilter = 'all' | 'low' | 'medium' | 'high'
export type PackagingFilter = PackagingType | 'all'

export interface ProductFilters {
  search: string
  packaging: PackagingFilter
  volume: VolumeFilter
  deposit: DepositFilter
}

interface ProductFiltersProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}

const PACKAGING_OPTIONS: { value: PackagingFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'can', label: 'Can' },
  { value: 'pet', label: 'PET' },
  { value: 'glass', label: 'Glass' },
  { value: 'tetra', label: 'Tetra' },
  { value: 'other', label: 'Other' },
]

const VOLUME_OPTIONS: { value: VolumeFilter; label: string }[] = [
  { value: 'all', label: 'All Volumes' },
  { value: 'small', label: '≤ 350ml' },
  { value: 'medium', label: '351ml - 750ml' },
  { value: 'large', label: '> 750ml' },
]

const DEPOSIT_OPTIONS: { value: DepositFilter; label: string }[] = [
  { value: 'all', label: 'All Deposits' },
  { value: 'low', label: '≤ $1.00' },
  { value: 'medium', label: '$1.01 - $2.00' },
  { value: 'high', label: '> $2.00' },
]

export function ProductFiltersBar({ filters, onChange }: ProductFiltersProps) {
  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.packaging !== 'all' ||
    filters.volume !== 'all' ||
    filters.deposit !== 'all'

  const handleReset = () => {
    onChange({ search: '', packaging: 'all', volume: 'all', deposit: 'all' })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by name (min 3 chars)..."
          className="pl-9 pr-8 w-64 h-9"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => onChange({ ...filters, search: '' })}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="h-6 w-px bg-border" />

      <Filter className="h-4 w-4 text-muted-foreground" />

      <Select
        value={filters.packaging}
        onValueChange={(value) => onChange({ ...filters, packaging: value as PackagingFilter })}
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Packaging" />
        </SelectTrigger>
        <SelectContent>
          {PACKAGING_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.volume}
        onValueChange={(value) => onChange({ ...filters, volume: value as VolumeFilter })}
      >
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Volume" />
        </SelectTrigger>
        <SelectContent>
          {VOLUME_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.deposit}
        onValueChange={(value) => onChange({ ...filters, deposit: value as DepositFilter })}
      >
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Deposit" />
        </SelectTrigger>
        <SelectContent>
          {DEPOSIT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-2">
          <X className="h-4 w-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  )
}
