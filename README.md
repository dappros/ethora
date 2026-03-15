# Ethora — SDK Monorepo

![GitHub stars](https://img.shields.io/github/stars/dappros/ethora) ![GitHub forks](https://img.shields.io/github/forks/dappros/ethora) ![GitHub license](https://img.shields.io/github/license/dappros/ethora)

**Chat, AI and messaging SDK platform.** Add real-time messaging, AI bots, and backend services to your app in minutes.

This repository serves as the **SDK monorepo** — a single place to discover, clone, and navigate all Ethora SDKs, tools, and sample apps. Each component lives in its own focused repository, linked here as git submodules.

## Ecosystem

| Folder | Repository | Description | Status |
|--------|-----------|-------------|--------|
| [`sdk-reactjs/`](sdk-reactjs/) | [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | React.js chat SDK — embed chat in any web app | Active |
| [`sdk-reactnative/`](sdk-reactnative/) | [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | React Native chat SDK (iOS & Android) | Active |
| [`sdk-android/`](sdk-android/) | [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | Native Android SDK (Kotlin) | Active |
| [`sdk-swift/`](sdk-swift/) | [ethora-sdk-swift](https://github.com/dappros/ethora-sdk-swift) | Native iOS SDK (Swift) | Active |
| [`sdk-wordpress/`](sdk-wordpress/) | [ethora-wp-plugin](https://github.com/dappros/ethora-wp-plugin) | WordPress plugin — no-code chat widget | Active |
| [`app-reactjs/`](app-reactjs/) | [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | Full web app (React.js) — App Builder frontend | Active |
| [`playground/`](playground/) | [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground) | SDK testing & demo playground | Active |
| [`backend-integration/`](backend-integration/) | [ethora-sdk-backend-integration](https://github.com/dappros/ethora-sdk-backend-integration) | Backend integration examples | Active |
| [`mcp-cli/`](mcp-cli/) | [ethora-mcp-server](https://github.com/dappros/ethora-mcp-server) | MCP server for IDE/agent integration | Active |
| [`rag-demos/`](rag-demos/) | [rag_demos](https://github.com/dappros/rag_demos) | RAG pipeline demos & examples | Active |
| [`bots/`](bots/) | [ethora-bots](https://github.com/dappros/ethora-bots) | Bot framework (XMPP, LLM, automation) | Active |
| [`setup/`](setup/) | [ethora-setup](https://github.com/dappros/ethora-setup) | CLI setup tool — `npx @ethora/setup` | Active |
| [`api/`](api/) | *(inline)* | REST API documentation (Swagger/OpenAPI) | Reference |
| — | [ethora-app-react-native](https://github.com/dappros/ethora-app-react-native) | React Native app (iOS & Android) | Legacy |
| — | [site_crawler](https://github.com/dappros/site_crawler) | Website crawler for RAG ingestion | Active |

## Getting Started

### Clone with all submodules

```bash
git clone --recurse-submodules https://github.com/dappros/ethora.git
cd ethora
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

### Set up credentials (recommended)

```bash
npx @ethora/setup
```

This will create an account, set up an app, and generate config files for your target SDK. You can also connect to a self-hosted server.

### Quick paths

**Add chat to a website (fastest):**
```bash
cd sdk-reactjs
npm install
# See sdk-reactjs/README.md for embedding instructions
```

**Add chat to a React Native app:**
```bash
cd sdk-reactnative
npm install
# See sdk-reactnative/README.md
```

**Native Android SDK:**
```bash
cd sdk-android
# See sdk-android/README.md for Gradle setup
```

**Native iOS SDK:**
```bash
cd sdk-swift
# See sdk-swift/README.md for Swift Package Manager setup
```

**WordPress (no code):**
Install the plugin from `sdk-wordpress/` or see [ethora-wp-plugin](https://github.com/dappros/ethora-wp-plugin).

**Connect via MCP (IDE/AI agent):**
```bash
cd mcp-cli
npm install
# See mcp-cli/README.md
```

### Default backend

Sign up for a free account at [app.ethora.com](https://app.ethora.com/register) to get API credentials. The SDKs connect to Ethora Cloud by default. Self-hosted and dedicated server options are available for enterprise customers.

## What you can build

- **Chat / Messaging** — 1:1 and group chat, push notifications, audio/video calls
- **AI Assistants** — LLM-powered bots, RAG pipelines, prompt engineering
- **Backend-as-a-Service** — Users, files, push notifications out of the box
- **Digital Wallets** — ERC-20/721/1155 tokens, documents, digital assets
- **Gamification** — Coins/points, referrals, daily bonuses, collectibles

## Architecture

```
Your App
  └── Ethora SDK (React.js / React Native / Android / Swift / WordPress)
        └── Ethora Platform API (REST + XMPP)
              ├── Chat (Ejabberd + custom services)
              ├── AI (LLM bots, RAG)
              ├── Users & Auth (SSO, JWT)
              ├── Files & Storage (S3/IPFS)
              ├── Push Notifications (FCM/APNs)
              └── Blockchain (EVM, optional)
```

**Hosting options:** Cloud (free tier) | Self-hosted (AWS Marketplace / Docker) | Dedicated server

## Contributing

We welcome issues, discussions, and PRs across the ecosystem. Each submodule has its own issue tracker — use the relevant repository for bug reports and feature requests.

- [Open an issue](https://github.com/dappros/ethora/issues) for cross-cutting concerns
- Use [Discussions](https://github.com/dappros/ethora/discussions) for Q&A
- Follow conventional commit messages

## Contact

- Website: https://ethora.com/
- Try Free: https://app.ethora.com/register
- Twitter/X: https://x.com/EthoraOfficial
- LinkedIn: https://www.linkedin.com/company/ethora-official/

## License

AGPL and MIT licenses. Commercial licenses available from [Dappros](https://www.dappros.com/).

---

<details>
<summary><strong>Previous README content (archive)</strong></summary>

### Project Updates (Archive)

<details>
<summary><strong>4 Dec 2024</strong> — New platform UI released</summary>

Finally our new version of the overall platform UI is released. This affects the whole web version including chat component and Admin Screens.
We hope you like the new look of Ethora and this inspires you to build your fascinating projects with Ethora engine!
Both old and new UI are going to remain available for you to use for a few months after which we will sunset the old version.
More details in our Community Forum: https://forum.ethora.com/topic/38-new-version-soft-launch/#comment-48
</details>

<details>
<summary><strong>11 Oct 2024</strong> — NPM: Ethora Chat Component</summary>

We released the **Ethora Chat Component** npm package — launch a chat room in minutes without digging into a mono-repo.
https://www.npmjs.com/package/@ethora/chat-component
</details>

<details>
<summary><strong>3 Sep 2024</strong> — Web version redesign</summary>

We're updating our web design — new login/sign-in screens and Admin dashboard. Follow updates: https://forum.ethora.com/forum/16-updates-and-announcements/
</details>

<details>
<summary><strong>5 Jul 2024</strong> — Chat Component alpha</summary>

Alpha of the chat component released. It combines Ethora's platform features with simple embedding. More: https://forum.ethora.com/topic/9-ethora-nmp-package-chat-component-alpha-version/#comment-9
</details>

<details>
<summary><strong>11 Oct 2023</strong> — Architecture & design plans</summary>

Architecture review & refactoring; forthcoming design updates (mobile first, then web).
Video by @CodeEater21 on building iOS/Android with Ethora: https://www.youtube.com/watch?v=pKEMcxJb5HM
Self-hosted options via AWS Marketplace / Docker Hub planned.
</details>

### Screenshots

**React Native — Standard UI (new design)**
![CleanShot 2024-07-05 at 15 56 26@2x](https://github.com/dappros/ethora/assets/328787/19cd37ff-150c-4994-a582-757bf30d914a)

**React Native — Standard UI (old version)**
<img width="736" alt="collage_ethora_ 2022-08-31" src="https://user-images.githubusercontent.com/328787/187653868-456026a8-ef7e-498c-9088-1d545dc9f818.png">

**Branded (customized) UI**
<img width="622" alt="Screenshot 2023-05-04 at 17 31 05" src="https://user-images.githubusercontent.com/328787/236267243-d0c8f324-4a27-4743-a547-702351385a21.png">

### App Builder

The fastest way to get your app running:
1. Customize name, logo, colors
2. Launch your web app on your subdomain
3. Generate React Native codebases for iOS & Android

Sign up: https://app.ethora.com/register

<img width="800" alt="App Builder" src="https://github.com/dappros/ethora/assets/328787/5c5b5230-e3d5-4f16-9f3a-9aae98649105">

### 5-minute demo (widget)

Add an AI chat to any site:
<img width="1518" height="294" alt="CleanShot 2025-10-07 at 16 07 58@2x" src="https://github.com/user-attachments/assets/1c547286-9bb6-449c-bdc5-8fa23d3d9449" />

### Chat Bots

Ethora uses **XMPP** for chat. Connect bots in Python, Node.js, etc.

- **ChatGPT bot** — integrate OpenAI/LLMs for topic-specialized assistants
  <img width="400" alt="Screenshot 2023-05-05 at 11 01 10" src="https://user-images.githubusercontent.com/328787/236429436-a1046904-b342-44e8-98a9-c269eb42857b.png">

- **Translate bot** — interpreter bot (EN-ES)
  <img width="400" alt="Screenshot 2023-05-05 at 11 03 15" src="https://user-images.githubusercontent.com/328787/236429833-26d10fd6-88c2-4e46-a1c5-be3f273071ea.png">

### Gamification, Referrals & Rewards

- **Coin** (ERC-20) for project economy
- **Sign-up bonus** (100 Coins by default)
- **Daily check-in** (5 Coins)
- **Referrals** (25 Coins to both users)

### Threads

Keep busy chats tidy with thread replies.

### Core Features

- iOS, Android, Web
- Your own name, branding, token/coin name
- SSO (Social Sign On) via Gmail, Facebook, Apple or email
- AI Bots with LLM, RAG, prompt engineering features
- Each user gets a digital assets wallet + cryptographic keypair
- Coins (ERC-20) & NFTs (ERC-721/1155)
- Crypto-likes (tip tokens to messages)
- Rooms & spaces, QR/public-key invites
- Profiles, push, audio/video calls

### Authors & Governance

Ethora & its server infrastructure have been developed since 2018 by [Dappros](https://www.dappros.com/) and [DeepX](http://deepxhub.com/). The team is led by Taras Filatov, a Ukrainian-born and UK-based tech entrepreneur.

**Backend:** Dappros Platform API & DeepX RTC: EVM chain + API/cache (Node.js, Kafka, Redis, MongoDB), IPFS/S3 storage, and XMPP Ejabberd messaging with custom services (Erlang, Mnesia, MySQL, Cassandra).

**Commercial model:**
- Client-side: free, open-source (closed-source commercial license available)
- Server-side: freemium (generous free tier + paid SLA for businesses)

</details>
