# Historical feature list: the 2021 to 2022 engine

> **Archive, not a current matrix.** For today's per-SDK coverage see
> [`../README.md`](../README.md) and [`../features.yaml`](../features.yaml).

This is the product capability list published on `wiki.ethora.com` for the early
Ethora engine, then known as the Dappros Platform. The wiki was retired in 2026;
this table was preserved because it is a different and complementary artefact
from the current matrix:

- **`features.yaml` answers "which SDK implements what, today"** — a per-platform
  coverage grid, kept current by audit.
- **This table answers "what did the product claim to be, as a whole, in 2021"** —
  a capability taxonomy of the engine, written as a product description rather
  than an implementation audit.

That makes it useful input for comparison and taxonomy work: atomic-feature
introspection, competitor comparison grids, and the "periodic table of
chat and messaging systems" analysis. It is a snapshot of one vendor's own
feature vocabulary at a fixed point in time, which is exactly the kind of
baseline that is hard to reconstruct after the fact.

**Caveats when using it.** Statuses are absent: everything is presented as
available, with no distinction between shipped, partial and planned, and no
evidence paths. Several capabilities listed here were removed, renamed or
rebuilt in later versions, and the token and wallet features reflect the
product's 2021 web3 positioning rather than its current direction. Treat every
row as a claim from 2021, to be verified against the current matrix before reuse.

**Provenance.** Extracted from the `Main_Page` article on `wiki.ethora.com`
(last edited 2025-03-13, table itself substantially unchanged since 2022),
archived 2026-08-23 before the subdomain was retired. Wiki markup converted to
Markdown; internal wiki links flattened to plain text. Full archive is held in
the internal `ethora-bdsm` workspace at `data/raw/wiki-ethora/`.

---

## The 2021 to 2022 engine feature list

75 capabilities across 10 groups, as originally published.

### Codebase

| Feature | Description |
|---|---|
| React Native (iOS & Android) | iOS and Android platforms are fully supported from the single React Native codebase |
| Config file | Config file allows to adjust important parameters and simplifies rebranding so that Ethora engine can be customized to a specific project |
| Dev / Prod | Switch between Development and Production infrastructures for development, testing and running live purposes |

### Users authentication

| Feature | Description |
|---|---|
| Social sign-in (Google) | Imports name, photo and e-mail from Google |
| Social sign-in (Facebook) | Imports name, photo and e-mail from Facebook |
| Social sign-in (Apple) | Imports e-mail from Apple |
| Login + Password | (optional) Your own authentication system via Dappros Platform backend |
| 3rd party authentication | (optional) Your own authentication system via 3rd party |
| E-mail verification | (optional) Send a verification link if you need users e-mails confirmed, for example to unlock features / content to specific @domain name user or to verify membership in your community via a 3rd party API integration |
| Secondary e-mails | (if enabled) Users may specify and verify additional e-mails |
| Phone verification (OTP) | (optional) Verify users phone number via Firebase or Twilio integration |

### User Profiles & Wallets

| Feature | Description |
|---|---|
| Crypto wallet / ID | Each user is automatically provided with a cryptographic keypair based on Ethereum technology that allows users to hold digital assets and sign transactions cryptographically. |
| Profile First + Last name | Names imported from social login if applicable |
| Profile photo | Photo imported from social login if applicable |
| Profile bio | Optional - Users can specify brief information about themselves |
| Profile business details | Optional - Users can specify their business details (company, phone, website) |
| Balances (blockchain) | Balance is shown in nav bar and in users profile |
| Transactions (blockchain) | Transactions for Coins and Items are done via blockchain (distributed immutable ledger) |
| Public display for tokens balances and transactions | (by default) Users can see balances and transactions on other users' profiles |
| Items/NFT provenance | Users can check the history of Items, NFTs, certificates and assets held by other users (when issued, by whom, history of transactions etc) |
| Items/NFT interactions | (if enabled) other users can purchase, exchange or bid for Items/NFTs through owner user's profile |
| Profile share via QR | Users can share their wallet address and profile details via a QR code |
| Profile share via link | Users can share their wallet address and profile details via a hyperlink (temporary and secure sharing supported too) |
| Profile visibility | App owner or Users can set the default and current profile visibility and sharing. If profile is not open to the public, User may share their profile with others using an individual sharing link which may have an expiry time. |

### Tokens

| Feature | Description |
|---|---|
| Coin | App/Ecosystem has a default ERC-20 token called Coin. It is shown in nav bar, user profile and used for most interactions by default. |
| ERC-20 tokens and ETH | Other ERC-20 tokens and ETH can also be used |
| Social Likes | Users can spend and receive Coins and Items for their chat messages and content |
| In-chat transactions | Users can transfer Coins and Items to each other within chat Rooms / Spaces and also send/receive tokens from Rooms and Bots |
| Explorer | Transactions and Tokens provenance seen in users profiles, web explorer and b/c nodes transactions |
| Items (NFT) | Items (ERC-721 tokens) are unique or limited edition assets transferrable in chats and displayed on users profiles. Metadata and multimedia hosted on IPFS. |
| Mint NFTs | (if enabled) Users can mint their own NFTs directly from the App. This can be limited to business-specific scenarios (for example, upload your academic or health certificate, upload a photograph of a shipped item etc) |
| NFT P2P purchases | (if enabled) Users can purchase Items directly from other Users' profiles (Buy now & Bid) |
| Item provenance | Item (NFT) display their mint and transactions history in Users profiles |

### Chat/Messaging

| Feature | Description |
|---|---|
| Lobby screen & Default chats | Lobby screen shows which Rooms/Spaces and Private chats user has joined, number of users and a latest message in each room |
| Chat Rooms / Spaces | Users can chat in group chats, also send and receive Coins and Items within rooms |
| Private chats | Users / crypto wallets can message each other individually |
| Manage chats | Users can rearrange chats via Lobby screen controls |
| Profile menu | Tap on User's profiile to send Coins/Items, start a Private chat, Ban/Report etc |
| Default Rooms / Spaces | Specify "pinned" or Default Rooms that all of your App / Ecosystem users will auto-join |
| Premium / Members-only rooms | (If enabled) certain Rooms/Spaces may be limited to a member status confirmed via a 3rd party integration |
| Ban users | Room/Space owners and admins can ban other users |
| Now typing | Users see when other users are typing |
| Photos/avatars/initials | Users represented by photos / avatars if uploaded, otherwise initials avatar in the messaging interactions |
| File attachments | Photos, Videos, other file types attachments supported. Previews supported for Photos and Videos. |
| Voice & Video messages | Long tap to record and send a message |
| Social Likes | Users can receive Coins and Items towards messages and content they post |
| Create Rooms / Spaces | Users can create their own chat Rooms / Spaces, modify their settings and rules, invite other users |
| Share room via QR | User can share and join Rooms / Spaces via QR codes. For example, invite users via TV or print, Zoom call etc |
| Share room via link | Text link sharing allows to link directly to Rooms / Spaces within and outside the app. Users join by tapping the link. |
| Chat Bots | Bots allow to connect custom business logic and smart contracts via conversational interface. Some bots are available out of the box. |
| Room/Space wallets | Users can transact Coins and Items with Room/Spaces or their smart contracts |
| Push Notifications (transactional) | When not online, users receive push notification alerts from Rooms/Spaces, Direct Messages, Coins or Items transfers |
| Manage Rooms / Spaces | User can move, rename, leave Rooms / Spaces to organize their Lobby screen |

### Files and Documents

| Feature | Description |
|---|---|
| File Attachments API | Uploads a file to the secure cloud storage so it can be sent in chat as an attachment and / or shared with other users directly. Identifies file type. Identifies record length for video and audio records. Identifies image resolution. Creates a smaller preview (thumbnail) image for media files. Creates a waveform preview for audio records and voice messages. Supports link sharing (see below). |
| File & Document link sharing | Creates an individual link for File and Document sharing purposes. This allows to share a file to certain users without exposing the permanent cloud storage link. The link can be revoked or expire at a certain date. |
| Token/NFT wrapped document | Documents smart contract we created specifically for tokenizing the business documents. This allows to track the full immutable provenance trail of the document - who it was created by, signed by as well as the current ownership or access information. |

### Users engagement & P2P Economy

| Feature | Description |
|---|---|
| On-boarding screens | (Optional, disabled by default), Educational screens for your Users upon first time they open the App |
| Join bonus | (If enabled), Users receive 100 Coins when they join your Application / Ecosystem. This enables new Users to participate in your Ecosystem and p2p rewards. |
| P2P rewards | Users can receive "crypto likes" Coins and Items in response to messages, thus enabling p2p rewards within your Ecosystem. |
| Daily bonus | (If enabled), Users will receive 5 coins every 24h they use the Application |
| Activity rewards | (work in progress) - Ecosystem rewards users for activity that is useful to the community |
| Push notifications (broadcasted) | Send informational messages to your Users |
| Premium / Members-only Spaces | Some Rooms/Spaces and features may be conditional upon User's status or activity. 3rd party membership confirmations are supported via e-mail domain verification, CRM integration etc. |

### Analytics

| Feature | Description |
|---|---|
| Analytics dashboard | Web-based analytics UI providing you with your App & Ecosystem metrics such as Users, Sessions, Transactions, Coins & Items, Messages, Push Notifications, Attachments etc. You can also manage your App, Users and other items using this web interface. |
| Firebase integration | Monitor app usage, demography, location, re-actiivation via Google Firebase dashboards |
| Explorer | Web explorer is available in Dappros Platform dashboard |
| Validation node | Add your own node to the network to access blockchain data directly |

### ACL

| Feature | Description |
|---|---|
| Access Control List | Manage Access at Owner, Application and User level for different actions and resources (see ACL page for details). |
| **API** | Our RESTful JSON API for cases where you need to go beyond functionalities and flows currently implemented in the engine |
| API documentation | Full API documentation of Ethora's backend via Dappros Platform. This provides access to Application/API/Web3/caching (DP Core) + Messaging (XMPP Ejabberd, Push Notifications) + Ethereum Blockchain (geth): https://www.dappros.com/developers/ |
| Swagger | Interactive web interface to query our API: https://app.dappros.com/api-docs/ |

### Misc

| Feature | Description |
|---|---|
| Short URL Room/Space linking | Link to Rooms/Spaces within your App via short URL from other applications and websites (see also QR code sharing). |
| Bots | Automated agents with their own Profiles and Wallets. May be interfacing dApps / smart contracts or external integration such as e-commerce, information retrieval etc. Some ready bots can be enabled out of the box, e.g. **Notary Bot** will sync your messages into immutable ledger, **Booking Bot** will set up an appointment with its owner User etc, **Hut Hut Bot** demonstrates interaction with storing and retrieving digital assets, **Questionnaire Bot** demonstrates collecting information from the user via conversational interface. Bots allow to integrate any functionality not covered by Ethora engine. |
| TnS | Trust & Safety system covers multiple use cases such as bad language censoring, blocking or reporting sensitive or unsafe information leaks etc. This is used for commercial policies, internal reporting and compliance purposes. TnS module works at a low level at the chat server side and is optimized for high load processing. This means it's able to scan every message in an anonymised and automated way to detect any policy violations. TnS is compatible with external API and Message Bus for the purpose of feeding the real-time reports into client systems. |
| Privacy Policy | Ethora's standard Privacy Policy is included within the App which covers Ethora-based projects universally. You can modify or replace it with your own Privacy Policy. |