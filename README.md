# Micro Quest Board

A Base Mini App for three simple onchain quest markers: Mark Start, Mark Progress, and Mark Done.

## Setup

Create `.env.local` with:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe2c3b4b5b4c47a4575f31fa9271208ed750534bc
NEXT_PUBLIC_BASE_DATA_SUFFIX=0x62635f3772616735766c6a0b0080218021802180218021802180218021
```

Base build code: `bc_7rag5vlj`

The app intentionally uses Wagmi native configuration with only `injected()` and `coinbaseWallet()` connectors. It does not use RainbowKit or `getDefaultConfig`.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Deployment Checklist

- Deploy `MicroQuestBoard` on Base and set `NEXT_PUBLIC_CONTRACT_ADDRESS`.
- Add the base.dev verify token directly in `app/layout.tsx`.
- Set `NEXT_PUBLIC_BASE_DATA_SUFFIX` to the ERC-8021 encoded attribution string.
- Deploy to Vercel and disable Deployment Protection for Base App embedding.
- Verify the offchain meta tag and onchain data suffix in base.dev.

Only the three board buttons call `writeContract`: Mark Start, Mark Progress, and Mark Done.
