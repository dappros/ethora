# Ethora SDK — Release Notes

> Auto-generated weekly by [@ethora/setup](https://github.com/dappros/ethora-setup) pipeline. Each section covers changes across the SDK ecosystem. For detailed commit history, see individual repo links.

---

## Week 12 (Mar 10–16, 2026)

**Contributors:** Taras Filatov, r0man31
**Total commits:** 17 | **Active repos:** 5 of 12

### Setup CLI (`@ethora/setup`) — NEW
> [ethora-setup](https://github.com/dappros/ethora-setup) | 7 commits

New interactive CLI tool for developer onboarding — register, create apps, and generate SDK config files without leaving the terminal.

- **New:** `npx @ethora/setup` — full onboarding flow: account registration, app creation, credential generation ([`2c7c89a`](https://github.com/dappros/ethora-setup/commit/2c7c89a))
- **New:** Server presets — Cloud QA (latest, asterotoken.com) and Cloud Production (ethora.com) ([`97731f3`](https://github.com/dappros/ethora-setup/commit/97731f3))
- **New:** SDK clone option — setup can clone the target SDK repo and write config directly into it ([`f86a6d1`](https://github.com/dappros/ethora-setup/commit/f86a6d1))
- **New:** Android SDK patching — automatically patches `AppConfig.kt` and `MainActivity.kt` with your credentials instead of generating unused files ([`f2ca5fe`](https://github.com/dappros/ethora-setup/commit/f2ca5fe))
- **Improved:** Profile name now explains its purpose; web app URL uses correct server domain ([`f86a6d1`](https://github.com/dappros/ethora-setup/commit/f86a6d1))
- **Fixed:** Clone into existing directory now checks for `.git` before skipping ([`49fcb2e`](https://github.com/dappros/ethora-setup/commit/49fcb2e))
- **API:** Switched to v2 signup/login routes (password set directly, no email confirmation step) ([`963bc59`](https://github.com/dappros/ethora-setup/commit/963bc59))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) `dev` branch | 5 commits

- **Restored:** Chat broadcast tools in admin app settings panel ([`ab5ab2c`](https://github.com/dappros/ethora-app-reactjs/commit/ab5ab2c))
- **Fixed:** Mobile push notification settings and base app UX settings were missing — now restored ([`05acb37`](https://github.com/dappros/ethora-app-reactjs/commit/05acb37))
- **Testing:** Added Playwright smoke test coverage ([`37af18c`](https://github.com/dappros/ethora-app-reactjs/commit/37af18c))
- **Docs:** Refreshed frontend README ([`393e057`](https://github.com/dappros/ethora-app-reactjs/commit/393e057))

### Android SDK (`sdk-android`)
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | 1 commit this week

- **Fixed:** Bugfix release ([`dbc45e2`](https://github.com/dappros/ethora-sdk-android/commit/dbc45e2))

### Monorepo Structure
> [ethora](https://github.com/dappros/ethora) | 3 commits

- **New:** Reorganized as SDK monorepo with 11 git submodules (flat `sdk-*` / `app-*` prefix structure)
- **New:** Ecosystem navigation table in README linking all SDKs, tools, and sample apps
- **New:** `setup/` submodule added for `@ethora/setup` CLI

---

## Week 11 (Mar 3–9, 2026)

### Playground
> [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground) | 2 commits

- **Fixed:** Environment variable loading fix ([`34bad25`](https://github.com/dappros/ethora-sdk-playground/commit/34bad25))

### Backend Integration
> [ethora-sdk-backend-integration](https://github.com/dappros/ethora-sdk-backend-integration) | 2 commits

- **Updated:** New logic handling and documentation updates ([`d6af11b`](https://github.com/dappros/ethora-sdk-backend-integration/commit/d6af11b))
- **Updated:** Version bump ([`b2e1f0f`](https://github.com/dappros/ethora-sdk-backend-integration/commit/b2e1f0f))

---

## Week 9–10 (Feb 18 – Mar 2, 2026)

### Android SDK (`sdk-android`)
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | 2 commits

- **New:** Push notifications support added ([`da0cac6`](https://github.com/dappros/ethora-sdk-android/commit/da0cac6))
- **Improved:** Code split for better modularity ([`da0cac6`](https://github.com/dappros/ethora-sdk-android/commit/da0cac6))
- **Docs:** Updated documentation ([`762902a`](https://github.com/dappros/ethora-sdk-android/commit/762902a))

### iOS SDK (`sdk-swift`)
> [ethora-sdk-swift](https://github.com/dappros/ethora-sdk-swift) | 1 commit

- **New:** Push notifications support added, code split ([`8b20dcd`](https://github.com/dappros/ethora-sdk-swift/commit/8b20dcd))

### Playground
> [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground) | 5 commits

- **New:** Direct HTTP API testing panel for debugging and exploring endpoints ([`dab8ee9`](https://github.com/dappros/ethora-sdk-playground/commit/dab8ee9))
- **New:** Chat metadata update via direct HTTP request ([`fa71264`](https://github.com/dappros/ethora-sdk-playground/commit/fa71264))
- **New:** Integration guide added ([`b13f812`](https://github.com/dappros/ethora-sdk-playground/commit/b13f812))
- **Refactored:** SDK type definitions — new `ChatRepository` interface, aligned method parameters with API request/response structures ([`9d75900`](https://github.com/dappros/ethora-sdk-playground/commit/9d75900))
- **Improved:** Environment variable loading with updated defaults and documentation ([`4c30db5`](https://github.com/dappros/ethora-sdk-playground/commit/4c30db5))

---

## Legend

| Tag | Meaning |
|-----|---------|
| **New** | Brand new feature or component |
| **Improved** | Enhancement to existing functionality |
| **Fixed** | Bug fix |
| **Refactored** | Code restructuring (no user-facing change) |
| **Docs** | Documentation updates |
| **Testing** | Test coverage additions |
| **API** | Backend/API-facing change |

---

*Last updated: 2026-03-18 | Generated by Ethora BDSM release-notes pipeline*
