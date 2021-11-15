## v21.11 - GOING PUBLIC!

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

### Backend

* Add crypto wallets pre-creation to Transactions Queue process
* Dappros Platform admin panel - annoying helper UI can be dismissed now 
* Process erc721Create with Transactions Queue
* Process erc721Transfer with Transactions Queue
* Process erc20Transfer with Transactions Queue


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
