# ethora: open-source tokenized community engine (iOS/Android, ERC-20/NFT, chat/messaging)
Mobile app engine and platform for social tokenized communities. 

## Learn more (our wiki website)
Visit https://ethora.com/ for latest information regarding the project. 
Some information below might be outdated as we update the above website most often. 

## How to build
Please check this Step by Step build guide - it shows how to build a new app using Ethora engine within 32 minutes: https://ethora.com/wiki/Step_By_Step_Guide

### Core features
* iOS & Android
* Social sign-in & Crypto wallets
* Coins (ERC-20 tokens)
* NFT Items (ERC-721 tokens)
* "Crypto likes" (sending tokens to messages)
* Ethereum blockchain powered immutable transactions ledger
* Crowd-sourced rooms and spaces, p2p QR-code / public key - based invites system
* Chat & Social profiles
* Push notifications

### Disclaimer

Our platform provides technology for ecosystems built on the principles of openness, transparency and decentralization. By design, certain information such as user profiles, rankings, and the transactions of digital assets will be available to the whole ecosystem or to the public. You should not use the standard version of this product for secure or commercially sensitive communications. You should not use any versions of this product for emergency communications. You should not share information or content through our platform in cases where you may not be comfortable or authorized to share it with the public.

Note: enterprise-level version of Ethora engine (additional security layers, custom user sign-on mechanisms, SLA package) is available under a separate license from <a href="https://www.dappros.com/contact-us/">Dappros</a>.

### License and Open-source roadmap

LICENSE. The project codebase of Ethora developed by the project contributors is released under Apache 2.0 license. 
This is a commercial friendly license allowing you to build your own projects using this codebase without a requirement for you to make your modifications open source.
We have applied what we believe is the most open and flexible license option in order to support developers, startups and businesses globally in creating their own tokenized ecosystems. 

CONTRIBUTORS AND GOVERNANCE. Currently (2018-2021) project is being developed and funded by <a href="https://www.dappros.com/">Dappros</a> and <a href="http://deepxhub.com/">DeepX</a>. In case this project grows popular and more individuals and organizations start supporting it, we intend to set up an independent foundation or DAO to govern further project development for the public good and promotion of decentralized economy globally.

BACKEND. The server-side functionality of Ethora is provided by Dappros Platform API and DeepX RTC infrastructure. Under the bonnet, it consists of Ethereum blockchain network, an API wrapper and caching layer interacting with Ethereum nodes and S3/IPFS storage (built with Node.js, Apache Kafka and MongoDB), as well as XMPP-based Ejabberd messaging server with our own custom-built services (such as Push Notifications, blockchain identities integration etc) built with Erlang, Mnesia, MySQL and Cassandra. 

When using Ethora engine, your default backend option is to <a href="https://app.dappros.com/register">sign up</a> for a free account of Dappros Platform. This provides backend infrastructure for your application(s) including Users, Wallets, Tokens, Chat/Messaging etc. Normally our users only need to customize client-side code and we did not have requests to open-source the backend code yet, but we are open to doing that and it is in our roadmap (more on that below).

### Commercial model

*  Client-side: free, open-source.
*  Server-side: freemium (free plan + optional paid SLA plans for businesses)

We intend to forever support a generous free tier of Dappros Platform for startups, small businesses and non-profit organizations. 
Platform R&D and the free tier infrastructure are supported through our paid entrerprise-level SLA packages and consulting services.

### DAO governance vision

Currently (2021) Dappros is a privately owned company that offers an open-source mobile app, open-source private blockchain and closed-source backend. Our founders promote decentralized economy and free p2p communication technologies for many years. We are developing a roadmap where the platform will become fully open and its governance can be transferred to a decentralized organization. In such scenario, we will remain a private organisation offering implementation and SLA services, but the development of the new versions of the platform engine and maintenance of the publicly available infrastructure will become globally distributed and decentralized. Our only limiting factor here is funding and time constraints. 

### Key principles (short term):

* A platform allowing businesses and creators to easily set up and for users to join and explore a tokenized p2p ecosystem.
*  Partially centralized. 
* Assets and transactions ledger is decentralized.
* Leveraging state of the art DLT, mobile and communication technologies.
* Mobile-first (no ads, no gimmicks)
* Open-source client

### Key principles (mid term):

* Self-Sovereign Identity - users own their identity, content and assets
* Open-source server - anybody can download and run a Validator or Host node (closed-source enterprise version possible for private chain projects)
* Validator / Hoster incentives - self-supporting network
* Easy sidechain / mainchain assets transfer


### Key principles (long term):

* Decentralized maintenance allowing both (a) incentivized hosting of the public infrastructure and (b) private networks. À la Ethereum;
* R&D grants available for teams and individual developers contributors globally
* Decentralized governance - platform stakeholders make important decisions for the public network 
* Meritocracy - governance stakes are earned through supporting platform infrastructure (running nodes), R&D work and platform promotion

### Contact

Drop us <a href="https://www.dappros.com/contact-us/">a line</a> if you’re interested to find out more or to become a contributor to the project. 

Also feel free to submit pull requests in this Github repo!
