import React from "react"
import renderer from "react-test-renderer"

import { roomListProps } from "../../src/stores/chatStore"
import { RoomList } from "../../src/components/RoomList/RoomList"

const mockRoomList: roomListProps[] = [
  {
    avatar: "https://placeimg.com/140/140/any",
    counter: 0,
    createdAt: `"2023-02-17T13":"45":31.169Z`,
    jid: "5dc237d5792e95ba96240223e14ee00b13d2548c5cdfcf2e27ca67a0b11f5b9d@conference.dev.dxmpp.com",
    lastUserName: "",
    lastUserText: "",
    name: "Random talks 💬☕",
    participants: 87,
    priority: 0,
    roomBackground: "",
    roomThumbnail:
      "https://etofs.com/ipfs/QmSr19Da4u8vmeE86DaDHfRTJ8gjwN1UccXn8He8Ugc6yx",
  },
  {
    avatar: "https://placeimg.com/140/140/any",
    counter: 0,
    createdAt: `"2023-02-17T13":"45":31.170Z`,
    jid: "cc39004bf432f6dc34b47cd64251236c9ae65eadd890daef3ff7dbc94c3caecb@conference.dev.dxmpp.com",
    lastUserName: "",
    lastUserText: "",
    name: "Technical support 🛠️",
    participants: 87,
    priority: 0,
    roomBackground: "",
    roomThumbnail:
      "https://etofs.com/ipfs/QmSMexq3bP9reoVma2MhpmwN9TezyzXNWr9S8o7rbCTtEB",
  },
  {
    avatar: "https://placeimg.com/140/140/any",
    counter: 0,
    createdAt: `"2023-02-17T13":"45":31.214Z`,
    jid: "dc635d74fb77f53701d48899d86175c3a62a3e8a2a76e9f5ea0e9a3918cf6152@conference.dev.dxmpp.com",
    lastUserName: "",
    lastUserText: "",
    name: "NFT Factory",
    participants: 58,
    priority: 0,
    roomBackground: "",
    roomThumbnail:
      "https://etofs.com/ipfs/Qmf2WGvC5ew3jx52qpB9tMQzWYG9Ch8A9qdk9iRZdBJxx6",
  },
]

test("renders correctly", () => {
  const tree = renderer.create(<RoomList roomsList={mockRoomList} />).toJSON()
  expect(tree).toMatchSnapshot()
})
