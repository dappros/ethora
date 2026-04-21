# Ethora SDK Feature Matrix

> **Version:** 26.04  ·  **Last reviewed:** 2026-04-21  ·  Legend: ✅ Present  ·  🟡 Partial  ·  🛠 Roadmap  ·  — Absent

High-level capability coverage across all Ethora SDKs. Source of truth is [`features.yaml`](features.yaml). Detailed view by category, with evidence paths: [views/by-category.md](views/by-category.md).

## Coverage summary

| SDK | Present | Partial | Roadmap | Absent | Coverage |
|---|---:|---:|---:|---:|---:|
| **React.js (Web)** | 32 | 4 | 0 | 8 | 77% |
| **React Native** | 27 | 6 | 1 | 10 | 68% |
| **Android (Kotlin)** | 31 | 5 | 1 | 7 | 76% |
| **iOS (Swift)** | 27 | 6 | 0 | 11 | 68% |
| **WordPress** | 3 | 6 | 0 | 35 | 14% |

_Coverage = (present + partial × 0.5) / 44 features._

## SDK overview

- **[React.js (Web)](https://github.com/dappros/ethora-chat-component)** — Flagship SDK, fullest feature coverage. Effectively the JS/TS reference.
- **[React Native](https://github.com/dappros/ethora-chat-component-rn)** — Mobile React Native. Shares architecture with React.js but trails on reactions and notifications.
- **[Android (Kotlin)](https://github.com/dappros/ethora-sdk-android)** — Native Kotlin + Jetpack Compose. JitPack-distributed. No account provisioning APIs.
- **[iOS (Swift)](https://github.com/dappros/ethora-sdk-swift)** — Native SwiftUI via SPM. Tracks Android closely; no logout helper or dark mode yet.
- **[WordPress](https://github.com/dappros/ethora-wp-plugin)** — Bot-widget plugin, not a full chat SDK. Embeds a single bot-to-user widget.

## Full matrix

| Feature | React.js (Web) | React Native | Android (Kotlin) | iOS (Swift) | WordPress |
|---|---|---|---|---|---|
| **Authentication** |  |  |  |  |  |
| Email/password signup | ✅ | 🟡 | — | — | — |
| Email/password login | ✅ | ✅ | ✅ | ✅ | — |
| JWT login (bring your own token) | ✅ | ✅ | ✅ | ✅ | — |
| OAuth / social login | ✅ | 🟡 | 🛠 | 🟡 | 🟡 |
| Anonymous / guest login | — | 🛠 | — | — | — |
| Logout | 🟡 | ✅ | ✅ | — | 🟡 |
| Token refresh | ✅ | ✅ | ✅ | ✅ | — |
| **Messaging** |  |  |  |  |  |
| Send text message | ✅ | ✅ | ✅ | ✅ | 🟡 |
| Edit message | ✅ | ✅ | ✅ | ✅ | — |
| Delete message | ✅ | ✅ | ✅ | ✅ | — |
| Reply to message | ✅ | ✅ | ✅ | ✅ | — |
| Message reactions | ✅ | — | ✅ | ✅ | — |
| @mentions | — | — | — | — | — |
| Typing indicator | ✅ | ✅ | ✅ | ✅ | — |
| Delivery status indicators | ✅ | — | — | ✅ | — |
| Message history (MAM pagination) | ✅ | ✅ | ✅ | ✅ | — |
| **Media** |  |  |  |  |  |
| Send/receive images | ✅ | ✅ | ✅ | ✅ | — |
| Send/receive video | ✅ | ✅ | ✅ | ✅ | — |
| Send/receive files | ✅ | ✅ | ✅ | ✅ | — |
| Audio messages | ✅ | ✅ | ✅ | ✅ | — |
| Inline media preview | 🟡 | ✅ | ✅ | 🟡 | — |
| **Rooms** |  |  |  |  |  |
| 1:1 direct messaging | ✅ | ✅ | ✅ | ✅ | 🟡 |
| Group chat (MUC) | ✅ | ✅ | ✅ | ✅ | — |
| Single-room mode | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create room | ✅ | ✅ | ✅ | ✅ | — |
| Invite users to room | ✅ | ✅ | 🟡 | 🟡 | — |
| Leave room | ✅ | ✅ | ✅ | — | — |
| Room metadata | ✅ | 🟡 | ✅ | ✅ | — |
| **Presence & Unread** |  |  |  |  |  |
| Online/offline presence | ✅ | ✅ | ✅ | ✅ | — |
| Last-seen timestamp | — | ✅ | 🟡 | — | — |
| Unread message counter | ✅ | ✅ | ✅ | ✅ | — |
| **Notifications** |  |  |  |  |  |
| Push notifications (FCM/APNS/Web Push) | ✅ | 🟡 | ✅ | ✅ | — |
| In-app notifications | ✅ | — | 🟡 | 🟡 | — |
| **AI / Bots** |  |  |  |  |  |
| RAG bot integration | — | — | — | — | — |
| AI auto-response triggers | — | — | — | — | 🟡 |
| Message translation | 🟡 | — | 🟡 | 🟡 | — |
| **UI** |  |  |  |  |  |
| Prebuilt chat component | ✅ | ✅ | ✅ | ✅ | ✅ |
| Theme customization | 🟡 | 🟡 | ✅ | ✅ | — |
| Dark mode | — | — | ✅ | — | — |
| Custom component overrides | ✅ | ✅ | ✅ | 🟡 | — |
| i18n / localization | — | — | 🟡 | — | 🟡 |
| **Platform** |  |  |  |  |  |
| Self-hosted server support | ✅ | ✅ | ✅ | ✅ | ✅ |
| Provision new app via SDK | — | — | — | — | — |
| Offline message cache | ✅ | 🟡 | ✅ | ✅ | — |

## Methodology

Statuses are based on direct code audit (file-level inspection, not just README claims). Each feature has a stable ID so it survives renames. "Partial" is used when a config / model / stub exists but the end-to-end flow isn't wired.

Next scheduled review: 2026-05-01 (monthly via CI)

## Updating this matrix

1. Edit `features.yaml` — the single source of truth.
2. Run `cd features/scripts && npm install && npm run render` to regenerate `README.md` and `views/by-category.md`.
3. Commit both the YAML and rendered output so diffs are visible in PRs.

