"use client";

import { clsx } from "clsx";
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  LogOut,
  Play,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { microQuestBoardAbi, microQuestBoardAddress } from "@/lib/abi";
import { dataSuffix } from "@/lib/wagmi";

type QuestAction = "start" | "progress" | "done";
type TxTone = "idle" | "pending" | "confirmed" | "failed" | "rejected";

const actionMeta: Record<
  QuestAction,
  {
    title: string;
    label: string;
    method: "markStart" | "markProgress" | "markDone";
    icon: typeof Play;
    accent: string;
    description: string;
  }
> = {
  start: {
    title: "Today",
    label: "Mark Start",
    method: "markStart",
    icon: Play,
    accent: "bg-baseblue",
    description: "Open a small quest marker for the day.",
  },
  progress: {
    title: "In Motion",
    label: "Mark Progress",
    method: "markProgress",
    icon: Activity,
    accent: "bg-mint",
    description: "Add a progress signal without points or rewards.",
  },
  done: {
    title: "Completed",
    label: "Mark Done",
    method: "markDone",
    icon: CheckCircle2,
    accent: "bg-amberline",
    description: "Close the loop with one completion mark.",
  },
};

const emptyAddress = "0x0000000000000000000000000000000000000000";

function shortAddress(address?: string) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatCount(value: unknown) {
  return typeof value === "bigint" ? value.toString() : "0";
}

function friendlyError(error: Error | null | undefined): TxTone {
  if (!error) return "failed";
  const message = error.message.toLowerCase();
  if (message.includes("rejected") || message.includes("denied") || message.includes("cancel")) {
    return "rejected";
  }
  return "failed";
}

function statusCopy(status: TxTone) {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "failed":
      return "Transaction failed. Please try again.";
    case "rejected":
      return "Request rejected.";
    default:
      return "Ready";
  }
}

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<QuestAction | null>(null);
  const [lastStatus, setLastStatus] = useState<TxTone>("idle");
  const [lastAction, setLastAction] = useState<QuestAction | null>(null);
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract({
    mutation: {
      onError(error) {
        console.error("Write transaction failed", error);
        setLastStatus(friendlyError(error));
        setActiveAction(null);
      },
      onSuccess() {
        setLastStatus("pending");
      },
    },
  });

  const contractReady = microQuestBoardAddress.toLowerCase() !== emptyAddress;
  const displayAddress = (address || emptyAddress) as `0x${string}`;

  const readContracts = useMemo(
    () =>
      [
        { functionName: "userStarts", args: [displayAddress] },
        { functionName: "userProgresses", args: [displayAddress] },
        { functionName: "userDones", args: [displayAddress] },
        { functionName: "totalStarts" },
        { functionName: "totalProgresses" },
        { functionName: "totalDones" },
      ].map((contract) => ({
        address: microQuestBoardAddress,
        abi: microQuestBoardAbi,
        chainId: base.id,
        ...contract,
      })),
    [displayAddress]
  );

  const {
    data: counts,
    refetch,
    isLoading: countsLoading,
  } = useReadContracts({
    contracts: readContracts,
    query: {
      enabled: contractReady,
      refetchInterval: 12000,
    },
  });

  const { isLoading: receiptPending, isSuccess: receiptConfirmed, isError: receiptFailed } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: base.id,
    query: {
      enabled: Boolean(txHash),
    },
  });

  const countValues = {
    myStarts: formatCount(counts?.[0]?.result),
    myProgresses: formatCount(counts?.[1]?.result),
    myDones: formatCount(counts?.[2]?.result),
    totalStarts: formatCount(counts?.[3]?.result),
    totalProgresses: formatCount(counts?.[4]?.result),
    totalDones: formatCount(counts?.[5]?.result),
  };

  const total =
    Number(countValues.totalStarts) + Number(countValues.totalProgresses) + Number(countValues.totalDones);
  const progressPercent = total
    ? Math.round((Number(countValues.totalDones) / Math.max(total, 1)) * 100)
    : 0;

  const runAction = (action: QuestAction) => {
    if (!isConnected) {
      setWalletMenuOpen(true);
      return;
    }

    if (!contractReady) {
      setLastAction(action);
      setLastStatus("failed");
      return;
    }

    setLastAction(action);
    setActiveAction(action);
    setLastStatus("pending");

    writeContract({
      address: microQuestBoardAddress,
      abi: microQuestBoardAbi,
      functionName: actionMeta[action].method,
      chainId: base.id,
      dataSuffix,
    });
  };

  const walletStatus = isConnected
    ? chainId === base.id
      ? "Connected on Base"
      : "Connected to another network"
    : "Disconnected";

  const displayStatus = receiptPending || isWriting ? "pending" : lastStatus;

  useEffect(() => {
    if (receiptConfirmed) {
      setLastStatus("confirmed");
      setActiveAction(null);
      refetch();
    }
  }, [receiptConfirmed, refetch]);

  useEffect(() => {
    if (receiptFailed) {
      setLastStatus("failed");
      setActiveAction(null);
    }
  }, [receiptFailed]);

  return (
    <main className="min-h-screen px-4 py-4 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white/92 p-4 shadow-panel sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              <span className="h-2 w-2 rounded-full bg-baseblue" />
              Base Mini App
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">Micro Quest Board</h1>
          </div>

          <div className="relative flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "h-2.5 w-2.5 rounded-full",
                  isConnected && chainId === base.id ? "bg-mint" : "bg-amberline"
                )}
                aria-label={walletStatus}
              />
              <span className="text-sm font-medium text-neutral-600">{shortAddress(address)}</span>
              {isConnected ? (
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  aria-label="Disconnect wallet"
                  title="Disconnect wallet"
                >
                  <LogOut size={16} />
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setWalletMenuOpen((open) => !open)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              <Wallet size={16} />
              {isConnected ? "Change Wallet" : isConnecting ? "Connecting" : "Connect Wallet"}
              <ChevronDown size={16} />
            </button>
            {walletMenuOpen ? (
              <div className="absolute right-0 top-[76px] z-20 w-72 rounded-lg border border-neutral-200 bg-white p-2 shadow-panel">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    type="button"
                    onClick={() => {
                      connect({ connector, chainId: base.id });
                      setWalletMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-neutral-100"
                  >
                    <span>{connector.name}</span>
                    <CircleDot size={15} className="text-baseblue" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-neutral-200 bg-white/94 p-4 shadow-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Command board</p>
                <h2 className="text-xl font-semibold">Today&apos;s onchain markers</h2>
              </div>
              <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                Gas only
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {(Object.keys(actionMeta) as QuestAction[]).map((key) => {
                const meta = actionMeta[key];
                const Icon = meta.icon;
                return (
                  <article key={key} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className={clsx("h-2.5 w-8 rounded-full", meta.accent)} />
                      <Icon size={18} className="text-neutral-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{meta.title}</h3>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600">{meta.description}</p>
                    <button
                      type="button"
                      onClick={() => runAction(key)}
                      disabled={isWriting || receiptPending}
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-baseblue px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                    >
                      <Icon size={16} />
                      {activeAction === key && displayStatus === "pending" ? "Pending" : meta.label}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-neutral-200 bg-white/94 p-4 shadow-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Progress rail</p>
                <h2 className="text-xl font-semibold">Board signal</h2>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                aria-label="Refresh board data"
                title="Refresh board data"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full rounded-full bg-baseblue" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-xs font-semibold text-neutral-500">
              <span>Started</span>
              <span>{progressPercent}% completed</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <StatusChip label="Start" value={countValues.totalStarts} tone="blue" />
              <StatusChip label="Progress" value={countValues.totalProgresses} tone="mint" />
              <StatusChip label="Done" value={countValues.totalDones} tone="amber" />
            </div>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-neutral-200 bg-white/94 p-4 shadow-panel">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-baseblue" />
              <h2 className="text-lg font-semibold">Counters</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Counter label="My Starts" value={countValues.myStarts} totalLabel="Total Starts" total={countValues.totalStarts} />
              <Counter
                label="My Progress Marks"
                value={countValues.myProgresses}
                totalLabel="Total Progress Marks"
                total={countValues.totalProgresses}
              />
              <Counter label="My Done Marks" value={countValues.myDones} totalLabel="Total Done Marks" total={countValues.totalDones} />
            </div>
            <p className="mt-3 text-xs font-medium text-neutral-500">
              {countsLoading ? "Loading board data" : contractReady ? "Live reads from the quest contract" : "Contract address is not configured yet"}
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white/94 p-4 shadow-panel">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 size={18} className="text-baseblue" />
              <h2 className="text-lg font-semibold">Recent activity</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Wallet Status" value={walletStatus} />
              <InfoRow label="Last Transaction" value={lastAction ? `${actionMeta[lastAction].label}: ${statusCopy(displayStatus)}` : statusCopy(displayStatus)} />
            </div>
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-sm font-semibold">Write access</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">
                Only Mark Start, Mark Progress, and Mark Done send onchain transactions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusChip({ label, value, tone }: { label: string; value: string; tone: "blue" | "mint" | "amber" }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div
        className={clsx("mb-2 h-1.5 w-8 rounded-full", {
          "bg-baseblue": tone === "blue",
          "bg-mint": tone === "mint",
          "bg-amberline": tone === "amber",
        })}
      />
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Counter({ label, value, totalLabel, total }: { label: string; value: string; totalLabel: string; total: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-sm font-semibold text-neutral-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <div className="mt-4 border-t border-neutral-200 pt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{totalLabel}</p>
        <p className="mt-1 text-lg font-semibold">{total}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-neutral-800">{value}</p>
    </div>
  );
}
