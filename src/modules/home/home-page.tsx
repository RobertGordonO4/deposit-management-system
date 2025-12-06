import { useState } from 'react'
import { Milk, CircleDashed, Building2, Users } from 'lucide-react'

import { PageHeader } from '../../ui-components/page-header'
import { Alert, AlertDescription, AlertTitle } from '../../ui-components/alert'
import { StatCard } from '../../ui-components/stat-card'
import { RecentProductsTable } from './components/recent-products-table'
import { QuickActions } from './components/quick-actions'
import { NewProductModal } from './components/new-product-modal'
import { useDashboardStats, useRecentProducts } from './hooks/useDashboard'

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch recent products first - this also gives us the active products count
  const recentProducts = useRecentProducts(5)
  const activeProductsCount = recentProducts.data?.pagination.totalItems

  // Pass the active products count to avoid redundant API call
  const stats = useDashboardStats(activeProductsCount)

  return (
    <div>
      <PageHeader
        title="Deposit management dashboard"
        description="Welcome to your deposit management system. Monitor and manage your products, companies, and users."
      />

      {/* Error alert */}
      {(stats.isError || recentProducts.isError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please make sure the API server is running on port 3001.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Active products"
          subtitle="Active products in system"
          value={stats.activeProducts}
          icon={Milk}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Pending products"
          subtitle="Products waiting for approval"
          value={stats.pendingProducts}
          icon={CircleDashed}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Companies"
          subtitle="Registered companies"
          value={stats.companies}
          icon={Building2}
          isLoading={stats.isLoading}
        />
        <StatCard
          title="Users"
          subtitle="Registered users"
          value={stats.users}
          icon={Users}
          isLoading={stats.isLoading}
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <QuickActions onAddProduct={() => setIsModalOpen(true)} />
      </div>

      {/* Recent products */}
      <RecentProductsTable
        products={recentProducts.data?.data}
        isLoading={recentProducts.isLoading}
      />

      {/* New Product Modal */}
      <NewProductModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
