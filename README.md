# Micro Quest Board

A Base Mini App for three simple onchain quest markers: Mark Start, Mark Progress, and Mark Done.

## Setup

Create `.env.local` with:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedMicroQuestBoard
NEXT_PUBLIC_BASE_DATA_SUFFIX=0xYourErc8021EncodedString
```

Then replace the hardcoded Base verify token in `app/layout.tsx`:

```html
<meta name="base:app_id" content="REPLACE_WITH_BASE_DEV_VERIFY_TOKEN" />
```

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
