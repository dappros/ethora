# Working with Ethora/DP Chat server (aka RTC, Real-Time Communication module)

## Definitions 

* **App** - an Ethora/DP App that you have created. An App may have a set of default (Pinned) Rooms which all Users of the App will automatically join 
* **User** - an XMPP user which is identified by JID (Jabber ID). In our platform, each platform User automatically has an XMPP user identity
* **Join**, **Participate**, become **Occupant** - this all has the same meaning of User being a member of a Room which means the server will be sending the User all messages from that Room unless User leaves the Room
* **Subscribe** - Users may remain Participants of the Room but unsubscribe or subscribe to Rooms at the same time. This can be used, for example, to manage notifications. 
* **Room** - a chat room (MUC, a Multi-User Chat, by XMPP definition, sometimes also called Conferences) to which Users may be subscribed to send and receive messages. Rooms may be private (1:1 direct messaging), Group (private discussion of more than 2 Users) or Public (publicly available Room) depending on their settings and who they were shared with
* **Owner (Room Owner)** - Room Owner is a User who has full controls over the Room (typically the User who has created it in the first place)
* **Admin (Room Admin)** - Room Admin is a User who has certain administrative privileges over the specific Room (e.g. a chat moderator)
* **Stanza** - an XMPP stanza which is basically a chat message encoded in 
* **XMPP** - XMPP messaging protocol which handles the instant messaging via the XMPP chat server as part of our RTC component
* **Push Notification** - Users who are currently inactive but are subscribed to a Room will receive a Push Notification to their Devices unless they have disabled alerts in your App settings
* **Device** - A User might have multiple Devices they use to access your Apps and for messaging. This means at our Chat server side, we handle subscriptions to Push Notifications separately for each device. Your App instances running on different Devices will also have individual local storage caching for assets such as chat history.
* **Block** - when one User blocks another User, they won't be able to see messages from them
* **Ban** - when a Room Owner or Admin bans a User, that User won't be able to post messages into the Room where they are banned

## Server and Plugins

At the core of the Ethora RTC is an open-source Ejabberd server with our own custom made plugins and add-ons to it developed and maintained jointly with DeepX https://deepxhub.com/. Main components listed below:

CORE SERVER 
* XMPP Chat Server (Ejabberd) - responsible for handling the core functionality of instant messaging. Stores data in an SQL database.

MAIN FEATURES PLUGINS
* Plugin: mod_delete - allows to delete chat messages
* Plugin: mod_edit - allows to edit chat messages
* Plugin: mod_get_user_rooms - allows to easily obtain a list of all Rooms the User is subscribed to
* Plugin: mod_get_users_activity - gets all subscribers and last activity from Room (used e.g. for Chat Details screen)
* Plugin: mod_offline_post - sends a push notification to a webservice (e.g. Apple, Google push services) to alert the subscribers who are currently offline
* Plugin: mod_user_ban - allows to ban Users
* Plugin: mod_user_block - allows to block Users

STATS 
* Plugin: mod_send_message_to_stat - sends message data to Stats server
 






