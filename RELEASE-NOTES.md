# Ethora SDK — Release Notes

## Legend

| Tag | Meaning |
|-----|---------|
| **New** | Brand new feature or component |
| **Improved** | Enhancement to existing functionality |
| **Fixed** | Bug fix |
| **Restored** | Previously available feature brought back |
| **Refactored** | Code restructuring (no user-facing change) |
| **Docs** | Documentation updates |
| **Testing** | Test coverage additions |
| **API** | Backend/API-facing change |
| **Milestone** | Version or release landmark |

---

## Week 12–13 (Mar 10–18, 2026)

### Android SDK (`sdk-android`) — v1.0.0
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | [v1.0.0](https://github.com/dappros/ethora-sdk-android/releases/tag/v1.0.0) | Now available via [JitPack](https://jitpack.io/#dappros/ethora-sdk-android/v1.0.0)

Major release addressing all reported issues and adding key features:

- **New:** JitPack distribution — install via Gradle dependency instead of manual zip/git ([`68f708f`](https://github.com/dappros/ethora-sdk-android/commit/68f708f))
- **New:** Unread message badge support for chat rooms
- **New:** Single-room mode — set `roomJid` in `EthoraChatConfig` to lock the SDK to one conversation
- **New:** JWT token fields — set user JWT directly so the chat component handles all data fetching internally
- **Improved:** Renamed `devServer` to `xmppServer` in config to avoid confusion in production deployments
- **Improved:** Removed confusing `ethora-cc-android` nested module — single clean repo structure with unified documentation
- **Improved:** Better error handlers and improved first-load performance
- **Fixed:** `/chats/my` returning 401 when using email login — resolved by allowing direct JWT token injection
- **Fixed:** (+) button crash (`PlatformRipple` exception) when `disableHeader: true` — button now hidden cleanly with option to add custom UI
- **Docs:** Consolidated to single documentation file, resolving README vs INSTRUCTIONS discrepancy

### API / Backend
- **Fixed:** `POST /v1/apps` returning 422 — updated auth middleware to correctly handle ACL
- **Fixed:** `GET /v2/chats/users` — `limit` and `offset` query parameters now work correctly; `getChatUserById` no longer returns multiple users
- **Improved:** Broadcast API and admin UI for enterprise mass messaging

### Setup CLI (`@ethora/setup`) — NEW
> [ethora-setup](https://github.com/dappros/ethora-setup)

New interactive CLI tool for developer onboarding — register, create apps, and generate SDK config files without leaving the terminal.

- **New:** `npx @ethora/setup` — full onboarding flow: account registration, app creation, credential generation ([`2c7c89a`](https://github.com/dappros/ethora-setup/commit/2c7c89a))
- **New:** Server presets — Cloud QA (latest) and Cloud Production (ethora.com) ([`97731f3`](https://github.com/dappros/ethora-setup/commit/97731f3))
- **New:** SDK clone + auto-config — setup can clone the target SDK repo and write config directly into it ([`f86a6d1`](https://github.com/dappros/ethora-setup/commit/f86a6d1))
- **New:** Android SDK patching — automatically patches `AppConfig.kt` and `MainActivity.kt` with your credentials ([`f2ca5fe`](https://github.com/dappros/ethora-setup/commit/f2ca5fe))
- **API:** Switched to v2 signup/login routes (password set directly, no email confirmation step) ([`963bc59`](https://github.com/dappros/ethora-setup/commit/963bc59))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) `dev` branch

- **Restored:** Chat broadcast tools in admin app settings panel ([`ab5ab2c`](https://github.com/dappros/ethora-app-reactjs/commit/ab5ab2c))
- **Fixed:** Mobile push notification settings and base app UX settings were missing — now restored ([`05acb37`](https://github.com/dappros/ethora-app-reactjs/commit/05acb37))
- **Testing:** Added Playwright smoke test coverage ([`37af18c`](https://github.com/dappros/ethora-app-reactjs/commit/37af18c))

### Playground
> [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground)

- **New:** Server-side token generation support ([`f4f7ef6`](https://github.com/dappros/ethora-sdk-playground/commit/f4f7ef6))
- **Improved:** Updated chat SDK version ([`f4f7ef6`](https://github.com/dappros/ethora-sdk-playground/commit/f4f7ef6))
- **Fixed:** Server token handling fix ([`4db67a6`](https://github.com/dappros/ethora-sdk-playground/commit/4db67a6))

### Monorepo
> [ethora](https://github.com/dappros/ethora)

- **New:** Reorganized as SDK monorepo with 11 git submodules (flat `sdk-*` / `app-*` prefix structure)
- **New:** Ecosystem navigation table in README linking all SDKs, tools, and sample apps

---

## Week 11 (Mar 3–9, 2026)

### Playground
> [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground)

- **Fixed:** Environment variable loading fix ([`34bad25`](https://github.com/dappros/ethora-sdk-playground/commit/34bad25))

### Backend Integration
> [ethora-sdk-backend-integration](https://github.com/dappros/ethora-sdk-backend-integration)

- **Improved:** New logic handling and documentation updates ([`d6af11b`](https://github.com/dappros/ethora-sdk-backend-integration/commit/d6af11b))

---

## Weeks 7–10 (Feb 6 – Mar 2, 2026)

### Android SDK (`sdk-android`)
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android)

- **New:** Push notifications support ([`da0cac6`](https://github.com/dappros/ethora-sdk-android/commit/da0cac6))
- **New:** Media sending — users can now send images and files in chat ([`72a0b2a`](https://github.com/dappros/ethora-sdk-android/commit/72a0b2a))
- **New:** Media viewing — inline image/file preview in messages ([`afa30e1`](https://github.com/dappros/ethora-sdk-android/commit/afa30e1))
- **New:** Message animation effects ([`fa75cf9`](https://github.com/dappros/ethora-sdk-android/commit/fa75cf9))
- **Improved:** Code split for better modularity ([`da0cac6`](https://github.com/dappros/ethora-sdk-android/commit/da0cac6))
- **Improved:** Pagination loader — fixed infinite scroll and "load more" behavior ([`4f67d27`](https://github.com/dappros/ethora-sdk-android/commit/4f67d27))
- **Fixed:** Message animation rendering issues ([`2485565`](https://github.com/dappros/ethora-sdk-android/commit/2485565))
- **Milestone:** Versions v0.7 → v0.8 → v0.9.1 → v1.0 progression ([`87066f7`](https://github.com/dappros/ethora-sdk-android/commit/87066f7)...[`f555462`](https://github.com/dappros/ethora-sdk-android/commit/f555462))

### iOS SDK (`sdk-swift`)
> [ethora-sdk-swift](https://github.com/dappros/ethora-sdk-swift)

- **New:** Push notifications support, code split ([`8b20dcd`](https://github.com/dappros/ethora-sdk-swift/commit/8b20dcd))

### Playground
> [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground)

- **New:** Direct HTTP API testing panel for debugging and exploring endpoints ([`dab8ee9`](https://github.com/dappros/ethora-sdk-playground/commit/dab8ee9))
- **New:** Chat metadata update via direct HTTP request ([`fa71264`](https://github.com/dappros/ethora-sdk-playground/commit/fa71264))
- **New:** Integration guide ([`b13f812`](https://github.com/dappros/ethora-sdk-playground/commit/b13f812))
- **Refactored:** SDK type definitions — new `ChatRepository` interface, aligned with API request/response structures ([`9d75900`](https://github.com/dappros/ethora-sdk-playground/commit/9d75900))

---

