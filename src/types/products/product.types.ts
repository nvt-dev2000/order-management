import type { ProductStatus } from "@/constants/product-status";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
