# Ethora (Dappros Platform) API

Studying this section is optional. You can build your apps using Ethora engine without having to study the API documentation.

Reference pages in this folder:

- [CHAT_PROTOCOL.md](CHAT_PROTOCOL.md): the chat wire protocol (identity and JID conventions, connecting over XMPP, rooms, the message stanza and its `<data>` element, history, read state, push and AI agents).
- [pushes.md](pushes.md): push notifications (operator setup per app, client registration, payload, broadcasts, calls).
- [chats.md](chats.md): the original 2022 chat flow, kept for historical context only.

The `swagger.js`, `swaggerOptions.js`, `tags.js` and `index.js` files are an August 2023 snapshot of the backend's JSDoc Swagger annotations. They are not updated; the live Swagger below is generated from the running backend and is the only current API reference.



This section will be useful for developers who are looking to:
1) Better understand how our platform works
2) Extend their apps functionality beyond the code currently available in Ethora client engines (React Native for iOS/Android and React.js for Web)
3) Interact with their apps and server data through their own 3rd party logic (for example, import/export users with your legacy system via Users API etc), create their own server extensions, chat bots etc

## Latest version (Swagger)

Latest version of Ethora API documentation is available here:
https://api.chat.ethora.com/api-docs/#/

This is the canonical API documentation, regenerated automatically from the running production backend. It includes the new v2 routes (tenant-admin / B2B endpoints, chat automation, sources/AI agents, async batch jobs, etc.).

Swagger documentation can be used interactively.

The spec itself is served at https://api.chat.ethora.com/api-docs/swagger.json.

<img width="1238" alt="Ethora Swagger UI" src="https://github.com/dappros/ethora/assets/328787/3541718c-f933-4ec5-bae6-38152f97f05c">

