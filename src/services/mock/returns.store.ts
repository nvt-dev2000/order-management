import type { ReturnRequest } from "@/types/returns/return.types";

import { buildSeedReturns } from "./returns.seed";

let returns: ReturnRequest[] = buildSeedReturns();

export const returnsStore = {
  list: (): ReturnRequest[] => returns,

  replace: (next: ReturnRequest[]) => {
    returns = next;
  },

  reset: () => {
    returns = buildSeedReturns();
  },
};
