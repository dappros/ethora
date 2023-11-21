import React from "react"
import renderer from "react-test-renderer"
import { QuickReplies } from "../../src/components/Chat/QuickReplies"

test("renders correctly", () => {
  const mockQuickReplies = [
    {
      name: "string",
      value: "string",
      notDisplayedValue: "string",
    },
  ]

  const tree = renderer
    .create(
      <QuickReplies
        messageAuthor="author"
        quickReplies={mockQuickReplies}
        roomJid="roomJid"
        roomName="roomName"
        width={20}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
