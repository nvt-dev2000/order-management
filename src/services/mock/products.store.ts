import type { Product } from "@/types/products/product.types";

import { SEED_PRODUCTS } from "./products.seed";

let products: Product[] = structuredClone(SEED_PRODUCTS);

export const productsStore = {
  list: (): Product[] => products,

  replace: (next: Product[]) => {
    products = next;
  },

  reset: () => {
    products = structuredClone(SEED_PRODUCTS);
  },
};
