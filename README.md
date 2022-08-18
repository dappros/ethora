# ethora: open-source web3 social app engine (iOS/Android, ERC-20/NFT, social features)
Mobile 📱 app engine and web3 🔗🌐 platform for social 💬 tokenized ₿Ξ💰 communities 👥👥. 

**UPD (August'22): Numerous updates, UX improvements, better NFT & digital assets support, bots, MetaMast/WalletConnect integration etc.

[![Ethora video demo](https://user-images.githubusercontent.com/328787/185500847-3a607707-9008-4c56-873c-7c9aa1aa1eee.png)](https://www.youtube.com/watch?v=pKEMcxJb5HM)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=pKEMcxJb5HM" target="_blank"><img width="439" alt="ethora_youtube" src="https://user-images.githubusercontent.com/328787/185500847-3a607707-9008-4c56-873c-7c9aa1aa1eee.png"></a>

**UPD (July'22): Major release v22.07 is out (July 2022 version) - lots of improvements, faster and easier to work with. Try it out!**

Proudly built in Ukraine 🇺🇦 (8 team members), India 🇮🇳 (4 team members) & U.K. 🇬🇧 (1 team member) (and inviting further collaborators)

<img src="https://ethora.com/images/thumb/3/39/Ethora_social_sign-in.jpg/450px-Ethora_social_sign-in.jpg" width="200" alt="Demo: sign in page" /> <img src="https://ethora.com/images/thumb/5/56/Ethora_chat_room.jpg/450px-Ethora_chat_room.jpg" width="200" alt="Demo: chat tokenized gamification" /> <img src="https://ethora.com/images/thumb/f/fd/Ethora_User_Profile.jpg/450px-Ethora_User_Profile.jpg" width="200" alt="Demo: sign in page" /> <img src="https://ethora.com/images/thumb/c/ce/RN_app_NFT_mint_14.jpg/450px-RN_app_NFT_mint_14.jpg" width="200" alt="Demo: sign in page" /> 

Video demo: https://www.youtube.com/watch?v=FvOTFyLVbKM

## Learn more (our wiki website)
Visit https://ethora.com/ for latest information regarding the project. 
The Launchpad https://ethora.com/wiki/Launchpad section lists some sample projects that use Ethora engine in production. 

*Note: Some information below might be outdated as we update the above website most often.* 

## How to BUIDL 🛠️
Please check this Step by Step build guide - it shows how to build a new app using Ethora engine within 30 minutes: https://ethora.com/wiki/Step_By_Step_Guide
You will need environment set up for iOS or Android development.

## Core features 💡
* iOS & Android
* SSO (Social Sign On) via Gmail, Facebook, Apple 
* Each user gets a digital assets wallet + cryptographic keypair 
* Coins (ERC-20 tokens) for internal p2p social economy, gamification etc (either secluded or L1/mainnet connected network)
* NFT Items (ERC-721 tokens)
* "Crypto likes" (sending tokens to messages)
* Ethereum blockchain powered immutable transactions ledger - great for transactions tracking and reputation mechanism
* Crowd-sourced rooms and spaces, p2p QR-code / public key - based invites system
* Chat & Social profiles
* Push notifications
* Audio, Video messages and calls

## Should I build my own version? 🤔

Ethora is distributed as B2B2C product (in other words, open-source and 'white label' friendly) which means you can build your own custom branded web3 social apps, for your community, using this engine.

You may also use our demo Ethora app directly from Apple and Google appstores 'as is', create your own chats there and proceed that way. 

Running your own version, however, allows you to:
* Have your own app in the iOS and Android appstores
* Have your own name and branding
* Your own token / coin 
* (Optional) dedicated infrastructure - your own chain either private or L1/L2 connected (or you can simply use our chain which is the default option) 
* (Optional) custom login and wallet options, for example, enable/disable social sign in, choose between custodial and non-custodial wallets for your users, integrate with your existing CRM / users database etc
* Lots of other Application-level Config options such as defining default chats, short links domain, enabling/disabling features etc

## Disclaimer 📜

Our platform provides technology for ecosystems built on the principles of openness, transparency and decentralization. By design, certain information such as user profiles, rankings, and the transactions of digital assets will be available to the whole ecosystem or to the public. You should not use the standard version of this product for secure or commercially sensitive communications. You should not use any versions of this product for emergency communications. You should not share information or content through our platform in cases where you may not be comfortable or authorized to share it with the public.

Note: enterprise-level version of Ethora engine (additional security layers, custom user sign-on mechanisms, SLA package) is available under a separate license from <a href="https://www.dappros.com/contact-us/">Dappros</a>.

## License and Open-source roadmap ⚖️

LICENSE. The project codebase of Ethora developed by the project contributors is released under Apache 2.0 license. 
This is a commercial friendly license allowing you to build your own projects using this codebase without a requirement for you to make your modifications open source.
We have applied what we believe is the most open and flexible license option in order to support developers, startups and businesses globally in creating their own tokenized ecosystems. 

CONTRIBUTORS AND GOVERNANCE. Currently (2018-2022) project is being developed and funded by <a href="https://www.dappros.com/">Dappros</a> and <a href="http://deepxhub.com/">DeepX</a>. In case this project grows popular and more individuals and organizations start supporting it, we intend to set up an independent foundation or DAO to govern further project development for the public good and promotion of decentralized economy globally.

BACKEND. The server-side functionality of Ethora is provided by Dappros Platform API and DeepX RTC infrastructure. Under the bonnet, it consists of Ethereum blockchain network, an API wrapper and caching layer interacting with Ethereum nodes and S3/IPFS storage (built with Node.js, Apache Kafka and MongoDB), as well as XMPP-based Ejabberd messaging server with our own custom-built services (such as Push Notifications, blockchain identities integration etc) built with Erlang, Mnesia, MySQL and Cassandra. 

When using Ethora engine, your default backend option is to <a href="https://app.dappros.com/register">sign up</a> for a free account of Dappros Platform. This provides backend infrastructure for your application(s) including Users, Wallets, Tokens, Chat/Messaging etc. Normally our users only need to customize client-side code and we did not have requests to open-source the backend code yet, but we are open to doing that and it is in our roadmap (more on that below).

## Commercial model 🛒

*  Client-side: free, open-source.
*  Server-side: freemium (free plan + optional paid SLA plans for medium/large businesses)

We intend to forever support a generous free tier of Dappros Platform for startups, small businesses and non-profit organizations.
Platform R&D and the free tier infrastructure are supported through our paid entrerprise-level SLA packages and consulting services.

## Project governance and roadmap 📅

### DAO governance vision

Ethora project is governed and implemented by Dappros Ltd with parts of roadmap fulfilled by DeepX. Our founders promote decentralized economy and free p2p communication technologies for many years. We work according to our roadmap with a goal that the platform governance will be fulfilled by a decentralized organization. In such scenario, we will remain a private organisation offering implementation and SLA services, but the development of the new versions of the platform engine and maintenance of the publicly available infrastructure will become globally distributed and decentralized. 

### Key principles (short term):

* A platform allowing businesses and creators to easily set up and for users to join and explore a web3 social ecosystem, powered by tokenized p2p commerce
* Partially centralized. 
* Assets and transactions ledger is decentralized.
* Leveraging state of the art DLT (Ethereum), mobile (iOS & Android) and communication (messaging, push notifications, WebRTC) technologies.
* Mobile-first ("no ads, no gimmicks" 😉)
* Open-source client

### Key principles (mid term):

* Self-Sovereign Identity - users own their identity, content and assets
* Open-source server - anybody can download and run a Validator or a Host node (closed-source enterprise version possible for private chain projects)
* Validator / Hoster incentives - self-supporting network
* Easy sidechain (L2) / mainchain (L1) assets transfer

### Key principles (long term):

* Decentralized maintenance allowing both (a) incentivized hosting of the public infrastructure and (b) private networks
* R&D grants available for teams and individual developers contributors globally
* Decentralized governance - platform stakeholders make important decisions for the main public network infrastructure and R&D priorities

## Contact 💬

Drop us <a href="https://www.dappros.com/contact-us/">a line</a> if you’re interested to find out more or to become a contributor to the project. 

Also feel free to submit pull requests in this Github repo!
