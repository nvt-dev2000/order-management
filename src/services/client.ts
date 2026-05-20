import axios, { type AxiosError } from "axios";
import { toast } from "sonner";

import { env } from "@/config/env";
import { getAuthToken, useAuthStore } from "@/stores/auth.store";
import type { ApiError } from "@/types/api";
import { getFirstErrorMessage } from "@/utils/handleError";
import { t } from "@/utils/i18n";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error(message ?? t("errors:sessionExpired"));
    } else if (status === 403) {
      toast.error(message ?? t("errors:forbiddenAction"));
    } else if (status && status >= 500) {
      toast.error(message ?? t("errors:serverError"));
    } else if (!error.response) {
      toast.error(t("common:networkError"));
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(
  error: unknown,
  fallback: string = t("common:toast.defaultError"),
) {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (data?.code) {
      return getFirstErrorMessage(
        Array.isArray(data.code) ? data.code : [data.code],
        data.message ?? fallback,
      );
    }
    return data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
