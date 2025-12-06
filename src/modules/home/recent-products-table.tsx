import type { Product } from "../../types/api";
import { Skeleton } from "../../components/skeleton";
import { Section } from "./section";

interface RecentProductsProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

/**
 * Format deposit amount from cents to currency string
 */
function formatDeposit(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format volume in ml to readable format
 */
function formatVolume(ml: number): string {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(ml % 1000 === 0 ? 0 : 1)}L`;
  }
  return `${ml}ml`;
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Capitalize first letter of packaging type
 */
function formatPackaging(packaging: string): string {
  return packaging.charAt(0).toUpperCase() + packaging.slice(1);
}

function ProductRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function RecentProductsTable({
  products,
  isLoading,
}: RecentProductsProps) {
  return (
    <Section title="Recent products">
      <div className="flex flex-col">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductRowSkeleton key={index} />
            ))}
          </>
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {product.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatVolume(product.volume)} • {formatDeposit(product.deposit)} deposit • {formatPackaging(product.packaging)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(product.registeredAt)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-3 text-center text-muted-foreground">
            No products found
          </div>
        )}
      </div>
    </Section>
  );
}
