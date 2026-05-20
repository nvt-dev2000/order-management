import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/common/language-switcher";
import { env } from "@/config/env";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/auth/use-logout";

export function Header() {
  const { t } = useTranslation("common");
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <header className="bg-card flex h-14 shrink-0 items-center justify-between border-b px-6">
      <p className="text-muted-foreground text-sm">
        {t("greeting")}{" "}
        <span className="text-foreground font-medium">
          {user?.name ?? t("user")}
        </span>
      </p>
      <div className="flex items-center gap-2">
        {env.VITE_USE_MOCK && (
          <Badge variant="secondary" className="text-xs">
            {t("mockMode")}
          </Badge>
        )}
        <LanguageSwitcher />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          disabled={isLoggingOut}
        >
          <LogOut className="size-4" />
          {isLoggingOut ? t("loggingOut") : t("logout")}
        </Button>
      </div>
    </header>
  );
}
