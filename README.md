# MicroQuestBoard

MicroQuestBoard is a Base Mini App for recording three simple onchain quest markers:

- Mark Start
- Mark Progress
- Mark Done

The app provides a compact board interface for marking quest state on Base using a deployed contract address supplied through environment configuration.

## Repository

GitHub: https://github.com/XantheBryce/micro-quest-board.git

## Overview

MicroQuestBoard is intentionally small and focused.

It is designed around a single quest board flow with three actions.

Each action corresponds to a board button and writes to the configured contract.

The app is built to run as a Base Mini App and to support Base App embedding.

## Features

- Simple quest board interface
- Three onchain quest markers
- Base Mini App support
- Environment-based contract configuration
- Native Wagmi setup
- Minimal connector configuration
- No RainbowKit dependency
- No `getDefaultConfig` usage

## Quest Actions

The board includes three primary actions:

1. **Mark Start**
2. **Mark Progress**
3. **Mark Done**

Only these three board buttons call `writeContract`.

## Tech Notes

The app intentionally uses Wagmi native configuration.

The configured connectors are:

- `injected()`
- `coinbaseWallet()`

This keeps the wallet integration lightweight and aligned with the app鈥檚 intended Base Mini App usage.

## Environment Setup

Create a `.env.local` file in the project root.

Add the following values:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe2c3b4b5b4c47a4575f31fa9271208ed750534bc
NEXT_PUBLIC_BASE_DATA_SUFFIX=0x62635f3772616735766c6a0b0080218021802180218021802180218021
```

Base build code:

```text
bc_7rag5vlj
```

## Installation

Install project dependencies:

```bash
npm install
```

## Local Development

Start the local development server:

```bash
npm run dev
```

After the server starts, open the local URL shown in your terminal.

## Production Build

Create a production build:

```bash
npm run build
```

## Configuration Reference

### `NEXT_PUBLIC_CONTRACT_ADDRESS`

The deployed `MicroQuestBoard` contract address on Base.

Update this value if the contract is redeployed.

### `NEXT_PUBLIC_BASE_DATA_SUFFIX`

The ERC-8021 encoded attribution string used for Base App verification.

Use the configured value required for the deployed app.

## Deployment Checklist

Before publishing the app, confirm the following:

- Deploy `MicroQuestBoard` on Base.
- Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the deployed contract address.
- Add the required base.dev verification value directly in `app/layout.tsx`.
- Set `NEXT_PUBLIC_BASE_DATA_SUFFIX` to the ERC-8021 encoded attribution string.
