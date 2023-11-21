import React from "react"
import renderer from "react-test-renderer"
import { TokensOrItemsTransfer } from "../../../src/components/Modals/TransactionModal/TokensOrItemsTransfer"

test("renders correctly", () => {
  const mockDataTransfer = {
    name: "string",
    message_id: "string",
    senderName: "string",
    walletFromJid: "string",
    chatJid: "string",
  }
  const tree = renderer
    .create(
      <TokensOrItemsTransfer
        closeModal={() => console.log("close modal")}
        dataForTransfer={mockDataTransfer}
        hideUserActions={() => console.log("hide user actions")}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
