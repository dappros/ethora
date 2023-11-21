import React from "react"
import renderer from "react-test-renderer"
import { ChatMediaModal } from "../../src/components/Modals/ChatMediaModal"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ChatMediaModal
        messageData={{}}
        onClose={() => console.log("close")}
        open={true}
        type="application/octet-stream"
        url="url"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
