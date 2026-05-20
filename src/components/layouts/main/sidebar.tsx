import type { LucideIcon } from "lucide-react";
import {
  Box,
  History,
  LayoutDashboard,
  Menu,
  Package,
  RotateCcw,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppRoutes } from "@/hooks/use-app-routes";
import { useUiStore } from "@/stores/ui.store";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export function Sidebar() {
  const { t } = useTranslation("common");
  const routes = useAppRoutes();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const navItems: NavItem[] = [
    {
      to: routes.dashboard,
      label: t("dashboard"),
      icon: LayoutDashboard,
      end: true,
    },
    { to: routes.orders.list, label: t("orders"), icon: Package },
    { to: routes.products.list, label: t("products"), icon: Box },
    { to: routes.returns.list, label: t("returns"), icon: RotateCcw },
    { to: routes.history, label: t("history"), icon: History },
  ];

  return (
    <aside
      className={cn(
        "bg-card shrink-0 border-r transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <Link to={routes.dashboard} className="text-lg font-semibold">
            {t("appShortName")}
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0"
          aria-label={sidebarCollapsed ? t("openSidebar") : t("closeSidebar")}
        >
          {sidebarCollapsed ? (
            <Menu className="size-4" />
          ) : (
            <X className="size-4" />
          )}
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-2" aria-label={t("mainNav")}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
