# Ethora chat protocol

How an Ethora client talks to the chat stack: identity, connecting, rooms, the message
stanza and its `<data>` element, history, read state, push notifications and AI agents.
It is written from the shipped code (web chat component, ejabberd modules, API, push
service, ai-service) as of release 26.10, so it describes what runs today, including
the rough edges, rather than an ideal design.

Read this if you are building or porting a client (web, React Native, native), a bot,
or a server-side integration that must interoperate with the Ethora apps.

The older [chats.md](chats.md) predates the `appId_userId` identity scheme and the
current modules; keep it only for historical context.

## 1. Components

```
client (web / RN / widget / bot)
   |  HTTPS: REST API (login, rooms, members, files, push tokens)
   |  WSS:   XMPP over WebSocket (wss://<xmpp host>/ws)
   v
API (Express)  <---- HTTP callbacks ----  ejabberd + custom modules
   |   writes MongoDB (users, chats, memberships, message archive)   |
   |                                                                  v
   +--> push service  <---- offline_message_hook (mod_offline_post) --+
   +--> ai-service (bots are ordinary XMPP users with a `-bot` suffix)
```

ejabberd keeps its own state in MySQL (accounts, MUC rooms, MAM archive, mucsub). The
custom modules never read or write MongoDB directly; they call the API over HTTP and
the API updates MongoDB. The API never reads the MySQL archive for the room list; it
keeps its own copy of messages (section 8.4).

## 2. Identity and naming

All ids below are 24-character hex MongoDB ObjectIds unless stated otherwise.

| Thing | Shape | Notes |
|---|---|---|
| User JID localpart (`xmppUsername`) | `${appId}_${userId}` | Returned by login as `user.xmppUsername`, with `user.xmppPassword`. Independent of any wallet. |
| Full user JID | `${appId}_${userId}@<xmppHost>/<resource>` | `xmppHost` comes from `GET /v1/apps/get-config`. The resource is assigned by the server at bind. |
| MUC nick / occupant resource | the JID localpart | Clients join as `room@conference.<host>/${appId}_${userId}`. Never a display name. `mod_ethora` rejects any other nick (section 4.2). |
| Room JID | `${appId}_${roomId}@conference.<xmppHost>` | The localpart is the `name` field of the chat record and the `chatName` in REST. |
| 1:1 (private) room localpart | `${xmppUsernameA}-${xmppUsernameB}`, sorted | Both sides derive the same name. Encrypted pairs use the same with an `-e2ee` suffix so a pair can hold a plaintext and an encrypted room. Whether a room is encrypted is the stored `e2ee` flag, never the name. |
| App system account | `${appId}_${appId}` | Creates rooms and sends invites on behalf of the app (`systemChatAccount.jid` in get-config). |
| AI agent (bot instance) | `${appId}_${botUserId}-bot` | A normal user record with `isBot: true`; the suffix is what clients and the gate use to recognise bots. |
| Widget visitor | `${appId}_widget-${24 hex}` | Anonymous website visitors provisioned by the AI chat widget. |
| Default (pinned) rooms | listed in get-config `defaultRooms[].jid` | Every user of the app is a member; see section 5.4 for how membership is maintained. |

Rules that follow from this:

- A room's app is the prefix of its localpart up to the first `_`. A user may only
  join rooms whose prefix equals their own app prefix (section 4.2). Owner sessions on
  a parent app that work with child apps are the exception handled by the API, not by
  the XMPP layer.
- A client can tell a 1:1 room from a group room by splitting the localpart on `-`
  into exactly two user localparts; "the half that is not me" is the peer.
- Duplicate prefixes (`${appId}_${appId}_${userId}`) have been seen in old data; the
  web component collapses them when comparing usernames.

## 3. Connecting

1. Call `POST /v2/users/login-with-email` (or a social/wallet login). The response
   carries `token` (API JWT), `refreshToken`, `user.xmppUsername`, `user.xmppPassword`,
   plus `wsToken` and `fileToken` for other services.
2. Read `xmppHost`, `defaultRooms`, `systemChatAccount` and `e2eeEnabled` from
   `GET /v1/apps/get-config?domainName=<app>`.
3. Open the XMPP session over WebSocket: service `wss://<xmppHost>/ws`, domain
   `<xmppHost>`, username `xmppUsername`, password `xmppPassword` (SASL PLAIN over
   TLS; nginx terminates TLS and proxies to ejabberd's `/ws`). BOSH is also exposed
   at `https://<xmppHost>/bosh`.
4. On `online`, send a bare `<presence/>`, then join rooms (section 5.3).

Server settings that matter:

| Setting | Value | Effect on a client |
|---|---|---|
| Anonymous auth | enabled at the server, but `mod_ethora` refuses MUC presence from anonymous sessions | Always log in with real credentials. |
| Stream management | `mod_stream_mgmt` with `resume_timeout: 0` | Acks work (`<r/>`/`<a/>`), resumption does not: reconnect means a new session, re-join every room, re-run startup. |
| Ping | `mod_ping` defaults; clients send `<iq type='get'><ping xmlns='urn:xmpp:ping'/></iq>` | Use it as a liveness check behind proxies. |
| Max sessions per user | 10 | More devices than that evict the oldest. |
| Max stanza size | 256 KB | Large `<data>` payloads (many attachments, long `mainMessage`) must stay under it. |
| Offline storage | `mod_offline`, 100 messages per user | Only relevant for 1:1 `type='chat'` messages; room messages are in MAM. |

## 4. Server-side guards

### 4.1 Bans and blocks

| Feature | Module | Behaviour |
|---|---|---|
| Room ban | `mod_user_ban` | A message to a room where the sender has a live ban bounces as `<error type='cancel'><forbidden/><text>You are banned in this room!</text>`. Bans are set with an IQ `<query xmlns='ns:deepx:muc:user:ban' action='ban|unban|get_list' user type='room|all' room time comment/>` and need an affiliation (member can ban nobody, admin cannot ban an owner, and so on). |
| User block | `mod_user_block` | IQs on `ns:deepx:muc:user:block`, `:unblock`, `:blocklist` store a per-user list. Nothing on the server enforces it on delivery: blocking is a client-side filter. |

### 4.2 `mod_ethora` presence filter

On every MUC join presence the module checks, in this order, and answers with
`<error><forbidden/><text>...</text>` when a check fails:

| Text | Cause |
|---|---|
| `wrong app name` | room localpart does not start with the sender's app prefix (the `admin` account is exempt) |
| `wrong nickname` | occupant nick is not the sender's JID localpart |
| `anonymous not allowed` | session authenticated anonymously |

The API recognises `wrong app name` and falls back to its admin XMPP session for
room provisioning, so a client should treat it as "this room is not yours", not retry.

## 5. Rooms

### 5.1 Creating rooms

Room creation on the XMPP side is restricted to the admin ACL (`access_create:
muc_create_admin`), so clients create rooms through REST and the API creates the MUC
with `create_room_with_opts` (persistent, `mam: true`, `allow_subscription: true`,
owner affiliation, `members_only` for group rooms):

| Call | Creates |
|---|---|
| `POST /v1/chats` `{ title, description?, type: 'public' \| 'group', picture?, uuid?, members?: [xmppUsername] }` | a room named `${appId}_${uuid or new id}` |
| `POST /v1/chats/private` `{ username: <peer xmppUsername>, e2ee? }` | the 1:1 room from section 2, idempotent |
| `POST /v1/apps` with `createDefaultChat: true` | an app plus its first default room |

The response (and `GET /v1/chats/my`) carries the room record: `_id, name, title,
description, type, picture, appId, isAppChat, createdAt`.

### 5.2 Membership

Membership is a MongoDB row (`user_to_chats`: `chatName, userId, updated, muted`) plus
the matching MUC affiliation (`member`, or `owner` for the creator). The API keeps the
two in step:

| Action | REST | XMPP side effect |
|---|---|---|
| add members | `POST /v1/chats/users-access` `{ chatName, members: [xmppUsername, ...] }` | `set_room_affiliation member`, invite stanza from the system account |
| remove members | `DELETE /v1/chats/users-access` `{ chatName, members }` (room creator only) | affiliation `none` |
| list members | `GET /v1/chats/users?chatName=<name>&limit=&offset=` | - |
| leave / join by the user | join presence (section 5.3) | `mod_track_member` posts `join` / `exit` to the API, which upserts or deletes the membership row |

Clients that change membership also broadcast a hint so other members refresh their
member list without polling:

```xml
<message to="<room jid>" type="groupchat" id="members-changed-<ts>-<rand>">
  <members-refresh xmlns="ethora:chats:members-refresh"/>
  <no-store xmlns="urn:xmpp:hints"/>
  <x xmlns="http://jabber.org/protocol/muc#user"><item affiliation="member|none" nick="<xmppUsername>"/></x>
</message>
```

### 5.3 Joining

```xml
<presence to="<room jid>/<xmppUsername>" id="presenceInRoom-<id>">
  <x xmlns="http://jabber.org/protocol/muc"/>
</presence>
```

- No `<nick>` and no `<history/>` child. MUC `history_size` is `0` on Ethora servers:
  joining never replays messages, only occupant presences. Use MAM for history.
- Inbound presences carry `<x xmlns='http://jabber.org/protocol/muc#user'><item
  affiliation role jid?/></x>`. Clients read `affiliation` (`owner|admin|member` means
  "a member", `none|outcast` with `type='unavailable'` means "removed"), status code
  `110` (self), `201` (room created) and `321` (kicked; together with `110` the client
  drops the room).
- Rejections come back as `<presence type='error'>` with `forbidden`,
  `not-allowed`, `item-not-found` or `remote-server-not-found`.
- Leave: `<presence to="<room jid>/<xmppUsername>" type="unavailable"/>`.

Joining is per session: after a reconnect the client joins every room again. The web
component joins all rooms from the room list with a pool of 5 and a 30 ms gap.

### 5.4 Default rooms and inactivity

Every new user is added to the app's default rooms at registration. An installation
may trim default-room memberships of users who have not logged in or called the API
for N days (`DEFAULT_ROOMS_INACTIVE_DAYS`, off by default, nightly). Any later login
(email, social, wallet signature, MFA) re-adds the user and re-sets the affiliation,
so a client never has to handle "I am no longer in the default room" itself.

### 5.5 Subscriptions (mucsub)

Rooms are created with `allow_subscription: true`. A client may subscribe so that
messages are delivered as mucsub events even when it is not joined, which is what
makes offline push for rooms work (section 11):

```xml
<iq to="<room jid>" type="set" id="newSubscription:<ts>">
  <subscribe xmlns="urn:xmpp:mucsub:0" nick="<xmppUsername>">
    <event node="urn:xmpp:mucsub:nodes:messages"/>
  </subscribe>
</iq>
```

`<forbidden/>` means the user is not a member. Subscribed messages arrive wrapped
(`<message type='normal'><event><items><item><message .../>`); clients unwrap them
before dispatch so the inner `id` and `<data>` are visible.

### 5.6 Other room IQs

| Purpose | Stanza |
|---|---|
| rooms I am in (server view) | `<iq type='get' id='getUserRooms'><query xmlns='ns:getrooms'/></iq>` -> `<room jid users_cnt name room_thumbnail room_background/>` per room (RSM paging supported) |
| room info | disco#info to the room JID |
| occupants with activity | `<query xmlns='ns:room:last' room='<jid>'/>` -> `<activity jid last_active ban_status role name profile/>` (first 50) |
| room picture / background | `<query xmlns='ns:getrooms:setprofile' room room_thumbnail room_background/>` (owner or admin) |
| rename / describe | `muc#owner` config form with `muc#roomconfig_roomname` / `muc#roomconfig_roomdesc` |

The REST room list (`GET /v1/chats/my`) is the primary source for clients; the
`ns:getrooms` IQ is kept for compatibility.

## 6. Messages

### 6.1 The stanza

```xml
<message to="<room jid>" type="groupchat" id="<client id>">
  <data xmlns="<see 6.2>" senderFirstName="Alice" senderLastName="Smith" fullName="Alice Smith"
        photo="https://.../avatar.png" senderJID="<full jid>" roomJid="<room jid>"
        isSystemMessage="false" push="true" .../>
  <body>Hello</body>
</message>
```

- `type` is `groupchat` for every room, including 1:1 rooms (they are two-member
  MUCs). `type='chat'` is used only for call signalling between two users and for
  private messages to a bot.
- `<body>` is required for a message to render. Stanzas without a body (typing,
  reactions, members-refresh, call tokens) are control messages.
- The room echoes the message back to the sender with the same `id`; that echo is
  the only delivery acknowledgement (section 7).

### 6.2 The `<data>` element

Ethora carries message metadata as attributes of one `<data>` child. There is no
single namespace in practice: the web component stamps its websocket URL as `xmlns`,
the ai-service stamps `https://ethora.com/xmpp/data`, media and reaction stanzas
carry none. Every consumer selects the element by name and ignores the namespace;
new code should do the same, and emit `https://ethora.com/xmpp/data`.

Values are client-supplied and unverified: a client can stamp any name or avatar.
Treat them as presentation hints and resolve identity through section 9 when it
matters.

Attributes on an ordinary message:

| Attribute | Written by | Read by | Meaning |
|---|---|---|---|
| `senderFirstName`, `senderLastName` | all clients, bots | clients (fallback name), push (title), ai-service (addressing the user) | sender display name parts |
| `fullName` | clients, bots | clients, ai-service | `firstName lastName` |
| `photo` | clients, bots | clients, push (image) | avatar URL. Legacy duplicate `photoURL`; media messages send only `photoURL`. |
| `senderJID` | clients, bots | clients (sender id when `from` has no resource) | full JID of the sender |
| `roomJid` | clients | clients | destination room |
| `isSystemMessage` | clients (`false`), bots (`'true'` for join/leave notices) | clients (muted rendering), ai-service (never replies to them) | system notice, not a chat line |
| `push` | clients (`'true'`) | nobody today (push reads it and discards it) | reserved |
| `mucName` | mobile clients | push (subject suffix) | room title for notification text |
| `project` | optional | push | target app for notification routing; defaults to all |
| `isReply`, `showInChannel`, `mainMessage` | clients | clients | thread reply, "also show in channel", JSON snapshot of the parent (section 6.6) |
| `mentions` | clients, only when non-empty | clients | JSON `[{jid, name, offset, length}]` over the body text |
| `quickReplies` | bots only (absent on user messages) | clients | JSON `[{name, value, questionId?}]` rendered as buttons; tapping sends `value` as a normal message |
| `senderWalletAddress`, `tokenAmount`, `receiverMessageId`, `notDisplayedValue` | clients (`''` / `0`) | nobody | legacy web3 fields, kept for compatibility |
| `type` | server, bots | clients | `call-token`, `call-state`, `call-invite` (section 6.8) |
| `clientEncrypted`, `omemoEncrypted` | clients | clients | end-to-end encryption markers (section 6.9) |

Media messages (`<body>media</body>` plus `<store xmlns='urn:xmpp:hints'/>`) add the
fields of the uploaded file as returned by `POST /v1/files`: `isMediafile='true'`,
`location`, `locationPreview`, `mimetype`, `fileName`, `originalName`, `size`,
`duration`, `waveForm`, `attachmentId`, `isVisible`, `ownerKey`, `userId`,
`createdAt`, `updatedAt`, `expiresAt`, and for several files `attachments` (JSON array
of the same shape).

On receipt, clients spread every `<data>` attribute onto the message object as a
string. `isSystemMessage="false"` is the string `"false"`; compare accordingly.

### 6.3 Translation

Append `<translate source="<ISO 639-1>"/>` to a message and `mod_translate` adds
`<translations value='{"translates":[{"lang":"..","translatedText":".."}, ...]}'/>`
for all recipients (and to the push payload). A `<translate>` without `source` is
answered with `bad-request`. The web component also duplicates the body as a
`userMessage` attribute on `<data>` in this variant. Not sent in encrypted rooms.

### 6.4 Reactions

```xml
<message to="<room jid>" type="groupchat" id="message-reaction:<ts>" from="<full jid>">
  <reactions xmlns="urn:xmpp:reactions:0" id="<target archive id>" from="<full jid>">
    <reaction>+1</reaction>
  </reactions>
  <data senderFirstName="Alice" senderLastName="Smith"/>
  <store xmlns="urn:xmpp:hints"/>
</message>
```

The set replaces the sender's previous reactions on that message; an empty set
withdraws. Values are emoji-mart ids (`+1`, `heart`), not characters. The target is
the message's archive id (section 7). Clients route this by the `message-reaction`
prefix of `id`, not by namespace, so keep the prefix.

### 6.5 Edit and delete

| Action | Stanza | Server |
|---|---|---|
| edit | `<message type='groupchat' id='edit-message-<ts>'><replace id='<archive id>' text='<new text>'/></message>` | `mod_edit` rewrites the stored body for the sender's own message and appends `<replaced timestamp/>` to the archived XML |
| delete | `<message type='groupchat' id='deleteMessageStanza'><body>wow</body><delete id='<archive id>'/></message>` | `mod_delete` replaces the stored body with `deleted` and appends `<deleted timestamp/>` |

Neither uses XEP-0308; `<replace>` and `<delete>` have no namespace, and the delete
stanza's `id` is the literal `deleteMessageStanza` (receivers route on it). Editing or
deleting someone else's message is silently ignored (an audit event is recorded; the
client gets no error). History delivered later shows `<deleted>` / `<replaced>`
children on the archived stanza.

### 6.6 Threads

A reply carries `isReply='true'`, optionally `showInChannel='true'`, and
`mainMessage` as a JSON snapshot of the parent: `{text, id, userName, createdAt,
imageLocation, imagePreview, mimeType, size, duration, waveForm, attachmentId,
roomJid, ...}`. The snapshot is what the UI quotes; it is not refreshed if the parent
is edited.

### 6.7 Typing

```xml
<message to="<room jid>" type="groupchat" id="typing-<ts>">
  <composing xmlns="http://jabber.org/protocol/chatstates"/>
  <data fullName="Alice Smith"/>
</message>
```

`<paused/>` ends it (`id="stop-typing-<ts>"`). `mod_offline_post` ignores these, so
they never produce a push.

### 6.8 Calls (summary)

Call signalling rides on `type='chat'` messages with `<data type=...>`: the API sends
`call-token` (`token`, `room`, `kind`, `callId`) to the callee, clients send
`call-invite` (`kind`) and `call-state` (`state=ended|declined|cancelled|rejected`,
`callId`, `room`), and the server writes a `call-state` log line with
`isSystemMessage='true'` and `durationMs` into the room. Offline callees get a call
push (section 11).

### 6.9 End-to-end encryption

Rooms with `e2ee: true` use OMEMO 2 (`urn:xmpp:omemo:2`). Only `<body>` is sealed;
`<data>` and `<store/>` stay in the clear inside the envelope because push and the
room list preview are built from them. Media keys travel inside the encrypted body
(`{"v":1,"keys":[...]}`) with `clientEncrypted='true'` on `<data>`. Translation is
disabled in encrypted rooms.

## 7. Ids, acknowledgement, ordering

| Id | Who sets it | Used for |
|---|---|---|
| `message@id` | the client (`send-text-message-<uuid>`, `send-media-message:<uuid>`, ...) | optimistic rendering; the MUC echoes it unchanged and the echo is the acknowledgement. There are no XEP-0184 receipts or XEP-0333 markers. The ai-service also uses it to drop a stanza repeated with the same id in the same room. |
| `<stanza-id xmlns='urn:xmpp:sid:0' by='<room jid>' id='<archive id>'/>` | ejabberd (MAM) | the durable message id: targets for reactions, edits, deletes; `by` is the room. The archive id is numeric (microsecond timestamp) and is what clients sort by and page on. |
| `<archived by id/>` | ejabberd | same id, the form the ai-service reads |
| `<delay stamp/>` | ejabberd on history | marks a message as historical |

Clients prefer the archive id over their own id once both are known, and derive the
message time from the first of: delay stamp, stanza-id, client id, now.

Because the echo is the only ack, a client that queues messages while connecting must
not resend a queued message after the queue flushed it (the web component tracks
"sent since this session came online" for exactly that case).

## 8. History

### 8.1 MAM query

```xml
<iq type="set" to="<room jid>" id="get-history:<ts>:<rand>">
  <query xmlns="urn:xmpp:mam:2" queryid="get-history:<ts>:<rand>">
    <set xmlns="http://jabber.org/protocol/rsm">
      <max>30</max>
      <before>[archive id]</before>   <!-- empty for the newest page -->
    </set>
  </query>
</iq>
```

Pages arrive as `<message><result xmlns='urn:xmpp:mam:2' queryid='...' id='<archive
id>'><forwarded><delay/><message .../></forwarded></result></message>`; the client
matches them by `queryid`. The `<iq type='result'><fin complete><set><first/><last/>`
ends the page. No `<with>` or form filters are used. `mod_history_access` records
every completed or denied MAM read as an audit event.

### 8.2 What a client fetches

- Newest page for the opened room (30 by default), older pages on scroll with
  `<before>` set to the oldest known archive id.
- Smaller pages (1 to 20) for the other rooms in the background, to fill list previews
  and unread state. This is the expensive part for users in many rooms; see the
  startup notes in section 13.

### 8.3 Reactions in history

Archived reaction stanzas come back through the same MAM query; clients re-apply them
by `<reactions id>` and `<stanza-id by>`.

### 8.4 Server-side archive and REST history

`mod_track_message` posts every room and 1:1 message to the API, which upserts it into
its own `messages` collection (app, room, sender, body, `messageId`, `stanzaId`,
timestamps, `editedAt`, `deletedAt`, translations). That copy feeds the REST room-list
previews and the tenant-level history endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /v1/chats/my` | rooms with `lastMessage` (`body, from, fromUserId, senderFirstName, senderLastName, messageId, stanzaId, createdAt, isOwn`), `unreadCount` (capped at 99 with `unreadCapped`), `muted`, `usersCnt`, a member preview |
| `GET /v2/apps/{appId}/chats/{chatId}/messages` and `.../messages/context` | paged history and "jump to message" context for integrations (tenant actor auth) |
| `POST /v2/apps/{appId}/users/unread-counts` | batch unread counts per room for a set of users |

## 9. Sender identity resolution

Three sources exist, and the client uses them in this order:

1. The `<data>` attributes on the message itself (`fullName`, else `senderFirstName`
   + `senderLastName`, `photo`). Always present on messages from Ethora clients and
   bots, timing-independent, unverified.
2. The member directory the client holds: built from the `members` arrays of
   `GET /v1/chats/my` (a preview of the most recently active members per room, 30 by
   default) and `GET /v1/chats/my/{chatName}` (full list), and kept fresh by
   `<user-update>` headline stanzas and the members-refresh hint. This is where
   renames and avatar changes come from.
3. A lookup for a sender outside the directory: `GET /v1/apps/users/{xmppUsername}`
   (user or B2B token) returns `firstName, lastName, profileImage, description,
   xmppUsername`. Cache hits and misses; do not block rendering on it.

Fallback when all three fail is the bare localpart, which is why a client without
step 3 shows ids like `646cc8dc..._6a8c3625...` for unknown senders.

Profile changes are pushed to connected clients as
`<message type='headline'><user-update xmppUsername firstName lastName photoURL description/></message>`
and room changes as `<chat-update chatName title description picture usersCnt/>`.

## 10. Read state and mute

Last-read position is stored server-side in XMPP private storage as one JSON object
keyed by room JID with the epoch-millisecond timestamp of the last viewed message:

```xml
<iq type="set" id="set-chats-private-req:<ts>">
  <query xmlns="jabber:iq:private">
    <chatjson xmlns="chatjson:store" value='{"<room jid>":"1772618245224", ...}'/>
  </query>
</iq>
```

Read it with `type='get'` and an empty `<chatjson xmlns='chatjson:store'/>`. Clients
read-merge-write and never move a room's timestamp backwards. Unread counts in the
REST room list are computed by the API from its archive against the same idea of
"last seen".

Mute is per user and room: `PUT /v1/chats/my/{chatName}/mute` and `DELETE` to unmute.
It suppresses push (section 11) and is reported as `muted` in the room list.

## 11. Push notifications

Pipeline:

1. ejabberd's `offline_message_hook` fires for a recipient who is offline (including
   mucsub subscribers), `mod_offline_post` builds a form payload from the message and
   POSTs it to the push service. Typing stanzas and messages without an inner message
   are skipped.
2. The push service queues the job, looks up the recipient's device tokens, drops the
   job when the user muted the room, picks the body translation for the user's
   language, and sends via FCM or APNs (or a hosted gateway with ids only).

Payload fields the module derives from the stanza:

| Field | Source |
|---|---|
| `jid` | recipient bare JID |
| `msgSubj`, `fullName` | `senderFirstName senderLastName` from `<data>`, plus ` (mucName)` when set; without `<data>` the sender localpart |
| `msgText` | `<body>` |
| `translations` | `<translations value>` as produced by `mod_translate` |
| `msgID` | the archive id |
| `MUCID` | room bare JID for groupchat, empty for 1:1 |
| `image` | `<data photo>` or `photoURL` |
| `project` | `<data project>` or `all` |

Notification title is the sender's full name, body is the message text (translated when
possible), and the data payload carries `jid` (room), `msgID` and `userJid` so the
client can open the right room and message.

Device registration: `POST /v1/push/subscription/{appId}` with
`{registrationToken, tokenType: fcm|apns|apns-voip, deviceType: android|ios|web}`
(user token), `DELETE` with `{registrationToken}` to remove. Room delivery while
offline additionally needs the mucsub subscription from section 5.5. Calls get a
separate high-priority data push (`type: call`, `callId`, `callToken`, `room`, `kind`,
`callerName`), VoIP on iOS when configured.

## 12. AI agents

Agents are XMPP users (section 2) run by the ai-service. What they read and write:

| Aspect | Behaviour |
|---|---|
| Incoming | groupchat messages with a non-empty `<body>` and an `<archived>` child; `fromBot` is the presence of `<x xmlns='urn:ethora:bot' agentAddress/>`; the user's name comes from `<data fullName>` or the first/last name parts; `isSystemMessage='true'` messages are never answered; a stanza with a repeated client `id` in the same room is dropped. |
| Outgoing | `<body>` + `<data fullName senderFirstName senderLastName senderJID photo isSystemMessage='false' quickReplies?/>` + `<x xmlns='urn:ethora:bot' agentAddress='...'/>`. A `<paused>` chatstate precedes the reply; `<composing>` is sent while generating. |
| Buttons | `quickReplies='[{"name":"Yes","value":"yes"}, ...]'`, at most 6, label 40 chars, value 200 chars. Flows (`ask`/`say` steps) use the same attribute. |
| Reactions | same stanza as section 6.4, target = archive id, values = emoji-mart ids. |
| Join / leave | plain MUC join presence; a system notice `"<name> has joined the chat"` with `isSystemMessage='true'` unless `announceJoin` is off; greeting message or start flow after joining. Invites (`muc#user` or `jabber:x:conference`) are honoured. |
| Private messages | `type='chat'` to the bot JID gets a `type='chat'` reply with `<extra-data>` carrying retrieval context. |
| Response modes | `always`; `mentioned` (`@name`, the bot name as a word, or `/bot` anywhere; a 1:1 room with the bot counts as mentioned); `probability`; `smart` (one yes/no model call, always yes for widget visitors and 1:1 rooms). Silencing is bot `status: off`. |
| Guards | no self-replies, a cap on consecutive bot turns without a human, bot-to-bot replies only in rooms with recent human activity, per-room cooldowns and 1.5 s spacing. |

A 1:1 room with a bot is detected by its name starting with `${botUsername}-` or ending
with `-${botUsername}`.

## 13. Recommended client startup

1. Login, get-config, `GET /v1/chats/my` (render the list from this alone: titles,
   pictures, `lastMessage`, `unreadCount`, `usersCnt`, member preview).
2. Connect XMPP, bare presence, read the private-store last-read map.
3. Join rooms in the background with a small pool; open the active room first.
4. Fetch the newest MAM page for the active room; fetch small pages for other rooms
   lazily (visible rows first, or on open) rather than all rooms at once.
5. Subscribe (mucsub) to rooms you want offline push for, and register the device
   token once per install.
6. Resolve unknown senders through section 9; never block rendering on it.
7. On reconnect, repeat 2 to 4; stream resumption is not available.

## 14. Known gaps

- Identity attributes on `<data>` are client-supplied and unverified. A server-side
  stamp (the MUC filter rewriting them from the user record) does not exist yet; until
  it does, clients, push and agents trust what the sender wrote.
- No delivery receipts or read markers; the echo is the only acknowledgement and read
  state is a client-maintained timestamp map.
- `mod_user_block` stores but does not enforce; blocking is client-side.
- Edit and delete of someone else's message fail silently.
- The `<data>` `xmlns` differs between emitters (section 6.2).
- There is no mucsub unsubscribe in the web client; leaving a room removes the
  membership but not the subscription.
- A ban issued by an affiliated user gets no IQ result (server-side quirk).

## 15. Versioning

This document tracks the `main` branches of the components. When a wire change
lands (new `<data>` attribute, new control stanza, changed default), update the
relevant table here in the same release and mention it in `RELEASE-NOTES.md`.
