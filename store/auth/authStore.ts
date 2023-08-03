import { createAuthStore } from "./createAuthStore";

export const useAuthStore = createAuthStore();

export enum WalletType {
  SEQUENCE = "sequence",
  RAINBOWKIT = "rainbowkit",
  NOT_CONNECTED = null,
}
