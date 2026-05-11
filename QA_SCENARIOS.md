# QA Scenarios — Cross-Platform SDK Test Catalog

> Reference catalog of test scenarios across the Android, iOS, and web SDKs.
> Each cluster lists the recurring failure modes observed in the field
> (anonymized), the recommended test layer, and the current automated
> coverage status. Use this as the input to test-planning decisions and as
> a cross-platform parity reference.

## Test layers

| Layer | Where | Cost per test | Catches |
|-------|-------|---------------|---------|
| L1 — Hermetic unit | JVM / Swift unit test, fakes for backend | seconds | Pure logic: reducers, parsers, state machines, formatters |
| L2 — Component UI | Compose UI / SwiftUI / Vitest + RTL | seconds–minutes | Single-component rendering + interaction |
| L3 — E2E synthetic | Maestro / Playwright against seeded test app | minutes | Multi-screen flows, real network, cross-platform parity |
| L4 — Manual | Tester on a real device | hours | UX feel, IME quirks, real-device-only bugs |

General rule: **push every test as far down the pyramid as it will go.** A
pure reducer behaviour that can be expressed as L1 should never live as L2
or L3. L3 is reserved for what L1 + L2 genuinely cannot reach — real
network, real OS surfaces, cross-platform parity, second device.

## Scenario clusters

### A. Multi-room state machine

**Failure modes:**
- After opening Room A successfully, switching to Room B leaves the UI on
  "Connecting" indefinitely.
- After re-login, only the most recently opened room loads cleanly;
  previously opened rooms then stick on "Connecting".
- Some rooms permanently spin on history fetch while others in the same
  session load fine.
- Room header shows "0 users" despite the room having members.
- Empty-state placeholder ("Start a conversation") renders in place of a
  previously-working room after a server-side data shape change.

**Why high priority:** all symptoms point at the same underlying class —
per-room state not isolated from session-level state, and presence /
history responses not surviving room switches cleanly. Fix-once,
test-everywhere territory.

**Recommended tests:**
- L1 `RoomStoreTest`: open A → open B → switch back to A. Assert per-room
  connection state survives the switch, current-room pointer transfers, no
  cross-contamination of pending presence callbacks.
- L1 `XMPPPresenceCacheTest`: presence-response markers persist across room
  changes; no stale `joining=true` flag leaks after switch.
- L1 `RoomMembershipTest`: member count derived from roster matches
  `members.size`, not a stale field — catches the "0 users when populated"
  failure mode.
- L2 Compose / SwiftUI `ChatRoomViewTest`: prop change to room JID re-keys
  the tree cleanly. Scroll state, draft, and unread reset without holding
  refs to the previous room.
- L3 Maestro: open A → open B → back to A flow, repeated 3× under one
  session; assert no "Connecting" loop on the third re-entry.

**Coverage status:** None hermetic today. Highest-priority cluster.

### B. Send + media orchestration

**Failure modes:**
- Text + image sent in the same compose action → image arrives, text
  silently dropped.
- File upload completes but doesn't commit as a chat message until the
  user performs another action (sends a second message, leaves room,
  etc.).
- Send orchestrator emits inconsistent statuses ("sending" vs immediate
  error) for messages that ultimately deliver successfully.
- Combined-send variant per platform: web drops text, native drops or
  stalls file — same root cause, different presentation.

**Recommended tests:**
- L1 `MessageSendOrchestratorTest`: `send(body, mediaUri)`. Assert
  orchestrator emits exactly 2 outgoing messages (or 1 combined OOB, per
  the locked contract), in order, neither swallowed. Current SDK contract
  treats two separate messages as acceptable.
- L1 `MessageSendOrchestratorTest`: `send(mediaUri only)`. Assert 1
  outgoing OOB stanza, no spurious empty-body stanza alongside.
- L1 `MessageSendOrchestratorTest`: `send(body only)`. Assert 1 outgoing
  body stanza, no orphan media artifact.
- L2 Compose / SwiftUI `ChatInputTest` extension: attach preview + typed
  text → tap send → assert both render as expected bubbles.

**Coverage status:** Partial. `PendingMediaSendQueueTest` covers the
queue; no orchestrator-contract test exists yet.

### C. Connection lifecycle

**Failure modes:**
- XMPP socket stays null until eventual reopening — incoming messages
  backfill only when the user resumes the app or sends a second message.
- Pending media uploads commit only when the user triggers a subsequent
  action, not when the network is actually restored.
- Same user logged into two sessions (e.g., real device + simulator) sees
  their own messages duplicated, with a noticeable backfill delay.

**Recommended tests:**
- L1 `XMPPConnectionStateMachineTest`: reconnect transitions don't
  double-flush pending queues; socket-null guard doesn't silently swallow
  outgoing sends.
- L1 `MessageRetryQueueTest`: queue commits on a connection-restored
  event, not on an unrelated user action.
- L3 Maestro: backgrounding flow — send msg → home button → resume after
  10s → assert msg delivered without manual second-send nudge.
- L4 Manual: dual-session same-user test (XMPP resource conflict
  territory), since the duplicate-self-message bug only surfaces with a
  real second client.

**Coverage status:** None hermetic.

### D. Send-status correctness & duplication

**Failure modes:**
- Bulk-send under degraded network → some messages briefly show error →
  seconds later they deliver successfully → original error bubbles remain
  visible alongside the delivered duplicate.
- Status flips between "sending" and "error" inconsistently for messages
  that eventually deliver fine.
- App crashes during sustained high-frequency send on certain Android API
  levels.

**Recommended tests:**
- L1 `MessageStoreTest`: `pending → sendFailed → server-echo` arrives.
  Assert echo merges into the original bubble; no stale failed bubble
  remains in the list.
- L1 `MessageStoreTest`: explicit `retry()` vs auto-retry — both paths
  must reconcile against incoming echo, neither leaves a duplicate.
- L1 `MessageStoreTest`: bulk add of 10 messages where 3 are marked
  `sendFailed=true` first, then all 10 echo back from server → final list
  size is 10, no orphan failed bubbles.
- L2 Compose / SwiftUI: drive a 10-message rapid-send with simulated 30%
  failure rate; assert final visible bubble count is 10, not 10 + 3 stale
  failures.
- L4 Manual: sustained-send + intentional network blip + crash-resistance
  test across the Android API matrix.

**Coverage status:** Partial. Bidirectional `pending ↔ echo` ID matching
covered. Failure-then-recovery NOT covered.

### E. Unread counter

**Failure modes:**
- Own messages appear as unread after re-login (cursor reset bug — own
  messages from MAM history should never count as unread).
- Unread badges don't render on the room-list when no chat room is
  currently focused.
- Edge cases acknowledged as still being investigated: re-entry resets,
  multi-room concurrent receive, edits, deletes.

**Recommended tests:**
- L1 `UnreadObserverTest`: MAM replay of own messages → cursor sets to
  last own message → unread count = 0.
- L1: room focus reset clears unread badge on entry; room-switch
  transfers focus correctly without bleeding unread between rooms.
- L1: deleted-while-unread doesn't decrement past zero; deleting an
  already-read message doesn't change count.
- L1: edits-while-unread don't double-count (edit is not a new unread).
- L1: badge formatter — 0 → empty, 1-99 → exact, 100+ → "99+".
- L2: badge component shows count when prop > 0, hides when 0.

**Coverage status:** Partial. `UnreadObserverTest` exists. Edge cases
above mostly uncovered.

### F. History + render parity

**Failure modes:**
- After re-login, first room opened shows no history (silent load
  failure).
- File icon missing on file messages loaded from MAM history; the same
  file-type message rendered from a live receive shows the icon
  correctly.
- Some rooms permanently loading history while others in the same session
  load fine.

**Recommended tests:**
- L1 `MessageCacheTest`: seed 30 messages → re-instantiate store → assert
  30 visible without round-trip (verifies fast-load contract).
- L1 `MessageCacheTest`: per-room cap at 100 — seed 150, assert eviction
  retains the most-recent 100.
- L1 `MessageRenderTest`: `Message(type=file)` rendered from "live
  receive" path vs "MAM replay" path → assert visual output identical
  (icon, filename, click target). Catches the historical-icon-missing
  class of bug.
- L2 Compose / SwiftUI: file-message bubble snapshot — regardless of
  origin path, icon and metadata must render.

**Coverage status:** None for cache contract. Visual parity gap (history
vs live receive) not covered.

### G. Media upload edges

**Failure modes:**
- Camera-captured photos can't be sent on Android (different URI scheme
  path than gallery picker, likely diverges in the upload pipeline).
- Large files (>2 MB) fail with 413 in some setups but succeed in others
  — reference server limit is 200 MB, so failures suggest client- or
  proxy-side size limits not aligned with backend.
- Displayed file size differs between bubble preview and file picker —
  two formatters drifting.
- Sent vs received file bubbles styled differently (sent inset as card,
  received inlined) — looks like a regression rather than intent.

**Recommended tests:**
- L1 `MediaSendTest`: file URI from camera → upload pipeline path matches
  gallery URI path; no special-case lost.
- L1 `MediaSizeFormatterTest`: single source of truth between preview
  formatter and bubble formatter — same byte count → same human string.
- L2 Compose / SwiftUI: sent vs received file bubble snapshot parity —
  same `Message` data, both branches must produce visually equivalent
  bubbles, or document the intentional difference.

**Coverage status:** None.

### H. Configuration safety

**Failure modes:**
- SDK has historically shipped with hardcoded fallback URLs that would
  silently route to default servers if configuration was missing —
  flagged as a privacy/security risk by enterprise consumers. Subsequent
  decision: SDK must fail explicitly on missing config, never silently
  fall back.

**Recommended tests:**
- L1 `ChatConfigurationTest`: SDK init **throws** on missing API host /
  XMPP host / app ID — no fallback to any default value, no silent
  degraded mode.
- Build-time check: source regex scan for known-default URL patterns in
  compiled SDK output.

**Coverage status:** Partial. `ChatConfigurationTest` exists; explicit
"no-fallback, fail-loud" assertion missing.

### I. UI affordances

**Failure modes:**
- Back arrow visible even when the rooms feature is disabled by config;
  tapping is a no-op.
- Scroll-to-bottom after send doesn't reach the bottommost message; user
  has to tap the scroll-down chip after every send.
- URL bubbles tinted / dimmed inconsistently with other text content.
- Header shows "Chat room name" placeholder and "0 users" even when the
  room is populated — partial render bug.

**Recommended tests:**
- L2: each affordance against the config matrix — `roomsDisabled = true`
  must hide the back arrow; `singleRoomMode = true` must hide the room
  list.
- L2: post-send scroll position — assert lazy column / list view scrolls
  to last item index after the send action.
- L2 / screenshot test: bubble style matrix (text, URL, image, file,
  deleted, pending, failed) — preferably with Paparazzi / Roborazzi for
  Android and reference-image snapshots for iOS once a baseline exists.
- L4 Manual: IME / keyboard layout, since Compose UI assertions on IME
  state are flaky.

**Coverage status:** Component-level tests exist for several affordances.
Config-matrix coverage is thin.

### J. App lifecycle

**Failure modes:**
- App crashes during message send on specific Android API levels.
- Process death + restore behavior unverified for draft text, unread
  counts, scroll position.

**Recommended tests:**
- L1 `SavedInstanceStateTest`: draft text and scroll position survive a
  config change (rotation, font scale).
- L2 Maestro: backgrounding → resume after 30s → assert no crash, state
  intact, unread badge correct.
- L4 Manual: device-specific Android API matrix (10 / 11 / 12 / 13 / 14
  / 15) for crash patterns under sustained load.

**Coverage status:** None.

### K. Auth + token state

**Failure modes:**
- 401 Unauthorized on `/users/client` after a JWT format change between
  major SDK versions.
- Token re-dispatch missing → chat component fails to re-init when the
  embedding app refreshes its token prop.

**Recommended tests:**
- L1 `JwtFormatTest`: parser handles both legacy and current token shapes
  cleanly during a deprecation window.
- L1 `LoginWrapperTest`: token-prop change triggers full re-init (close
  existing sockets, clear stores, re-auth, re-join).
- L2 Vitest (web): `<LoginWrapper>` re-renders on token swap.

**Coverage status:** Partial on web. Native unrepresented.

### L. Cross-platform parity

**Failure modes:**
- Message delivery instant browser → Android, ~500 ms Android → browser —
  same test, asymmetric latency.
- Combined send (text + media) drops different parts on different
  platforms — same orchestration bug presenting differently.
- Same multi-room state bug surfaces with different symptoms on web vs
  native.

**Recommended tests:**
- L1: shared test-vectors file (JSON) covering wire-level stanza shapes,
  consumed by parsers on both Android and iOS — guarantees parse symmetry
  for every documented stanza type.
- L3 Maestro + Playwright shared seeded fixture: send from platform A,
  assert receipt on platform B within N seconds, repeat for each platform
  pair.

**Coverage status:** None. Highest infrastructure cost (needs the seeded
test app instance, below).

## Seeded test app instance — recommended infrastructure

Several clusters above (A, C, F, L especially) gain massive testability if
runs target a pre-seeded test app instance with known data rather than
generating data live every run.

Suggested shape:
- A dedicated QA app ID (e.g. `ethora_qa_<env>`)
- 4 deterministic test users (`qa-a`, `qa-b`, `qa-c`, `qa-d`)
- 3 deterministic rooms:
  - empty room (baseline render)
  - active room (50 messages: mix of text, media, edited, deleted)
  - long-history room (500 messages, deterministic content)
- A reset / reseed script (drops + reseeds in ~10s via existing admin
  APIs)
- A CI job that wakes the QA instance before each E2E suite run

After this exists, every cross-platform parity test becomes cheap and
deterministic. Estimated build cost: ~1 day.

## Recommended priority — next 30 days

1. **L1 cluster targeting recurring field bugs** (cheap, hermetic, no
   infra): A multi-room state, D failure-recovery, E unread MAM, F cache
   contract, B send-orchestrator. Target: 12–15 new tests.
2. **L2 Compose / SwiftUI extensions on emulator / simulator** (week 2):
   config-matrix UI affordances (I), combined-send (B).
3. **Seeded test app infrastructure** (week 3): unblocks L3.
4. **L3 cross-platform parity** (after seeded app): Maestro + Playwright
   on the top five flows.

## How to extend this catalog

- Add new clusters when a field bug class doesn't fit cleanly into A–L.
- Within a cluster, add concrete failure modes (one bullet each) before
  adding tests — they are the evidence base for why the test matters.
- Anonymize: no customer names, individual engineer names, JIRA ticket
  IDs, or environment-specific URLs. Generic descriptions only.
- Mark coverage status honestly — "Partial" means *some* tests exist;
  list the specific test names if it helps future readers.

## Per-SDK testing entry points

- Android SDK: `sdk-android/README.md` — Compose UI test scaffold + JVM
  unit-test layer.
- iOS SDK: `sdk-swift/README.md` — XCTest scaffold + accessibility
  identifiers for cross-platform parity.
- Web (chat component): `sdk-reactjs/README.md` — Vitest + RTL setup,
  shared `data-testid` IDs.
- Sample apps: `sample-android/README.md`, `sample-swift/README.md` —
  Maestro E2E flow libraries.
