## v22.07 - MAJOR RELEASE "CHERVONA KALYNA" 

There has been a significant number of changes, updates and improvements during our monthly releases since the initial GitHub launch in November 2021 (and since the kick off of the development much earlier than that). We aren't doing the best job documenting all changes in this file as they are done, however most of the code is self explanatory and we have documentation wiki available publicly here: https://ethora.com/ that covers the features of the engine.

### Changes/improvements of v22.07
Note: the main improvement of this major release is the code architecture.
It has come time to refactor our code and improve the performance.
In addition, we have improved the project code structure and readability to make it easier for outside developers to build their own projects on top of Ethora engine.
We are happy to say the goal has been achieved and there is a drastic improvement in the performance of the application.

Some of the changes rolled out in this release:
* Switched to Typescript across the code
* Switched to MobX and functional components
* Multiple code architecture improvements, better organized Helpers, async logic etc
* Lots of improvements around media and Items. You can now play audio and video Items directly from user profiles.
* Introduced some Chat Bots - "Hut, Hut" Bot that allows to store and release NFT items in Rooms/Spaces, "Questionnaire Bot" that allows to collect information from users, "Notary Bot" allowing to keep an immutable ledger audit trail of conversations and agreements, as well as helper bots "Mint Bot" and "Merchant Bot" that allow to mint and purchase/get NFT/NFMT Items. 
* Fixed numerous bugs and issues (caching, XMPP, Push Notifications subscriptions etc)
* More intuitive menu
* NFMT smart contract format for Items (our own variation and extension of ERC-1155 NFT smart contract)
* Audio & Video calls - beta implementation
* Server and blockchain architecture improvements allowing to better connect Users and assets across Applications, removed obstacles for L1/L2 bridging
* Lots of other improvements
* Starting from this release, we are going to assign a unique name to each major release.
* This one is called "Chervona Kalyna" (Red Viburnum) 🩸 and we devote it to the fearless defenders of Ukraine 💛💙 who are now fighting to protect its independence and freedom.

Read more about Chervona Kalyna here: https://en.wikipedia.org/wiki/Oi_u_luzi_chervona_kalyna

Stay tuned for future updates, some really exciting features are still coming soon in follow-up updates to this major release.

Additional details regarding updates merged into this release (information from commits, pardon the brevity):

* d2a1a0eb - New architecture initial commit-> Chat list screen and chat screen
* 25dcdf9a - File upload, Email Account, Profile screen, Asset, Token transfer, folder structure #71
* a08c6cbe - caching with realm
* e5f879a9 - Retreiving messages and transactions for cache
* c7ac80ce - formatting
* 10c84116 - Push notifications
* f7ecc825 - changed transaction retreiving
* 3a028f5c - disabled modal for current user
* 4da1f203 - Taking messages from cache
* d2dc05af - push route
* 659f88bf - fixed bug with transactions from cache
* e8116963 - packages
* be3b0d0f - App name
* 20798169 - Re login issues, Token transfer amount showing undefined, app icon, Direct message incomplete, Font incomplete
* 2261bbee - Playable nfts
* f8e5ab6e - minor UI changes, DM completed, UX needs to change
* a9c86e35 - New mimetype for modal
* 4e977286 - Added items sending
* 727dc1d3 - File upload progress
* 1e755cf3 - Added expanded state
* 8980fb9f - added token refreshing
* 84ecb86c - Fixed token transfer
* d1e4acf1 - Fixed room deleting
* 1ce1bee0 - Fixed title displaying in chat rom
* 6a3593b0 - Fixed scanning
* ecff425f - Added subscription to non-members chat
* 56c3a11e - Minor fixes
* 6950700d - audio message component
* f39aa30b - Debug mode enabling
* 6faab79e - Changed logs adding
* 82de1237 - addding xmpp logs to store
* 1d537920 - Debug screen
* e03dfe2e - Fixed audio message
* 10209e70 - Removed conference
* 8559cff5 - domain
* 046754c1 - Ui fixes
* 7b1c788f - Major changes done
* 7f3c4f68 - Code formatting
* 36a45ddb - Changed key extractor
* 53e41fb2 - Removed doubling upload percent
* a9dc18e3 - Fixed transactions counting and fetching
* a99ffa3e - Fixed problem with coins that not displaying
* 4090efec - 22.07 logo
* 1185fcc4 - Delete logo-02.png
* 054ee5a3 - Added app version
* 2799684e - Changed versioning format
* 064c5255 - Fixed image resize mode
* 6320ffeb - Share profile qr and other UI fixes
* 5367afb3 - App version
* 6e398c5f - Changed close button
* c7ee2221 - Logo height
* ee6c1f52 - Timestamp
* 4621253f - Changed balance
* fbd9b218 - Removed unneccessary code
* 3557bdf6 - Changed setting async storage to normal way
* 4ac9a2c4 - Push notifications helper
* 97000a53 - formatting
* 9afa6e11 - Fetch last message, avatar issue, chat room open on click push noti
* 1250dd6b - Calcucating media height
* 0a194063 - Added quick replies buttons
* 79063a58 - alpha helper
* 7bf919c0 - quick reply scheme

## v21.11 - MAJOR RELEASE - GOING PUBLIC!

PUBLIC GITHUB LAUNCH - MESSAGE FROM THE TEAM

Thank you all for your support and interest in Ethora project! We are finally going public after over 2 years working on our React Native codebase and over 3 years working on our backend infrastructure. We are grateful to our team and families, our early adopter clients and everybody who have helped make this product better by their feedback and suggestions.

Messages from the Ethora development team:

* Mansi Nashte (HR & marketing) - Those who think women cannot be leaders are not married.
* Borys Bordunov (Backend engineer) - Big jobs can be smaller together.
* Mykhailo Mogyliuk (React Native engineer) - Seen it all, done it all, can't remember most of it).
* Vineeth Nambiar (React Native engineer) - The start of any big journey can be complex. Determination and patience makes it simple.
* Oleksii Kliuiev (Erlang engineer) - Rome wasn’t built in a day.
* Bikash Patak (QA engineer) - Nothing is impossible, the word itself says "I'm possible".
* Nikhil Bankar (UX designer, Product Lead) - A user interface is like a joke. If you have to explain it, it’s not that good.
* Taras Filatov (founder, CEO & CTO) - I devote my work on this product to my parents Vira and Sergii and my family Polina, Platon and Max. My thanks also go out to my ‘extended family’ - Dappros team who have worked on the blockchain and API backend, and the Ethora engine itself, and to DeepX team who have built the messaging infrastructure (Oleksii, Ihor, my brother Dima - thank you for sparing your time and resources towards this project). This project wouldn’t have been possible without you all!

### Frontend
* Config file improvements - implemented across all screens
* Resolved realm issue and upgraded rn version back to 0.64.2
* Config - ability to enable and disable NFT
* Improved in-chat playback for audio & video messages, added duration etc
* Improved UI/UX for audio messages recording
* Users banning and roles 
* Added waveform logic for Audio messages
* Chat renaming - fixed, improved UI
* Mint UI improvements
* Profile bio - added chat links support
* Fixed UI/UX issue with attachments blocking the message tap menu
* Added/improved debug mode - supports JSON API and XMPP verbose logging
* Introduced swipe menu for managing chat rooms

### Backend
* Add crypto wallets pre-creation to Transactions Queue process
* Dappros Platform admin panel - annoying helper UI can be dismissed now 
* Process erc721Create with Transactions Queue
* Process erc721Transfer with Transactions Queue
* Process erc20Transfer with Transactions Queue
* Added Redis queue and limiter for B/C transactions. Limiter is set via BC_STACK_SIZE at .env file. This is done to avoid overloading B/C node with too many concurrent transaction. 

<<<<<<< HEAD

=======
>>>>>>> 1d3b9db1fa789645879b0dd997b143432f59feaa
## v21.10

### Backend
* Replace S3 with private IPFS cluster
* E-mail confirmation template improvement
* Created Objects API for storing (retrieving, deleting) objects to blockchain
* Adapt NFT & server API to allow creation of up to 100 assets (rarity value)


## v21.09

### Backend
* Swagger UI added at /api-docs route for easier tests by external developers
* Audio/Video API loads extended to add Duration property
* Multi-tenancy for Google Auth tokens (to improve support for multiple Owners and Apps within one Dappros Platform cluster)
* Daemon for processing unconfirmed blockchain TXs
* NFT Burn on behalf of the Application

## v21.07

### New features
* NFT details screen
* added Gzip compression for API responses

### UI/UX improvements
* users can edit their firstname and lastname in the Profile
* users can open attached files in the chat in full size mode
* the text of system messages about the token or item transfers is aligned to the center of the screen
* new items displays first in the item's list and when user is choosing items for tranferring
* chats images on the Lobby screen is replaced with the first letters of chat name, font is changed 
* limited characters for the "Items name" & "Chat Name" fields
* 50 symbols for Items name
* 30 symbols for Chat name

### Bugs
* fixed issue with uploading files from Gallery (iOS)
* fixed issue: user isn't able to scroll transaction after NFT minting
* fixed issue: transactions history doesn't display due to wrong timestamp
* fixed issue: after item tranferring the number of coins is displayed on the Transactions screen instead of the amount of this specific NFT in user's wallet
