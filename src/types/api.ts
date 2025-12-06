// Product types
export interface Product {
  id: number;
  companyId: number;
  registeredById: number;
  name: string;
  packaging: "pet" | "can" | "glass" | "tetra" | "other";
  deposit: number;
  volume: number;
  registeredAt: string;
  active: boolean;
}

// Company types
export interface Company {
  id: number;
  name: string;
  registeredAt: string;
}

// User types
export interface User {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Pagination info from API
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: PaginationInfo;
}

export interface ListApiResponse<T> extends ApiResponse<T[]> {
  total: number;
}
