import { Outlet } from "react-router";

import { RedirectIfAuth } from "@/components/features/auth/require-auth";

export default function AuthLayout() {
  return (
    <RedirectIfAuth>
      <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </RedirectIfAuth>
  );
}
