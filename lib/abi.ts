export const microQuestBoardAbi = [
  {
    type: "function",
    name: "markStart",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "markProgress",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "markDone",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "userStarts",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "userProgresses",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "userDones",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalStarts",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalProgresses",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalDones",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "StartMarked",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "userStarts", type: "uint256" },
      { indexed: false, name: "totalStarts", type: "uint256" }
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProgressMarked",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "userProgresses", type: "uint256" },
      { indexed: false, name: "totalProgresses", type: "uint256" }
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DoneMarked",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "userDones", type: "uint256" },
      { indexed: false, name: "totalDones", type: "uint256" }
    ],
    anonymous: false,
  },
] as const;

export const microQuestBoardAddress = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xe2c3b4b5b4c47a4575f31fa9271208ed750534bc"
) as `0x${string}`;
