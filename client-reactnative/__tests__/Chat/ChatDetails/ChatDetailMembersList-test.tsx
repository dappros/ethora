import React from "react"
import renderer from "react-test-renderer"

import ChatDetailMembersList from "../../../src/components/Chat/ChatDetails/ChatDetailMembersList"
import { roomListProps } from "../../../src/stores/chatStore"

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
      <ChatDetailMembersList
        currentRoomDetail={mockRoomDetails}
        handleKickDialog={() => console.log("kick dialog")}
        handleMemberLongTap={() => console.log("member long tap")}
        onUserAvatarPress={() => console.log("user avatar")}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
