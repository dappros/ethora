// import xmpp from "@xmpp/client";
// import { Element } from "ltx";
// import {
//   VITE_APP_XMPP_SERVICE,
//   VITE_XMPP_HOST,
//   VITE_XMPP_SERVICE,
// } from "../config/apiService";
// import uuid from "react-native-uuid";

// const xml = xmpp.xml;

// const XMPP_SERVICE = VITE_XMPP_SERVICE;
// const XMPP_HOST = VITE_XMPP_HOST;

// class WsClient {
//   service = "";
//   username = "";
//   password = "";
//   client: xmpp.Client | null = null;
//   resource = "";

//   constructor(service: string) {
//     this.service = service;
//     this.username = "";
//     this.password = "";
//     this.resource = Date.now().toString();
//   }

//   checkOnline() {
//     return this.client && this.client.status === "online";
//   }

//   login(username: string, password: string) {
//     try {
//       return new Promise((resolve, reject) => {
//         this.username = username;
//         this.password = password;

//         if (!this.client) {
//           this.client = xmpp.client({
//             username: this.username,
//             password: this.password,
//             service: this.service,
//             resource: this.resource,
//           });

//           this.client.on("online", (jid: unknown) => {
//             const message = xml("presence");

//             if (this.client) {
//               this.client.send(message);
//               resolve(jid);
//             }
//           });

//           this.client.on("error", (error: any) => {
//             console.log("xmpp on error ", error);
//             reject(error);
//           });

//           this.client.on("stanza", this.stanzaHandler);

//           return this.client.start();
//         }
//       });
//     } catch (error) {
//       console.log("login error");
//     }
//   }

//   stanzaHandler = async (stanza: Element) => {
//     // console.log(stanza.toString());

//     runInAction(async () => {
//       if (stanza.is("message")) {
//         // we handling massage stanza with result in different place
//         if (!stanza.getChild("result")) {
//           const from = stanza.attrs.from;

//           const fromLocalJid = from.split("@")[0];
//           const username = from.split("/")[1];

//           if (true) {
//             const text = stanza.getChild("body")?.getText();

//             if (text) {
//               let FN = runInAction(() => rootStore.chatStore.vCards[username]);

//               if (!FN) {
//                 // console.log('looking for FN');
//                 FN = (await this.getFN(username)) as string;

//                 runInAction(() => rootStore.chatStore.addVcard(username, FN));
//               }
//               runInAction(() =>
//                 rootStore.chatStore.addMessages([
//                   {
//                     _id: uuid.v4().toString(),
//                     text: text,
//                     createdAt: new Date(),
//                     FN: FN,
//                     username: username,
//                     fromLocalJid: fromLocalJid,
//                     user: {
//                       _id: username,
//                       name: FN,
//                     },
//                   },
//                 ])
//               );

//               rootStore.chatStore.setChatChanged();
//               console.log(`New message from ${from}: ${text}`);
//             }
//           }
//         }
//       }
//     });
//   };

//   async subscribe(roomName: string) {
//     try {
//       if (this.client) {
//         const message = xml(
//           "iq",
//           {
//             to: `${roomName}@${VITE_XMPP_SERVICE}`,
//             type: "set",
//             id: "newSubscription",
//           },
//           xml(
//             "subscribe",
//             { xmlns: "urn:xmpp:mucsub:0", nick: this.client?.jid?.getLocal() },
//             xml("event", { node: "urn:xmpp:mucsub:nodes:messages" }),
//             xml("event", { node: "urn:xmpp:mucsub:nodes:presence" })
//           )
//         );

//         // console.log('-----> ', message.toString());

//         this.client.send(message);
//       }
//     } catch (error) {
//       console.log("sub error");
//     }
//   }

//   async presence(roomName: string) {
//     try {
//       if (this.client) {
//         let message = xml(
//           "presence",
//           {
//             to: `${roomName}@${VITE_XMPP_SERVICE}/${this.username}`,
//           },
//           xml("x", "http://jabber.org/protocol/muc")
//         );
//         // console.log('--------->', message.toString());

//         this.client.send(message);
//       }
//     } catch (error) {
//       console.log("presence error");
//     }
//   }

//   sendMessage(roomName: string, text: string) {
//     if (this.client) {
//       const message = xml(
//         "message",
//         {
//           to: `${roomName}@${XMPP_SERVICE}`,
//           type: "groupchat",
//           id: "sendMessage",
//         },
//         xml("data", {
//           xmlns: XMPP_SERVICE,
//         }),
//         xml("body", {}, text)
//       );

//       console.log("-----> ", message.toString());

//       try {
//         this.client.send(message);
//         console.log("message sent");
//       } catch (error) {
//         console.log("err sending", error);
//       }
//     }
//   }

//   getHistory(roomName: string, max: number) {
//     const id = `get-history:${Date.now().toString()}`;

//     let stanzaHdlrPointer: (stanza: any) => Promise<void>;

//     const unsubscribe = () => {
//       this.client?.off("stanza", stanzaHdlrPointer);
//     };

//     const responsePromise = new Promise((resolve, reject) => {
//       let messages: Element[] = [];

//       stanzaHdlrPointer = async (stanza) => {
//         if (
//           stanza.is("message") &&
//           stanza.attrs.from &&
//           stanza.attrs.from.startsWith(roomName)
//         ) {
//           const result = stanza.getChild("result");

//           if (result) {
//             const messageEl = result.getChild("forwarded")?.getChild("message");

//             messages.push(messageEl);
//           }
//         }

//         if (
//           stanza.is("iq") &&
//           stanza.attrs?.["id"] === id &&
//           stanza.attrs?.["type"] === "result"
//         ) {
//           let result = [];

//           for (const msg of messages) {
//             const text = msg.getChild("body")?.getText();
//             if (text) {
//               const from = msg.attrs["from"];
//               const time = msg.getChild("archived")?.attrs.id;

//               const fromLocalJid = from.split("@")[0];
//               const username = from.split("/")[1];

//               let FN = runInAction(() => rootStore.chatStore.vCards[username]);

//               if (!FN) {
//                 FN = (await this.getFN(username)) as string;
//                 runInAction(() => rootStore.chatStore.addVcard(username, FN));
//               }

//               result.push({
//                 text,
//                 username,
//                 FN: FN,
//                 fromLocalJid: fromLocalJid,
//                 _id: uuid.v4().toString(),
//                 createdAt: new Date(time / 1000),
//               });
//             }
//           }
//           unsubscribe();
//           const transformedMessages = result.map((msg) => ({
//             _id: msg._id,
//             text: msg.text,
//             createdAt: msg.createdAt,
//             fromLocalJid: msg.fromLocalJid,
//             FN: msg.FN,
//             username: msg.username,
//             user: {
//               _id: msg.username,
//               name: msg.FN,
//             },
//           }));
//           runInAction(() =>
//             rootStore.chatStore.addMessages(transformedMessages)
//           );
//           resolve(transformedMessages);
//         }

//         if (
//           stanza.is("iq") &&
//           stanza.attrs.id === id &&
//           stanza.attrs.type !== "result"
//         ) {
//           unsubscribe();
//           reject();
//         }
//       };

//       this.client?.on("stanza", stanzaHdlrPointer);

//       const message = xml(
//         "iq",
//         {
//           type: "set",
//           to: `${roomName}@${XMPP_SERVICE}`,
//           id: id,
//         },
//         xml(
//           "query",
//           { xmlns: "urn:xmpp:mam:2" },
//           xml(
//             "set",
//             { xmlns: "http://jabber.org/protocol/rsm" },
//             xml("max", {}, max.toString()),
//             xml("before")
//           )
//         )
//       );

//       this.client?.send(message);
//     });

//     const timeoutPromise = createTimeoutPromise(2000, unsubscribe);

//     return Promise.race([responsePromise, timeoutPromise]);
//   }

//   getFN(name: string) {
//     const id = `get-FN:${Date.now().toString()}`;

//     let stanzaHdlrPointer: (stanza: any) => void;

//     const unsubscribe = () => {
//       this.client?.off("stanza", stanzaHdlrPointer);
//     };

//     const responsePromise = new Promise((resolve, reject) => {
//       stanzaHdlrPointer = (stanza) => {
//         if (
//           stanza.is("iq") &&
//           stanza.attrs.id === id &&
//           stanza.attrs.type === "result"
//         ) {
//           const FN = stanza.getChild("vCard")?.getChild("FN")?.getText();
//           unsubscribe();
//           resolve(FN);
//         }

//         if (
//           stanza.is("iq") &&
//           stanza.attrs.id === id &&
//           stanza.attrs.type === "error"
//         ) {
//           unsubscribe();
//           reject();
//         }
//       };

//       this.client?.on("stanza", stanzaHdlrPointer);

//       const msg = xml(
//         "iq",
//         {
//           type: "get",
//           id: id,
//           to: `${name}@${XMPP_HOST}`,
//         },
//         xml("vCard", {
//           xmlns: "vcard-temp",
//         })
//       );

//       // console.log('--------------------------------- >>>>>>> ', msg.toString());
//       this.client?.send(msg);
//     });

//     const timeoutPromise = createTimeoutPromise(1000, unsubscribe);

//     return Promise.race([responsePromise, timeoutPromise]);
//   }

//   getRoomTitle(roomName: string): Promise<string> {
//     const id = `get-room-title:${Date.now().toString()}`;

//     let stanzaHdlrPointer: (stanza: any) => void;

//     const unsubscribe = () => {
//       this.client?.off("stanza", stanzaHdlrPointer);
//     };

//     const responsePromise = new Promise((resolve, reject) => {
//       stanzaHdlrPointer = (stanza) => {
//         if (
//           stanza.is("iq") &&
//           stanza.attrs.id === id &&
//           stanza.attrs.type === "result"
//         ) {
//           const fields = stanza
//             .getChild("query")
//             ?.getChild("x")
//             ?.getChildren("field");

//           let roomTitle = "";
//           fields.forEach(
//             (el: {
//               attrs: { [x: string]: string };
//               getChild: (arg0: string) => {
//                 (): any;
//                 new (): any;
//                 getText: { (): string; new (): any };
//               };
//             }) => {
//               if (el.attrs["var"] === "muc#roomconfig_roomname") {
//                 roomTitle = el.getChild("value")?.getText();
//               }
//             }
//           );
//           unsubscribe();
//           resolve(roomTitle);
//         }

//         if (
//           stanza.is("iq") &&
//           stanza.attrs.id === id &&
//           stanza.attrs.type === "error"
//         ) {
//           unsubscribe();
//           reject();
//         }
//       };

//       this.client?.on("stanza", stanzaHdlrPointer);

//       const message = xml(
//         "iq",
//         {
//           id: id,
//           to: `${roomName}@${XMPP_SERVICE}`,
//           type: "get",
//         },
//         xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
//       );
//       this.client?.send(message);
//     });

//     const timeoutPromise: Promise<any> = createTimeoutPromise(
//       1000,
//       unsubscribe
//     );

//     return Promise.race([responsePromise, timeoutPromise]);
//   }
// }

// function createTimeoutPromise(
//   ms: number | undefined,
//   unsubscribe: { (): void; (): void; (): void; (): void }
// ) {
//   return new Promise((_, reject) => {
//     setTimeout(() => {
//       try {
//         unsubscribe();
//       } catch (e) {}
//       reject();
//     }, ms);
//   });
// }

// const wsClient = new WsClient(VITE_APP_XMPP_SERVICE);
// export { wsClient };

export {};
