# Ethora - React.js client

This is a part of Ethora project monorepo. 

Please see the main readme file in the root folder [https://github.com/dappros/ethora#readme](https://github.com/dappros/ethora/blob/main/README.md) for details on the project, installation instructions and contacts for technical support.

## How to deploy

There are three ways to build your React.js app using Ethora engine (this repo):
1. Deployed automatically - just register at https://ethora.com/ create a new Application there and use the web interface to customize your app appearance. Your app is hosted and deployed automatically in our cloud. You can use your own domain name and branding.
2. Dedicated server image from Ethora/Dappros. Obtain a self-install server image from us directly or via AWS Marketplace. Your web application will be hosted on your server / AWS instance. It will be deployed automatically after you complete the initial set up steps.
3. Build manually using this repo, self host and deploy manually.


(c) Dappros Ltd, UK, 2018-2023

---

# Getting Started

To install dependencies run
### `yarn install`

Create .env file in the root of the client-web with the following structure 

### `VITE_APP_API_URL=https://api.ethoradev.com/v1`
### `VITE_APP_DOMAIN_NAME=ethoradev.com`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
