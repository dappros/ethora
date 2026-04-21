# SDK Feature Matrix — detailed view

> Rendered from [`features.yaml`](../features.yaml)  ·  Legend: ✅ Present  ·  🟡 Partial  ·  🛠 Roadmap  ·  — Absent

This view lists every feature by category with status + evidence per SDK. For the condensed matrix, see [../README.md](../README.md).

## Authentication

### Email/password signup

Sign up a new user with email + password directly from the SDK.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/api-requests/auth.api.ts` |
| React Native | 🟡 Partial | `src/components/AuthForms/Register.tsx` — Form stub, not fully wired. |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Email/password login

Sign in with email + password.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/api-requests/auth.api.ts` |
| React Native | ✅ Present | `src/networking/api-requests/auth.api.ts:15-30` |
| Android (Kotlin) | ✅ Present | `chat-core/src/main/java/com/ethora/chat/core/networking/AuthAPI.kt:19` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Networking/AuthAPI.swift:79-217` |
| WordPress | — Absent | — |

### JWT login (bring your own token)

Authenticate with a pre-signed JWT from your own backend.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/api-requests/auth.api.ts (loginViaJwt)` |
| React Native | ✅ Present | `src/networking/api-requests/auth.api.ts:78-90` |
| Android (Kotlin) | ✅ Present | `chat-core/src/main/java/com/ethora/chat/core/networking/AuthAPI.kt:26` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Networking/AuthAPI.swift:349-402` |
| WordPress | — Absent | — |

### OAuth / social login

Sign in with Google/Apple/other OAuth providers.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/api-requests/auth.api.ts (signInWithGoogle, loginSocial)` |
| React Native | 🟡 Partial | `src/networking/api-requests/auth.api.ts:32-48` — Functions exist, implementation incomplete. |
| Android (Kotlin) | 🛠 Roadmap | `chat-core/src/main/java/com/ethora/chat/core/config/LoginConfig.kt:8` — GoogleLoginConfig defined, not wired. |
| iOS (Swift) | 🟡 Partial | `Sources/XMPPChatCore/Models/Config/LoginConfig.swift` — Firebase/Google only. |
| WordPress | 🟡 Partial | `assets/js/ethora_assistant_source.js:160-163` — OAuth scopes defined, stub only. |

### Anonymous / guest login

Allow visitors to join without registering.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | — |
| React Native | 🛠 Roadmap | `src/components/AuthForms/LoginAnonym.tsx` — Form stub. |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Logout

Clear credentials and disconnect from chat.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | 🟡 Partial | `src/main.ts (logoutService export)` — Handler exists, no explicit endpoint call. |
| React Native | ✅ Present | `src/roomStore/chatSettingsSlice.ts + src/networking/apiClient.ts:37` |
| Android (Kotlin) | ✅ Present | `chat-core/src/main/java/com/ethora/chat/core/service/LogoutService.kt:72` |
| iOS (Swift) | — Absent | No dedicated logout method. |
| WordPress | 🟡 Partial | `assets/js/ethora_assistant_source.js:333` — Stub function. |

### Token refresh

Automatically refresh expiring auth tokens.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/types/models/config.model.ts (refreshTokens) + xmppClient reconnect` |
| React Native | ✅ Present | `src/networking/apiClient.ts:12-40` |
| Android (Kotlin) | ✅ Present | `chat-core/src/main/java/com/ethora/chat/core/networking/TokenManager.kt:37` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Networking/AuthAPI.swift:228-339` |
| WordPress | — Absent | — |

## Messaging

### Send text message

Send a plain text message to a room.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/sendTextMessage.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/sendTextMessage.xmpp.ts + useSendMessage.tsx` |
| Android (Kotlin) | ✅ Present | `chat-core/src/main/java/com/ethora/chat/core/xmpp/XMPPOperations.kt:15` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift:16-69` |
| WordPress | 🟡 Partial | `assets/js/ethora_assistant_source.js:258-273` — Basic text input, simulated response. |

### Edit message

Modify a previously sent message.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/editMessage.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/editMessage.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/src/main/java/com/ethora/chat/core/xmpp/XMPPClient.kt (editMessage)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift:148-171` |
| WordPress | — Absent | — |

### Delete message

Remove a previously sent message.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/deleteMessage.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/deleteMessage.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPClient.kt (deleteMessage)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift:128-146` |
| WordPress | — Absent | — |

### Reply to message

Quote and reply to a specific message.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/sendTextMessage.xmpp.ts (isReply)` |
| React Native | ✅ Present | `src/types/types.ts:29 + src/types/messages.ts:27-29` |
| Android (Kotlin) | ✅ Present | `chat-core/.../models/Message.kt:29 (reply, mainMessage)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift (isReply param)` |
| WordPress | — Absent | — |

### Message reactions

React to messages with emoji.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/sendMessageReaction.xmpp.ts` |
| React Native | — Absent | — |
| Android (Kotlin) | ✅ Present | `chat-core/.../models/Message.kt:30 (reaction Map)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift:173-220` |
| WordPress | — Absent | — |

### @mentions

Tag users with @mentions in messages.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | — |
| React Native | — Absent | — |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Typing indicator

Show when other users are typing.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/sendTypingRequest.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/sendTypingRequest.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPOperations.kt:47 (sendTypingIndicator)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift:222-248` |
| WordPress | — Absent | — |

### Read / delivery receipts

Track whether messages have been delivered and read.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | Ack queue is internal, not user-visible. |
| React Native | — Absent | — |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Message history (MAM pagination)

Load earlier messages via XEP-0313 MAM with paging.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/getHistory.xmpp.ts (RSM)` |
| React Native | ✅ Present | `src/networking/xmpp/getHistory.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPClient.kt (registerMAMCollector)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendGetHistory.swift` |
| WordPress | — Absent | — |

## Media

### Send/receive images

Upload and display image messages.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/sendMediaMessage.xmpp.ts + uploadFile` |
| React Native | ✅ Present | `src/components/styled/MessageImage.tsx` |
| Android (Kotlin) | ✅ Present | `chat-core/.../AuthAPI.kt:239 (uploadFile)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/SendTextMessage.swift:71-126` |
| WordPress | — Absent | — |

### Send/receive video

Upload and play back video messages.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `sendMediaMessage.xmpp.ts (video mimetype)` |
| React Native | ✅ Present | `src/components/styled/VideoMessage.tsx` |
| Android (Kotlin) | ✅ Present | `chat-ui/.../VideoPlayerView.kt` |
| iOS (Swift) | ✅ Present | `sendMediaMessage supports video mimetype` |
| WordPress | — Absent | — |

### Send/receive files

Upload arbitrary file attachments.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `sendMediaMessage + uploadFile` |
| React Native | ✅ Present | `src/types/messages.ts:37-48 (FileAttachmentParams)` |
| Android (Kotlin) | ✅ Present | `chat-core/.../AuthAPI.kt:36 (POST /files multipart)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Networking/AuthAPI.swift:467-538 (uploadFile)` |
| WordPress | — Absent | — |

### Audio messages

Record and play voice notes with waveform/duration.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `sendMediaMessage (waveForm, duration)` |
| React Native | ✅ Present | `src/components/InputComponents/AudioRecorder.tsx` |
| Android (Kotlin) | ✅ Present | `chat-ui/.../AudioPlayerView.kt` |
| iOS (Swift) | ✅ Present | `MediaMessageData (duration, waveForm)` |
| WordPress | — Absent | — |

### Inline media preview

Render images/video/links inline in the message stream.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | 🟡 Partial | locationPreview exists; explicit inline image rendering limited. |
| React Native | ✅ Present | `src/types/messages.ts:42 (imagePreview) + MessageImage.tsx` |
| Android (Kotlin) | ✅ Present | `chat-core/.../Message.kt:19 (locationPreview)` |
| iOS (Swift) | 🟡 Partial | `Sources/XMPPChatUI/Components/URLPreviewCard.swift` — Link previews only, not inline media. |
| WordPress | — Absent | — |

## Rooms

### 1:1 direct messaging

Private one-to-one conversations.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/createPrivateRoom.xmpp.ts` |
| React Native | ✅ Present | `XMPP direct recipient rooms` |
| Android (Kotlin) | ✅ Present | `chat-core/.../RoomsAPI.kt:35 (createPrivateRoom)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/RoomOperations.swift:46-71` |
| WordPress | 🟡 Partial | 1:1 bot-to-user widget only. |

### Group chat (MUC)

Multi-user chat rooms via XEP-0045.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/createRoom.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/createRoom.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPClient.kt (MUC support)` |
| iOS (Swift) | ✅ Present | `RoomOperations.swift:16-43` |
| WordPress | — Absent | — |

### Single-room mode

Pin the SDK to one pre-configured room (chat widget flow).

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `config.model.ts:76 (customRooms.singleRoom)` |
| React Native | ✅ Present | `roomJID parameter (README)` |
| Android (Kotlin) | ✅ Present | `disableRooms + roomJID (README)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Models/ChatConfig.swift:33 (disableRooms)` |
| WordPress | ✅ Present | `Widget is single-room by design.` |

### Create room

Programmatically create a new chat room.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `createRoom.xmpp.ts + createPrivateRoom.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/createRoom.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/.../RoomsAPI.kt:24 (createRoom)` |
| iOS (Swift) | ✅ Present | `RoomOperations.swift (createRoom, createPrivateRoom)` |
| WordPress | — Absent | — |

### Invite users to room

Invite other users to an existing room.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/inviteRoomRequest.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/inviteRoomRequest.xmpp.ts` |
| Android (Kotlin) | 🟡 Partial | members field exists, no dedicated invite API. |
| iOS (Swift) | 🟡 Partial | Referenced in RoomOperations but incomplete. |
| WordPress | — Absent | — |

### Leave room

Leave a chat room.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/leaveTheRoom.xmpp.ts` |
| React Native | ✅ Present | `src/networking/xmpp/leaveTheRoom.xmpp.ts` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPOperations.kt:36 (leaveRoom)` |
| iOS (Swift) | — Absent | No leave-room method found. |
| WordPress | — Absent | — |

### Room metadata

Room name, avatar, description, title.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `setRoomImage.xmpp.ts + room config files` |
| React Native | 🟡 Partial | `setRoomImage (avatar only, no name/description update)` |
| Android (Kotlin) | ✅ Present | `chat-core/.../models/Room.kt:39 (name, title, description, picture)` |
| iOS (Swift) | ✅ Present | `Room model (name, avatar, description)` |
| WordPress | — Absent | — |

## Presence & Unread

### Online/offline presence

Show which users are currently online.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/xmpp/presenceInRoom.xmpp.ts` |
| React Native | ✅ Present | `presenceInRoom + xmppClient status` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPClient.kt (presence)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/XMPPOperations/PresenceOperations.swift:13-62` |
| WordPress | — Absent | — |

### Last-seen timestamp

Show when a user was last active.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | — |
| React Native | ✅ Present | `src/types/types.ts:63 (last_active) + ChatProfileModal.tsx` |
| Android (Kotlin) | 🟡 Partial | `models/RoomMember.kt:15 (lastActive)` — Field present, not fully integrated. |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Unread message counter

Track unread messages per room + total badge.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/hooks/useUnreadMessagesCounter.ts` |
| React Native | ✅ Present | `src/roomStore/Middleware/unreadMidlleware.tsx` |
| Android (Kotlin) | ✅ Present | `chat-ui/.../UnreadHook.kt (useUnread)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Store/RoomStore.swift (totalUnreadCount)` |
| WordPress | — Absent | — |

## Notifications

### Push notifications (FCM/APNS/Web Push)

Deliver notifications when the app is backgrounded.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/networking/api-requests/push.api.ts + Firebase/Web Push VAPID` |
| React Native | 🟡 Partial | `messages.ts:21-23 (push flag)` — Protocol flag only, no FCM/APNS SDK integration. |
| Android (Kotlin) | ✅ Present | `chat-core/.../push/PushNotificationManager.kt:18 (FCM)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Networking/PushAPI.swift:34 (APNS)` |
| WordPress | — Absent | — |

### In-app notifications

Show incoming-message toasts or sounds inside the app.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/context/MessageNotificationContext.tsx` |
| React Native | — Absent | — |
| Android (Kotlin) | 🟡 Partial | `chat-core/.../config/MessageNotificationConfig.kt` — Config exists, integration limited. |
| iOS (Swift) | 🟡 Partial | `Sources/XMPPChatCore/Models/MessageNotification.swift` — Config present, sound not wired. |
| WordPress | — Absent | — |

## AI / Bots

### RAG bot integration

Chat against a retrieval-augmented bot grounded in your knowledge base.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | Bot lives server-side; SDKs just render messages. |
| React Native | — Absent | — |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | Widget connects to bot but no RAG config in plugin. |

### AI auto-response triggers

Configure when AI responds (every message / @mention / keyword).

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | Configured server-side on the bot, not in SDK. |
| React Native | — Absent | — |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | 🟡 Partial | Bot ID parameter auto-responds, no trigger config. |

### Message translation

Translate messages into the reader's preferred language.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | 🟡 Partial | `src/networking/xmpp/sendTextMessageWithTranslateTag.xmpp.ts` — Send-with-translate-tag exists, config only otherwise. |
| React Native | — Absent | — |
| Android (Kotlin) | 🟡 Partial | `chat-core/.../config/TranslationsConfig.kt` — Config enabled with language codes. |
| iOS (Swift) | 🟡 Partial | `Sources/XMPPChatCore/Models/MessageTranslation.swift + TranslationConfig.swift` |
| WordPress | — Absent | — |

## UI

### Prebuilt chat component

Drop-in chat UI (room list + message stream + input).

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `src/components/MainComponents (Chat, ChatRoom, MessageList, SendInput)` |
| React Native | ✅ Present | `src/components/MainComponents/Chat.tsx` |
| Android (Kotlin) | ✅ Present | `chat-ui/.../EthoraChat.kt (Chat composable + RoomListView)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatUI/Components/ChatWrapperView.swift` |
| WordPress | ✅ Present | `assets/js/ethora_assistant_source.js:200-240 (widget)` |

### Theme customization

Customize colors, typography, spacing.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | 🟡 Partial | `config.model.ts (colors.primary/secondary)` — Limited — primary/secondary only. |
| React Native | 🟡 Partial | `src/types/types.ts:137 (colors)` — Limited palette. |
| Android (Kotlin) | ✅ Present | `chat-ui/.../ChatTheme.kt (full ChatTheme + customizable colors)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatUI/Styling/ChatStyles.swift (ChatColors + RoomListStyles + ChatRoomStyles)` |
| WordPress | — Absent | — |

### Dark mode

First-class dark color scheme.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | — |
| React Native | — Absent | — |
| Android (Kotlin) | ✅ Present | `chat-ui/.../ChatTheme.kt:32 (darkChatColorScheme)` |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Custom component overrides

Replace message bubble, input, scroll area with your own components.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `CustomMessageComponent + CustomInputComponent + CustomComponentsContext.tsx` |
| React Native | ✅ Present | `CustomMessageComponent prop (README)` |
| Android (Kotlin) | ✅ Present | `chat-core/.../models/CustomComponents.kt:80 (CustomComponents interface)` |
| iOS (Swift) | 🟡 Partial | `CustomComponentsProtocol in ChatConfig` — Limited scope. |
| WordPress | — Absent | — |

### i18n / localization

UI string translation for app localization.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | translates config exists but no i18n library integration. |
| React Native | — Absent | — |
| Android (Kotlin) | 🟡 Partial | TranslationsConfig for message translation, no UI string resources. |
| iOS (Swift) | — Absent | — |
| WordPress | 🟡 Partial | `ethora-assistant-plugin.php:14 (text domain)` — Text domain only, no language files. |

## Platform

### Self-hosted server support

Point the SDK at your own Ethora server deployment.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `baseUrl + xmppSettings config` |
| React Native | ✅ Present | `README: override xmppSettings + baseUrl` |
| Android (Kotlin) | ✅ Present | `chat-core/.../XMPPSettings.kt (configurable URL)` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Models/ChatConfig.swift:28 (baseUrl)` |
| WordPress | ✅ Present | `readme.txt (data-bot-id parameter)` |

### Provision new app via SDK

Create a new Ethora app (tenant) programmatically from the SDK.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | Handled by @ethora/setup CLI, not SDKs. |
| React Native | — Absent | — |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

### Offline message cache

Persist messages locally so they're visible without network.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | ✅ Present | `redux-persist with encrypted storage` |
| React Native | 🟡 Partial | `src/hooks/useLocalStorage.tsx + async-storage` — User data only, not full message sync. |
| Android (Kotlin) | ✅ Present | `chat-core/.../persistence/ChatPersistenceManager.kt` |
| iOS (Swift) | ✅ Present | `Sources/XMPPChatCore/Persistence/MessageCache.swift (LRU eviction)` |
| WordPress | — Absent | — |

### End-to-end encryption

Messages encrypted client-side so server cannot read them.

| SDK | Status | Evidence / Notes |
|---|---|---|
| React.js (Web) | — Absent | Storage encryption is disk-only, not message-level E2E. |
| React Native | — Absent | — |
| Android (Kotlin) | — Absent | — |
| iOS (Swift) | — Absent | — |
| WordPress | — Absent | — |

