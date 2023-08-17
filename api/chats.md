# Working with Ethora/DP Chat server (aka RTC, Real-Time Communication module)

# Definitions 

* **App
* **User** - an XMPP user which is identified by JID (Jabber ID). In our platform, each platform User automatically has an XMPP user identity
* **Room** - a chat room (MUC, a Multi-User Chat, by XMPP definition) to which Users may be subscribed to send and receive messages. Rooms may be private (1:1 direct messaging), Group (private discussion of more than 2 Users) or Public (publicly available Room) depending on their settings and who they were shared with
* **Owner (Room Owner)** - Room Owner is a User who has full controls over the Room (typically the User who has created it in the first place)
* **Admin (Room Admin)** - Room Admin is a User who has certain administrative privileges over the specific Room (e.g. a chat moderator)
* **Stanza** - an XMPP stanza which is basically a chat message encoded in 
* **XMPP** - XMPP messaging protocol which handles the instant messaging via the XMPP chat server as part of our RTC component
* **Push Notification** - Users who are currently inactive but are subscribed to a Room will receive a Push Notification to their Devices unless they have disabled alerts in your App settings
* **Device** - A User might have multiple Devices they use to access your Apps and for messaging. This means at our Chat server side, we handle subscriptions to Push Notifications separately for each device. Your App instances running on different Devices will also have individual local storage caching for assets such as chat history.



