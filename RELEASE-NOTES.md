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

## Week 38 (Sep 14 – 20, 2026) — The hosted MCP server goes live behind OAuth; self-hosting gains licence keys and a container image; the web chat SDK ships its cold-start and accessibility round

**Contributors:** Roman Leshchuh, Taras Filatov, Yurii T.
**Total commits:** 130 across SDK/app repos + 31 platform/server | **Active repos:** 7

### Theme

The week's centre of gravity was **making Ethora something an AI assistant can drive**. The MCP server stopped being a command-line tool you install and became a hosted service you connect to: Streamable HTTP transport, per-session isolation, a personal connector URL, and a full OAuth 2.1 authorization server built into the platform so a user signs in on an Ethora consent page instead of pasting a secret into someone else's product. Four releases went out in five days, the agent **Flows** capability that shipped last week was exposed through MCP with an authoring reference, and a docs corpus was added so an assistant can look things up instead of guessing.

Two other lines ran in parallel. **Self-hosting grew a commercial spine**: offline-verifiable licence keys with grace and restricted states, a licence page in the admin console, a container image for the API with an optional bytecode stage, runtime configuration for the frontend so one prebuilt image serves any install, and a new licence service to issue and renew keys. And the **web chat SDK** had its biggest single week of the year: the profile panels became a real third column instead of an overlay, the room list learned to seed itself from the API so it is never blank, the cold-start empty states stopped lying, and a contrast sweep took the default palette to WCAG AA.

### AI Assistants & MCP (`mcp-server`)
> [ethora-mcp-server](https://github.com/dappros/ethora-mcp-server) | 46 commits / 26.9.0 → 26.9.3

- **New:** **Hosted mode over Streamable HTTP.** The server can now run as a shared, long-lived service alongside the platform instead of only as a local command-line process. Session state is kept per connection, so one client's sign-in never reaches another, and idle sessions are evicted on a four-hour timer. The endpoint accepts a bearer credential and binds the session to whatever kind it is — a user token, an API key, an app token or a server token — so the same surface serves a person in Claude and a machine in CI ([`3a3e855`](https://github.com/dappros/ethora-mcp-server/commit/3a3e855), [`9e16c09`](https://github.com/dappros/ethora-mcp-server/commit/9e16c09))
- **New:** **Two ways to connect without a login step.** A personal connector URL carries the API key in the path, which is what URL-only clients such as Claude.ai and ChatGPT custom connectors need; and an OAuth-protected entry point returns a proper challenge, publishes its resource metadata, validates the token against the platform once per session and enforces the granted scope per tool, hiding identity tools from a grant that did not ask for them. Request URLs are never logged, since the personal URL is itself a credential ([`dce199f`](https://github.com/dappros/ethora-mcp-server/commit/dce199f), [`73c53df`](https://github.com/dappros/ethora-mcp-server/commit/73c53df))
- **New:** **Agent flows are reachable from an assistant.** The scripted-conversation YAML that shipped last week is now accepted on agent create and update through MCP, with an authoring reference in the docs corpus so a model writes a valid script rather than inventing a syntax. Opening menus, appointment requests and intake questionnaires can now be built end to end from Claude, ChatGPT or Cursor ([`e131cfb`](https://github.com/dappros/ethora-mcp-server/commit/e131cfb))
- **New:** **`search` and `fetch` over a built-in docs corpus.** Auth map, quickstarts, recipes, a hosted getting-started guide, an API-keys guide and one reference entry per tool with its inputs and annotations. The `initialize` response now also returns instructions tailored to how the client connected, so an assistant knows the status, sign-in and app-selection ordering before its first call ([`9e16c09`](https://github.com/dappros/ethora-mcp-server/commit/9e16c09), [`6695ccc`](https://github.com/dappros/ethora-mcp-server/commit/6695ccc))
- **New:** **A widget embed tool.** `ethora-widget-embed-snippet` emits the ready-to-paste script tag for the website chat widget with its prerequisites spelled out, and agent activation now works from an ordinary user session, so "give my site an AI assistant" is a single conversation rather than a trip through the admin panel ([`ef8e616`](https://github.com/dappros/ethora-mcp-server/commit/ef8e616))
- **New:** **Report a problem from inside the session.** `ethora-feedback-submit` sends a report with the last few tool failures attached automatically, so it joins to the server-side log instead of arriving as a paraphrase. It works anonymously and is exempt from scope checks, because the person most worth hearing from is the one whose sign-up is what broke. Outbound calls now also carry client and tool attribution headers, so assistant traffic can be counted separately from the web app ([`05233f5`](https://github.com/dappros/ethora-mcp-server/commit/05233f5))
- **New:** **A Claude Code plugin.** A second distribution channel alongside the connector directory: it declares the hosted server over HTTP and ships a marketplace manifest and setup notes, so a developer installs it with one command and signs in through the consent page rather than pasting a credential ([`6a1e75e`](https://github.com/dappros/ethora-mcp-server/commit/6a1e75e), [`957f518`](https://github.com/dappros/ethora-mcp-server/commit/957f518))
- **Improved:** **Every tool now carries a human title and explicit behaviour hints** (read-only, destructive, open-world), the discovery document publishes its auth modes, vendor and contact as structured data, and the hosted surface deliberately excludes the wallet tools, which stay available to the local command-line process only ([`1e96863`](https://github.com/dappros/ethora-mcp-server/commit/1e96863), [`9b10827`](https://github.com/dappros/ethora-mcp-server/commit/9b10827), [`78e8840`](https://github.com/dappros/ethora-mcp-server/commit/78e8840))
- **Improved:** **Credentials are redacted from every tool result.** App secrets, tenant secrets, app tokens and passwords are replaced at any depth, with an exception only for the handful of tools whose job is to hand a credential over once. A separate tool reveals an app token deliberately, under admin scope, and the App Secret is never returned over MCP at all. Bare token-shaped key names are covered too ([`0c37fab`](https://github.com/dappros/ethora-mcp-server/commit/0c37fab), [`42d04c0`](https://github.com/dappros/ethora-mcp-server/commit/42d04c0))
- **Improved:** **Errors say what to do next.** A sweep of all tools replaced masked failures with the API's own message, gave every class of validation, precondition and authorisation problem a real code instead of a generic internal error, and made the app-selection messaging uniform so a model that picked the wrong app is told so plainly. The agent-import bundle is typed, so a malformed bundle is rejected before it reaches the network ([`8bd86ff`](https://github.com/dappros/ethora-mcp-server/commit/8bd86ff), [`9b10827`](https://github.com/dappros/ethora-mcp-server/commit/9b10827), [`88d66f6`](https://github.com/dappros/ethora-mcp-server/commit/88d66f6), [`4938df1`](https://github.com/dappros/ethora-mcp-server/commit/4938df1))
- **Fixed:** Agents, rooms and message tools work in ordinary user mode, and several message and history routes that pointed at retired endpoints were rewired. A sweep closed an app-update field mismatch, crawl polling, a legacy widget 404, agent id aliases and a header auth override ([`2d45e3d`](https://github.com/dappros/ethora-mcp-server/commit/2d45e3d), [`e260232`](https://github.com/dappros/ethora-mcp-server/commit/e260232))
- **Docs:** README rewritten for the hosted server (entry points, auth modes, the agent journey, environment, troubleshooting), one-click install buttons that point at the hosted server over HTTPS redirectors, LM Studio added to the supported clients, and a security policy and container notes added ([`8dd81eb`](https://github.com/dappros/ethora-mcp-server/commit/8dd81eb), [`3e7e23a`](https://github.com/dappros/ethora-mcp-server/commit/3e7e23a), [`a0f8e65`](https://github.com/dappros/ethora-mcp-server/commit/a0f8e65), [`425b4b8`](https://github.com/dappros/ethora-mcp-server/commit/425b4b8), [`1b22812`](https://github.com/dappros/ethora-mcp-server/commit/1b22812))
- **Infrastructure:** Publishing to npm and the registry now runs from CI with loud failure on a bad token and a retry on registry verification, a Dockerfile was added, and the security scan moved to the open-source scanner CLI ([`08fc838`](https://github.com/dappros/ethora-mcp-server/commit/08fc838), [`62c4953`](https://github.com/dappros/ethora-mcp-server/commit/62c4953), [`e16c0f2`](https://github.com/dappros/ethora-mcp-server/commit/e16c0f2), [`b13339b`](https://github.com/dappros/ethora-mcp-server/commit/b13339b), [`afb4c36`](https://github.com/dappros/ethora-mcp-server/commit/afb4c36))
- **Milestone:** **`@ethora/mcp-server` 26.9.0, 26.9.1, 26.9.2 and 26.9.3 published** — 26.9.0 fixed a version scheme that could not be published at all, 26.9.1 carried hosted mode, API keys, the OAuth entry point and the widget tool, and 26.9.2 and 26.9.3 carried the compliance, redaction and feedback rounds ([`5e5058e`](https://github.com/dappros/ethora-mcp-server/commit/5e5058e), [`f9e5da8`](https://github.com/dappros/ethora-mcp-server/commit/f9e5da8), [`6f86077`](https://github.com/dappros/ethora-mcp-server/commit/6f86077), [`a90d7e9`](https://github.com/dappros/ethora-mcp-server/commit/a90d7e9))
- **Milestone:** The registry entry gained a website URL and the listing metadata needed for third-party MCP directories, including a quality-score card ([`6209269`](https://github.com/dappros/ethora-mcp-server/commit/6209269), [`3964e4d`](https://github.com/dappros/ethora-mcp-server/commit/3964e4d), [`c93509d`](https://github.com/dappros/ethora-mcp-server/commit/c93509d), [`4efcbc3`](https://github.com/dappros/ethora-mcp-server/commit/4efcbc3))

### Platform API & Identity (`platform`)
> Platform API and AI service | 29 commits

- **New:** **An OAuth 2.1 authorization server, built on the existing token factory.** Standards-compliant metadata, dynamic client registration, authorization code with PKCE, rotating refresh tokens and revocation, plus a self-contained sign-in, create-account and consent page that reuses the ordinary web login against the base app. Access tokens are the platform's normal user tokens anchored to a revocable row, so revoking a connection takes effect immediately and no API route had to change. A "connected AI apps" list lets a user see and revoke their grants.
- **New:** **Sign in with Google (and optionally Facebook) on the consent page**, so connecting an assistant does not force a password on an account that has never had one. The app's closed-registration setting is honoured on the consent page's sign-up paths.
- **New:** **Long-lived, revocable user API keys.** Automation clients — the hosted MCP server, agents, CI — need a credential that outlives the one-hour session token but can still be killed instantly. An API key is an ordinary user token bound to a revocable row with a chosen lifetime of up to a year, so every existing authenticated route accepts it with no middleware change, deleting the row revokes it, and it can never be used to mint a session refresh.
- **New:** **Revocable B2B server tokens minted by the app owner.** Integrators previously had to hand-sign a server token from the app secret, which meant the only way to revoke one was to rotate the secret and break everything else. An owner can now create a server token from the API, see it once, list the active ones and revoke any of them individually; a revoked or expired token is refused at the point of use, and legacy hand-signed tokens keep working.
- **New:** **A minimal identity surface for connector review.** A userinfo endpoint returns the subject, email and verification state for the bearer of an OAuth access token, checked against the grant so a revoked connection stops returning claims, and two identity scopes are advertised and described in plain words on the consent screen. Identity scopes grant claims only, never platform access, and the user can decline and continue. Deliberately not built: ID tokens, asymmetric signing and a full provider surface, none of which the review asks for.
- **New:** **Optional email verification.** Mandatory confirmation was removed on purpose because the friction cost signups, so verification stays optional everywhere: sign-up, sign-in and the admin panel behave exactly as before for an unconfirmed account. The one exception is an assistant connector asking for identity scopes, since some of them refuse an unverified address. A user can start verification themselves and confirm from the email client.
- **New:** **Product feedback, accepted from anywhere.** A feedback endpoint takes a message with an optional category, address, source and free-form context and delivers it by email and chat. It works authenticated or anonymous — a signed-in caller is attributed from the token only, never from the body — and the free-form context is what makes an assistant-submitted report useful, because it carries the tool, error code and request id that join straight to the server-side log.
- **New:** **Offline-verifiable licence keys for self-hosted installs.** A signed key encodes the licensed parent domain, edition and expiry and is verified locally against public keys compiled into the platform, so an install never has to phone home to start. A state machine moves an install between licensed, a fourteen-day grace period and a restricted state, a key supplied at deploy time takes precedence over one uploaded in the admin panel, and local and test hosts always pass. A daily job calls home for renewal and operator notices, and reports the current key expiry so the issuing service can refresh a key only when it is genuinely due.
- **New:** **A licence service.** A small standalone service issues and renews the signed keys, records installs, enforces the instance limit on a licence, issues one fourteen-day trial per domain and per address, and exposes an administration surface for creating, inspecting, renewing and suspending licences and for minting an offline key.
- **New:** **A container image for the API**, one image that runs the API, the jobs runner or the blockchain worker depending on its argument, with an optional stage that compiles first-party code to bytecode and ships no sources. Test files, source maps and development dependencies are never included.
- **Improved:** **Multi-agent rooms can no longer talk to each other forever.** Four gaps in the autonomy cap are closed: a bot answers another bot only while a human has spoken within a configurable window, a bot mentioning another bot no longer bypasses that rule, and a proactive heartbeat post opens a short round rather than handing out a fresh full budget.
- **Improved:** An app provisioned through the B2B route is now attributed to the person who provisioned it rather than to the tenant identity, so it appears in their own app list and can be deleted by them.
- **Fixed:** Agent reactions are sent in the identifier format clients actually expect, so they render under the right bubble.
- **Fixed:** The app-scoped document and site-source routes accept their own URL. Their parameter schemas omitted the app id that the route path itself declares, so every assistant-driven call to tag or delete a source was rejected as malformed.
- **Fixed:** The broadcast endpoint answers a missing room list with a sentence that names the three valid options, instead of the validation library's raw internal text.
- **Fixed:** **The metrics endpoint.** It returned a server error the moment it was switched on, because the handler wrote a promise to the response; and once fixed, every distinct URL an internet scanner probed became a permanent label, pushing a single host past eight thousand series. Requests are now labelled with the route pattern that handled them, unmatched requests fold into one value, and the number of distinct paths is capped.
- **Fixed:** A client registered without a scope may request any supported scope, rather than being locked out of everything.
- **Fixed:** Three consent-page defects found in social sign-in: the popup could not reach the consent page under a cross-origin isolation policy, a failure did not name its cause, and the form could not be submitted at all.
- **Docs:** A data-handling reference for the assistant integration, plus a policy template a self-hosting operator can adapt, and notes on licence enforcement and the container image.
- **Infrastructure:** The repository's secret scan moved to the open-source scanner CLI.

### Web Chat SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 60 commits / 26.7.5 → 26.8.1

- **New:** **The profile family is now a chat column, not an overlay.** Chat profile, user profile, settings, Manage Data and Visibility used to render on the modal layer parked against the right edge, which meant opening a profile hid the conversation you were reading. They now sit in the layout as a third column and the chat simply gets narrower, the way a desktop messenger behaves. The routing that decides which panel is open has one source of truth shared by both hosts, so centred dialogs and side panels cannot drift apart ([`419dff6`](https://github.com/dappros/ethora-chat-component/commit/419dff6), [`d60284c`](https://github.com/dappros/ethora-chat-component/commit/d60284c))
- **New:** **The room list seeds its previews from the API.** The rooms endpoint returns a last message per room, so a room whose history has not loaded yet now shows that message as its preview and sorts by its timestamp, instead of a blank line and a creation-date ordering. Live history still wins the moment it arrives, and a response that omits the field never erases one already seeded ([`9daf70d`](https://github.com/dappros/ethora-chat-component/commit/9daf70d), [`c0e5ff2`](https://github.com/dappros/ethora-chat-component/commit/c0e5ff2), [`41bc8fc`](https://github.com/dappros/ethora-chat-component/commit/41bc8fc))
- **New:** **The chat QR code is a panel rather than a full-screen takeover**, stacking over the profile column with the room list and conversation left in place, and recomposed as one balanced centred block. Escape peels it off and leaves the profile open underneath ([`7da947d`](https://github.com/dappros/ethora-chat-component/commit/7da947d), [`707a435`](https://github.com/dappros/ethora-chat-component/commit/707a435))
- **New:** **Motion throughout.** Side drawers, file previews, the thread pane, and the delete-confirm, report-chat and new-chat dialogs animate in and out; switching rooms settles in with a fade rather than snapping. Exit animations need the element to stay mounted, which two small hooks now handle, and everything no-ops under a reduced-motion preference ([`2794fdd`](https://github.com/dappros/ethora-chat-component/commit/2794fdd), [`f4bfa2b`](https://github.com/dappros/ethora-chat-component/commit/f4bfa2b), [`c81ce4b`](https://github.com/dappros/ethora-chat-component/commit/c81ce4b), [`0a80f01`](https://github.com/dappros/ethora-chat-component/commit/0a80f01), [`27bcf95`](https://github.com/dappros/ethora-chat-component/commit/27bcf95), [`8792c61`](https://github.com/dappros/ethora-chat-component/commit/8792c61), [`c41129e`](https://github.com/dappros/ethora-chat-component/commit/c41129e))
- **Improved:** **The default palette meets WCAG AA.** A contrast sweep found online and success text at 2.62:1 and message timestamps at 3.36:1 against a 4.5:1 requirement, and the destructive colour short of the bar on the hover surface where it actually renders. All three tokens were darkened to the minimum needed to clear 4.5:1 on every surface they appear on, keeping their hue. A host's own configured colours are passed through untouched, and a new test computes the ratios from the theme builder's real output so a future edit fails loudly instead of shipping a regression ([`08ec238`](https://github.com/dappros/ethora-chat-component/commit/08ec238))
- **Improved:** **The profile drawers were redesigned.** Description reads as prose instead of a disabled-looking form field, chat type is a small icon pill, member rows are taller with hover feedback and a secondary line, and empty states read as deliberate blanks rather than failures. A published type scale gives the profile hero a real focal point, and Manage Data's controls read as controls ([`179f8f6`](https://github.com/dappros/ethora-chat-component/commit/179f8f6), [`b997fb0`](https://github.com/dappros/ethora-chat-component/commit/b997fb0))
- **Fixed:** **The cold-start empty states stopped lying.** Three separate defects made a fresh login show "no chats yet" or "choose a chat" while the room list was still loading — a request that takes tens of seconds on a cold cache, not a frame. The no-rooms prompt was guarded only by the absence of loading, the idle placeholder returned before any of those guards were reached, and a failed rooms request was indistinguishable from an account with no rooms because the transport error was swallowed and handed back as an empty list. All three empty-list outcomes now live in one guard: a clean resolve with zero rooms gets the prompt, a failure gets a retry message and a timed retry, and anything else gets a loader ([`cb29b84`](https://github.com/dappros/ethora-chat-component/commit/cb29b84), [`951c4b9`](https://github.com/dappros/ethora-chat-component/commit/951c4b9), [`09d378e`](https://github.com/dappros/ethora-chat-component/commit/09d378e), [`47404f3`](https://github.com/dappros/ethora-chat-component/commit/47404f3))
- **Fixed:** A slow or failing rooms request no longer paints "connection lost" over a healthy socket ([`47404f3`](https://github.com/dappros/ethora-chat-component/commit/47404f3))
- **Fixed:** **Opening a room no longer flickers.** The loading state was derived from four independent async flags, so a loader and an empty-chat placeholder traded places several times before any history landed. One forward-only phase per room now absorbs the gaps between them, and while a room is opening its seeded last message is shown in a normal bubble with a loader above it for the rest of the conversation. A room whose archive is genuinely empty keeps that message and stops spinning ([`00877ea`](https://github.com/dappros/ethora-chat-component/commit/00877ea), [`4b06080`](https://github.com/dappros/ethora-chat-component/commit/4b06080))
- **Fixed:** **Joining a public room by link works without a reload.** The join was sent without waiting and the room list immediately refetched from a cache, so the new room never appeared and the user got an empty pane until they reloaded by hand. The join is now awaited, the refetch invalidates the cache, and it retries in the background because membership registers a few seconds later ([`50f1f69`](https://github.com/dappros/ethora-chat-component/commit/50f1f69))
- **Fixed:** **Deep links can no longer address a room that cannot exist.** A missing conference host used to produce a malformed room address, which selected nothing and left the pane blank; a missing host now means do nothing rather than guess, full addresses are accepted as given, and any malformed entries already persisted in a browser are pruned on load. A parked link destination also survives the first-run cache reset that a shared link tends to trigger ([`7ca8743`](https://github.com/dappros/ethora-chat-component/commit/7ca8743), [`b06f76a`](https://github.com/dappros/ethora-chat-component/commit/b06f76a), [`8b2eb38`](https://github.com/dappros/ethora-chat-component/commit/8b2eb38), [`e8aa4b1`](https://github.com/dappros/ethora-chat-component/commit/e8aa4b1), [`0dd3a83`](https://github.com/dappros/ethora-chat-component/commit/0dd3a83), [`abe1ba8`](https://github.com/dappros/ethora-chat-component/commit/abe1ba8))
- **Fixed:** **Manual translation works again, and shows what automatic mode shows.** The two modes had separate lookups and separate visibility rules, so a reader could watch automatic mode render a translation while clicking Translate on the same message dead-ended. Both now call one shared resolver, a translation is fetched on demand when the host provides no translator of its own, and both the older and newer shapes of the translation service are supported so a deployment change cannot silently break it again ([`dc7b74f`](https://github.com/dappros/ethora-chat-component/commit/dc7b74f), [`5919319`](https://github.com/dappros/ethora-chat-component/commit/5919319), [`ed5c8e9`](https://github.com/dappros/ethora-chat-component/commit/ed5c8e9))
- **Fixed:** **Line breaks a user typed are kept.** Markdown treats a single newline as a space, so a multi-line message collapsed into one line; a small plugin restores real breaks, including in the plain-text paths that render a quoted original alongside a translation ([`f3f613b`](https://github.com/dappros/ethora-chat-component/commit/f3f613b))
- **Fixed:** **An edit appears the moment it is sent.** Editing only put the change on the wire, so the bubble kept its old text until the server echo arrived and on a slow link the edit looked like it had done nothing. It is now applied locally as soon as the client confirms it can actually send, and not at all if it cannot ([`b68b1a3`](https://github.com/dappros/ethora-chat-component/commit/b68b1a3))
- **Fixed:** **Scrollbars.** Setting a scrollbar colour makes current Chrome abandon the platform's slim overlay bar for a classic always-visible widget, which arrived painted in the host's brand colour, ran the height of the room list and clipped the date column. The themed bar is back but muted and translucent, firming up on hover, and the room list reserves real clearance for it on every platform rather than relying on a property that only applies to space-taking scrollbars ([`03a44c5`](https://github.com/dappros/ethora-chat-component/commit/03a44c5), [`df78dda`](https://github.com/dappros/ethora-chat-component/commit/df78dda), [`e88b419`](https://github.com/dappros/ethora-chat-component/commit/e88b419))
- **Fixed:** **A broken avatar image falls back to initials.** Social profile photos hotlinked with a referrer, or simply expired, rendered as a broken-image glyph with clipped alternative text in member lists. The referrer is now withheld, which fixes most of them outright, the rest fall back to the same initials used when no picture is set, images in a long member list load lazily, and the alternative text is the person's name in their own language ([`6297a9f`](https://github.com/dappros/ethora-chat-component/commit/6297a9f))
- **Fixed:** Clicking a room no longer leaves a focus ring on the row, while keyboard activation keeps one; a chat-type pill no longer stretches and the scroll button no longer covers the panel; and a room that cannot be opened now says so instead of showing nothing ([`c426ab2`](https://github.com/dappros/ethora-chat-component/commit/c426ab2), [`b8a8ed2`](https://github.com/dappros/ethora-chat-component/commit/b8a8ed2), [`a1b793d`](https://github.com/dappros/ethora-chat-component/commit/a1b793d), [`5f4cffc`](https://github.com/dappros/ethora-chat-component/commit/5f4cffc))
- **Milestone:** `@ethora/chat-component` 26.7.6, 26.7.7, 26.7.9 and **26.8.1** published ([`b7c2353`](https://github.com/dappros/ethora-chat-component/commit/b7c2353), [`6b1effe`](https://github.com/dappros/ethora-chat-component/commit/6b1effe), [`fad8715`](https://github.com/dappros/ethora-chat-component/commit/fad8715), [`ebb3b0b`](https://github.com/dappros/ethora-chat-component/commit/ebb3b0b))

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 6 commits / 26.7.10 → 26.8.1

- **Fixed:** **The read marker is the message you actually reached.** Every path that leaves a room — unmounting, backgrounding, losing visibility or focus, logging out — wrote the newest message the server had acknowledged rather than the last one the reader had scrolled to, so leaving a room marked unread messages as read. It now writes the reader's own scroll boundary, and the "new messages" divider compares timestamps at full precision, so it sits directly below the last read message and matches the unread count ([`3147653`](https://github.com/dappros/ethora-chat-component-rn/commit/3147653))
- **Fixed:** **Every screen rendered blank on React Native 0.81.** A style helper the framework removed in that version was being spread into ten different style objects, which is a silent no-op rather than a crash, so positioning simply vanished from media overlays, the interactions overlay, the file-preview backdrop and the testbed's own panes. Swapped for the equivalent that remains, which is a drop-in ([`206059b`](https://github.com/dappros/ethora-chat-component-rn/commit/206059b))
- **Fixed:** **Three localisation defects from a French and Spanish QA pass.** The attach sheet, the chat profile screen and the new-message divider carried hardcoded English that no locale could reach and now resolve through the string table in all six supported languages; translations were dropped on every cold start because the field was excluded from what gets persisted; and "Show original" now collapses ([`c09de5a`](https://github.com/dappros/ethora-chat-component-rn/commit/c09de5a), [`206059b`](https://github.com/dappros/ethora-chat-component-rn/commit/206059b))
- **New:** `config.inputDockPaddingBottom` overrides the composer's bottom padding, including to zero, for a host that already sits above its own tab bar ([`3147653`](https://github.com/dappros/ethora-chat-component-rn/commit/3147653))
- **Improved:** The version constant is now regenerated from the package version as part of the release itself, with a test covering the other direction, so the two cannot drift again ([`eac2801`](https://github.com/dappros/ethora-chat-component-rn/commit/eac2801))
- **Milestone:** `@ethora/chat-component-rn` 26.7.10 and **26.8.1** published; the minimum supported iOS version stays where it was ([`4b3b4fa`](https://github.com/dappros/ethora-chat-component-rn/commit/4b3b4fa), [`d48033f`](https://github.com/dappros/ethora-chat-component-rn/commit/d48033f))

### Web App & Admin (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 16 commits / branches 2609 and 2610

- **New:** **An AI Assistants tab in the account.** Create, list and revoke personal API keys, and on creating one, see it once alongside ready-to-paste connection details for the hosted assistant server: a personal connector URL for Claude.ai and ChatGPT custom connectors, a one-line command for Claude Code, and a JSON block with a bearer header for Cursor and other clients. A "Connected AI apps" section lists the grants a user has given and lets them revoke one, and hides itself on installs where that endpoint is not deployed ([`741358f`](https://github.com/dappros/ethora-app-reactjs/commit/741358f))
- **New:** **Server tokens in the API tab.** An app owner can mint a B2B server token, see it once behind the existing secret control with a copy-ready request example, list the active ones and revoke any of them. The credential table now says what each credential is and which one to use. The whole section hides itself on deployments that predate the feature ([`a9db57b`](https://github.com/dappros/ethora-app-reactjs/commit/a9db57b), [`25aed51`](https://github.com/dappros/ethora-app-reactjs/commit/25aed51), [`b9b6a73`](https://github.com/dappros/ethora-app-reactjs/commit/b9b6a73), [`870ba27`](https://github.com/dappros/ethora-app-reactjs/commit/870ba27), [`91e5013`](https://github.com/dappros/ethora-app-reactjs/commit/91e5013))
- **New:** **A Licence page in the admin console**, with a status card and key upload for super administrators, a banner shown to administrators while an install is in grace or restricted, and a redirect that keeps the console on that page when the platform reports the admin panel as restricted. The status is read once and shared, and a failed read never blocks the interface ([`3f7eef7`](https://github.com/dappros/ethora-app-reactjs/commit/3f7eef7))
- **New:** **Runtime configuration and a prebuilt frontend image.** Every setting the app reads now prefers a runtime configuration file loaded before the bundle, falling back to the build-time value, so one image can serve any install instead of each install needing its own build. The container renders that file and the content-security origins from its environment at start, and can either serve the bundle itself or render it into a directory for a host that serves it with its own web server. Source-mode installs are unchanged ([`5db92ef`](https://github.com/dappros/ethora-app-reactjs/commit/5db92ef), [`7a0a318`](https://github.com/dappros/ethora-app-reactjs/commit/7a0a318))
- **New:** **An optional email-verification affordance**, placed on the AI Assistants tab beside the connector setup it affects rather than anywhere a general user would meet it, because verification stays optional and the only reason to surface it is that some connectors will not accept an unverified address. It shows the address with its state, offers to send a link, and renders nothing at all unless the platform reports a verification state ([`90af287`](https://github.com/dappros/ethora-app-reactjs/commit/90af287), [`ed32e4e`](https://github.com/dappros/ethora-app-reactjs/commit/ed32e4e))
- **New:** A customisation interface for the embeddable widget, and a clearer loading state on sign-in ([`ecce9f0`](https://github.com/dappros/ethora-app-reactjs/commit/ecce9f0))
- **Improved:** The bundled chat component was moved forward to the week's releases ([`ec6838a`](https://github.com/dappros/ethora-app-reactjs/commit/ec6838a), [`f789410`](https://github.com/dappros/ethora-app-reactjs/commit/f789410))
- **Refactored:** The quick lint findings were cleared, from 201 down to 138 ([`5cffc22`](https://github.com/dappros/ethora-app-reactjs/commit/5cffc22))
- **Docs:** The diagnostics catalogue gained the agent room probe with its button-tap and scripted modes, and a note that the widget lives in a shadow root ([`70c6151`](https://github.com/dappros/ethora-app-reactjs/commit/70c6151))

### Monorepo (`ethora`)
> [ethora](https://github.com/dappros/ethora) | 2 commits (plus daily submodule bumps)

- **Docs:** Week 37 release notes published, and the MCP section of the README now leads with the hosted server rather than the command-line install ([`3440e79f`](https://github.com/dappros/ethora/commit/3440e79f), [`afb914fd`](https://github.com/dappros/ethora/commit/afb914fd))

---

## Week 37 (Sep 7 – 13, 2026) — Agents learn to run a script: operator-authored flows, tappable answers, and a mobile push overhaul

**Contributors:** Borys Bordunov, Dmytro Berberov, Roman Leshchuh, Taras Filatov, Yurii T.
**Total commits:** 29 across SDK/app repos + 16 platform/server | **Active repos:** 8

### Theme

Three lines converged this week. **Flows** gives an operator a way to script an agent's conversation in YAML — an opening menu, an intake questionnaire, an appointment request — validated by the API and authored from a new tab in the agent settings. **Quick replies** gives that script somewhere to land: the web chat component now renders a bot's buttons under the bubble and posts the tapped answer back as an ordinary message, and the AI service can choose to answer with buttons or a reaction. And the React Native SDK got a **push-delivery overhaul** that closes the gap where a signed-in user held a device token and still received nothing.

### AI Agents & Platform API (`platform`)
> Platform API and AI service | 14 commits

- **New:** **Scripted agent flows.** An operator can now describe an agent's conversation as a YAML script on the agent itself: `say` steps (with optional buttons that jump to another flow or end the conversation), `ask` steps that collect one typed slot (text, number, date, phone, email, or a list of options rendered as buttons), `goto` and `end`, with `{slot}` interpolation and `when: slot == value` branching. The API compiles and validates the script on save and refuses to store one that does not compile, returning line-numbered errors. A flow named `start` becomes the agent's **opening menu**, offered automatically at the beginning of a session; any other flow is invoked when the model decides it is needed, and flows can chain into one another. A dedicated validate endpoint dry-runs the compiler without saving, and the widget session response carries the opening step so a client can render it immediately. The answers a flow collects are readable through the API. Pre-built templates ship for an opening menu, appointment request, lead capture, intake questionnaire and feedback survey.
- **New:** **Agents can answer with buttons and reactions.** Both are exposed to the model as tools alongside the existing persona tool. `reply_with_buttons` sends the reply text with tappable options attached (labels and values validated and capped, duplicates dropped, so a confused model degrades to fewer buttons rather than a broken bubble); `react_to_message` puts an emoji reaction on the message being answered, built to match the chat component's own reaction format so it renders under the right bubble. Reactions are offered only on room turns, where there is a message to react to.
- **New:** **Mute and unmute a chat, per member.** A member can silence a room for themselves through new mute and unmute endpoints; the flag is per member, so it never affects anyone else, and the room list and single-room reads return it. Idempotent, and scoped to rooms the caller belongs to.
- **New:** **Optional password on single-user provisioning.** The provisioning route now accepts a password chosen by the caller and stores it as a permanent credential, so an operator provisioning an account for someone who cannot receive the invite email (a shared inbox, onboarding done in person, an address not yet live) can hand over a credential that works straight away. Minimum length matches the sign-in floor, so anything accepted at creation is accepted at login.
- **New:** **App and chat language are now two separate preferences.** The profile used to carry one language that meant two things: what the interface renders in, and what incoming messages are translated into. These are now `appLanguage` and `chatLanguage`, both validated against the install's configured list, both clearable. Chat language falls back to the app language when unset, so a reader who never chose one keeps the behaviour they had. A migration moves existing rows.
- **New:** **The install's translation targets are published to clients.** The translation server is deployed separately from the API, so which languages it can translate into is an operational fact no client could infer. A new install-wide `translateLanguages` list, configured at deploy time and synchronised on every install and update, is served in the unauthenticated bootstrap config alongside the chat host. The key is always present and empty when no translation server is configured, so a client can tell "none configured" from "old API". Language writes are validated against the same list clients receive, so a picker cannot offer a code the write would then reject.
- **Improved:** One list now describes the available languages instead of two that could disagree. The older `languages` block has been removed from the session bootstrap responses in favour of the config list.
- **Improved:** **Message translations are persisted in the archive**, so a translated conversation reads the same on reload as it did live, and the chat server forwards translations to the push service.
- **Improved:** **Push notifications carry more of the message.** The sender's name becomes the notification title, the body is rendered in the receiver's own language, a member's chat mute is honoured, and the sender's avatar is forwarded to the device (as the notification image on Android, and with mutable content on iOS so a notification service extension can attach it).
- **Improved:** **Faster app reads and token refresh.** The app payload no longer embeds the full crawled markdown of every indexed site source — the dashboard only ever used the URL and size, and the markdown is fetched per source — which removes seconds and hundreds of megabytes of heap from a single read on an app with a large web index. Indexes were declared behind refresh-token, app-ACL and room-membership lookups that had been full collection scans on every request.
- **Fixed:** An edited message's translations now sync correctly out of the archive.

### Chat Server & Infrastructure (`platform`)
> Chat server | 2 commits

- **Improved:** The offline-message hook forwards message translations to the push service and passes the sender's avatar through as the notification image.

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 4 commits / 26.7.5 → 26.7.9

- **New:** **Mute a chat from its profile.** A bell button joins Search, Leave and Report in the chat-profile hero, reading "Unmuted" or "Muted" and toggling the caller's own membership flag through the new platform endpoints, with the initial state read from the room list. The flip is optimistic and rolls back with a toast if the request fails ([`6d8a289`](https://github.com/dappros/ethora-chat-component-rn/commit/6d8a289))
- **New:** **`handlePushPayload(data)` and `openRoomFromPush(jid)` are exported from the package root.** The host keeps ownership of the native push side (token, permission, tap listeners) and hands the tapped notification's data to the SDK: a call push rings, a message push opens its room — immediately if the room list is loaded, otherwise as soon as it is. The pending room is persisted with a five-minute expiry, so a tap handled by a JS context that is replaced right after (the cold-start race) still opens the room on the next mount ([`8bef8e6`](https://github.com/dappros/ethora-chat-component-rn/commit/8bef8e6))
- **New:** **`config.headerLayout.safeAreaTop`** lets the room-list and chat header cards pad their own top inset and run under the status bar as one surface, instead of the host wrapping the component in a top-edge safe area that painted its own white band above the card. Off by default, so existing hosts are unchanged ([`dd9136d`](https://github.com/dappros/ethora-chat-component-rn/commit/dd9136d))
- **Fixed:** **Push notifications now arrive for users who only ever signed in through the SDK.** The bootstrap re-joined rooms with presence but never sent the room-subscription that the chat server uses to decide whom to push for — only the legacy path did — so such a user had a registered device token and received nothing. Both the bootstrap and the reconnect handler now subscribe every room in the store after the presence pass ([`dd9136d`](https://github.com/dappros/ethora-chat-component-rn/commit/dd9136d))
- **Fixed:** **Push subscription no longer takes minutes on a busy account.** The subscription pass was strictly sequential with a pause and a timeout per room, so a user with a few dozen rooms outlived the socket and finished mostly unsubscribed; it now runs in parallel batches with unique request ids (shared ids had made every request resolve on the first reply). A refused subscription logs the server's reason instead of failing silently ([`8bef8e6`](https://github.com/dappros/ethora-chat-component-rn/commit/8bef8e6))
- **Fixed:** **The chat stream is now closed when the app goes to the background** and reopened on foreground. Android keeps a backgrounded socket alive for minutes, and while it lived the server still saw the user as online and routed new messages into the socket instead of sending a push — so only the first push after a cold start ever arrived. Opt out with `xmppSettings.keepAliveInBackground: true` ([`8bef8e6`](https://github.com/dappros/ethora-chat-component-rn/commit/8bef8e6))
- **Fixed:** A successful room join is no longer reported as a bootstrap failure — the presence timeout raced the reply and won ([`dd9136d`](https://github.com/dappros/ethora-chat-component-rn/commit/dd9136d))
- **Milestone:** `@ethora/chat-component-rn` 26.7.6, 26.7.7, 26.7.8 and 26.7.9 published ([`dd9136d`](https://github.com/dappros/ethora-chat-component-rn/commit/dd9136d), [`8bef8e6`](https://github.com/dappros/ethora-chat-component-rn/commit/8bef8e6), [`c443cf9`](https://github.com/dappros/ethora-chat-component-rn/commit/c443cf9))

### Web Chat SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 3 commits / 26.7.4 → 26.7.5

- **New:** **Bot quick-reply buttons render under the bubble and answer as messages.** A message carrying `quickReplies` now draws its options as tappable chips; tapping one sends its value into the room as an ordinary message, so the bot reads the answer through exactly the same path as typed input and the transcript stays readable. The chips lock after a tap, so a double tap cannot post two answers to one question. The wire format is the one Ethora bots already emit, so nothing on the bot side has to change to light this up; an optional question id is carried for flows that need to tie an answer to its question. Options survive a repaint from cache instead of disappearing until the message is re-delivered ([`c8e2781`](https://github.com/dappros/ethora-chat-component/commit/c8e2781), [`ebfb2fd`](https://github.com/dappros/ethora-chat-component/commit/ebfb2fd))
- **New:** `config.eventHandlers.onQuickReply` fires after the answer is sent, for hosts driving their own scripted flow (a quiz, an intake form) on top of the same buttons. It is a notification rather than an interception point, so a throwing handler cannot cost the user their answer ([`c8e2781`](https://github.com/dappros/ethora-chat-component/commit/c8e2781))
- **Milestone:** `@ethora/chat-component` 26.7.5 published ([`890f901`](https://github.com/dappros/ethora-chat-component/commit/890f901))

### Web App & Admin (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 11 commits / branch 2609

- **New:** **Flows tab in the agent settings.** This is where an operator writes the YAML script: a plain editor in the Behaviour section with starter templates (opening menu, appointment request, lead capture, intake questionnaire, feedback survey), a Validate button that dry-runs the API's compiler without saving, and Save. Compiler errors come back with line numbers and are listed under the editor, and a script that does not compile is refused by the API, so the panel can never show a saved-but-broken state. Copy in English, French and Spanish ([`472468e`](https://github.com/dappros/ethora-app-reactjs/commit/472468e))
- **New:** **Self-serve Apple push credentials and a per-app push switch.** The mobile app settings screen takes an APNs auth key upload with its key id, team id, bundle id and sandbox or production environment, shows whether a key is in place and allows removing it, and adds a switch that turns platform push on or off per app with today's count against the daily quota shown next to it. Validation problems from the API are surfaced verbatim ([`7df9f05`](https://github.com/dappros/ethora-app-reactjs/commit/7df9f05))
- **New:** **Generate a password in Add New User and download the credentials as CSV.** Creating a user from the admin modal used to produce an account whose credential the operator never saw. The modal now seeds a fresh password on every open (drawn from the platform's cryptographic random with rejection sampling so the character distribution is even, one character of each class guaranteed, and the characters that get misread off a screen left out), the field is editable with a regenerate link, and the credentials are downloaded as CSV the moment the account exists — before the user-list refresh, since the server stores the password hashed and no endpoint reads it back ([`ee42ab9`](https://github.com/dappros/ethora-app-reactjs/commit/ee42ab9))
- **New:** **Two language pickers in the profile.** App language and chat language are now separate choices, each written on its own. The app picker offers the locales the bundle ships dictionaries for (an unbundled one would render in English); the chat picker offers the translation server's own list, whole, because translating *into* a language does not require the interface to render in it. When no translation server is configured the chat row is hidden entirely, and a chat language that was never chosen shows the app language and says it is following it ([`53e9747`](https://github.com/dappros/ethora-app-reactjs/commit/53e9747), [`315f761`](https://github.com/dappros/ethora-app-reactjs/commit/315f761), [`7742daf`](https://github.com/dappros/ethora-app-reactjs/commit/7742daf))
- **Fixed:** **The chat language choice now actually translates messages.** The chat surface took a single language input derived from the app language and used it for both its own captions and its message-translation target, so the profile's chat-language row was stored and echoed back but read by nothing. The two inputs are now separate, and the app-wide chat provider follows the user's picks instead of raw browser detection; changing a language re-applies the config without reconnecting ([`14f8dbd`](https://github.com/dappros/ethora-app-reactjs/commit/14f8dbd))
- **Fixed:** **The translation controls no longer appear on installs that cannot translate.** The gate read a capability list whose fallback was the entire bundled catalogue, which turned "no translation server" into three offered languages, a globe picker and an auto-translate mode that could never produce anything. It now reads the install's real list ([`14f8dbd`](https://github.com/dappros/ethora-app-reactjs/commit/14f8dbd))
- **Fixed:** The admin apps list's cheap count call for the other tab's total now uses the API's minimum page size instead of one, which the API rejects ([`f324271`](https://github.com/dappros/ethora-app-reactjs/commit/f324271))
- **Testing:** The multi-agent room probe transcribes agent buttons and reactions, not just message bodies, tagging message ids so a reaction can be matched to its target; `TAP_BUTTON` answers the first message offering buttons the way a person tapping a chip would, and `SCRIPT` plays a whole scripted conversation from the command line, so one run covers the full round trip of an agent offering choices, a user picking, and the agent seeing the answer through the normal inbound path ([`6c3f668`](https://github.com/dappros/ethora-app-reactjs/commit/6c3f668), [`472468e`](https://github.com/dappros/ethora-app-reactjs/commit/472468e))
- **Improved:** The chat bootstrap passes the app id through to the component, and the admin app is marked as not for indexing ([`20a616e`](https://github.com/dappros/ethora-app-reactjs/commit/20a616e), [`4a92bc2`](https://github.com/dappros/ethora-app-reactjs/commit/4a92bc2))

### Embeddable AI Widget (`ai-chat-widget`)
> [ethora-ai-chat-widget](https://github.com/dappros/ethora-ai-chat-widget) | 2 commits / 26.7.2

- **Fixed:** **The call-to-action teaser could stay permanently invisible.** Its fade-in animation started from fully transparent, and a CSS animation's clock only advances once the browser produces render frames for the document — so in a backgrounded tab, a non-visible preview iframe or on a low-power device the animation stayed pinned at its first keyframe: correctly positioned, sized and dismissible, but invisible, which is indistinguishable from never having rendered ([`43f7464`](https://github.com/dappros/ethora-ai-chat-widget/commit/43f7464))
- **Milestone:** `@ethora/ai-chat-widget` 26.7.2 published, rebuilt against chat component 26.7.4 ([`6ebd9d4`](https://github.com/dappros/ethora-ai-chat-widget/commit/6ebd9d4))

### Playground (`sdk-playground`)
> [ethora-sdk-playground](https://github.com/dappros/ethora-sdk-playground) | 8 commits

- **New:** **AI Assistant configurator with live preview.** A full configurator for the embeddable widget — appearance, colours, fonts, position, launcher, call-to-action — that generates the production embed snippet as you change it. The preview loads the real built widget bundle in an iframe rather than a hand-simulated approximation, so what you see is what the snippet produces ([`8f711ef`](https://github.com/dappros/ethora-sdk-playground/commit/8f711ef), [`346be46`](https://github.com/dappros/ethora-sdk-playground/commit/346be46))
- **New:** **React Native tab with an in-browser Expo Snack.** The React Native chat component now runs in the browser with no account and no install, using the sample app; the local iOS Simulator and Android Emulator route is documented alongside it for a real native run ([`b14c921`](https://github.com/dappros/ethora-sdk-playground/commit/b14c921))
- **New:** Both tabs are wired into the top-level navigation next to Chat, SDK, Auto and HTTP, and a "Book a call" action sits beside "Launch live demo chat" on the Quickstart tab ([`0de10b7`](https://github.com/dappros/ethora-sdk-playground/commit/0de10b7))
- **New:** The server-to-server token endpoint takes an optional TTL, so a QA script can mint a longer-lived token without changing the one-hour default used everywhere else ([`e0f6b8c`](https://github.com/dappros/ethora-sdk-playground/commit/e0f6b8c))
- **Milestone:** The public "try without signup" sandbox and production defaults landed on the main branch ([`03c7148`](https://github.com/dappros/ethora-sdk-playground/commit/03c7148), [`4374a8d`](https://github.com/dappros/ethora-sdk-playground/commit/4374a8d))

### Backend Integration Sample (`sdk-backend-integration`)
> [ethora-sdk-backend-integration](https://github.com/dappros/ethora-sdk-backend-integration) | 1 commit

- **Milestone:** Version bumped to 26.08.01 ([`8cc7d47`](https://github.com/dappros/ethora-sdk-backend-integration/commit/8cc7d47))

---

## Week 36 (Aug 31 – Sep 6, 2026) — Version 26.09 ships; the RN SDK gets a full UI redesign; AI agents learn to share a room and to speak first

**Contributors:** Dmytro Berberov, Roman Leshchuh, Yurii T., Borys Bordunov, Taras Filatov
**Total commits:** ~16 across SDK/app repos + ~10 platform/server | **Active repos:** 5

### Milestones

- **Milestone:** **Version 26.09 released** — the 2608 iteration (August development) is tagged `v26.09` on the monorepo and npm packages roll to 26.09 (`@ethora/mcp-server` [`0966301`](https://github.com/dappros/ethora-mcp-server/commit/0966301)); production platform updated to the 2608 line during the week. September development continues on the `2609` iteration branches (version 26.10).

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 12 commits / v26.7.2 → 26.7.4

- **New:** Chat profile screen rebuilt around the chat photo — a full-bleed hero with name, member count and round action buttons that collapses into a frosted compact bar as you scroll (parallax and collapse run on the UI thread); rooms without a picture get a flat avatar colour with initials. Below it: description and chat-type cards, an **Add Members** row for moderators, the member list with roles and a per-row remove action, **Leave** / **Report** actions (report categories post to the platform), a "…" menu with Edit / Remove photo / Delete and Leave gated on what the signed-in user may do, and a member **search** that folds into the menu when the header is collapsed ([`d8b08a9`](https://github.com/dappros/ethora-chat-component-rn/commit/d8b08a9))
- **New:** User profile screen rebuilt on the same collapsing header — your own profile gets Account, Share, Edit, Log out and a Leave button that runs the SDK's full sign-out teardown; someone else's gets Message and Share. New **About** section and, on your own profile, **Language / Media / Documents** tabs (files come from the platform's v2 files endpoint, split by type) ([`1981077`](https://github.com/dappros/ethora-chat-component-rn/commit/1981077))
- **New:** "Create new chat" redesigned as a full-screen modal — round picture picker, chat name, optional description, side-by-side Cancel/Create, every accent on the configured primary colour ([`1981077`](https://github.com/dappros/ethora-chat-component-rn/commit/1981077))
- **New:** Attach sheet reworked into a Slack-style media picker — a "Photos & Videos" strip with a camera tile and the 12 most recent photos (via the optional `expo-media-library` peer), one-tap attach, "View Library" for the full gallery and "Upload a File" for documents; the grab handle now drags to dismiss ([`921cb80`](https://github.com/dappros/ethora-chat-component-rn/commit/921cb80))
- **New:** Room-list header menu is now a bottom sheet (New Chat / Profile / Settings / Sign out) that pulls down to dismiss; `config.headerMenu: true` shows the SDK's own menu without a host callback; Settings restyled into separate cards; shared full-screen modal headers get the same card treatment ([`70b117a`](https://github.com/dappros/ethora-chat-component-rn/commit/70b117a))
- **Improved:** Room list, headers and composer restyled — light grey list ground, floating search strip, white card headers with rounded bottom corners and soft shadow, the composer mirroring it; tapping a room's avatar now opens the chat; profile header buttons realigned with the collapsed avatar ([`c85add7`](https://github.com/dappros/ethora-chat-component-rn/commit/c85add7), [`ea20c90`](https://github.com/dappros/ethora-chat-component-rn/commit/ea20c90))
- **Improved:** Room-list search overlay reworked (v2) with expanded regression tests, alongside session-refresh handling tweaks ([`dd87da1`](https://github.com/dappros/ethora-chat-component-rn/commit/dd87da1), [`ddcd845`](https://github.com/dappros/ethora-chat-component-rn/commit/ddcd845))
- **Fixed:** Unread counts are no longer silently capped at one history page — when the first page is entirely unread the SDK pages further back (bounded) to find the true boundary, and flags the count as a floor when it cannot; the "typing…" indicator is cleared when the app is backgrounded or the device locks; send-message and last-viewed bookkeeping tightened ([`6386e37`](https://github.com/dappros/ethora-chat-component-rn/commit/6386e37))
- **Fixed:** The signed-in user's description survives login (the About section can show your bio); avatars for names starting with a digit render initials; "Save to gallery" works again on Expo SDK 54+ via the media-library legacy runtime ([`1981077`](https://github.com/dappros/ethora-chat-component-rn/commit/1981077), [`921cb80`](https://github.com/dappros/ethora-chat-component-rn/commit/921cb80))
- **Milestone:** `@ethora/chat-component-rn` 26.7.3 and 26.7.4 published ([`8273b7f`](https://github.com/dappros/ethora-chat-component-rn/commit/8273b7f), [`16e8069`](https://github.com/dappros/ethora-chat-component-rn/commit/16e8069))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 3 commits (branches `2608`/`2609`)

- **New:** Per-agent **LLM model** override in the agent Persona panel (free text with suggestions; empty keeps the platform default), and the SOUL.MD / Heartbeat panels now describe what is live — the agent self-updates its SOUL.MD and the heartbeat scheduler runs — with the schedule grammar (`every 30m`, `idle 15m`, `daily 09:00`, cron) documented inline in en/fr/es. A new diagnostics probe posts into a room with AI agents and transcribes their replies ([`c93f26d`](https://github.com/dappros/ethora-app-reactjs/commit/c93f26d))
- **Improved:** Admin/app-management tabs now show only on the base app host — tenant app hosts present a clean end-user navigation ([`4f6b085`](https://github.com/dappros/ethora-app-reactjs/commit/4f6b085))
- **Fixed:** Product analytics reports image uploads as images (the MIME type is read from the chat component's `metadata.fileType`) ([`3b41f42`](https://github.com/dappros/ethora-app-reactjs/commit/3b41f42))

### Platform API & AI Service

- **New:** **Multi-agent rooms that keep talking.** Rooms with several AI agents no longer fall silent after one exchange — response-gate counters are tracked once per message instead of once per agent, and human-pause, cooldown and spacing rules now *defer* a reply instead of dropping it (newest message wins, one pending reply per agent per room). A configurable cap bounds agent-only turns per human message, and system join/leave notices are never answered.
- **New:** **Real room history for agents.** A per-room transcript log (30-day retention, deduplicated across agents) now feeds each agent's context window: its own turns as assistant messages, everyone else — humans and other agents — as name-attributed turns. Knowledge (RAG) excerpts are injected into the same prompt, so a persona agent stays in character while citing your sources instead of dropping into a stateless FAQ mode.
- **New:** **Heartbeat scheduler.** Agents can now speak first: interval, idle, daily and cron schedules post a proactive turn into every room of an enabled agent, or stay quiet when the model decides there is nothing worth saying. Configured per agent in the admin panel.
- **New:** **Per-agent models.** The agent's LLM model setting is honoured in the chat path, and the model layer handles reasoning-model parameters separately from classic ones, so different model families can be mixed across agents in one install.
- **New:** **One-shot agent reply endpoint** — a server-to-server API call asks an agent a question and gets a single answer back over HTTP, for integrations that need an agent's judgement outside a chat room.
- **Improved:** Operator edits to a running agent (prompt, response mode, cooldown, model, SOUL.MD) hot-apply without a restart; agent tool callbacks resolve against the install's own platform address so self-hosted installs work out of the box; the AI service README is rewritten around Agents, bot instances and multi-agent rooms.
- **New:** **Push notification overhaul for calls and universal builds** — VoIP push notifications and subscriptions (incoming calls ring on iOS through the VoIP channel); a central push gateway delivers to devices running the universal/platform build, with delivery keys routed by build origin (platform vs tenant), owner opt-in and a daily quota for platform-key delivery; the app's public config exposes whether platform push is enabled.
- **Improved:** Apple push delivery now goes direct to APNs over a reused connection (no third-party relay required for iOS).
- **Improved:** Platform usage reports (daily/weekly/monthly) now exclude the platform's own synthetic monitoring traffic — synthetic apps and sessions are flagged at creation and filtered on read, with an opt-in to include them — and the emailed HTML body is capped to stay within mail-provider limits (full data continues in the CSV attachments).

---

## Week 35 (Aug 24 – 30, 2026) — Encrypted-at-rest storage lands in the RN SDK; React 19 support; installs can go invite-only

**Contributors:** Roman Leshchuh, Dmytro Berberov, Borys, Taras Filatov
**Total commits:** ~25 across SDK/app repos + ~6 platform/server | **Active repos:** 5

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 4 commits / v26.6.13 → 26.7.2

- **New:** Secure on-device storage across the SDK — session credentials (REST access and refresh tokens, chat password, secure-media file token) now live in the platform Keychain (iOS) / Keystore-backed encrypted preferences (Android) via the optional `expo-secure-store` peer, and the persisted message-history/room-list cache is AES-256 envelope-encrypted at rest with its key held in the same secure store. Hosts without the peer fall back gracefully (one logged warning), so nothing breaks for existing consumers; verified on device, 18 new unit tests (760 total green) ([`47a9511`](https://github.com/dappros/ethora-chat-component-rn/commit/47a9511))
- **New:** `config.logout` — a built-in "Sign out" item in the room-list header menu with native confirm and host `onBeforeLogout`/`onAfterLogout` hooks, backed by a full teardown (XMPP, state, persisted caches); `useLogout` is now exported so hosts can build their own button on the same awaitable teardown ([`6b312db`](https://github.com/dappros/ethora-chat-component-rn/commit/6b312db))
- **Fixed:** iOS attach sheet — the Take photo / Photo or video / Document rows now reliably open their pickers (a modal-dismiss race left them dead and jammed the document picker), and the picker opens noticeably sooner after the tap ([`6b312db`](https://github.com/dappros/ethora-chat-component-rn/commit/6b312db))
- **Fixed:** Avatar handling — profile and new-chat avatar picking and placeholder rendering corrected ([`56cc6aa`](https://github.com/dappros/ethora-chat-component-rn/commit/56cc6aa))
- **Milestone:** `@ethora/chat-component-rn` 26.7.1 and 26.7.2 published ([`7d3becf`](https://github.com/dappros/ethora-chat-component-rn/commit/7d3becf), [`6b312db`](https://github.com/dappros/ethora-chat-component-rn/commit/6b312db))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 7 commits / v26.7.1 → 26.7.4

- **New:** React 19 support — the package stops bundling react-dom's React 18 reconciler, so hosts on React 19 can adopt the chat component without dependency conflicts ([`eaa46bf`](https://github.com/dappros/ethora-chat-component/commit/eaa46bf))
- **Fixed:** Media loading polish — the loading skeleton now holds while the secure-media file token is absent or rotating, and media is preloaded before the skeleton swaps out, so images no longer flash a blank gap or a broken first paint ([`27fb3fb`](https://github.com/dappros/ethora-chat-component/commit/27fb3fb), [`9cc9a48`](https://github.com/dappros/ethora-chat-component/commit/9cc9a48), [`80ee118`](https://github.com/dappros/ethora-chat-component/commit/80ee118))
- **Milestone:** `@ethora/chat-component` 26.7.1 → 26.7.4 published ([`9848122`](https://github.com/dappros/ethora-chat-component/commit/9848122), [`99be692`](https://github.com/dappros/ethora-chat-component/commit/99be692), [`bb132b4`](https://github.com/dappros/ethora-chat-component/commit/bb132b4), [`eaa46bf`](https://github.com/dappros/ethora-chat-component/commit/eaa46bf))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | ~14 commits (branches `2607`/`2608`/`2609`)

- **New:** PostHog product analytics wired into the web app, giving the team behavioural insight into the live admin/chat experience ([`937d1d1`](https://github.com/dappros/ethora-app-reactjs/commit/937d1d1))
- **New (next release line):** UI language becomes a real per-profile setting — the picker lists the languages the install offers, persists the choice to the user's profile, and on single-language installs the picker and message translation hide entirely ([`65c9c01`](https://github.com/dappros/ethora-app-reactjs/commit/65c9c01), [`c80eed5`](https://github.com/dappros/ethora-app-reactjs/commit/c80eed5))
- **New (next release line):** The login/registration flow honours the app's new self-service registration switch, so invite-only installs present the right door ([`f52298f`](https://github.com/dappros/ethora-app-reactjs/commit/f52298f))
- **Fixed:** Secure-files media — the file token is forwarded to the chat component so membership-gated media renders ([`65af9a1`](https://github.com/dappros/ethora-app-reactjs/commit/65af9a1)); the web app's own token refresh no longer deadlocks on its own lock ([`f07c280`](https://github.com/dappros/ethora-app-reactjs/commit/f07c280))
- **Improved:** Chat component dependency rolled forward across iteration branches; the frontend build now tolerates a stubbed AI widget so deploys don't fail on optional components ([`cf6f2bc`](https://github.com/dappros/ethora-app-reactjs/commit/cf6f2bc), [`d8a9a73`](https://github.com/dappros/ethora-app-reactjs/commit/d8a9a73))
- **Milestone:** Iteration branch `2609` opened — the next release line (version 26.09, shipping with September) starts taking features

### Platform API & AI Service

- **New:** Per-app switch to close self-service registration — operators can now run an install invite-only, with the guard enforced at the API level, not just hidden in the UI
- **New:** User-profile UI language — the platform stores each user's language choice, with the offered language set fixed at install time; an empty set marks a single-language install so clients can skip the picker and translation machinery
- **Improved:** Stricter install-time configuration validation on self-hosted deployments — the platform now verifies its chat-server settings at startup instead of running with incomplete configuration

### Chat Server & Infrastructure

- **Improved:** Tighter default configuration for self-hosted chat-server installs — deployments now supply their own secrets rather than inheriting sample values

---

## Week 34 (Aug 17 – 23, 2026) — Knowledge goes per-agent; the AI widget ships inside the app

**Contributors:** Borys, Roman Leshchuh, Dmytro Berberov, Yurii T.
**Total commits:** ~29 across SDK/app repos + ~27 platform/server | **Active repos:** 6

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 11 commits (branch `2607`)

- **New:** The Knowledge panel is now scoped per agent — each AI agent sees and manages its own indexed sources, instead of one shared per-app list ([`48594ee`](https://github.com/dappros/ethora-app-reactjs/commit/48594ee))
- **Improved:** The embeddable AI widget is now served by the web app itself and pinned as a versioned dependency instead of a committed bundle — installs no longer depend on an external widget host, and the admin preview drives the widget through its public control API ([`4f8b52c`](https://github.com/dappros/ethora-app-reactjs/commit/4f8b52c), [`fb927fe`](https://github.com/dappros/ethora-app-reactjs/commit/fb927fe), [`ea30d6c`](https://github.com/dappros/ethora-app-reactjs/commit/ea30d6c), [`67d1c8c`](https://github.com/dappros/ethora-app-reactjs/commit/67d1c8c))
- **Fixed:** Widget bundles load as classic scripts so built embeds run everywhere ([`7cc171d`](https://github.com/dappros/ethora-app-reactjs/commit/7cc171d)); the shipped widget bundle wins over stale env configuration ([`5ad01f7`](https://github.com/dappros/ethora-app-reactjs/commit/5ad01f7)); the preview can load the widget from its dev server during development ([`6c6d2e1`](https://github.com/dappros/ethora-app-reactjs/commit/6c6d2e1))
- **Improved:** Chat component dependency updated, session-refresh handling improved, assorted bug fixes ([`8e7e46a`](https://github.com/dappros/ethora-app-reactjs/commit/8e7e46a), [`75bd871`](https://github.com/dappros/ethora-app-reactjs/commit/75bd871), [`e8f6e77`](https://github.com/dappros/ethora-app-reactjs/commit/e8f6e77))

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 7 commits / v26.6.11 → 26.6.13

- **Fixed:** Secure media rendered blank in hosts that pass a login snapshot — three holes closed: the session resolver now adopts the fresher persisted session (so the file token needed by membership-gated media is present), bootstrap rotates the session *before* the first chat connect (so short-lived chat passwords are live at boot instead of dead-ending on a connection error), and the testbed folds the top-level file token into the resolved user ([`08dde9b`](https://github.com/dappros/ethora-chat-component-rn/commit/08dde9b), [`788b692`](https://github.com/dappros/ethora-chat-component-rn/commit/788b692), [`2295ca2`](https://github.com/dappros/ethora-chat-component-rn/commit/2295ca2))
- **New:** Secure-upload fallback — when the platform doesn't serve the secure files endpoint yet, uploads retry on the legacy endpoint and remember that for the session, so the SDK works against older self-hosted platforms ([`08dde9b`](https://github.com/dappros/ethora-chat-component-rn/commit/08dde9b))
- **Improved:** Session-refresh and file-handling logic reworked across the SDK ([`dcded7d`](https://github.com/dappros/ethora-chat-component-rn/commit/dcded7d), [`30f148a`](https://github.com/dappros/ethora-chat-component-rn/commit/30f148a), [`cf3c654`](https://github.com/dappros/ethora-chat-component-rn/commit/cf3c654))
- **Milestone:** `@ethora/chat-component-rn` 26.6.13 published ([`6d30de4`](https://github.com/dappros/ethora-chat-component-rn/commit/6d30de4))

### Embeddable AI Widget (`ai-chat-widget`)
> [ethora-ai-chat-widget](https://github.com/dappros/ethora-ai-chat-widget) | 10 commits / v26.7.1

- **New:** Public control API + embed attribute manifest — host pages can now drive the widget programmatically, and every supported embed attribute is documented in a machine-readable manifest ([`e54872b`](https://github.com/dappros/ethora-ai-chat-widget/commit/e54872b))
- **New:** Configurable starter message greets visitors by default; roomier desktop default size; media features off by default for leaner embeds ([`8571b0c`](https://github.com/dappros/ethora-ai-chat-widget/commit/8571b0c), [`1904529`](https://github.com/dappros/ethora-ai-chat-widget/commit/1904529))
- **Fixed:** Greeting reliability — the welcome message now survives history loads, hidden room-join notices and message ordering, and resumed visitor sessions no longer get stuck ([`cb007c1`](https://github.com/dappros/ethora-ai-chat-widget/commit/cb007c1), [`11906fb`](https://github.com/dappros/ethora-ai-chat-widget/commit/11906fb), [`28f9e73`](https://github.com/dappros/ethora-ai-chat-widget/commit/28f9e73), [`b47145e`](https://github.com/dappros/ethora-ai-chat-widget/commit/b47145e))
- **Milestone:** Widget version 26.7.1 cut, shipped with a prebuilt embed bundle and pinned by the web app; npm package refreshed ([`9832b28`](https://github.com/dappros/ethora-ai-chat-widget/commit/9832b28), [`020391b`](https://github.com/dappros/ethora-ai-chat-widget/commit/020391b), [`4a6d4b9`](https://github.com/dappros/ethora-ai-chat-widget/commit/4a6d4b9))

### Monorepo (`ethora`)
> [ethora](https://github.com/dappros/ethora) | 1 commit

- **Docs:** README links repaired — retired docs-portal links replaced, MCP server repo rename reflected, product page links refreshed ([`dad32884`](https://github.com/dappros/ethora/commit/dad32884))

### Platform API & AI Service

- **New:** Agent-scoped knowledge sources — indexed website sources are now tracked per AI agent instead of per app, with a migration that backfills existing installs; retrieval falls back to the app-level index when an agent has no scoped sources yet, so answers keep working through the transition
- **New:** The chat list now returns each room's last message for the signed-in user, so clients can render conversation previews without extra requests
- **New:** The platform's public config now exposes the install's chat-server host, so clients on self-hosted deployments auto-discover the right endpoint
- **Improved:** Website crawling for agent knowledge hardened for large sites — deep crawls are bounded and processed in prioritized batches, browser concurrency is capped, and the crawl engine was upgraded, so indexing a big site no longer risks exhausting server memory
- **Improved:** Chat-session token lifetimes are now configurable per install — interactive sessions default to short-lived tokens while embedded-widget visitors get long-lived ones, balancing security and visitor convenience
- **New:** API session security strengthened with refresh-token rotation and reuse detection on the release line
- **Docs:** Push service architecture and API documented

### Chat Server & Infrastructure

- **New:** Deploy tooling now runs data migrations automatically as part of install and update — schema and data changes ship with the release instead of requiring manual steps, and already-migrated hosts are detected and re-run safely when a migration is revised
- **Improved:** Chat-token lifetime knobs wired through the deploy environment configuration
- **Fixed:** Crawler service healthcheck corrected; installer treats an empty component directory as missing sources instead of failing part-way

---

## Week 33 (Aug 10 – 16, 2026) — Web Index overhaul for AI agents; push credentials go self-serve

**Contributors:** Borys, Yurii T., Dmytro Berberov
**Total commits:** ~19 across SDK/app repos + ~23 platform/server | **Active repos:** 5

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 12 commits (branch `2607`)

- **New:** Web Index management for AI agents got a full workover in the admin panel — the operator now sees a crawl *start* and watches the index fill live as pages arrive (event-driven, no manual refetch) ([`9c1c606`](https://github.com/dappros/ethora-app-reactjs/commit/9c1c606), [`92b37b5`](https://github.com/dappros/ethora-app-reactjs/commit/92b37b5), [`9705ff2`](https://github.com/dappros/ethora-app-reactjs/commit/9705ff2)); you can view the stored markdown of any indexed URL ([`2f2dfb9`](https://github.com/dappros/ethora-app-reactjs/commit/2f2dfb9)), bulk-remove URLs ([`d1f1ed0`](https://github.com/dappros/ethora-app-reactjs/commit/d1f1ed0)), page through large indexes ([`cd2b4f9`](https://github.com/dappros/ethora-app-reactjs/commit/cd2b4f9)), and get a re-crawl offer when a URL is already indexed ([`34bd94e`](https://github.com/dappros/ethora-app-reactjs/commit/34bd94e))
- **New:** Mobile push credentials are now managed from the app settings screen — upload, status check and removal for both APNs auth keys and Firebase service accounts, no support ticket needed ([`e75b14c`](https://github.com/dappros/ethora-app-reactjs/commit/e75b14c))
- **Improved:** Chat component dependency updated with adaptive-layout fixes ([`0134420`](https://github.com/dappros/ethora-app-reactjs/commit/0134420)); login/register page fixes and general UI polish ([`71ab109`](https://github.com/dappros/ethora-app-reactjs/commit/71ab109), [`e3fbe70`](https://github.com/dappros/ethora-app-reactjs/commit/e3fbe70))
- **Refactored:** Legacy v1 site-crawl UI removed from the admin frontend ([`dab3b78`](https://github.com/dappros/ethora-app-reactjs/commit/dab3b78))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 5 commits / v26.6.3 → 26.6.6

- **New:** File handling moved to the platform's v2 files endpoint with a configurable base URL — media previews, file/photo modals, chat-list thumbnails and unsupported-type fallbacks all updated ([`cda02e6`](https://github.com/dappros/ethora-chat-component/commit/cda02e6))
- **Improved:** Upload fallback logic so hosts on older platform versions keep working against the previous file endpoint, backed by a new regression test suite ([`6cdbb7d`](https://github.com/dappros/ethora-chat-component/commit/6cdbb7d), [`59b6e42`](https://github.com/dappros/ethora-chat-component/commit/59b6e42))
- **Milestone:** `@ethora/chat-component` 26.6.5 and 26.6.6 published ([`7a8b2ec`](https://github.com/dappros/ethora-chat-component/commit/7a8b2ec), [`0a469db`](https://github.com/dappros/ethora-chat-component/commit/0a469db))

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 2 commits / v26.6.11

- **Fixed:** Media and video message rendering hardened (video player sizing/controls) and auth/API request handling reworked, with expanded test coverage for API requests and customer-feedback fixes ([`1b3e50f`](https://github.com/dappros/ethora-chat-component-rn/commit/1b3e50f))
- **Milestone:** `@ethora/chat-component-rn` 26.6.11 published ([`1c2516c`](https://github.com/dappros/ethora-chat-component-rn/commit/1c2516c))

### Platform API & AI Service

- **New:** Website crawling for agent knowledge is now fully asynchronous — the crawl endpoint answers immediately and every crawl runs on a queue as a tracked job. Crawled pages are delivered to the platform in incremental batches with progress events to the requesting operator, and crawl failures are reported instead of silently dropped.
- **New:** Web Index API round-out — fetch a single indexed URL with its stored markdown, opt-in pagination for the sources list, duplicate-crawl detection with an explicit re-crawl path, and reindexing queued as a tracked job. The base app's assistant can crawl beyond the standard per-tenant page ceilings.
- **New:** Push credential management API — upload, status and delete endpoints for APNs auth keys and Firebase service accounts, and Push endpoints are now documented in the public API reference.
- **Improved:** Chat-session authentication modernized — the platform now issues short-lived signed chat tokens (JWT) for XMPP sessions, automatically re-issued when the API session refreshes, replacing static per-user chat credentials.
- **Improved:** Background job consumers now self-heal after transient Redis connection blips, so queued work (crawls, exports, notifications) resumes without a restart.
- **Fixed:** Chat-widget sessions now provision correctly for apps whose only bot is a modern bot instance (no legacy bot user required).
- **Refactored:** Legacy v1 site-crawl routes and dead crawl-result handling removed.

### Chat Server & Infrastructure

- **New:** The chat server now accepts JWT-based (SASL) authentication with a signing secret provisioned automatically by the deploy tooling — the server-side half of the short-lived chat-token flow.
- **Docs:** Deploy documentation covers the chunked crawl-callback flow and its batch-size tuning knobs.

---

## Week 32 (Aug 3 – 9, 2026) — Unread counts land in the chat list; audit trail extends to room membership

**Contributors:** Borys, Yurii T., Roman Leshchuh
**Total commits:** ~2 across SDK/app repos + ~20 platform/server | **Active repos:** 4

### React Native SDK (`sdk-reactnative`)
> [ethora-chat-component-rn](https://github.com/dappros/ethora-chat-component-rn) | 2 commits / v26.6.10

- **Milestone:** `@ethora/chat-component-rn` package version realigned to 26.6.10 for npm publishing ([`f71aae1`](https://github.com/dappros/ethora-chat-component-rn/commit/f71aae1))
- **Improved:** Message-translation UI polish (translation bubble + language selector) and hardened "new messages" divider ordering, backed by new Jest regression suites for manual-translation mirroring and divider order; testbed app updated to exercise the flows ([`f71aae1`](https://github.com/dappros/ethora-chat-component-rn/commit/f71aae1), [`0e60e82`](https://github.com/dappros/ethora-chat-component-rn/commit/0e60e82))

### Platform API & AI Service

- **New:** Per-room unread message counts in the chat list — the signed-in user's room list now returns an unread count per room (computed fresh on each request, with a safety cap), building on the server-side unread-counts API shipped earlier. Chat UIs get accurate badge counts without client-side bookkeeping.
- **New:** Compliance audit trail now covers room membership — room join and leave events, plus message creation, are persisted into the platform audit logs alongside the existing edit/delete and history-access events, completing the who-did-what picture for regulated deployments.
- **Improved:** The website-crawler (RAG ingestion) result callback into the platform is now authenticated with a shared secret, matching the convention already used between platform services; previously silent callback failures are now surfaced in logs.
- **Fixed:** Secure chat attachments now render correctly when embedded by the chat app across origins (resource-policy header adjusted on the token-gated file endpoint).
- **Fixed:** The AI widget's chat binding now saves correctly for apps without a legacy bot user, so the admin panel selection no longer reverts to "None" after reload.
- **Refactored:** Legacy built-in API monitoring retired in favour of the platform's external monitoring stack.

### Chat Server & Infrastructure

- **Improved:** Local development installs now enable the message- and membership-tracking modules out of the box, matching production audit-trail behaviour.
- **Improved:** Installer and deploy hardening continues — chat-server admin commands no longer hang on interactive input, the AI database's readiness is verified with a real query before schema setup, chat-server config rendering is portable to macOS/BSD tooling, and the crawler callback secret is provisioned automatically at install time.
- **Fixed:** Local deployment templates corrected (valid owner-email domain, correct crawler callback URL wiring).

---

## Week 31 (Jul 27 – Aug 2, 2026) — Version 26.08 cut; secure attachments & a full compliance audit trail

**Contributors:** Yurii T., Borys, Dmytro Berberov
**Total commits:** ~7 across SDK/app repos + ~25 platform/server | **Active repos:** 8

- **Milestone:** **Version 26.08 cut.** The July development cycle was tagged `v26.08` on July 31 and npm package versions rolled over on August 1 (`@ethora/setup` 26.08 ([`0ebf165`](https://github.com/dappros/ethora-setup/commit/0ebf165)), `@ethora/mcp-server` 26.08 ([`4623e93`](https://github.com/dappros/ethora-mcp-server/commit/4623e93))). Development continues on the next monthly iteration.

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 3 commits (branch `2607`)

- **Improved:** Login and registration pages refreshed as part of the sitewide design pass ([`c33b5d1`](https://github.com/dappros/ethora-app-reactjs/commit/c33b5d1), [`a65adda`](https://github.com/dappros/ethora-app-reactjs/commit/a65adda))

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 1 commit

- **Refactored:** Deploy-script build stamps kept out of version control across the SDK ecosystem ([`c9d41f6`](https://github.com/dappros/ethora-chat-component/commit/c9d41f6))

### Platform API & AI Service

- **New:** Secure chat attachments — file uploads to a chat can now be membership-gated: attachments are stored in a private bucket and streamed back only to authenticated room members via short-lived file tokens. Documented in the public API reference.
- **New:** Compliance audit trail expanded — message edit and delete events, authentication outcomes, and archived-history reads are all persisted into the platform's audit logs, giving regulated deployments a verifiable record of what happened and who accessed what.
- **New:** Immutable audit-log export — a scheduled job ships audit logs to a write-once (immutable) S3 bucket, a building block for HIPAA-style retention and tamper-evidence requirements.
- **Improved:** App-wide broadcast messaging is now restricted to admin and B2B roles, following a customer feedback round.
- **Fixed:** Image and video attachment previews no longer fail on freshly provisioned servers, and upload errors are surfaced in server logs for faster diagnosis.
- **Refactored:** Legacy analytics count/graph routes retired.

### Chat Server & Infrastructure

- **New:** The chat server now reports message edit and delete events, and archived-history access, to the platform audit trail — configurable per deployment, wired automatically by the installer.
- **Improved:** Deployment wiring for the secure-attachments flow (dedicated vhost + environment) and for per-install audit callback endpoints.
- **Fixed:** Installer robustness on localhost and clean-machine installs — chat-server config rendering, callback URL derivation, and stateful data directories all handled safely.

---

## Week 30 (Jul 20 – 26, 2026) — Translation goes regional; compliance audit logging on the chat server

**Contributors:** Roman Leshchuh, Yurii T., Borys
**Total commits:** ~5 across SDK/app repos + ~14 platform/server | **Active repos:** 5

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 4 commits / v26.6.3

- **Improved:** The language picker now works with regional language ids (`en-CA`, `es-US`, `fr-CA`), so readers in regional locales get the right translation variant ([`6677988`](https://github.com/dappros/ethora-chat-component/commit/6677988))
- **Fixed:** Sender avatars now resolve through the live user set instead of the message's own stale copy, so photo updates show everywhere ([`08eb345`](https://github.com/dappros/ethora-chat-component/commit/08eb345))
- **Fixed:** A translation that comes back identical to the original is no longer shown as a "translation" ([`5406622`](https://github.com/dappros/ethora-chat-component/commit/5406622))
- **Milestone:** `@ethora/chat-component` 26.6.3 published ([`9845df9`](https://github.com/dappros/ethora-chat-component/commit/9845df9))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 1 commit (branch `2607`)

- **Improved:** Chat component updated to 26.6.3 with the regional language-code alignment ([`e9d116e`](https://github.com/dappros/ethora-app-reactjs/commit/e9d116e))

### Chat Server & Infrastructure

- **New:** Compliance-grade audit logging for message-history access — reads of archived chat history are now tracked on the server with request/response outcome and delivered to a configurable audit endpoint. A building block for regulated deployments (healthcare, finance) that need a verifiable trail of who accessed which conversation history.
- **Improved:** Edited messages are re-translated automatically, so readers in other languages always see the translation of the latest text, not the original version.
- **Improved:** Self-hosted deployments can now configure the chat server's translation endpoint directly from the deployment config.
- **Fixed:** Installer robustness — deployment data-sentinel files are written safely alongside data directories, removing an upgrade crash path.

---

## Week 29 (Jul 13 – 19, 2026) — AI message translation lands end-to-end

**Contributors:** Roman Leshchuh, Yurii T.
**Total commits:** ~41 across SDK/app repos + ~4 platform API | **Active repos:** 4

The headline feature of the 26.08 iteration arrived this week: **real-time AI message translation**. Every participant can read the room in their own language while senders keep typing in theirs. Translations travel inside the message itself, so there is no extra round-trip on read.

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 35 commits / v26.6.0 → 26.6.1

- **New:** Sender-side pre-translation — outgoing messages carry their translations inside the message stanza, and each reader resolves the right one by their full locale (e.g. `fr-CA`) with base-language fallback ([`9776215`](https://github.com/dappros/ethora-chat-component/commit/9776215), [`29d69b9`](https://github.com/dappros/ethora-chat-component/commit/29d69b9))
- **New:** Reader controls — switch between automatic and on-demand translation from the language modal; hosts can pin the mode via `forceType`, toggle the language picker, or drive it externally ([`6f7b0d2`](https://github.com/dappros/ethora-chat-component/commit/6f7b0d2), [`00d3c7b`](https://github.com/dappros/ethora-chat-component/commit/00d3c7b), [`dc2d057`](https://github.com/dappros/ethora-chat-component/commit/dc2d057))
- **New:** Translated messages get a real UI — quoted original with the translation emphasized ([`e26077b`](https://github.com/dappros/ethora-chat-component/commit/e26077b), [`5c69cab`](https://github.com/dappros/ethora-chat-component/commit/5c69cab))
- **New:** Static UI localization completed — new-chat, user-selection, room-menu, profile, settings and auth surfaces all follow the language picker ([`26b869b`](https://github.com/dappros/ethora-chat-component/commit/26b869b), [`dbe1489`](https://github.com/dappros/ethora-chat-component/commit/dbe1489))
- **New:** Edited messages are marked as edited, and the flag survives a cache restore ([`996b85f`](https://github.com/dappros/ethora-chat-component/commit/996b85f))
- **Improved:** Send-path performance — translation taken off the send path, the per-send history-fetch storm eliminated, and persist transforms repaired so sends are fast again ([`7eb7daf`](https://github.com/dappros/ethora-chat-component/commit/7eb7daf), [`02cd49f`](https://github.com/dappros/ethora-chat-component/commit/02cd49f))
- **Fixed:** Local cache stability — storage quota budget corrected, member rosters no longer evict the message cache, and live-only state is kept out of persistence ([`5e5baf0`](https://github.com/dappros/ethora-chat-component/commit/5e5baf0), [`34da5f9`](https://github.com/dappros/ethora-chat-component/commit/34da5f9), [`1e519f2`](https://github.com/dappros/ethora-chat-component/commit/1e519f2))
- **Fixed:** Refresh no longer flashes the login form — the stored session is restored seamlessly ([`4a6a2ef`](https://github.com/dappros/ethora-chat-component/commit/4a6a2ef), [`06765ae`](https://github.com/dappros/ethora-chat-component/commit/06765ae))
- **Fixed:** An incoming call no longer double-rings when the tab is open but backgrounded ([`75a2542`](https://github.com/dappros/ethora-chat-component/commit/75a2542))
- **Fixed:** Reconnect polish — no more "Deleted User" names or raw room addresses in notifications right after reconnect ([`7ad8a6f`](https://github.com/dappros/ethora-chat-component/commit/7ad8a6f))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 6 commits (branch `2607`)

- **New:** AI message translation wired into the hosted web app ([`2185e0f`](https://github.com/dappros/ethora-app-reactjs/commit/2185e0f), [`ae68728`](https://github.com/dappros/ethora-app-reactjs/commit/ae68728))
- **Fixed:** App bootstrap repaired after the chat-component upgrade ([`324fd32`](https://github.com/dappros/ethora-app-reactjs/commit/324fd32))

### Platform API & AI Service

- **Fixed:** Call push notifications now reliably reach devices — the push matcher uses the full user address, so incoming-call alerts line up with stored subscriptions.
- **Improved:** Push-subscription hygiene — device tokens that the push provider reports as dead are pruned automatically, keeping delivery lists clean.

---

## Week 28 (Jul 6 – 12, 2026) — Calls & performance polish; load-testing and monitoring for self-hosted

**Contributors:** Roman Leshchuh, Yurii T., Taras Filatov, Borys
**Total commits:** ~50 across SDK/app repos + ~20 platform/server | **Active repos:** 8

### React.js SDK (`sdk-reactjs`)
> [ethora-chat-component](https://github.com/dappros/ethora-chat-component) | 33 commits

- **New:** Groundwork for multilingual chat — built-in UI string tables (en/fr/es) with a `useT` hook and `config.i18n`, plus an on-demand Translate button with a pluggable `onTranslate` callback so hosts can bring their own translation endpoint ([`97fd6b0`](https://github.com/dappros/ethora-chat-component/commit/97fd6b0), [`8ee22ab`](https://github.com/dappros/ethora-chat-component/commit/8ee22ab))
- **New:** Online-members popover on group rooms — see who is online straight from the room list or chat header ([`1818621`](https://github.com/dappros/ethora-chat-component/commit/1818621), [`f199238`](https://github.com/dappros/ethora-chat-component/commit/f199238))
- **Improved:** Audio calls get their own compact call card with redesigned spacing, no clipped controls, and correct sizing on mobile toolbars ([`264e636`](https://github.com/dappros/ethora-chat-component/commit/264e636), [`a85da38`](https://github.com/dappros/ethora-chat-component/commit/a85da38), [`258db67`](https://github.com/dappros/ethora-chat-component/commit/258db67))
- **Improved:** Calls ring on any app page, with an OS-level notification when the tab is not visible ([`1bc873a`](https://github.com/dappros/ethora-chat-component/commit/1bc873a))
- **Fixed:** Call history is reliable — the server call state is the canonical log entry, with a local "call ended" fallback so no call disappears from history ([`3495a05`](https://github.com/dappros/ethora-chat-component/commit/3495a05), [`cb89d37`](https://github.com/dappros/ethora-chat-component/commit/cb89d37))
- **Improved:** Chat-loading performance on heavy accounts — a loading stall and duplicate presence sweeps were eliminated, with regression tests added ([`f5e23cd`](https://github.com/dappros/ethora-chat-component/commit/f5e23cd), [`6f43437`](https://github.com/dappros/ethora-chat-component/commit/6f43437), [`c4938e3`](https://github.com/dappros/ethora-chat-component/commit/c4938e3))
- **Fixed:** Unread polish — the New Messages delimiter survives realtime sync, and per-room badges no longer flicker on refresh ([`c8dab3d`](https://github.com/dappros/ethora-chat-component/commit/c8dab3d), [`3aa9270`](https://github.com/dappros/ethora-chat-component/commit/3aa9270))
- **Fixed:** Mobile layout pass — room list adapts to narrow widths without horizontal scroll, long 1:1 titles no longer widen rows, and in-app toasts show across the whole app ([`efbf290`](https://github.com/dappros/ethora-chat-component/commit/efbf290), [`6717857`](https://github.com/dappros/ethora-chat-component/commit/6717857), [`d39d212`](https://github.com/dappros/ethora-chat-component/commit/d39d212))

### Web App (`app-reactjs`)
> [ethora-app-reactjs](https://github.com/dappros/ethora-app-reactjs) | 14 commits (branches `2607`/`2606`)

- **Improved:** Theming correctness — attach/mic/send icon chips and system messages no longer render as black squares under dark secondary colours, and per-name avatar colours are preserved ([`189b73e`](https://github.com/dappros/ethora-app-reactjs/commit/189b73e), [`ab328a8`](https://github.com/dappros/ethora-app-reactjs/commit/ab328a8))
- **Fixed:** Mobile UX — flicker removed, menu-bar grey strip closed, room-list padding made responsive ([`2094de7`](https://github.com/dappros/ethora-app-reactjs/commit/2094de7), [`e0079f4`](https://github.com/dappros/ethora-app-reactjs/commit/e0079f4))
- **Testing:** WordPress-embed network probe added to the diagnostics suite ([`d915387`](https://github.com/dappros/ethora-app-reactjs/commit/d915387))

### Embeddable AI Widget (`ethora-ai-chat-widget`)
> [ethora-ai-chat-widget](https://github.com/dappros/ethora-ai-chat-widget) | 1 commit

- **Improved:** The embed script accepts `data-api-url` as an alias for `data-api-base`, matching the documented attribute ([`c2e7f8d`](https://github.com/dappros/ethora-ai-chat-widget/commit/c2e7f8d))

### Developer tooling (`mcp-server`)
> [ethora-mcp-server](https://github.com/dappros/ethora-mcp-server) | 1 commit (branch `feat/ai-agents`)

- **New:** AI-agents branch brought to 26.07 API parity, with the B2B AI bootstrap fixed for freshly created apps ([`364ffc2`](https://github.com/dappros/ethora-mcp-server/commit/364ffc2))

### Uptime & Self-hosted Ops (`ethora-uptime`)
> [ethora-uptime](https://github.com/dappros/ethora-uptime) | 6 commits

- **New:** Built-in load-testing tool with scenarios, a metrics endpoint, and Grafana/Prometheus links in the load-testing UI ([`57c4885`](https://github.com/dappros/ethora-uptime/commit/57c4885), [`8dd8f98`](https://github.com/dappros/ethora-uptime/commit/8dd8f98))
- **New:** TLS certificate-expiry checks — self-hosted operators get warned before certificates lapse ([`668e2a8`](https://github.com/dappros/ethora-uptime/commit/668e2a8))
- **New:** Opt-in AI journey for synthetic monitoring, kept out of the standard B2B journey by default ([`ee2e3a7`](https://github.com/dappros/ethora-uptime/commit/ee2e3a7))

### Chat Server & Infrastructure

- **New:** Self-hosted monitoring stack — Grafana and Prometheus dashboards ship with the deployment, served behind authenticated access and auto-started on update.
- **New:** Load-testing tooling wired into the server deployment, so operators can benchmark their own instance before go-live.
- **Docs:** AWS backup and restore runbook plus a customer-facing guide for self-hosted deployments.
- **Fixed:** Profile images are returned for chat members via the API.

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

