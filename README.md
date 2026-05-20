# Order Management

Ứng dụng quản lý đơn hàng — React Router 7 SPA + TypeScript + shadcn/ui.

## Tech stack

- **Framework**: React 19, React Router 7 (SPA, `ssr: false`)
- **Build**: Vite 8
- **State server**: TanStack Query v5 (+ devtools)
- **State client**: Zustand (auth, UI sidebar)
- **HTTP**: Axios + interceptors (token, error handler)
- **Form**: react-hook-form + Zod (schema-first)
- **UI**: shadcn/ui + Tailwind CSS 4 + Lucide
- **Notifications**: Sonner
- **i18n**: i18next + react-i18next (vi / en)
- **DX**: ESLint, Prettier, Husky + lint-staged, pnpm

## Cấu trúc thư mục

Kiến trúc tách layer theo concern, domain mirror qua nhiều folder.

```text
src/
├── root.tsx, routes.ts, app.css
│
├── pages/                      # Page components (tương ứng routes)
│   ├── dashboard.tsx
│   ├── login/index.tsx
│   ├── history/index.tsx
│   ├── orders/{index, new, order-detail, order-edit}.tsx
│   ├── products/...
│   └── returns/...
│
├── components/
│   ├── features/               # UI nghiệp vụ theo domain
│   │   ├── auth/               # login-form, require-auth
│   │   ├── orders/             # order-table, order-form, order-filters...
│   │   └── dashboard/          # stats-cards
│   ├── common/                 # page-header, loading-spinner, empty-state
│   ├── ui/                     # shadcn primitives
│   ├── layouts/                # auth-layout, locale-layout; main/{layout,sidebar,header,footer}
│   └── providers/              # AppProviders, queryClient
│
├── services/                   # API layer (tương đương services/ citygas)
│   ├── client.ts               # Axios instance + interceptors
│   ├── auth/auth.api.ts
│   ├── orders/orders.api.ts
│   └── dashboard/dashboard.api.ts
│
├── hooks/                      # Custom hooks theo domain
│   ├── use-debounce.ts
│   ├── auth/{use-login, use-logout}.ts
│   ├── orders/{use-orders, use-order, use-order-mutations, use-order-list-params}.ts
│   └── dashboard/use-dashboard-stats.ts
│
├── schemas/                    # Zod validation
│   ├── auth/login.schema.ts
│   └── orders/order.schema.ts
│
├── types/                      # TypeScript types
│   ├── api.ts
│   ├── auth/auth.types.ts
│   ├── orders/order.types.ts
│   └── dashboard/dashboard.types.ts
│
├── constants/                  # Hằng số tập trung
│   ├── index.ts                # barrel
│   ├── api.ts                  # API_ENDPOINTS
│   ├── routes.ts               # buildRoutes(locale)
│   ├── query-keys.ts           # orderKeys, dashboardKeys
│   ├── order-status.ts
│   ├── pagination.ts, debounce.ts, query.ts, storage.ts
│
├── i18n/                       # Đa ngôn ngữ (vi / en)
│   ├── index.ts                # init i18next
│   ├── config.ts               # DEFAULT_LOCALE, SUPPORTED_LOCALES
│   ├── locales/{vi,en}/*.json  # common, auth, orders, dashboard, errors, validation
│   └── meta.ts                 # pageTitle() cho route meta
│
├── stores/                     # Zustand (auth, UI sidebar + locale)
├── config/                     # env.ts
├── lib/                        # cn() utility
└── utils/                      # formatCurrency, formatDate...
```

### Quy ước

- **Routing mỏng**: `routes.ts` khai báo URL → `pages/` chứa page component.
- **Locale trong URL**: `/vi`, `/en`, `/vi/orders`… — đổi ngôn ngữ đổi luôn segment trên router.
- **Domain mirror**: cùng tên folder qua `components/features/`, `hooks/`, `services/`, `schemas/`, `types/`.
- **Shared UI 3 tầng**: `ui/` → `common/` → `components/features/`.
- **Constants tập trung**: routes, API endpoints, query keys, pagination ở `constants/`.
- **Import trực tiếp** theo layer — không dùng barrel feature ở root.

### Đa ngôn ngữ (i18n)

- Ngôn ngữ mặc định: **vi**; hỗ trợ **en**.
- Locale lưu trong Zustand `ui-storage` (cùng sidebar).
- Nút đổi ngôn ngữ: header app + trang login (`LanguageSwitcher`).
- Trong component: `useTranslation('orders')` → `t('title')`.
- Ngoài React (axios, query client): `import { t } from '@/utils/i18n'`.
- Zod schema: factory `createLoginSchema(i18n.getFixedT(null, 'validation'))` — cập nhật khi đổi locale.
- **Comment trong code**: tiếng Anh. **Chuỗi UI**: file JSON `src/i18n/locales/`.

## Yêu cầu

- Node.js >= 20
- pnpm 10.x (project pin qua `packageManager`)

## Bắt đầu

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Truy cập http://localhost:5173.

## Scripts

| Lệnh                | Mô tả                             |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Dev server                        |
| `pnpm build`        | Build production (SPA)            |
| `pnpm start`        | Serve bản build                   |
| `pnpm typecheck`    | React Router typegen + tsc        |
| `pnpm lint`         | ESLint                            |
| `pnpm lint:fix`     | ESLint --fix                      |
| `pnpm format`       | Prettier --write toàn project     |
| `pnpm format:check` | Kiểm tra format (CI / pre-commit) |
| `pnpm check`        | typecheck + lint + format:check   |
| `pnpm check:fix`    | format + eslint --fix             |

## Format code

- **Prettier** (`.prettierrc`): `printWidth: 80`, `semi: true`, `trailingComma: "all"`, plugin **Tailwind** sắp xếp class.
- **ESLint** (`eslint.config.js`): TypeScript + React Hooks; `eslint-config-prettier` tắt rule trùng Prettier.
- **EditorConfig** (`.editorconfig`): indent 2 spaces, LF, UTF-8.
- **VS Code / Cursor**: mở folder → cài extension gợi ý (`.vscode/extensions.json`) → **Format on Save** đã bật trong `.vscode/settings.json`.
- **Husky pre-commit**: `lint-staged` chạy `eslint --fix` + `prettier --write` trên file staged.

```bash
# Sửa format + lint một lần
pnpm check:fix

# Kiểm tra trước khi push (giống CI)
pnpm check
```

## Biến môi trường

| Biến            | Bắt buộc | Mặc định                    | Mô tả                                          |
| --------------- | -------- | --------------------------- | ---------------------------------------------- |
| `VITE_API_URL`  | Có       | `http://localhost:3000/api` | Base URL API backend                           |
| `VITE_USE_MOCK` | Không    | `false`                     | Bật mock toàn bộ API (auth, orders, dashboard) |

Khi `VITE_USE_MOCK=true`, app **không gọi backend** — dữ liệu in-memory trong `src/services/mock/`.

## Backend contract (rút gọn)

| Nhóm      | Endpoint                                                   |
| --------- | ---------------------------------------------------------- |
| Auth      | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`    |
| Orders    | CRUD `/orders` + query `page`, `limit`, `search`, `status` |
| Dashboard | `GET /dashboard/stats`                                     |

Response shape:

```ts
// Single
{ data: T; message?: string }

// Paginated
{ data: T[]; meta: { page; limit; total; totalPages } }
```

## Lưu ý production

1. Token JWT đang lưu trong `localStorage` qua Zustand `persist`. Với app nội bộ là chấp nhận được; nếu cần chống XSS cao hãy chuyển sang httpOnly cookie + refresh token.
2. Đảm bảo backend đã sẵn các endpoint trong contract.
3. App là SPA (`ssr: false`) — cấu hình host static với fallback `index.html` cho client routing.
