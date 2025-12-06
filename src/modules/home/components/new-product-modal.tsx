import { useCallback, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../ui-components/dialog'
import { Button } from '../../../ui-components/button'
import { Input } from '../../../ui-components/input'
import { Label } from '../../../ui-components/label'
import { SearchableSelect } from '../../../ui-components/searchable-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui-components/select'
import { useCompanies, useUsers, useCreateProduct } from '../hooks/useProductForm'
import type { PackagingType } from '../../../types/api'

interface NewProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  companyId: string
  registeredById: string
  packaging: PackagingType | ''
  deposit: string
  volume: string
}

interface FormErrors {
  name?: string
  companyId?: string
  registeredById?: string
  packaging?: string
  deposit?: string
  volume?: string
}

const PACKAGING_OPTIONS: PackagingType[] = ['pet', 'can', 'glass', 'tetra', 'other']

const INITIAL_FORM_DATA: FormData = {
  name: '',
  companyId: '',
  registeredById: '',
  packaging: '',
  deposit: '',
  volume: '',
}

export function NewProductModal({ open, onOpenChange }: NewProductModalProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})

  const { data: companies = [] } = useCompanies(open)
  const { data: users = [] } = useUsers(open)
  const createProduct = useCreateProduct()

  // Memoize options for SearchableSelect - only recompute when data changes
  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.name })),
    [companies]
  )

  const userOptions = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: `${u.firstName} ${u.lastName}` })),
    [users]
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required'
    }
    if (!formData.registeredById) {
      newErrors.registeredById = 'Registered by is required'
    }
    if (!formData.packaging) {
      newErrors.packaging = 'Packaging type is required'
    }
    const depositNum = Number(formData.deposit)
    if (!formData.deposit || isNaN(depositNum) || depositNum < 0) {
      newErrors.deposit = 'Valid deposit amount is required'
    }
    const volumeNum = Number(formData.volume)
    if (!formData.volume || isNaN(volumeNum) || volumeNum <= 0) {
      newErrors.volume = 'Valid volume is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
    createProduct.reset()
  }, [createProduct])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      createProduct.mutate(
        {
          name: formData.name.trim(),
          companyId: Number(formData.companyId),
          registeredById: Number(formData.registeredById),
          packaging: formData.packaging as PackagingType,
          deposit: Number(formData.deposit),
          volume: Number(formData.volume),
        },
        {
          onSuccess: () => {
            resetForm()
            onOpenChange(false)
          },
        }
      )
    },
    [formData, validateForm, resetForm, onOpenChange, createProduct]
  )

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        resetForm()
      }
      onOpenChange(newOpen)
    },
    [onOpenChange, resetForm]
  )

  // Memoized handlers for each field to maintain stable references across renders.
  // Empty dependency array is intentional: setFormData and setErrors are stable (React guarantees this),
  // and we use functional updates (prev => ...) so we don't need the current state values.
  const handlers = useMemo(() => {
    const createInputHandler =
      (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormData((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
      }

    const createSelectHandler = (field: keyof FormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    }

    return {
      name: createInputHandler('name'),
      deposit: createInputHandler('deposit'),
      volume: createInputHandler('volume'),
      companyId: createSelectHandler('companyId'),
      registeredById: createSelectHandler('registeredById'),
      packaging: createSelectHandler('packaging'),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill in the details below to create a new product.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {createProduct.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {createProduct.error instanceof Error
                ? createProduct.error.message
                : 'Failed to create product'}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handlers.name}
              placeholder="Enter product name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <SearchableSelect
              options={companyOptions}
              value={formData.companyId}
              onValueChange={handlers.companyId}
              placeholder="Select a company"
              searchPlaceholder="Search companies..."
              error={!!errors.companyId}
            />
            {errors.companyId && <p className="text-sm text-red-500">{errors.companyId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registeredBy">Registered By</Label>
            <SearchableSelect
              options={userOptions}
              value={formData.registeredById}
              onValueChange={handlers.registeredById}
              placeholder="Select a user"
              searchPlaceholder="Search users..."
              error={!!errors.registeredById}
            />
            {errors.registeredById && (
              <p className="text-sm text-red-500">{errors.registeredById}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="packaging">Packaging Type</Label>
            <Select value={formData.packaging} onValueChange={handlers.packaging}>
              <SelectTrigger className={errors.packaging ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select packaging type" />
              </SelectTrigger>
              <SelectContent>
                {PACKAGING_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.packaging && <p className="text-sm text-red-500">{errors.packaging}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit (cents)</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit}
                onChange={handlers.deposit}
                placeholder="e.g., 25"
                className={errors.deposit ? 'border-red-500' : ''}
              />
              {errors.deposit && <p className="text-sm text-red-500">{errors.deposit}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume (ml)</Label>
              <Input
                id="volume"
                type="number"
                value={formData.volume}
                onChange={handlers.volume}
                placeholder="e.g., 500"
                className={errors.volume ? 'border-red-500' : ''}
              />
              {errors.volume && <p className="text-sm text-red-500">{errors.volume}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createProduct.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
