import { useQuery } from "@tanstack/react-query";
import { getProducts, getCompanies, getUsers } from "../../../lib/api";

/**
 * Hook to fetch recent active products and their total count
 * Optimized to serve both the recent products table and active products stat
 */
export function useRecentProducts(limit: number = 5) {
  return useQuery({
    queryKey: ["products", "recent", limit],
    queryFn: () =>
      getProducts({
        active: true,
        limit,
        sort: "registeredAt",
        order: "desc",
      }),
  });
}

/**
 * Hook to fetch dashboard statistics
 * Returns counts for pending products, companies, and users
 * Note: Active products count comes from useRecentProducts to avoid redundant API calls
 */
export function useDashboardStats(activeProductsCount: number | undefined) {
  // Fetch pending (inactive) products count - this is the only products call we need for stats
  const pendingProductsQuery = useQuery({
    queryKey: ["products", "pending", "stats"],
    queryFn: () => getProducts({ active: false, limit: 1 }),
    select: (data) => data.pagination.totalItems,
  });

  // Fetch companies count
  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    select: (data) => data.total,
  });

  // Fetch users count
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    select: (data) => data.total,
  });

  const isLoading =
    activeProductsCount === undefined ||
    pendingProductsQuery.isLoading ||
    companiesQuery.isLoading ||
    usersQuery.isLoading;

  const isError =
    pendingProductsQuery.isError ||
    companiesQuery.isError ||
    usersQuery.isError;

  return {
    activeProducts: activeProductsCount ?? 0,
    pendingProducts: pendingProductsQuery.data ?? 0,
    companies: companiesQuery.data ?? 0,
    users: usersQuery.data ?? 0,
    isLoading,
    isError,
  };
}
