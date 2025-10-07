# Ethora: chat, AI and wallets app engine

![GitHub watchers](https://img.shields.io/github/watchers/dappros/ethora) ![GitHub forks](https://img.shields.io/github/forks/dappros/ethora) ![GitHub Repo stars](https://img.shields.io/github/stars/dappros/ethora) ![GitHub repo size](https://img.shields.io/github/repo-size/dappros/ethora) ![GitHub language count](https://img.shields.io/github/languages/count/dappros/ethora) ![GitHub top language](https://img.shields.io/github/languages/top/dappros/ethora) <a href="https://codeclimate.com/github/dappros/ethora/maintainability"><img src="https://api.codeclimate.com/v1/badges/715c6f3ffb08de5ca621/maintainability" /></a> ![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/dappros/ethora/newArchitecture) ![GitHub issues](https://img.shields.io/github/issues/dappros/ethora) ![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/dappros/ethora) ![GitHub](https://img.shields.io/github/license/dappros/ethora) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END --> 

![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white) ![iOS](https://img.shields.io/badge/iOS-000000?style=flat&logo=ios&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) ![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=flat&logo=Ethereum&logoColor=white) ![Web3.js](https://img.shields.io/badge/web3.js-F16822?style=flat&logo=web3.js&logoColor=white) ![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=flat&logo=solidity&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white) ![ApacheCassandra](https://img.shields.io/badge/cassandra-%231287B1.svg?style=flat&logo=apache-cassandra&logoColor=white) ![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=flat&logo=openai&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white) 

[![Discord](https://img.shields.io/badge/%3Cethora%3E-%237289DA.svg?style=flat&logo=discord&logoColor=white)](https://discord.gg/Sm6bAHA3ZC) [![Twitter URL](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2Fdappros%2Fethora)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fdappros%2Fethora%2F&via=tarasfilatov&text=check%20out%20Ethora%20%23web3%20%23social%20app%20engine&hashtags=lowcode%2Creactnative%2Copensource%2Cnocode) [![Website](https://img.shields.io/website?url=https%3A%2F%2Fethora.com%2F)](https://ethora.com/) [![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCRvrXwMOU0WBkRZyFlU7V_g)](https://www.youtube.com/channel/UCRvrXwMOU0WBkRZyFlU7V_g)

---

**Ethora** is a feature‑rich low‑code engine that helps you ship **mobile (React Native)** and **web (React.js)** apps with **chat**, **AI assistants**, and **wallets** in days, not months.

> This repository is now the **project hub**. Actively developed code has moved into focused repositories (NPM chat component, React.js client (Web), React Native client (iOS & Android), WordPress plugin, bots framework, tooling). Use the quick links below to jump to the right place.

## 🚀 Quick start — choose your path

- **Embed an AI Chat on any site (no backend):**  
  👉 [`ethora-chat-component`](https://github.com/dappros/ethora-chat-component)

- **WordPress (no code):**  
  👉 [`ethora-wp-plugin`](https://github.com/dappros/ethora-wp-plugin)

- **Connect your IDE/agent via MCP:**  
  👉 [`ethora-mcp-server`](https://github.com/dappros/ethora-mcp-server)

- **Index your site & build RAG backends:**  
  👉 [`site_crawler`](https://github.com/dappros/site_crawler) · [`rag_demos`](https://github.com/dappros/rag_demos)

- **Explore all repos:**  
  👉 https://github.com/dappros

---

## ✨ What you can build

- **Chat / Messaging** — 1:1 & group chat, push, audio/video calls
- **AI Bots** — LLM‑powered assistants, data processing & automation
- **Digital Wallets** — store, display, exchange documents & digital assets (ERC‑20/721/1155)
- **Gamification & Rewards** — coins/points, referrals, daily bonuses, collectibles
- **Communities** — profiles, rooms/spaces, QR invites, social interactions

> Build an iOS/Android/Web app with your branding in minutes via our **App Builder**: https://app.ethora.com/register


---

## 🧪 5-minute demo (widget)

Add an AI chat to any site:

```html
<script src="https://cdn.jsdelivr.net/npm/ethora-chat-component@latest/dist/widget.js"></script>
<script>
  EthoraChatWidget.init({
    endpoint: "https://your-backend.example.com/api/rag",
    title: "Ask our AI Assistant"
  });
</script>
```

Use the WordPress plugin if you prefer a UI: https://github.com/dappros/ethora-wp-plugin

---

## 🧭 Repository map (hub → satellites)

| Area | Repositories |
|---|---|
| **Chat component (client core)** | [`ethora-chat-component`](https://github.com/dappros/ethora-chat-component) · [`ethora-wp-plugin`](https://github.com/dappros/ethora-wp-plugin) |
| **RAG ingestion & demos** | [`site_crawler`](https://github.com/dappros/site_crawler) · [`rag_demos`](https://github.com/dappros/rag_demos) |
| **Developer tooling** | [`ethora-mcp-server`](https://github.com/dappros/ethora-mcp-server) |
| **Everything else** | Browse all: https://github.com/dappros |

---

## 📣 Project updates (archive)

<details>
<summary><strong>4 Dec 2024</strong> — New platform UI released</summary>

Finally our new version of the overall platform UI is released. This affects the whole web version including chat component and Admin Screens.
We hope you like the new look of Ethora and this inspires you to build your fascinating projects with Ethora engine!  
Both old and new UI are going to remain available for you to use for a few months after which we will sunset the old version.  
More details in our Community Forum: https://forum.ethora.com/topic/38-new-version-soft-launch/#comment-48
</details>

<details>
<summary><strong>11 Oct 2024</strong> — NPM: Ethora Chat Component</summary>

We released the **Ethora Chat Component** npm package — launch a chat room in minutes without digging into a mono‑repo.  
https://www.npmjs.com/package/@ethora/chat-component
</details>

<details>
<summary><strong>3 Sep 2024</strong> — Web version redesign</summary>

We’re updating our web design — new login/sign‑in screens and Admin dashboard. Follow updates: https://forum.ethora.com/forum/16-updates-and-announcements/
</details>

<details>
<summary><strong>5 Jul 2024</strong> — Chat Component alpha</summary>

Alpha of the chat component released. It combines Ethora’s platform features with simple embedding. More: https://forum.ethora.com/topic/9-ethora-nmp-package-chat-component-alpha-version/#comment-9
</details>

<details>
<summary><strong>11 Oct 2023</strong> — Architecture & design plans</summary>

Architecture review & refactoring; forthcoming design updates (mobile first, then web).  
Video by @CodeEater21 on building iOS/Android with Ethora: https://www.youtube.com/watch?v=pSomfrBgPzI  
Self‑hosted options via AWS Marketplace / Docker Hub planned.
</details>

---

## 📱 React Native (iOS/Android)

Standard UI (new design)  
![CleanShot 2024-07-05 at 15 56 26@2x](https://github.com/dappros/ethora/assets/328787/19cd37ff-150c-4994-a582-757bf30d914a)

Standard UI (old version)  
<img width="736" alt="collage_ethora_ 2022-08-31" src="https://user-images.githubusercontent.com/328787/187653868-456026a8-ef7e-498c-9088-1d545dc9f818.png">

Branded (customized) UI  
<img width="622" alt="Screenshot 2023-05-04 at 17 31 05" src="https://user-images.githubusercontent.com/328787/236267243-d0c8f324-4a27-4743-a547-702351385a21.png">

---

## 🧰 App Builder

The fastest way to get your app running:
1. Customize name, logo, colors
2. Launch your web app on your subdomain
3. Generate React Native codebases for iOS & Android

⏱️ Gets you running in minutes. Sign up: https://app.ethora.com/register

<img width="800" alt="App Builder" src="https://github.com/dappros/ethora/assets/328787/5c5b5230-e3d5-4f16-9f3a-9aae98649105">

App Builder Demo  
![App Builder Demo](client-web/public/images/Builder-demo.gif)

FAQs (from the original README) are preserved:
- **Hosting**: default is our Cloud (Free tier). You can self‑host the React.js code or deploy a full backend (AWS Marketplace option).  
- **Push/Firebase**: bring your own credentials in **Services** tab in App Settings.

---

## 💬 Chat bots (LLMs, DAO, minting, bookings, commerce)

Ethora uses **XMPP** for chat. Connect bots in Python, Node.js, etc. Examples live in `/bots/` (samples & scaffolding).

- **ChatGPT bot** — integrate OpenAI/LLMs for topic‑specialized assistants  
  <img width="400" alt="Screenshot 2023-05-05 at 11 01 10" src="https://user-images.githubusercontent.com/328787/236429436-a1046904-b342-44e8-98a9-c269eb42857b.png">

- **Translate bot** — interpreter bot (EN↔ES)  
  <img width="400" alt="Screenshot 2023-05-05 at 11 03 15" src="https://user-images.githubusercontent.com/328787/236429833-26d10fd6-88c2-4e46-a1c5-be3f273071ea.png">

---

## 🎨 Branding & customization

Change app name, logo, theme colors, coin name/symbol via **App Builder** (no code).  
Deeper customization possible in code. Users can personalize rooms, profiles, collections—features are toggleable per project.

Custom chat background  
<img width="400" alt="Screenshot 2023-05-05 at 11 04 28" src="https://user-images.githubusercontent.com/328787/236430051-2c24e3e8-5006-41f6-b035-0dfe1f0a3c9a.png">

---

## 🧵 Threads

Keep busy chats tidy with thread replies:  
<img width="400" alt="Screenshot 2023-05-05 at 11 08 53" src="https://user-images.githubusercontent.com/328787/236430928-5e371c86-d346-48df-ad18-9aa64d2ec05e.png">

---

## 🏅 Gamification, referrals & rewards

Out of the box:
- **Coin** (ERC‑20) for project economy (“stars”, “points”, “credits” — you name it)
- **Sign‑up bonus** (100 Coins by default)
- **Daily check‑in** (5 Coins by default)
- **Referrals** (25 Coins to both users by default)

Referrals  
<img width="400" alt="Screenshot 2023-05-05 at 11 35 46" src="https://user-images.githubusercontent.com/328787/236436264-e8f57960-6995-41dd-a708-f66d7ff4fc41.png">

Rewarding with Coin & collectibles (1.5 min demo, enable subtitles):  
<a href="http://www.youtube.com/watch?feature=player_embedded&v=pKEMcxJb5HM" target="_blank"><img width="439" alt="ethora_youtube" src="https://user-images.githubusercontent.com/328787/185500847-3a607707-9008-4c56-873c-7c9aa1aa1eee.png"></a>

Notes: Coins use ERC‑20; items/collectibles are NFTs (ERC‑1155). You can keep these internal for gamification or open to external networks.

---

## 📚 Learn more

- Website: https://ethora.com/  
- Try Free: https://app.ethora.com/register

> Some docs may lag - if in doubt, raise a topic on forum or contact us

---

## 🔧 Core features

- iOS, Android, Web
- Your own name, branding, token/coin name etc
- SSO (Social Sign On) via Gmail, Facebook, Apple or email
- AI Bots with LLM, RAG, prompt engineering features
- Each user gets a digital assets wallet + cryptographic keypair 
- Coins (ERC‑20) & NFTs (ERC‑721/1155)
- Crypto‑likes (tip tokens to messages)
- Immutable ledger (EVM)
- Rooms & spaces, QR/public‑key invites
- Profiles, push, audio/video calls

---

## 🧑‍💻 Contributing

We welcome issues, discussions, and PRs across the ecosystem.

- Open an issue if something’s unclear or broken
- Use Discussions for Q&A and Show & Tell
- Follow conventional commit messages where possible

---

## ⚖️ Authors, License & Governance

**Authors.** Ethora & its server infrastructure (Dappros Platform, chat & push services, etc.) have been developed since 2018 by <a href="https://www.dappros.com/">Dappros</a> and <a href="http://deepxhub.com/">DeepX</a>. The team is led by Taras Filatov, a Ukrainian‑born and UK‑based tech entrepreneur.

**License.** Project codebase is released under **AGPL** and **MIT** licenses; other licenses (commercial closed source, SaaS, perpetual, etc.) are available from the authors.

**Backend.** Server‑side via **Dappros Platform API** & **DeepX RTC**: EVM chain + API/cache (Node.js, Kafka, Redis, MongoDB), IPFS/S3 storage, and **XMPP Ejabberd** messaging with custom services (Erlang, Mnesia, MySQL, Cassandra).

**Default backend option.** Sign up for a free Dappros Platform account: https://app.ethora.com/register (Cloud). Self‑hosted (AWS Marketplace) and dedicated options available.

---

## 🛒 Commercial model

- Client‑side: **free, open‑source** (closed‑source commercial license available)
- Server‑side: **freemium** (generous free tier + paid SLA for businesses). 

---

## 💬 Contact

- Contact form: https://ethora.com/#contact  
- Forum: https://forum.ethora.com/
- Twitter/X: https://x.com/EthoraOfficial
- Linkedin: https://www.linkedin.com/company/ethora-official/

Also feel free to submit pull requests in this repository!

