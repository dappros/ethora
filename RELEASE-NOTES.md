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

## Week 27 (Jun 29 – Jul 5, 2026) — Version 26.07 ships; web chat polish & message search

**Contributors:** Roman Leshchuh, Yurii T.
**Total commits:** ~17 across SDK/app repos + platform API & chat-server work | **Active repos:** 6

- **Milestone:** **Version 26.07 rolled out.** The June development cycle shipped at the start of July — package versions bumped across the ecosystem on July 1 (`@ethora/setup` 26.07, `@ethora/mcp-server` 26.07), and platform/server work advanced onto the 26.07 iteration. Development now continues on the next monthly iteration.

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 14 commits

A concentrated stability-and-polish pass on the web chat component, tightening host-configuration handling and squashing several interaction bugs:

- **Fixed:** In-app notifications no longer fire for your own messages, nor for the room you are actively viewing ([`04b0044`](https://github.com/dappros/ethora-chat-component/commit/04b0044), [`8810e9b`](https://github.com/dappros/ethora-chat-component/commit/8810e9b))
- **Fixed:** `config.disableNewChatButton` and `config.disableProfilesInteractions` are now honored — the new-chat button and the duplicate Settings / Manage Data room-menu options hide as intended (they were previously dead flags) ([`144e71b`](https://github.com/dappros/ethora-chat-component/commit/144e71b), [`774b102`](https://github.com/dappros/ethora-chat-component/commit/774b102))
- **Fixed:** QR-join reliability — the QR code now encodes the room localpart and builds its link from `config.qrUrl` or the current origin instead of a hardcoded default, so QR joins work outside production and no longer produce a malformed JID ([`aff1dc1`](https://github.com/dappros/ethora-chat-component/commit/aff1dc1), [`d7dd9d1`](https://github.com/dappros/ethora-chat-component/commit/d7dd9d1))
- **Fixed:** Deleting a room now leaves the MUC and clears the active room, so a public room no longer auto-rejoins ([`5d52595`](https://github.com/dappros/ethora-chat-component/commit/5d52595))
- **Fixed:** Guarded config-colour access in the Manage Data modal and room-state destructuring when leaving a room — removes two crash paths ([`fc1487c`](https://github.com/dappros/ethora-chat-component/commit/fc1487c), [`c3c63e5`](https://github.com/dappros/ethora-chat-component/commit/c3c63e5))
- **Improved:** Interaction and visual polish — the whole user row toggles selection (the checkbox was double-toggling), the room list is pinned to a fixed width with a reserved scrollbar gutter so it stops jumping on select, the date-separator pill uses a light chip, and the non-functional Unban placeholder is removed ([`2ab4c8b`](https://github.com/dappros/ethora-chat-component/commit/2ab4c8b), [`6612f8a`](https://github.com/dappros/ethora-chat-component/commit/6612f8a), [`31453df`](https://github.com/dappros/ethora-chat-component/commit/31453df), [`9bed4f2`](https://github.com/dappros/ethora-chat-component/commit/9bed4f2))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 1 commit

- **Improved:** Mobile styling refinements ([`988d005`](https://github.com/dappros/ethora-app-reactjs/commit/988d005))

### Developer tooling (`setup`, `mcp-server`)

- **Milestone:** `@ethora/setup` and `@ethora/mcp-server` bumped to 26.07 ([`81da293`](https://github.com/dappros/ethora-setup/commit/81da293), [`d287159`](https://github.com/dappros/ethora-mcp-server/commit/d287159))

### Platform API & AI Service

- **New:** Message search for end users — an app's own users can now search their message history through the API, with sortable, direction-aware results.

### Chat Server & Infrastructure

- **New:** Server-side message-tracking archive hook is now compiled into the chat-server image and wired through deployment, so message activity is durably recorded on the server.

---

## Week 26 (Jun 22–28, 2026) — Audio calls & durable reactions

**Contributors:** Roman Leshchuh
**Total commits:** 5 across SDK repos | **Active repos:** 1

A focused week on the React.js chat SDK: voice calling arrives as an opt-in alongside the existing video calls, and message reactions now survive a page reload by being rebuilt from chat history.

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 5 commits / 26.5.7 → 26.5.10

- **New:** Opt-in audio-only calls, rendered next to the video-call button and gated behind a new `config.videoCalls.enableAudioCalls` flag (off by default). Reuses the existing call signalling, so no server change is required ([`686530b`](https://github.com/dappros/ethora-chat-component/commit/686530b), [`1b6591d`](https://github.com/dappros/ethora-chat-component/commit/1b6591d))
- **Fixed:** Message reactions now persist across a refresh. They are archived as standalone history stanzas, so on reload they are extracted and reapplied to their target messages instead of being dropped; added test coverage for in-page merge, multi-reactor and clearing ([`33e127f`](https://github.com/dappros/ethora-chat-component/commit/33e127f))
- **Milestone:** Published 26.5.8 → 26.5.10 ([`8ead128`](https://github.com/dappros/ethora-chat-component/commit/8ead128), [`4421639`](https://github.com/dappros/ethora-chat-component/commit/4421639))

---

## Week 24–25 (Jun 11–21, 2026) — Theming, fonts & broadcasts

**Contributors:** Taras Filatov, Roman Leshchuh, Dmytro Berberov
**Total commits:** 39 across SDK/app repos + platform hardening | **Active repos:** 4

Customization week across the SDKs: host apps gained deep control over colours, fonts and typography on both web and React Native, the Android SDK learned to render system broadcasts cleanly, and the admin panel added archive/restore plus full app/agent export-import.

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 5 commits

Admin lifecycle & data portability (Phase 5b):

- **New:** Archive & restore for users, with a dedicated Archived users tab — admins can take accounts out of active rotation without deleting them ([`0817aa3`](https://github.com/dappros/ethora-app-reactjs/commit/0817aa3))
- **New:** Archive/restore plus JSON/ZIP export-import for Apps and Agents — back up or move an app or agent's full configuration ([`b521cf5`](https://github.com/dappros/ethora-app-reactjs/commit/b521cf5))
- **Improved:** UX polish across the lifecycle / archive / import controls ([`0c74af8`](https://github.com/dappros/ethora-app-reactjs/commit/0c74af8))
- **Improved:** New apps now opt in to a default "Main" chat on creation; tab counts shown comma-separated; chat rooms surfaced in the purge confirmation ([`b8b4b6d`](https://github.com/dappros/ethora-app-reactjs/commit/b8b4b6d), [`d39b6fc`](https://github.com/dappros/ethora-app-reactjs/commit/d39b6fc))

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 18 commits / → 26.5.21

Theming, fonts & platform stability:

- **New:** Colour configuration from the config file — icon colours, sender-name and avatar colours, and message-date colour are all drivable from config, with a worked colour-config example ([`babcfa2`](https://github.com/dappros/ethora-chat-component-rn/commit/babcfa2), [`c0b641f`](https://github.com/dappros/ethora-chat-component-rn/commit/c0b641f), [`a1acac9`](https://github.com/dappros/ethora-chat-component-rn/commit/a1acac9), [`5df2309`](https://github.com/dappros/ethora-chat-component-rn/commit/5df2309), [`d11d862`](https://github.com/dappros/ethora-chat-component-rn/commit/d11d862))
- **New:** Typography and input-layout configuration, configurable header height, and custom fonts on the Chat Profile title and attach-sheet hint ([`7856834`](https://github.com/dappros/ethora-chat-component-rn/commit/7856834), [`32eee85`](https://github.com/dappros/ethora-chat-component-rn/commit/32eee85), [`9c235db`](https://github.com/dappros/ethora-chat-component-rn/commit/9c235db), [`e8aad0c`](https://github.com/dappros/ethora-chat-component-rn/commit/e8aad0c))
- **Fixed:** XMPP reconnect handling ([`322c119`](https://github.com/dappros/ethora-chat-component-rn/commit/322c119)); iOS document picker; iOS fonts & UI polish ([`1ec1175`](https://github.com/dappros/ethora-chat-component-rn/commit/1ec1175), [`ef7f49f`](https://github.com/dappros/ethora-chat-component-rn/commit/ef7f49f), [`bbcdeb0`](https://github.com/dappros/ethora-chat-component-rn/commit/bbcdeb0))
- **Improved:** Pending-message watchdog timing tuned for slower networks ([`0742029`](https://github.com/dappros/ethora-chat-component-rn/commit/0742029))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 11 commits / → 26.5.7

Mirrors the RN theming work for web:

- **New:** Background colours for own/other message bubbles and the input bar (`config.colors.ownMessageBackground` / `otherMessageBackground` / `inputBackground`), plus additional host customizations and web placeholders ([`8448ea3`](https://github.com/dappros/ethora-chat-component/commit/8448ea3), [`7769c14`](https://github.com/dappros/ethora-chat-component/commit/7769c14), [`598ff69`](https://github.com/dappros/ethora-chat-component/commit/598ff69))
- **Improved:** `config.colors.icons` now drives the active send button, the new-chat button and other accent icon-buttons (not just chrome icons), and icon colours are locked against host CSS bleed ([`5b0f936`](https://github.com/dappros/ethora-chat-component/commit/5b0f936), [`15b12b5`](https://github.com/dappros/ethora-chat-component/commit/15b12b5))
- **Improved:** Custom avatar colours ([`d7ca8a9`](https://github.com/dappros/ethora-chat-component/commit/d7ca8a9), [`3bbc604`](https://github.com/dappros/ethora-chat-component/commit/3bbc604))
- **Fixed:** Unread counter no longer ramps up from `0` — the `loading` flag stays true while a room backfills history so the host can reveal the final count at once ([`7122abb`](https://github.com/dappros/ethora-chat-component/commit/7122abb), [`fb1a62a`](https://github.com/dappros/ethora-chat-component/commit/fb1a62a))

### Android SDK (`sdk-android`)
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | 5 commits

Broadcast / system-message rendering:

- **New:** System-message broadcasts now render as a centered banner ([`c8d671e`](https://github.com/dappros/ethora-sdk-android/commit/c8d671e))
- **Fixed:** MUC-SUB broadcasts with a bare `<item>` and any node are unwrapped correctly, and broadcasts no longer collapse onto each other ([`b2d152c`](https://github.com/dappros/ethora-sdk-android/commit/b2d152c), [`ab33ff5`](https://github.com/dappros/ethora-sdk-android/commit/ab33ff5), [`a97ffd2`](https://github.com/dappros/ethora-sdk-android/commit/a97ffd2))
- **Fixed:** Zero read-markers no longer permanently silence the unread badge ([`f02e8a6`](https://github.com/dappros/ethora-sdk-android/commit/f02e8a6))

### Platform & Infrastructure

- **Improved:** Server platform hardening and deployment-reliability improvements landed this week (details kept internal).

---

## Week 23–24 (Jun 1–10, 2026) — Version 26.06 ships

**Contributors:** Taras Filatov, r0man31, Dmytro Berberov, Roman Leshchuh
**Total commits:** ~70 across SDK/app repos + platform API | **Active repos:** 7

- **Milestone:** **Version 26.06 released** — the May development cycle shipped at the start of June. The 26.06 iteration was cut on May 26 and package versions rolled across the ecosystem on June 1 (`@ethora/setup` 26.06, `@ethora/mcp-server` 26.06, platform services). Development now continues on the next monthly iteration.

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 23 commits

Admin & onboarding overhaul week:

- **New:** Restructured admin navigation — top-level **Apps / Agents / Billing** sidebar, lifted page headers, branded app tile ([`5886546`](https://github.com/dappros/ethora-app-reactjs/commit/5886546), [`7689e38`](https://github.com/dappros/ethora-app-reactjs/commit/7689e38))
- **New:** Help & Support section in sidebar and admin panel, plus a universal admin footer linking to it ([`23735f8`](https://github.com/dappros/ethora-app-reactjs/commit/23735f8), [`23f19d5`](https://github.com/dappros/ethora-app-reactjs/commit/23f19d5))
- **New:** Native Book-a-Call form posting straight to the HubSpot Forms API, with first/last name + email prefilled from the current user and a consistent fallback across all three entry points ([`033218d`](https://github.com/dappros/ethora-app-reactjs/commit/033218d), [`d9cb8f9`](https://github.com/dappros/ethora-app-reactjs/commit/d9cb8f9), [`8baccbe`](https://github.com/dappros/ethora-app-reactjs/commit/8baccbe))
- **Improved:** `/app/settings` renamed to `/app/account` with a Status card, clearer Account header, Logout, and decluttered layout ([`17d4833`](https://github.com/dappros/ethora-app-reactjs/commit/17d4833), [`d1e2dad`](https://github.com/dappros/ethora-app-reactjs/commit/d1e2dad))
- **New:** Owner-aware Agents UI — visibility tab, public-creation warning, persona-card Edit link, public agents listed ([`4fed2ad`](https://github.com/dappros/ethora-app-reactjs/commit/4fed2ad), [`acced1f`](https://github.com/dappros/ethora-app-reactjs/commit/acced1f))
- **Improved:** Onboarding polish batch — titles, Account, Billing gate, Free plan labeling; lighter "Choose Your Path" modal ([`c0e944f`](https://github.com/dappros/ethora-app-reactjs/commit/c0e944f), [`72981aa`](https://github.com/dappros/ethora-app-reactjs/commit/72981aa))
- **Fixed:** Apps-list pagination, Enter submitting the new-app modal, Blocked Users tab styling ([`8a93d1a`](https://github.com/dappros/ethora-app-reactjs/commit/8a93d1a), [`30a0159`](https://github.com/dappros/ethora-app-reactjs/commit/30a0159))

### Platform API & AI Service

- **New:** "Lazy" agent lifecycle — agent bot instances now disconnect when idle and wake the moment a chat opens, with rate-limited cold-start spawning. Cuts steady-state XMPP connections dramatically on multi-tenant servers
- **New:** Superadmin agent moderation — cross-tenant agent list/get + visibility controls
- **New:** Platform Support Agent extended to apps created before auto-attach landed — every existing app now has a working agent too
- **Improved:** Agent RAG knowledge-base size reporting; private-visibility agents in list endpoints; accurate app totals in the apps API

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 26.5.10 → 26.5.11+

- **New:** Font customization hook (`useChatFonts`) — host apps can now ship custom fonts through the chat surface ([`359d5a5`](https://github.com/dappros/ethora-chat-component-rn/commit/359d5a5), [`217bd3c`](https://github.com/dappros/ethora-chat-component-rn/commit/217bd3c))
- **Improved:** Unread state split into persisted vs ephemeral visibility (`visibleRoomJID`) — removes the main source of tab-mounted single-room unread regressions; bare room ids normalized to full MUC JIDs before join paths
- **Fixed:** Android unread edge cases, keyboard handling, `MessageInteractions`, media preview modal, header `RoomMenu`, global store/registry residue ([`ea29cd8`](https://github.com/dappros/ethora-chat-component-rn/commit/ea29cd8), [`d684fba`](https://github.com/dappros/ethora-chat-component-rn/commit/d684fba), [`fe82389`](https://github.com/dappros/ethora-chat-component-rn/commit/fe82389))
- **New:** "New messages" delimiter; flag to resolve single-room-view unreads; reconnect + caching-system fixes ([`4d3bbc3`](https://github.com/dappros/ethora-chat-component-rn/commit/4d3bbc3), [`577e4f8`](https://github.com/dappros/ethora-chat-component-rn/commit/577e4f8))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component)

- **New:** Font customization (v1) mirroring the RN work ([`19a12e8`](https://github.com/dappros/ethora-chat-component/commit/19a12e8), [`55977db`](https://github.com/dappros/ethora-chat-component/commit/55977db))
- **Fixed:** Broadcast handling ([`0faf7b6`](https://github.com/dappros/ethora-chat-component/commit/0faf7b6))

### Android SDK (`sdk-android`)
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android)

- **New:** Font customization (v1) + font fixes — completing the cross-platform theming story started with v1.0.42's dark mode ([`b41f3f8`](https://github.com/dappros/ethora-sdk-android/commit/b41f3f8), [`69555d6`](https://github.com/dappros/ethora-sdk-android/commit/69555d6))

### Monorepo & Infrastructure

- **New:** DOAP file describing XMPP protocol support (with `schema:logo`) — machine-readable capability manifest for the XMPP ecosystem ([`ddc1ac87`](https://github.com/dappros/ethora/commit/ddc1ac87), [`ec5a31a4`](https://github.com/dappros/ethora/commit/ec5a31a4))
- **Infrastructure:** CI submodule-bump workflow now runs as a matrix across every active YY.MM iteration branch, not just the highest; `mcp-cli` submodule renamed to `mcp-server`
- **Infrastructure:** Server-side video processing enabled end to end (ffmpeg pipeline) and widget conversation history wired through the message archive on production installs

---

## Week 22 (May 25–31, 2026) — 26.06 iteration cut; AI Agents overhaul Phases B & C

**Contributors:** Taras Filatov, r0man31, Dmytro Berberov, Roman Leshchuh, Yurii Tsymborovych
**Total commits:** ~39 across SDK/app repos + ~25 platform API | **Active repos:** 6

- **Milestone:** 26.06 iteration cut from 2605 (May 26) — all submodules switched to track the new iteration.

### Platform API & AI Service

The AI Agents architecture overhaul (Phases B + C) landed this week:

- **New:** Every newly created App now auto-attaches the platform **Support Agent** — fresh signups get a working AI agent in their first chat without any setup
- **Improved:** The AI service now reads its bot inventory and room membership from the platform's canonical data models, retiring the legacy write-back path — one source of truth for agents
- **New:** Agent persona self-update — agents can evolve their own `SOUL.MD` persona document through function calling
- **Fixed:** Direct messages to agents get replies, joined rooms persist across restarts, agents respond to widget visitors without needing an explicit mention
- **Fixed:** New default rooms auto-subscribe the owner and existing users; avatar/name lookups resolve against the correct app in cross-app scenarios
- **API:** Message-context endpoint — fetch the surrounding messages for any search hit
- **Fixed:** Video file path handling in the files API

### Bots Framework (`bots`)
> [ethora-bots](https://github.com/dappros/ethora-bots)

- **Docs:** Multi-agent simulation demo — several AI agents with distinct personas and RAG knowledge bases debate fictional scenarios in a shared room, with reproducible recipe and transcripts ([`a79332f`](https://github.com/dappros/ethora-bots/commit/a79332f))

### Android SDK (`sdk-android`) — v1.0.42
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | [CHANGELOG](https://github.com/dappros/ethora-sdk-android/blob/main/CHANGELOG.md)

- **New:** Dark-mode colour overrides across the host-facing theme API — `primaryDark`/`secondaryDark`, independent header/input-bar/input-text tinting, per-mode bubble + background colours. All nullable, defaulting to the light value, so existing hosts pass through unchanged ([`443df44`](https://github.com/dappros/ethora-sdk-android/commit/443df44))
- **New:** `ChatConfig.forceDarkTheme` — pin the chat surface to light/dark regardless of system setting, for hosts that own their theme switcher
- **Improved:** Theme resolution centralised in a `CompositionLocal` (single hex parse at the top of the tree); hex parsing hardened against malformed values ([`05eadbc`](https://github.com/dappros/ethora-sdk-android/commit/05eadbc))

### React Native SDK (`sdk-reactnative`) — 26.5.3 → 26.5.9
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | [CHANGELOG](https://github.com/dappros/ethora-chat-component-rn/blob/main/CHANGELOG.md)

Integration-hardening sprint driven by a customer feedback round:

- **Improved:** Expo packages moved to `peerDependencies` (26.5.3); `emoji-mart` removed and the optional-modules list trimmed (26.5.5) — lighter installs, fewer version conflicts ([`db4d63d`](https://github.com/dappros/ethora-chat-component-rn/commit/db4d63d), [`deb8d87`](https://github.com/dappros/ethora-chat-component-rn/commit/deb8d87))
- **New:** Actionable error overlay with Retry (26.5.4) ([`39e2305`](https://github.com/dappros/ethora-chat-component-rn/commit/39e2305))
- **Fixed:** Reconnect re-joins MUC rooms (messages sent after a drop actually deliver), unread tracking in tab navigators, idle-auth loop, translated-message reconciliation (26.5.9) ([`a2cc01b`](https://github.com/dappros/ethora-chat-component-rn/commit/a2cc01b))
- **Fixed:** Outbound sends queued across XMPP (re)connect races; `expo-av` → `expo-video` migration; media preview/choose modals ([`53a7369`](https://github.com/dappros/ethora-chat-component-rn/commit/53a7369), [`a554b60`](https://github.com/dappros/ethora-chat-component-rn/commit/a554b60))
- **Testing:** Regression tests covering the full customer feedback round; build pipeline + CI ([`2e01eba`](https://github.com/dappros/ethora-chat-component-rn/commit/2e01eba), [`45fe891`](https://github.com/dappros/ethora-chat-component-rn/commit/45fe891))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component)

- **Fixed:** Group-chat member avatars — `getDataFromXml` accepts `photo`/`photoURL`/`profileImage`, profile modal enriches members from `usersSet` ([`2dd52cb`](https://github.com/dappros/ethora-chat-component/commit/2dd52cb), [`2cfb1e0`](https://github.com/dappros/ethora-chat-component/commit/2cfb1e0))
- **Fixed:** `notifyMembersChanged`, header rendering, websocket message spam ([`699728c`](https://github.com/dappros/ethora-chat-component/commit/699728c), [`f99fcdf`](https://github.com/dappros/ethora-chat-component/commit/f99fcdf))

### Sample Android (`sample-android`)
> [ethora-sample-android](https://github.com/dappros/ethora-sample-android)

- **Improved:** JitPack integration + custom colour demo wiring ([`853665f`](https://github.com/dappros/ethora-sample-android/commit/853665f))

---

## Week 20–21 (May 10–24, 2026) — React Native SDK relaunch + cross-platform test blitz

**Contributors:** Taras Filatov, r0man31, Dmytro Berberov, Roman Leshchuh, Yurii Tsymborovych
**Total commits:** ~194 across SDK/app repos (busiest fortnight of the quarter) | **Active repos:** 9

### React Native SDK (`sdk-reactnative`) — the relaunch
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | [CHANGELOG](https://github.com/dappros/ethora-chat-component-rn/blob/main/CHANGELOG.md)

~110 commits transformed the RN component into a true drop-in library:

- **New:** Ships as a drop-in npm library with a metro shim helper for consumers ([`11b6ac6`](https://github.com/dappros/ethora-chat-component-rn/commit/11b6ac6))
- **New:** Web-parity flows ported — `initBeforeLoad`, QoS, notifications, persistence; built-in `RoomList` in `ChatWrapper` mirroring the web UI ([`15e6da0`](https://github.com/dappros/ethora-chat-component-rn/commit/15e6da0), [`a5c992f`](https://github.com/dappros/ethora-chat-component-rn/commit/a5c992f))
- **New:** Optimistic pending message bubble flipping to delivered on echo; single-room toggle; email+appToken login mode; 3-tab developer testbed (Setup / Chat / Logs) ([`b1204d7`](https://github.com/dappros/ethora-chat-component-rn/commit/b1204d7), [`0b5d8d6`](https://github.com/dappros/ethora-chat-component-rn/commit/0b5d8d6))
- **Improved:** Testbed migrated to Expo SDK 54 / RN 0.81.5 / React 19.1; eslint wired and cleaned (357 errors → 0); relicensed to MIT ([`b0cc50f`](https://github.com/dappros/ethora-chat-component-rn/commit/b0cc50f), [`815df4c`](https://github.com/dappros/ethora-chat-component-rn/commit/815df4c), [`12bb180`](https://github.com/dappros/ethora-chat-component-rn/commit/12bb180))
- **Fixed:** Spam-tap send merge (two compounding bugs), full logout teardown contract, chat cache limits + unread counter, typing self-detect ([`40d91be`](https://github.com/dappros/ethora-chat-component-rn/commit/40d91be), [`21c28e0`](https://github.com/dappros/ethora-chat-component-rn/commit/21c28e0))
- **Testing:** Massive unit-test layer landed May 16 (one-day blitz: reducers, XMPP builders, hooks, middleware, L2 component layer — ~580 Jest tests by month end); Maestro e2e flows + testIDs ([`79fc0fa`](https://github.com/dappros/ethora-chat-component-rn/commit/79fc0fa))
- **Refactored:** Product-code-policy sweep — placeholder defaults, no tracked credentials, tenant-specific notes scrubbed ([`0577ca9`](https://github.com/dappros/ethora-chat-component-rn/commit/0577ca9))

### Android SDK (`sdk-android`) — v1.0.34 → v1.0.41
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | [CHANGELOG](https://github.com/dappros/ethora-sdk-android/blob/main/CHANGELOG.md)

The unread-counting system was rebuilt end to end:

- **New:** `ChatService.lifecycle.onChatPaused/onChatResumed` host API + Compose-native auto-detection of "actively viewing" (window position + focus + lifecycle state) ([`e1833b4`](https://github.com/dappros/ethora-sdk-android/commit/e1833b4))
- **New:** `EthoraChatBootstrap.recomputeUnread()` safety net + `RoomStoreUnreadDbg` verbose diagnostics ([`1cf3a6a`](https://github.com/dappros/ethora-sdk-android/commit/1cf3a6a))
- **Fixed:** Cross-device read-marker sync against ejabberd `mod_private` (single-quote XML attributes), unread listener pinned at `false` on fresh installs, room/user JID collision misclassifying incoming messages as own ([`6102996`](https://github.com/dappros/ethora-sdk-android/commit/6102996))
- **Fixed:** Server-initiated stream termination (login-elsewhere `conflict`) now triggers immediate reconnect instead of a ~13-minute dead socket ([`5600eee`](https://github.com/dappros/ethora-sdk-android/commit/5600eee))
- **Fixed:** MUC joins on stricter `mod_muc` configs — device-resource suffix dropped from join nickname ([`8c64708`](https://github.com/dappros/ethora-sdk-android/commit/8c64708))
- **Fixed:** Rapid-fire sends land in order with XEP-0359 `archiveId` reconciliation; edit/delete resolve the right bubble after bursts; scroll/pagination edge cases ([`0ef64bc`](https://github.com/dappros/ethora-sdk-android/commit/0ef64bc))
- **New:** Apache License 2.0 added ([`af5cae0`](https://github.com/dappros/ethora-sdk-android/commit/af5cae0))
- **Testing:** chat-core unit-test layer + Compose UI tests seeded and consolidated ([`9824c1a`](https://github.com/dappros/ethora-sdk-android/commit/9824c1a))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component)

- **Fixed:** Unread counter stabilised during init via per-room baseline; unread-on-unmount; connecting state; room member counting ([`fed8714`](https://github.com/dappros/ethora-chat-component/commit/fed8714), [`e94791d`](https://github.com/dappros/ethora-chat-component/commit/e94791d), [`6427b36`](https://github.com/dappros/ethora-chat-component/commit/6427b36))
- **Fixed:** Auth flow, `users/my` handling, serialization, system-message + chat-box widths ([`53a6e45`](https://github.com/dappros/ethora-chat-component/commit/53a6e45), [`587b93f`](https://github.com/dappros/ethora-chat-component/commit/587b93f))
- **Testing:** Vitest + React Testing Library scaffold with cross-platform `data-testid` pattern; test files excluded from publish build ([`ce09594`](https://github.com/dappros/ethora-chat-component/commit/ce09594), [`9ffd382`](https://github.com/dappros/ethora-chat-component/commit/9ffd382))

### iOS SDK (`sdk-swift`)
> [ethora-sdk-swift](https://github.com/dappros/ethora-sdk-swift)

- **Fixed:** Delete message ([`ff6f244`](https://github.com/dappros/ethora-sdk-swift/commit/ff6f244))
- **Testing:** Core L1 tests (stores, parser, cache, hooks) + L2 ViewModel tests mirroring the Android coverage; accessibility IDs seeded for E2E ([`d8125f0`](https://github.com/dappros/ethora-sdk-swift/commit/d8125f0), [`764d556`](https://github.com/dappros/ethora-sdk-swift/commit/764d556))

### Web App (`app-reactjs`)

- **New:** Video calls added to the web app (May 21) ([`918c9b8`](https://github.com/dappros/ethora-app-reactjs/commit/918c9b8))

### Platform API & Chat Server

- **API:** `GET /v2/apps/:appId/messages/search` — full-text message search with visibility filtering
- **New:** New server-side message-archiving mode on the chat server — the foundation under message search and widget conversation history
- **Fixed:** User-identity normalisation (duplicate app-prefix collapse) with migration tooling for existing deployments

### Setup CLI (`@ethora/setup`) — first npm publish
> [ethora-setup](https://github.com/dappros/ethora-setup) | [npm](https://www.npmjs.com/package/@ethora/setup)

- **Milestone:** First public npm publish (26.5.0), then 26.5.1 + 26.5.2 ([`ccf7669`](https://github.com/dappros/ethora-setup/commit/ccf7669))
- **New:** Android environment pre-flight (JAVA_HOME / ANDROID_HOME / emulator); auto `npm install` after cloning JS samples; RN testbed opens pre-filled ([`27943c3`](https://github.com/dappros/ethora-setup/commit/27943c3), [`ca18250`](https://github.com/dappros/ethora-setup/commit/ca18250))
- **Improved:** XMPP host derived from the API URL; base app domain defaults ([`6b2eb9b`](https://github.com/dappros/ethora-setup/commit/6b2eb9b))

### MCP Server (`mcp-cli` → `mcp-server`)
> [ethora-mcp-server](https://github.com/dappros/ethora-mcp-server) | [npm](https://www.npmjs.com/package/@ethora/mcp-server)

- **Milestone:** Repo renamed to `ethora-mcp-server`; 26.5.2 + 26.5.3 published to npm and the official MCP Registry ([`b38add7`](https://github.com/dappros/ethora-mcp-server/commit/b38add7), [`35b1c81`](https://github.com/dappros/ethora-mcp-server/commit/35b1c81))
- **Improved:** Claude-ecosystem efficiency pass — all 80 tools annotated (`readOnly`/`destructive`/`idempotent`), descriptions trimmed ~40%, alias tools env-gated, `tools/list` footprint cut ~25%
- **New:** One-click Cursor install, Cline quickstart with verified agent-loop transcript, Smithery + Open Plugin manifests

### Cross-platform testing initiative (all repos)

A unified testing layer now spans all four client platforms with shared test-id conventions: JUnit + Compose tests (Android), XCTest L1/L2 (iOS), Vitest + RTL (web component), Playwright (web app), Maestro E2E (iOS + RN). Each repo's README gained a 4-platform testing overview.

---

## Week 18–19 (Apr 23 – May 9, 2026) — AI website widget + Agents Phase 1

**Contributors:** Taras Filatov, Dmytro Berberov, Roman Leshchuh, r0man31, Yurii Tsymborovych
**Total commits:** ~139 across SDK/app repos + ~35 platform API | **Active repos:** 8

### Platform API & AI Service

The embeddable AI website widget got a real backend:

- **API:** `POST /v2/widget/sessions` — provisions a website visitor with a persistent chat room and invites the App's active Agent automatically
- **API:** `GET /v2/apps/:appId/widget/conversations` — admin view over every widget conversation
- **New:** Visitor metadata captured + surfaced — country, OS, browser, user agent
- **API:** Archive-backed chat history endpoints — read a room's full server-side message history, plus a cleanup/delete endpoint
- **New:** The widget bot is the App's active Agent (persona included in session responses), replacing the earlier fixed-bot wiring
- **New:** Tenant-owner session powering the web app's App Switcher, with self-healing provisioning and clear error surfacing
- **Fixed:** Broadcast messages stamp sender identity so chats render the configured name
- **Improved:** B2B user-management endpoints accept more identity formats; apps list page size raised to 200

### AI Chat Widget (`ai-chat-widget`)
> [ethora-ai-chat-widget](https://github.com/dappros/ethora-ai-chat-widget)

The embeddable website widget moved to its production architecture:

- **New:** Switched to the persistent-room (MUC) variant — the widget provisions a session, joins the visitor's room, and chats in group mode, so conversations survive page reloads ([`ab9ad60`](https://github.com/dappros/ethora-ai-chat-widget/commit/ab9ad60))
- **New:** Active Agent's name + photo on bot bubbles; persona + `data-*` override params consumed from the embed snippet ([`faa3ed0`](https://github.com/dappros/ethora-ai-chat-widget/commit/faa3ed0), [`e1775da`](https://github.com/dappros/ethora-ai-chat-widget/commit/e1775da))
- **Fixed:** Production WebSocket endpoint resolution, optimistic-message dedupe, input gated on room join, version baked into the bundle ([`fa5fd8b`](https://github.com/dappros/ethora-ai-chat-widget/commit/fa5fd8b), [`752a58e`](https://github.com/dappros/ethora-ai-chat-widget/commit/752a58e))

### Chat Server & Infrastructure

- **Improved:** Chat server upgraded to ejabberd 26.04 on OTP 28 across managed installs

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 43 commits

The AI Agents admin suite took shape:

- **New:** Widget Conversations panel — message history modal, CSV export (selected + full list), bulk delete with confirm, visitor metadata popover ([`1fe1338`](https://github.com/dappros/ethora-app-reactjs/commit/1fe1338), [`178b814`](https://github.com/dappros/ethora-app-reactjs/commit/178b814), [`ca28cba`](https://github.com/dappros/ethora-app-reactjs/commit/ca28cba), [`87430ca`](https://github.com/dappros/ethora-app-reactjs/commit/87430ca))
- **New:** Embed snippet emits `data-app-id` for the MUC widget; persona-card refresh with snippet redesign ([`06cce86`](https://github.com/dappros/ethora-app-reactjs/commit/06cce86), [`12d836a`](https://github.com/dappros/ethora-app-reactjs/commit/12d836a))
- **New:** Agents panel — avatar upload, chat-row bot chips with Remove, live Start/Stop refresh, Test message button, per-room Test + Leave actions ([`9e2db4b`](https://github.com/dappros/ethora-app-reactjs/commit/9e2db4b), [`c288a62`](https://github.com/dappros/ethora-app-reactjs/commit/c288a62), [`e9d7ec1`](https://github.com/dappros/ethora-app-reactjs/commit/e9d7ec1))
- **New:** App Switcher in the Chats page — tenant owners switch XMPP context between their apps ([`592f0b6`](https://github.com/dappros/ethora-app-reactjs/commit/592f0b6), [`0666515`](https://github.com/dappros/ethora-app-reactjs/commit/0666515))
- **New:** Default broadcast sender + per-broadcast override in app settings ([`e757265`](https://github.com/dappros/ethora-app-reactjs/commit/e757265))
- **Improved:** AI surfaces greyed out when AI features are disabled; pagination for non-superadmin apps lists ([`746535d`](https://github.com/dappros/ethora-app-reactjs/commit/746535d), [`56801d4`](https://github.com/dappros/ethora-app-reactjs/commit/56801d4))
- **Testing:** Diagnostics harness for live remote-environment debugging — widget E2E + history probes ([`48654a4`](https://github.com/dappros/ethora-app-reactjs/commit/48654a4))

### iOS SDK (`sdk-swift`)
> [ethora-sdk-swift](https://github.com/dappros/ethora-sdk-swift)

Reliability sprint:

- **Fixed:** Reconnection errors, background reconnect, message retry after disconnect ([`af71763`](https://github.com/dappros/ethora-sdk-swift/commit/af71763), [`9669cd5`](https://github.com/dappros/ethora-sdk-swift/commit/9669cd5))
- **New:** Real-time room create/delete, leave chat, unread tracking from outside the project, multi-message selection, message caching ([`b1910ea`](https://github.com/dappros/ethora-sdk-swift/commit/b1910ea), [`b6dc10d`](https://github.com/dappros/ethora-sdk-swift/commit/b6dc10d), [`a27b3a2`](https://github.com/dappros/ethora-sdk-swift/commit/a27b3a2))
- **Improved:** Media preview reworked; checkmark colours; logout documented; source comments translated to English ([`bebf3c8`](https://github.com/dappros/ethora-sdk-swift/commit/bebf3c8), [`c2d1f2d`](https://github.com/dappros/ethora-sdk-swift/commit/c2d1f2d))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component)

- **Fixed:** Avatar resolution pipeline — `photo`/`photoURL`/`profileImage` attributes accepted; live messages enriched through full author resolution; "Deleted User" un-sticks once identity is available ([`2244f87`](https://github.com/dappros/ethora-chat-component/commit/2244f87), [`371e674`](https://github.com/dappros/ethora-chat-component/commit/371e674), [`345e246`](https://github.com/dappros/ethora-chat-component/commit/345e246))
- **Fixed:** MUC presence + history restored on fresh private-chat create; rooms slice cleared on logout (cross-app leak); JWT login; multi-message support ([`77f76ae`](https://github.com/dappros/ethora-chat-component/commit/77f76ae), [`573c00a`](https://github.com/dappros/ethora-chat-component/commit/573c00a), [`eb1a9a2`](https://github.com/dappros/ethora-chat-component/commit/eb1a9a2))
- **Refactored:** XMPP session lifecycle unified; presence timeouts standardised ([`7cf1ad6`](https://github.com/dappros/ethora-chat-component/commit/7cf1ad6))

### Android SDK (`sdk-android`) — v1.0.29 → v1.0.33
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | [CHANGELOG](https://github.com/dappros/ethora-sdk-android/blob/main/CHANGELOG.md)

- **New:** In-bubble timestamp + sent indicator on message bubbles ([CHANGELOG 26.04.30](https://github.com/dappros/ethora-sdk-android/blob/main/CHANGELOG.md))
- **New:** `EthoraChatSdk.initialize(context)` / `shutdown()` — one-shot idempotent process-level lifecycle for SDK persistence
- **Fixed:** Duplicate DataStore instances on Activity recreation; bootstrap socket preserved when the Chat composable unmounts (background unread listeners keep working); media bubbles fall back to a file icon when the preview URL fails

### Setup CLI (`@ethora/setup`)
> [ethora-setup](https://github.com/dappros/ethora-setup)

- **Fixed:** React.js flow writes runtime keys to gitignored `.env.local` (including `VITE_APP_TOKEN`), dev-server command corrected to `npm run dev` ([`7976082`](https://github.com/dappros/ethora-setup/commit/7976082), [`8199319`](https://github.com/dappros/ethora-setup/commit/8199319))
- **New:** Android pre-flight check for the required Android Platform SDK ([`33c2610`](https://github.com/dappros/ethora-setup/commit/33c2610))

### Sample Android (`sample-android`)
> [ethora-sample-android](https://github.com/dappros/ethora-sample-android)

- **Improved:** Gradle 9.4.1 upgrade, early SDK bootstrap in `Application`, git SHA + branch build stamping, `.env` policy compliance ([`40b89fc`](https://github.com/dappros/ethora-sample-android/commit/40b89fc), [`8255c43`](https://github.com/dappros/ethora-sample-android/commit/8255c43))

---

## Week 17 (Apr 16–22, 2026)

### Android SDK (`sdk-android`)
> [ethora-sdk-android](https://github.com/dappros/ethora-sdk-android) | [CHANGELOG](https://github.com/dappros/ethora-sdk-android/blob/main/CHANGELOG.md)

Major feature release (Apr 21):

- **New:** URL link previews in messages — new `UrlPreviewStore` renders link cards inline ([`2de87c6`](https://github.com/dappros/ethora-sdk-android/commit/2de87c6))
- **New:** Connection state monitoring — `ConnectionStore` + `ConnectionHook` expose live connection status to host apps
- **New:** Event dispatcher — `ChatEvents` + `ChatEventDispatcher` let host apps subscribe to chat lifecycle events
- **Docs:** Feature documentation + Android ↔ iOS platform comparison + restructured README ([`35909da`](https://github.com/dappros/ethora-sdk-android/commit/35909da))
- **Refactored:** Sample app extracted into [`ethora-sample-android`](https://github.com/dappros/ethora-sample-android) — SDK repo no longer tracks `sample-chat-app/` ([`86fd0a2`](https://github.com/dappros/ethora-sdk-android/commit/86fd0a2))
- **Fixed:** Message loader + XMPP websocket edge cases, `ChatRoomView` rendering ([`9998279`](https://github.com/dappros/ethora-sdk-android/commit/9998279))

### iOS SDK (`sdk-swift`)
> [ethora-sdk-swift](https://github.com/dappros/ethora-sdk-swift) | [CHANGELOG](https://github.com/dappros/ethora-sdk-swift/blob/main/CHANGELOG.md)

- **New:** `UnreadStateBridge` hook for badge propagation to host apps ([`83208b9`](https://github.com/dappros/ethora-sdk-swift/commit/83208b9))
- **Testing:** `UnreadStateBridgeTests` added ([`83208b9`](https://github.com/dappros/ethora-sdk-swift/commit/83208b9))
- **Docs:** Full README + INSTALLATION overhaul, new `features.md` ([`0e1605f`](https://github.com/dappros/ethora-sdk-swift/commit/0e1605f))
- **Refactored:** API surface alignment across `AppConfig`, `AuthAPI`, `RoomsAPI`, `XMPPClient`, `MessageParser`, `ChatRoomViewModel`, `RoomListView` ([`146c52f`](https://github.com/dappros/ethora-sdk-swift/commit/146c52f))
- **Refactored:** `Examples/` folder removed — playground moving to dedicated sample repo ([`97d54f9`](https://github.com/dappros/ethora-sdk-swift/commit/97d54f9))

### Sample Android (`sample-android`)
> [ethora-sample-android](https://github.com/dappros/ethora-sample-android) | [CHANGELOG](https://github.com/dappros/ethora-sample-android/blob/main/CHANGELOG.md)

- **Refactored:** Package namespace `com.ethora.sample` → `com.ethora.samplechatapp` ([`74d0521`](https://github.com/dappros/ethora-sample-android/commit/74d0521))
- **New:** Firebase push notifications wired — `EthoraApplication`, `EthoraFirebaseMessagingService`, AndroidManifest entries
- **New:** `MainActivity` rewritten as full playground-style sample (881 lines)
- **API:** `buildConfigField` schema updated — added `ETHORA_USER_JWT` + `ETHORA_ROOM_JID`, removed `ETHORA_APP_TOKEN`

### Setup CLI (`@ethora/setup`) — v26.04
> [ethora-setup](https://github.com/dappros/ethora-setup) | [CHANGELOG](https://github.com/dappros/ethora-setup/blob/main/CHANGELOG.md)

- **Improved:** Server presets switched to canonical `chat.ethora.com` defaults (Cloud Production + Cloud QA) ([`5c83f05`](https://github.com/dappros/ethora-setup/commit/5c83f05))
- **Fixed:** `MainActivity.kt` patcher generalised to accept any host — was silently no-op'ing after SDK templates moved off `ethoradev.com` ([`35d47ef`](https://github.com/dappros/ethora-setup/commit/35d47ef))

---

## Week 15–16 (Apr 2–15, 2026)

### iOS SDK (`sdk-swift`)

- **New:** SDK playground (`Examples/SDKPlayground/`) — Setup / Chat / Logs tabs for exercising SDK features ([`53a8839`](https://github.com/dappros/ethora-sdk-swift/commit/53a8839), [`c4ac7d0`](https://github.com/dappros/ethora-sdk-swift/commit/c4ac7d0))
- **New:** Single-chat mode — `ChatWrapperView` + `UseChatWrapperInit` hook ([`7122809`](https://github.com/dappros/ethora-sdk-swift/commit/7122809))
- **Fixed:** Push notifications rewrite completed — new `PushNotificationManager`, `PushSubscriptionService`, `PendingNotificationJidStore`, `WalletUsername` utility ([`0b44384`](https://github.com/dappros/ethora-sdk-swift/commit/0b44384))
- **Refactored:** `XMPPClient+Connection/Handlers/Pings/Stream.swift` and `ChatRoomViewModel+Actions/History/Messages/Observers/XMPP.swift` partials consolidated into single files
- **Improved:** `MessageLoaderQueue` reliability ([`0150fb2`](https://github.com/dappros/ethora-sdk-swift/commit/0150fb2))

### Android SDK (`sdk-android`)

- **New:** SDK playground in sample-chat-app — interactive `MainActivity` exercising SDK features ([`fd539c8`](https://github.com/dappros/ethora-sdk-android/commit/fd539c8))
- **Improved:** `XMPPClient` hardened (213-line update), `XMPPSettings` extended, `IncrementalHistoryLoader` / `MessageLoader` reliability ([`97ad445`](https://github.com/dappros/ethora-sdk-android/commit/97ad445))
- **Docs:** Push notification setup instructions added to README; `google-services.json` no longer committed — developers supply their own Firebase config ([`670c337`](https://github.com/dappros/ethora-sdk-android/commit/670c337))

---

## Week 13–14 (Mar 19 – Apr 1, 2026)

### Android SDK (`sdk-android`)

- **New:** Firebase push notifications wired through sample app — new `EthoraApplication`, `EthoraFirebaseMessagingService`, AndroidManifest entries ([`925b9d8`](https://github.com/dappros/ethora-sdk-android/commit/925b9d8))
- **Improved:** `PushAPI` + `PushNotificationManager` updated for new registration flow

### iOS SDK (`sdk-swift`)

- **New:** `sendGlobalPresence` operation ([`d15067b`](https://github.com/dappros/ethora-sdk-swift/commit/d15067b))
- **Fixed:** XMPP nickname handling ([`16eacdf`](https://github.com/dappros/ethora-sdk-swift/commit/16eacdf))
- **Fixed:** View polish batch — message rendering, footer button, open-chat view, scroll, image viewing ([`64548b1`](https://github.com/dappros/ethora-sdk-swift/commit/64548b1), [`0f3c2eb`](https://github.com/dappros/ethora-sdk-swift/commit/0f3c2eb), [`9d79d67`](https://github.com/dappros/ethora-sdk-swift/commit/9d79d67), [`6bd509e`](https://github.com/dappros/ethora-sdk-swift/commit/6bd509e), [`b1b9488`](https://github.com/dappros/ethora-sdk-swift/commit/b1b9488))
- **Improved:** Debug logging + docs / example app updates ([`a874a22`](https://github.com/dappros/ethora-sdk-swift/commit/a874a22))

### Sample Android (`sample-android`)

- **New:** Initial sample app — Ethora Android SDK quickstart ([`b6773fc`](https://github.com/dappros/ethora-sample-android/commit/b6773fc))
- **New:** Monthly release workflow publishing `vYY.MM` tags ([`e993c24`](https://github.com/dappros/ethora-sample-android/commit/e993c24))

### Setup CLI (`@ethora/setup`)

- **New:** React.js SDK support — patches `config.ts` directly when a React.js clone is detected (instead of writing a separate `.env.ethora`) ([`a912550`](https://github.com/dappros/ethora-setup/commit/a912550))

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

