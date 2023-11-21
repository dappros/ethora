import React from "react"
import renderer from "react-test-renderer"
import { ChatLongTapModal } from "../../../src/components/Modals/Chat/ChatLongTapModal"

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
      <ChatLongTapModal
        dataForTransfer={mockDataTransfer}
        onClose={() => console.log("close")}
        open={true}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
