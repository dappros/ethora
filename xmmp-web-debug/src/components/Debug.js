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

  const onLogin = () => {
    xmppService.connect(username, password);
  };

  const getRooms = () => {
    xmppService.getRooms();
  };

  return (
    <div>
      <div>Debug</div>
      <div>
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
        <button onClick={onLogin}>Login</button>
      </div>
      <div>
        <button onClick={getRooms}>getRooms</button>
      </div>
      <div>
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
          <button onClick={() => xmppService.presence(room, username)}>Presence</button>
        </div>
      </div>
      <div>
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
      <div>
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
      <div>
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
      <div>
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
      <div>
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
      <div>
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
      <div>
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
            Edit
          </button>
        </div>
      </div>
      <div>
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
      <div>
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
      <div>
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
      <div>
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
      <div>
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
    </div>
  );
}
