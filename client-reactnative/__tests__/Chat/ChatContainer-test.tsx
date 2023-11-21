import React from "react"
import renderer from "react-test-renderer"

import ChatContainer from "../../src/components/Chat/ChatContainer"
import { IMessage, roomListProps } from "../../src/stores/chatStore"

const mockMessages: IMessage[] = [
  {
    _id: "1675255919817827",
    attachmentId: "",
    avatar: null,
    contractAddress: undefined,
    createdAt: `2023-01-31T18":"30":00.000Z`,
    duration: undefined,
    fileName: "",
    image: undefined,
    isEdited: false,
    isReply: false,
    isStoredFile: false,
    localURL: "",
    mainMessage: undefined,
    message_id: "1675255919817827",
    mimetype: undefined,
    name: null,
    nftId: "",
    nftName: "",
    numberOfReplies: 0,
    originalName: "",
    preview: undefined,
    quickReplies: "",
    realImageURL: "",
    roomJid:
      "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
    room_name:
      "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
    showInChannel: false,
    size: undefined,
    system: false,
    text: "Fdfdf",
    tokenAmount: 0,
    user: {
      _id: "string",
      name: "string",
      avatar: "string",
    },
    user_id: null,
    waveForm: undefined,
    wrappable: true,
  },
  {
    _id: "1675255919345482",
    attachmentId: "",
    contractAddress: undefined,
    createdAt: `"2023-01-31T18":"30":00.000Z`,
    duration: undefined,
    fileName: "",
    image: undefined,
    isEdited: false,
    isReply: false,
    isStoredFile: false,
    localURL: "",
    mainMessage: undefined,
    message_id: "1675255919345482",
    mimetype: undefined,
    name: null,
    nftId: "",
    nftName: "",
    numberOfReplies: 0,
    originalName: "",
    preview: undefined,
    quickReplies: "",
    realImageURL: "",
    roomJid:
      "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
    room_name:
      "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
    showInChannel: false,
    size: undefined,
    system: false,
    text: "Hhhh",
    tokenAmount: 0,
    user: {
      _id: "string",
      name: "string",
      avatar: "string",
    },
    user_id: null,
    waveForm: undefined,
    wrappable: true,
  },
  {
    _id: "1674879752807000",
    attachmentId: "",
    contractAddress: undefined,
    createdAt: `"2023-01-27T18":"30":00.000Z`,
    duration: undefined,
    fileName: "",
    image: undefined,
    isEdited: false,
    isReply: false,
    isStoredFile: false,
    localURL: "",
    mainMessage: undefined,
    mimetype: undefined,
    nftId: "",
    nftName: "",
    numberOfReplies: 0,
    originalName: "",
    preview: undefined,
    quickReplies: "",
    realImageURL: "",
    roomJid:
      "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
    showInChannel: false,
    size: undefined,
    system: false,
    text: "Hiii",
    tokenAmount: 0,
    user: {
      _id: "string",
      name: "string",
      avatar: "string",
    },
    user_id: null,
    waveForm: undefined,
    wrappable: true,
  },
]

const mockRoomDetails: roomListProps = {
  avatar: "https://placeimg.com/140/140/any",
  counter: 0,
  createdAt: `2023-02-20T07:00:17.995Z`,
  jid: "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
  lastUserName: "",
  lastUserText: "",
  name: "Delete test",
  participants: 1,
  priority: 0,
  roomBackground: "",
  roomThumbnail: "",
}

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ChatContainer
        containerType="main"
        messages={mockMessages}
        roomDetails={mockRoomDetails}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
