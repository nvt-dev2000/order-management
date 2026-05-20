**Author:** HoàngTPH  
**Last Updated:** May 2026  
**Version:** 1.0.0

# Quy ước Code — Order Management

## Mục lục

1. [Cấu trúc dự án](#cấu-trúc-dự-án)
2. [Quy tắc đặt tên](#quy-tắc-đặt-tên)
3. [Routing & Pages](#routing--pages)
4. [TypeScript & React](#typescript--react)
5. [Quản lý state](#quản-lý-state)
6. [API & Services](#api--services)
7. [Form & Validation](#form--validation)
8. [i18n](#i18n)
9. [Styling & UI](#styling--ui)
10. [Performance](#performance)
11. [Linting & Formatting](#linting--formatting)
12. [Security](#security)
13. [Git workflow](#git-workflow)

---

## Cấu trúc dự án

```text
order-management/
├── src/
│   ├── root.tsx, routes.ts, app.css
│   ├── pages/                      # Page components (map 1-1 với routes)
│   ├── components/
│   │   ├── features/               # UI nghiệp vụ theo domain
│   │   ├── common/                 # page-header, empty-state, skeleton...
│   │   ├── ui/                     # shadcn primitives (không sửa tay trừ khi cần)
│   │   ├── layouts/                # route layouts (auth, locale) + main/{layout,sidebar,header,footer}
│   │   └── providers/              # AppProviders, queryClient
│   ├── services/                   # Axios + API theo domain
│   ├── hooks/                      # Custom hooks theo domain
│   ├── schemas/                    # Zod validation
│   ├── types/                      # TypeScript types
│   ├── constants/                  # ROUTES, API_ENDPOINTS, query keys...
│   ├── stores/                     # Zustand (auth, UI)
│   ├── config/                     # env.ts
│   ├── i18n/                       # i18next config + locales
│   ├── lib/                        # cn() và utility nhỏ
│   └── utils/                      # format, date, handleError...
├── public/
├── .env.example
└── RULE.md
```

### Nguyên tắc tổ chức

| Nguyên tắc              | Mô tả                                                                         |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Routing mỏng**        | `routes.ts` chỉ khai báo URL → logic nằm ở `pages/` và `components/features/` |
| **Domain mirror**       | Cùng tên folder qua `features/`, `hooks/`, `services/`, `schemas/`, `types/`  |
| **Shared UI 3 tầng**    | `ui/` → `common/` → `features/`                                               |
| **Constants tập trung** | Routes, API, query keys, pagination ở `constants/`                            |
| **Import trực tiếp**    | Dùng alias `@/`; không tạo barrel export ở root `src/`                        |

### Thêm file mới theo domain

Ví dụ domain `orders`:

```text
src/
├── pages/orders/...
├── components/features/orders/...
├── hooks/orders/...
├── services/orders/orders.api.ts
├── schemas/orders/order.schema.ts
├── types/orders/order.types.ts
└── constants/query-keys.ts   # bổ sung orderKeys nếu chưa có
```

---

## Quy tắc đặt tên

### Tổng quan

- Tên có ý nghĩa, dễ đọc, dễ tìm kiếm
- Tránh viết tắt không cần thiết
- File/folder dùng **kebab-case**

### Chi tiết

| Loại              | File                            | Export / Symbol                           |
| ----------------- | ------------------------------- | ----------------------------------------- |
| Page              | `pages/orders/order-detail.tsx` | `export default function OrderDetailPage` |
| Feature component | `order-table.tsx`               | `export function OrderTable`              |
| Hook              | `use-orders.ts`                 | `export function useOrders`               |
| Service           | `orders.api.ts`                 | `export const ordersApi`                  |
| Schema            | `order.schema.ts`               | `orderSchema`, `type OrderInput`          |
| Types             | `order.types.ts`                | `interface Order`, `type OrderStatus`     |
| Store             | `auth.store.ts`                 | `useAuthStore`                            |
| Constant          | `order-status.ts`               | `ORDER_STATUS`, `ORDER_STATUS_OPTIONS`    |

### Event handlers

```typescript
const handleSubmit = () => {
  /* ... */
};
const handleStatusChange = (status: OrderStatus) => {
  /* ... */
};
```

### Route paths (locale prefix)

URL luôn có prefix ngôn ngữ: `/vi`, `/en`, `/vi/orders`, `/en/login`...

- `buildRoutes(locale)` trong `constants/routes.ts` — tạo path theo locale
- Trong component/hook: `useAppRoutes()` — đọc `:locale` từ URL, **không hard-code**

```typescript
const routes = useAppRoutes();

<Link to={routes.orders.new}>Tạo đơn</Link>
navigate(routes.orders.detail(orderId));
```

Đổi ngôn ngữ: `LanguageSwitcher` đổi segment locale trên URL (`/vi/orders` → `/en/orders`).

---

## Routing & Pages

### `routes.ts`

- Chỉ import từ `@react-router/dev/routes` và khai báo cây route
- Layout bọc nhóm route: `auth-layout` (login), `main/layout` (app chính)
- File page nằm trong `pages/`, không đặt logic nghiệp vụ nặng trong layout

### Page component

```typescript
// pages/dashboard.tsx
export function meta() {
  return [{ title: "Dashboard | Order Management" }];
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="..." description="..." />
      <StatsCards />
    </div>
  );
}
```

- Page **mỏng**: compose `common/` + `features/`, gọi hooks
- Không gọi Axios trực tiếp trong page — dùng hooks + services

### Auth (hiện tại)

- App shell **không** bắt buộc đăng nhập (đã gỡ `RequireAuth` tạm thời)
- Trang `/login` vẫn giữ; `RedirectIfAuth` chuyển về `/` nếu đã có token
- Khi bật lại guard: bọc `main/layout` bằng `RequireAuth` từ `components/features/auth/`

---

## TypeScript & React

### Component structure

```typescript
// 1. Imports (type imports tách riêng)
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/types/orders/order.types";

// 2. Props interface (nếu có)
interface OrderTableProps {
  orders: Order[];
  onRowClick?: (id: string) => void;
}

// 3. Component
export function OrderTable({ orders, onRowClick }: OrderTableProps) {
  // hooks → derived state → handlers → render
}
```

### Quy tắc

- Bật TypeScript strict — **không dùng `any`**
- Ưu tiên `import type` cho types/interfaces (`consistent-type-imports`)
- Props interface đặt ngay trên component hoặc trong file types nếu dùng chung
- Export named cho feature/common; `export default` cho page và layout

### Error handling

- API errors: dùng `getErrorMessage` từ `@/utils/handleError` hoặc interceptor trong `services/client.ts`
- Mutation errors: hiển thị qua `toast` (Sonner) trong hook `onError`
- Không `console.log` lỗi production — dùng toast hoặc UI error state

---

## Quản lý state

### Server state — TanStack Query

```typescript
// hooks/orders/use-orders.ts
export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.list(params),
    placeholderData: (previous) => previous,
  });
}
```

| Việc                                | Nơi đặt                           |
| ----------------------------------- | --------------------------------- |
| Query key factory                   | `constants/query-keys.ts`         |
| `queryFn` gọi API                   | `services/*.api.ts`               |
| Hook bọc `useQuery` / `useMutation` | `hooks/<domain>/`                 |
| Invalidate sau mutation             | trong hook mutation (`onSuccess`) |

### Client state — Zustand

| Store        | Mục đích                                                      |
| ------------ | ------------------------------------------------------------- |
| `auth.store` | `token`, `user`, `setAuth`, `logout` (+ persist localStorage) |
| `ui.store`   | sidebar collapsed, UI ephemeral                               |

- Chỉ dùng Zustand cho state **client-only**, không duplicate server data đã có trong Query cache
- Selector cụ thể: `useAuthStore((s) => s.user)` — tránh subscribe cả store

### Local state

- `useState` cho UI đơn giản (modal open, tab active)
- URL state (filter, pagination): sync qua `useSearchParams` + hook `use-order-list-params`

---

## API & Services

### Cấu trúc

```typescript
// services/orders/orders.api.ts
import { api } from "@/services/client";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export const ordersApi = {
  list: async (params?: OrderListParams) => {
    const { data } = await api.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params },
    );
    return data;
  },
  // create, update, delete...
};
```

### Quy tắc

- Một file `*.api.ts` per domain — export object `xxxApi`
- Endpoint path chỉ khai báo trong `constants/api.ts`
- `services/client.ts`: Axios instance, gắn token, xử lý 401/403/5xx
- **Không mock API** trong repo — mọi auth/orders gọi backend thật qua `VITE_API_URL`

### Response shape (contract)

```typescript
// Single
{ data: T; message?: string }

// Paginated
{ data: T[]; meta: { page; limit; total; totalPages } }
```

---

## Form & Validation

### Schema-first (Zod)

```typescript
// schemas/orders/order.schema.ts
export const orderSchema = z.object({
  customerName: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  // ...
});
export type OrderInput = z.infer<typeof orderSchema>;
```

### Form UI

```typescript
const form = useForm<OrderInput>({
  resolver: zodResolver(orderSchema),
  defaultValues: {
    /* ... */
  },
});
```

- Message validation: `constants/messages.ts` hoặc i18n `validation.json`
- Submit qua mutation hook — không gọi API trực tiếp trong form component
- `noValidate` trên `<form>` khi dùng Zod + RHF

---

## i18n

- Thư viện: **i18next** + **react-i18next**
- Locale mặc định: `vi` — hỗ trợ `en`
- File dịch: `src/i18n/locales/{vi,en}/<namespace>.json`
- Namespace theo domain: `common`, `auth`, `orders`, `dashboard`, `errors`, `validation`

```typescript
const { t } = useTranslation("orders");
return <span>{t("table.empty")}</span>;
```

- Text hiển thị cho user ưu tiên qua `t()` — tránh string cứng trong feature component (trừ prototype tạm)

---

## Styling & UI

### Tailwind CSS 4

- Utility-first; gom class dài bằng `cn()` từ `@/lib/utils`
- Theme / CSS variables trong `app.css`
- Không inline style trừ giá trị động bất khả kháng

### shadcn/ui

- Primitives nằm `components/ui/` — generate qua CLI, **không chỉnh sửa tùy tiện**
- ESLint ignore `src/components/ui/**` — custom wrapper đặt ở `common/` hoặc `features/`

### Component layers

```
ui/Button          → primitive
common/PageHeader  → tái sử dụng cross-page
features/orders/OrderTable → nghiệp vụ
```

---

## Performance

- Route-level code splitting: React Router lazy route khi page lớn
- `placeholderData: (prev) => prev` cho list query giữ UX khi đổi filter/page
- `useDebounce` cho search input (`hooks/use-debounce.ts` + `constants/debounce.ts`)
- `useMemo` / `useCallback` chỉ khi đo được re-render thừa hoặc stable dependency cho child memo

---

## Linting & Formatting

### Scripts (pnpm)

| Lệnh                          | Mô tả            |
| ----------------------------- | ---------------- |
| `pnpm dev`                    | Dev server       |
| `pnpm build`                  | Production build |
| `pnpm typecheck`              | typegen + `tsc`  |
| `pnpm lint` / `pnpm lint:fix` | ESLint           |
| `pnpm format`                 | Prettier         |

### Trước khi commit / PR

- [ ] `pnpm typecheck` pass
- [ ] `pnpm lint` pass
- [ ] `pnpm format:check` pass (hoặc `pnpm format`)
- [ ] `pnpm build` pass
- [ ] Đã test thủ công flow liên quan

### Husky + lint-staged

- Pre-commit chạy ESLint --fix + Prettier trên file staged `*.{ts,tsx}`

### ESLint highlights

- `react-hooks/rules-of-hooks`: error
- `@typescript-eslint/consistent-type-imports`: warn
- `react-refresh/only-export-components`: cho phép export `meta`, `links`, `loader`...

---

## Security

1. **Env**: chỉ `VITE_*` trong client; không commit `.env`
2. **Token**: JWT lưu `localStorage` qua Zustand persist — chấp nhận cho app nội bộ; production cao hơn nên httpOnly cookie
3. **Input**: sanitize qua `@/utils/sanitize` khi hiển thị dữ liệu user
4. **401**: interceptor logout + toast — không lộ stack trace cho user

---

## Git workflow

### Branch naming

`{type}/{issue-number}-{short-description}`

Ví dụ:

- `feature/Backlog_123-order-filters`
- `bugfix/Backlog_456-fix-pagination`
- `hotfix/Backlog_789-api-timeout`

### Commit message

`{type}({issue-number}): {description}`

```
feat(Backlog_123): add order status filter
fix(Backlog_456): resolve pagination on empty list
docs(Backlog_789): add RULE.md
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request checklist

```markdown
## Description

[Mô tả thay đổi]

## Related Issue

Closes #Backlog_123

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Self-test Checklist

- [ ] pnpm typecheck pass
- [ ] pnpm lint pass
- [ ] pnpm build pass
- [ ] Đã test thủ công các flow đã sửa
- [ ] Branch & commit message đúng convention
```

### Quy trình branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/Backlog_123-order-filters

# ... làm việc ...

git commit -m "feat(Backlog_123): add order status filter"
git push origin feature/Backlog_123-order-filters
```

Trước PR: rebase `develop`, self-test, tạo PR vào `develop`.

---

## Tài liệu tham khảo

- [README.md](./README.md) — setup, env, backend contract
