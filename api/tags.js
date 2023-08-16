module.exports = [
  {
    name: 'Apps',
    description: 'Managing Apps and their settings.<br /> ℹ️ Apps are entities that you create for your specific projects. Apps have certain setttings and properties including visual branding and User default settings that allow you to tailor the experience to the needs of your Users and your project. Normally each app has its own mobile build (iOS, Android client) distributed via Appstore under your name and a web client distributed via your own custom URL such as app.yourdomain.com.'
  },
  {
    name: 'Explorer',
    description: 'Retrieving the assets ledger (blockchain) transactions. <br />ℹ️ In our platform, a private (L2) Ethereum blockchain is used for keeping an immutable ledger of transactions of digital assets and Documents.  <br />This ensures that all assets, transactions, documents, art and token issuances are happening in a verifiable manner facilitating trust of users and organizations. <br />Each DP/Ethora server by default has its own private L2 chain. There is an option to make L2 chain public or connect it to a global L1 chain depending on project requirements.'
  },
  {
    name: 'Files',
    description: 'Managing user uploaded files. ℹ️ Files mechanism is used in multiple features in our platform including for chat attachments, user-created Documents, in user profiles and chat rooms media, for digital collectibles (NFTs) etc. Files are stored either using IPFS (a federated file system) or Minio (analog of AWS S3 buckets) mechanisms. Certain types of files trigger additional processing when uploaded. For example, videos and images have thumbnails and previews generated for them, audio files have wavelets visualizations etc. Also, depending on the server and your App configuration, files may be automatically encrypted and/or protected via secure sharing links.'
  },
  {
    name: 'Tokens',
    description: 'Managing digital assets and crypto tokens owned by Apps, Users and Bots. <br />ℹ️ There are 3 types of Tokens in our platform (ERC20, Coins, ERC-1155, Items, NFMT) plus Documents which leverage web3 (blockchain) technology for tracking their issuance, transfers and signatures. <br />Depending on your use case, your App may be using or not using these features, and your Users may be aware or not aware of the powerful cryptographic technology behind these assets. <br />Tokens are often used for gamification and retention purposes (e.g. internal Coins that Users receive for activity) but they can also be used for business and assets ownership purposes (Documents, digital art, provenance tracking etc). <br />Issuances and transfers of Tokens are managed via an immutable cryptographic ledger including the cryptographic Merkle Tree mechanism. This means that the digital assets within your App have a very high level of protection. <br />The projects then decide for themselves whether to use the Tokens mechanics at all and where it is used, whether to use it just for internal gamification purposes, or whether to link them with real-world processes and assets. '
  },
  {
    name: 'Users',
    description: 'Managing Users. <br />ℹ️ Users are end user identities that have authenticated with one of the allowed sign on methods.  <br />Users are first created by a certain App but depending on configuration and business logic, Users may be able to interact beyond the resources of a current App, for example they may be able to interact with global web3 resources (L1), server-wide (L2) resources shared across Apps etc.  <br />Each user receives an EVM (Ethereum) compatible "L2" cryptographic identity or wallet by default and additional wallets/IDs can be linked if required. <br />Tags can be assigned to Users depending on business logic requirements.'
  },
  {
    name: 'Wallets',
    description: 'Managing Wallets. <br />ℹ️ Users, Apps, Bots and other entities may create and manage Wallets. Wallets are protected by cryptographic keypairs and allow to store and transact digital assets such as Coins, digital art and Documents. '
  },
  {
    name: 'Mobile',
    description: 'App Builder functions. <br >ℹ️ This allows to initiate the generated of React Native code customized for your specific Application.'
  }
  {
    name: 'Docs',
    description: 'Managing User uploaded Documents. <br />ℹ️ Documents are special types of Tokens that act as cryptographic and metadata wrappers around File objects. This allows to implement various business logic for secure documents sharing and also to track signatures and provenance if required. <br />Before calling a Docs API, client application should first use Files to upload the file and then call Docs API with the File location, which in turn will create an on-chain Document entity.'
  }
  {
    name: 'Rooms',
    description: 'Managing chat rooms. <br />ℹ️ We use MUC (multi-user chats) according to XMPP standards for private, group and public chat rooms in the platform. <br />Most of the messaging interaction including managing the rooms happens via XMPP protocol. <br />Some functions have API endpoints however to simplify client-side and backend interaction with Rooms.'
  }
  {
    name: 'Sharelinks',
    description: 'Managing secure sharing links for certain resources such as User Profiles and Documents. <br />ℹ️ Sharelink is a special mechanism to facilitate individual shares of User Profiles or Documents in cases where such resource is not open to the public and/or is encrypted.'      
  }  
]
