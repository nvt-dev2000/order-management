import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_CONFIG } from "@/constants";
import { getErrorMessage } from "@/services/client";
import { t } from "@/utils/i18n";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      retry: QUERY_CONFIG.RETRY,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(getErrorMessage(error, t("common:toast.operationFailed")));
    },
  }),
});
