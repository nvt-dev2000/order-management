import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from "@/constants/product-status";
import type { Product } from "@/types/products/product.types";

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function product(
  index: number,
  partial: Omit<Product, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: string;
  },
): Product {
  const createdAt = partial.createdAt ?? daysAgo(index % 30);
  const { createdAt: _c, ...rest } = partial;
  return {
    id: `prd-${index}`,
    createdAt,
    updatedAt: createdAt,
    ...rest,
  };
}

export const SEED_PRODUCTS: Product[] = [
  product(1, {
    sku: "EL-001",
    name: "Tai nghe Bluetooth Pro",
    category: PRODUCT_CATEGORIES[0],
    price: 890_000,
    stock: 120,
    status: PRODUCT_STATUS.ACTIVE,
    description: "ANC, pin 30h",
  }),
  product(2, {
    sku: "EL-002",
    name: "Sạc nhanh 65W USB-C",
    category: PRODUCT_CATEGORIES[0],
    price: 450_000,
    stock: 85,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(3, {
    sku: "FA-101",
    name: "Áo thun cotton basic",
    category: PRODUCT_CATEGORIES[1],
    price: 199_000,
    stock: 200,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(4, {
    sku: "FA-102",
    name: "Quần jean slim fit",
    category: PRODUCT_CATEGORIES[1],
    price: 520_000,
    stock: 45,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(5, {
    sku: "HM-201",
    name: "Bình giữ nhiệt 1L",
    category: PRODUCT_CATEGORIES[2],
    price: 320_000,
    stock: 60,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(6, {
    sku: "HM-202",
    name: "Đèn bàn LED chỉnh sáng",
    category: PRODUCT_CATEGORIES[2],
    price: 280_000,
    stock: 0,
    status: PRODUCT_STATUS.INACTIVE,
    description: "Hết hàng tạm thời",
  }),
  product(7, {
    sku: "FD-301",
    name: "Cà phê hạt Arabica 500g",
    category: PRODUCT_CATEGORIES[3],
    price: 185_000,
    stock: 150,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(8, {
    sku: "FD-302",
    name: "Snack mix hạt 200g",
    category: PRODUCT_CATEGORIES[3],
    price: 75_000,
    stock: 300,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(9, {
    sku: "BT-401",
    name: "Serum vitamin C 30ml",
    category: PRODUCT_CATEGORIES[4],
    price: 410_000,
    stock: 40,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(10, {
    sku: "EL-003",
    name: "Chuột không dây ergonomic",
    category: PRODUCT_CATEGORIES[0],
    price: 350_000,
    stock: 95,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(11, {
    sku: "FA-103",
    name: "Giày sneaker unisex",
    category: PRODUCT_CATEGORIES[1],
    price: 780_000,
    stock: 28,
    status: PRODUCT_STATUS.ACTIVE,
  }),
  product(12, {
    sku: "HM-203",
    name: "Ổ cắm điện 6 cổng",
    category: PRODUCT_CATEGORIES[2],
    price: 165_000,
    stock: 110,
    status: PRODUCT_STATUS.ACTIVE,
  }),
];
