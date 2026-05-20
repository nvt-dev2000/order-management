import { LoginForm } from "@/components/features/auth/login-form";
import { pageTitle } from "@/i18n/meta";

export function meta() {
  return [{ title: pageTitle("auth:loginPageTitle") }];
}

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">{/* <LanguageSwitcher /> */}</div>
      <LoginForm />
    </div>
  );
}
