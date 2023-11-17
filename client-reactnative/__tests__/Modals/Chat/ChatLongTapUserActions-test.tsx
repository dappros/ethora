import React from "react"
import renderer from "react-test-renderer"
import { ChatLongTapUserActions } from "../../../src/components/Modals/Chat/ChatLongTapUserActions"

test("renders correctly", () => {
  const mockDataTransfer = {
    name: "",
    message_id: "",
    senderName: "",
    walletFromJid: "",
    chatJid: "",
    open: false,
  }

  const tree = renderer
    .create(
      <ChatLongTapUserActions
        closeModal={() => console.log("close")}
        dataForTransfer={mockDataTransfer}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
