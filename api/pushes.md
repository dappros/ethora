# Push notifications

How Ethora delivers push notifications for chat messages and calls, what an app
operator has to configure, and what a client has to do. Written from the code that
ships in release 26.10. The stanza-level details (what the ejabberd hook reads from a
message) are in [CHAT_PROTOCOL.md, section 11](CHAT_PROTOCOL.md#11-push-notifications).

The previous version of this page described the 2020 push service API
(`/api/v1/push/subscriptions`, numeric device types, wallet-derived JIDs). That API is
gone; the history of this file has the old text if you need it.

## How it works

```
sender --XMPP--> ejabberd --offline_message_hook--> mod_offline_post
                                                        |  POST /push/api/v2/push (form)
                                                        v
                                                  push service --queue--> worker --> FCM / APNs
                                                        ^
Ethora API --/v1/push/*--> (device tokens, app credentials, broadcasts)
```

1. A message reaches a recipient who is offline (no XMPP session) or who is
   subscribed to the room (mucsub) but not connected. ejabberd's `offline_message_hook`
   fires and `mod_offline_post` posts a payload to the push service: recipient JID,
   sender name (from the message's `<data>` attributes), message text, translations,
   the archive message id, the room JID, the sender's avatar URL.
2. The push service queues the job and the worker looks up the recipient's device
   tokens for the app, skips the job if the user muted the room, picks the body
   translation for the user's language, and sends through FCM (Android, web) or APNs
   (iOS, VoIP for calls). Dead tokens reported by FCM or APNs are removed.
3. The notification carries the sender's full name as title, the message text as
   body, and a data payload with `jid` (room), `msgID` (archive id) and `userJid`
   (recipient) so the app can open the right room.

A user who is online in any session does not get a push; typing indicators never do.

## Operator setup (per app)

Credentials are uploaded per app from the admin panel (App > Settings > Push) or with
the API below. Without credentials an app can still use the platform's own keys when
platform push is enabled for it.

| Endpoint | Body | Purpose |
|---|---|---|
| `POST /v1/push/apns/{appId}` | multipart: `apnsKey` (the `.p8` file), `keyId` (10 characters), `teamId` (10 characters), `bundleId` (optional if set on the app), `environment` (`production` or `sandbox`) | Upload the APNs auth key for iOS |
| `DELETE /v1/push/apns/{appId}` | - | Remove it |
| `POST /v1/push/firebase-service-account/{appId}` | multipart: `firebaseServiceAccount` (the service-account `.json`) | Upload the Firebase service account for Android and web |
| `DELETE /v1/push/firebase-service-account/{appId}` | - | Remove it |
| `PUT /v1/push/platform/{appId}` | `{ enabled: boolean }` | Deliver with the platform's keys instead of the app's own |
| `GET /v1/push/platform/{appId}` | - | Current platform-push status |
| `POST /v1/push/validate/{appId}` | - | Dry-run check of the app's push configuration |

All of these take the app owner's user token. `get-config` reports `apnsKeyUploaded`,
`firebaseServiceAccountUploaded` and `platformPushEnabled` so a client can tell what
is configured.

## Client flow

1. Obtain a device token from the platform SDK: FCM registration token on Android and
   web (Firebase JS SDK), APNs device token on iOS (plus a PushKit VoIP token if the
   app rings for calls).
2. Register it once per install, with the user's token:

   ```
   POST /v1/push/subscription/{appId}
   { "registrationToken": "<token>", "tokenType": "fcm" | "apns" | "apns-voip", "deviceType": "android" | "ios" | "web" }
   ```

   The API derives the user's JID from the session and stores the subscription in the
   push service. Register again after the SDK rotates the token; the newest token per
   device wins.
3. Subscribe to each room you want offline delivery for (mucsub, once per room per
   user):

   ```xml
   <iq to="<room jid>" type="set" id="newSubscription:<ts>">
     <subscribe xmlns="urn:xmpp:mucsub:0" nick="<xmppUsername>">
       <event node="urn:xmpp:mucsub:nodes:messages"/>
     </subscribe>
   </iq>
   ```

   Without the subscription a user gets pushes only for 1:1 messages addressed to
   their bare JID while offline.
4. Remove the token on logout: `DELETE /v1/push/subscription/{appId}` with
   `{ "registrationToken": "<token>" }`.
5. Mute per room with `PUT /v1/chats/my/{chatName}/mute` (`DELETE` to unmute). Muted
   rooms produce no push for that user; the room list reports `muted`.

Stamp `senderFirstName`, `senderLastName`, `fullName` and `photo` on the `<data>`
element of every message you send (every Ethora client does): the notification title
and image are built from them, and a message without `<data>` is announced with the
sender's bare username.

## Sending pushes from your own backend

With the app owner's user token:

| Endpoint | Body | Effect |
|---|---|---|
| `POST /v1/push/user/{appId}` | `{ jid, text, title?, ttl? }` | one user, `jid` is the bare JID (`<xmppUsername>@<xmppHost>`) |
| `POST /v1/push/project/{appId}` | `{ text, title?, ttl? }` | every registered device of the app |

These go through the same queue and respect the same token bookkeeping; they carry no
`jid` room id in the data payload, so clients treat them as system notifications.

## Calls

An incoming call produces a data push (`type: "call"`, `callId`, `callToken`, `room`,
`kind`, `callerName`, `callerXmppUsername`) with high priority and a short TTL (60 s by
default, at most 600 s). On iOS it is sent as a VoIP push to the `apns-voip` token when
the app has one registered; VoIP tokens receive only call pushes.

## Troubleshooting

- `POST /v1/push/validate/{appId}` is a dry run against the stored credentials; the
  response says what is configured and what failed to load.
- No push for a room message: check that the recipient was offline, that the room is
  not muted for them, that they hold a mucsub subscription for the room, and that the
  device token is registered for the same app the room belongs to.
- iOS alerts arrive but calls do not ring: register a VoIP token (`tokenType:
  "apns-voip"`) and make sure the APNs key was uploaded with the right `bundleId`.
