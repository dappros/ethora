# Ethora - React.js client

Ethora engine web client, built in React.js. 

This is a part of Ethora project monorepo. Please see the main readme file in the root folder [https://github.com/dappros/ethora#readme](https://github.com/dappros/ethora/blob/main/README.md) for details on the project, installation instructions and contacts for technical support. (c) Dappros Ltd, 2018-2024

## Choose your preferred option

There are three ways to build your React.js app using Ethora engine (this repo):
1. Via **web dashboard**. You can ignore this repo if you choose this '**no code**' option. Just register at https://ethora.com/ create a new Application there and use the web interface to customize your app appearance. Your app is hosted and deployed automatically in our cloud. You can switch to your own domain name and branding using dashboard settings. 
2. Build **manually using this repo**, self host and deploy your web application manually. 
3. **Dedicated server image** from Ethora/Dappros. Obtain a self-install server image from us directly or via AWS Marketplace. Your web application will be hosted on your server / AWS instance. It will be deployed automatically after you complete the initial set up steps. In this configuration, your API, push/messaging and other services will also be hosted in your own dedicated server.

ℹ️ 
Option #1 (no code) is the fastest. Most developers choose option #2 especially if they need to make more significant changes than our web dashboard allows or if you need to build a new application from scratch using Ethora components nested within your own architecture. Option #3 (everything self hosted) is mainly for enterprise clients such as finance or healthcare companies that require to have their own dedicated server e.g. for compliance reasons. You can always test the engine with option #1 or #2 first and then decide if you need #3. We also provide dedicated hosting + SLA packages.  

## Getting Started

### Install dependencies

To install dependencies, run
#### `yarn install`

![CleanShot 2024-03-06 at 17 53 27@2x](https://github.com/dappros/ethora/assets/328787/2a9f26b0-5074-4cd9-bfdc-7d6bd315ba16)

⚠️ 'npm install' won't do it - make sure to use yarn.

### Configure .env file

There should be `.env.example` in the project folder, just copy it to `.env` and edit the endpoints if needed.

![CleanShot 2024-03-06 at 17 54 09@2x](https://github.com/dappros/ethora/assets/328787/ac8e9c07-1e00-4937-9c73-f11785f2d6d9)


### Launch locally

In the project directory launch your app like so:

`npm start`

![CleanShot 2024-03-06 at 17 54 40@2x](https://github.com/dappros/ethora/assets/328787/8e1abdcb-10ab-4749-bf9e-08d93a5ca021)

This runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. You should see something like this:

![CleanShot 2024-03-06 at 17 57 26@2x](https://github.com/dappros/ethora/assets/328787/c345f3f6-4f66-4547-8ad7-dc573f6190b1)


### Testing and debugging

The page will reload if you make edits:

![CleanShot 2024-03-06 at 17 55 13@2x](https://github.com/dappros/ethora/assets/328787/e6a8bfed-cf84-432a-9222-1d587fbc77c4)

You will also see any lint errors in the console.

### Other stuff

`npm run build` builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

### That's all!

Your app is ready to be deployed!
