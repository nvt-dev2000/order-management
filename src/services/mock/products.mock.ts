import { PAGINATION } from "@/constants/pagination";
import type { PaginatedResponse } from "@/types/api";
import type { Product } from "@/types/products/product.types";
import type {
  CreateProductInput,
  ProductListParams,
  UpdateProductInput,
} from "@/schemas/products/product.schema";

import { mockDelay } from "./delay";
import { productsStore } from "./products.store";

function filterProducts(all: Product[], params?: ProductListParams): Product[] {
  let result = [...all];

  if (params?.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (params?.category) {
    result = result.filter((p) => p.category === params.category);
  }

  if (params?.status) {
    result = result.filter((p) => p.status === params.status);
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: { page: safePage, limit, total, totalPages },
  };
}

export const productsMockApi = {
  list: async (
    params?: ProductListParams,
  ): Promise<PaginatedResponse<Product>> => {
    await mockDelay();
    const page = params?.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = params?.limit ?? PAGINATION.DEFAULT_LIMIT;
    const filtered = filterProducts(productsStore.list(), params);
    return paginate(filtered, page, limit);
  },

  getById: async (id: string): Promise<Product> => {
    await mockDelay();
    const product = productsStore.list().find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  create: async (payload: CreateProductInput): Promise<Product> => {
    await mockDelay();
    const now = new Date().toISOString();
    const all = productsStore.list();
    const created: Product = {
      id: `prd-${crypto.randomUUID()}`,
      sku: payload.sku,
      name: payload.name,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
      status: payload.status,
      description: payload.description,
      createdAt: now,
      updatedAt: now,
    };
    productsStore.replace([created, ...all]);
    return created;
  },

  update: async (id: string, payload: UpdateProductInput): Promise<Product> => {
    await mockDelay();
    const all = productsStore.list();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    const updated: Product = {
      ...all[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    const next = [...all];
    next[index] = updated;
    productsStore.replace(next);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await mockDelay();
    const all = productsStore.list();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) throw new Error("Product not found");
    productsStore.replace(next);
  },
};
