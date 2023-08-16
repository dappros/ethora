module.exports = [
  {
    name: 'Apps',
    description: 'Managing Apps and their settings.<br /> ℹ️ Apps are entities that you create for your specific projects. Apps have certain setttings and properties including visual branding and User default settings that allow you to tailor the experience to the needs of your Users and your project. Normally each app has its own mobile build (iOS, Android client) distributed via Appstore under your name and a web client distributed via your own custom URL such as app.yourdomain.com.'
  },
  {
    name: 'Explorer',
    description: ''
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
    description: ''
  },
  {
    name: 'Wallets',
    description: ''
  },
  {
    name: 'Mobile',
    description: ''
  }
]
