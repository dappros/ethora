import { useState } from "react";
import xmppService from "../XmppService";

export default function Debug() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [discoInfo, setDiscoInfo] = useState("");
  const [mucService, setMucService] = useState("");
  const [userJid, setUserJid] = useState("");
  const [fullName, setFullName] = useState("");
  const [rosterJid, setRosterJid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bookmarkJid, setBookmarkJid] = useState("");
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkNick, setBookmarkNick] = useState("");
  const [bookmarkPassword, setBookmarkPassword] = useState("");

  const onLogin = () => {
    xmppService.connect(username, password);
  };

  const getRooms = async () => {
    let getRoomsResp = await xmppService.getRooms();
    console.log("getRooms ", getRoomsResp.toString());
  };

  const onFirstName = (e) => {
    const firstName = e.target.value;
    setFirstName(firstName);
    xmppService.firstName = firstName;
  };

  const onLastName = (e) => {
    const lastName = e.target.value;
    setLastName(lastName);
    xmppService.lastName = lastName;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>Debug</div>
      <div style={{ paddingTop: "10px" }}>
        <div>Login</div>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={onLogin}>Connect</button>
      </div>

      <div style={{ paddingTop: "10px" }}>
        <div>User Data</div>
        <label>
          First Name
          <input
            type="text"
            placeholder="firstName"
            value={firstName}
            onChange={onFirstName}
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            placeholder="lastName"
            value={lastName}
            onChange={onLastName}
          />
        </label>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button onClick={() => xmppService.stop()}>Disconnect</button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button onClick={getRooms}>getRooms</button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>initial presence</div>
        <div>
          <button onClick={() => xmppService.initialPresence()}>
            Initial Presence
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>presence</div>
        <div>
          <input
            placeholder="nickname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="room jid"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => xmppService.presence(room, username)}>
            Presence
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>leave room</div>
        <div>
          <input
            placeholder="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => xmppService.leaveRoom(room)}>Leave</button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>subscribe room</div>
        <div>
          <input
            placeholder="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => xmppService.subscribe(room)}>
            subscribe room
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>unsubscribe room</div>
        <div>
          <input
            placeholder="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => xmppService.unsubscribe(room)}>
            unsubscribe room
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>owner request configuration room</div>
        <div>
          <input
            placeholder="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => xmppService.getConfiguration(room)}>
            getConfiguration
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>history</div>
        <div>
          <input
            placeholder="room jid"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={() => xmppService.getHistory(room)}>History</button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>Delete Message</div>
        <div>
          <input
            placeholder="room jid"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            placeholder="message id"
            value={messageId}
            onChange={(e) => setMessageId(e.target.value)}
          />
          <button onClick={() => xmppService.deleteMessage(room, messageId)}>
            Delete
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>Edit Message</div>
        <div>
          <input
            placeholder="room jid"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            placeholder="message id"
            value={messageId}
            onChange={(e) => setMessageId(e.target.value)}
          />
          <input
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => xmppService.editMessage(room, messageId, message)}
          >
            Edit Message
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>Send Raction Message</div>
        <div>
          <input
            placeholder="room jid"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            placeholder="message id"
            value={messageId}
            onChange={(e) => setMessageId(e.target.value)}
          />
          <input
            placeholder="reaction short name"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => xmppService.sendReaction(room, messageId, message)}
          >
            Edit
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>Send Message</div>
        <div>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => xmppService.sendMessage(room, message)}>
            send
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>Room config</div>
        <div>
          <input type="text" />
        </div>
        <div>
          <input
            type="text"
            placeholder="room local jid"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room Description"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
          />
          <button
            onClick={() =>
              xmppService.roomConfig(room, roomName, roomDescription)
            }
          >
            Set Room Name & Description
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>DiscoInfo</div>
        <div>
          <input
            type="text"
            placeholder="to"
            value={discoInfo}
            onChange={(e) => setDiscoInfo(e.target.value)}
          ></input>
          <button
            onClick={() => {
              xmppService.discoInfo(discoInfo);
            }}
          >
            DiscoInfo
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>DiscoItems</div>
        <div>
          <input
            type="text"
            placeholder="to"
            value={discoInfo}
            onChange={(e) => setDiscoInfo(e.target.value)}
          ></input>
          <button
            onClick={() => {
              xmppService.discoItems(discoInfo);
            }}
          >
            DiscoItems
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>
          <input
            type="text"
            placeholder="MucService"
            value={mucService}
            onChange={(e) => setMucService(e.target.value)}
          ></input>
          <button
            onClick={() => {
              xmppService.getMySubscriptions(mucService);
            }}
          >
            getMySubscriptions
          </button>
        </div>
      </div>
      <div>
        <button onClick={() => xmppService.getArchiveFormField()}>
          getArchiveFormField
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button onClick={() => xmppService.myVcard()}>my vCard</button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <input
          type="text"
          value={userJid}
          onChange={(e) => setUserJid(e.target.value)}
        ></input>
        <button onClick={() => xmppService.otherVcard(userJid)}>
          other vCard
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>Update my vCard</div>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          ></input>
        </div>
        <button onClick={() => xmppService.updateMyVcard({ FN: fullName })}>
          update MyVcard
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>get roster</div>
        <button onClick={() => xmppService.getRoster()}>get roster</button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>set roster</div>
        <div>
          <input
            placeholder="rosterJid"
            type="text"
            value={rosterJid}
            onChange={(e) => setRosterJid(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => xmppService.setRoster(rosterJid)}>
            set roster
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>remove roster</div>
        <div>
          <input
            placeholder="rosterJid"
            type="text"
            value={rosterJid}
            onChange={(e) => setRosterJid(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => xmppService.removeRoster(rosterJid)}>
            remove roster
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <div>bookmarks</div>
        <div>
          <button onClick={() => xmppService.getBookmarks()}>
            getBookmarks
          </button>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <div>addBookmark</div>
          {/* jid: bookmark.jid,
            autojoin: bookmark.autojoin,
            name: bookmark.name,
            nick: bookmark.nick,
            password: bookmark.password, */}
          <div>
            <input
              placeholder="bookmark.jid"
              type="text"
              value={bookmarkJid}
              onChange={(e) => setBookmarkJid(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="bookmark.name"
              type="text"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="bookmark.nick"
              type="text"
              value={bookmarkNick}
              onChange={(e) => setBookmarkNick(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="bookmark.password"
              type="text"
              value={bookmarkPassword}
              onChange={(e) => setBookmarkPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={() => xmppService.addBookmark({jid: bookmarkJid, name: bookmarkName, nick: bookmarkNick, password: bookmarkPassword})}>
              addBookmark
            </button>
          </div>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <div>removeBookmark</div>
          <div>
            <input type="text" placeholder="bookmark.jid" value={bookmarkJid} onChange={(e) => setBookmarkJid(e.target.value)} />
          </div>
          <div>
            <button onClick={() => xmppService.removeBookmark(bookmarkJid)}>remove Bookmark</button>
          </div>
        </div>
      </div>
    </div>
  );
}
