import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const dataSuffix = (
  process.env.NEXT_PUBLIC_BASE_DATA_SUFFIX || "0x"
) as `0x${string}`;

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      target() {
        return {
          id: "injected",
          name: "Browser Wallet",
          provider: typeof window !== "undefined" ? window.ethereum : undefined,
        };
      },
    }),
    coinbaseWallet({
      appName: "Micro Quest Board",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});
