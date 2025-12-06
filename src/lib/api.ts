import type {
  Product,
  Company,
  User,
  CreateProductInput,
  PaginatedApiResponse,
  ListApiResponse,
  ApiResponse,
} from "../types/api";

const API_BASE_URL = "http://localhost:3001";

/**
 * Generic fetch wrapper with error handling for GET requests
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Generic fetch wrapper for POST requests
 */
async function apiPost<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || `API error: ${response.status}`);
  }

  return responseData;
}

// Products API
export interface GetProductsParams {
  page?: number;
  limit?: number;
  active?: boolean;
  sort?: "name" | "registeredAt";
  order?: "asc" | "desc";
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<PaginatedApiResponse<Product[]>> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined)
    searchParams.set("limit", String(params.limit));
  if (params.active !== undefined)
    searchParams.set("active", String(params.active));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.order) searchParams.set("order", params.order);

  const queryString = searchParams.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ""}`;

  return apiFetch<PaginatedApiResponse<Product[]>>(endpoint);
}

// Create product
export async function createProduct(
  data: CreateProductInput
): Promise<ApiResponse<Product>> {
  return apiPost<CreateProductInput, ApiResponse<Product>>("/api/products", data);
}

// Companies API
export async function getCompanies(): Promise<ListApiResponse<Company>> {
  return apiFetch<ListApiResponse<Company>>("/api/companies");
}

// Users API
export async function getUsers(): Promise<ListApiResponse<User>> {
  return apiFetch<ListApiResponse<User>>("/api/users");
}
