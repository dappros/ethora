import React from "react"
import renderer from "react-test-renderer"
import { MetaNavigation } from "../../src/components/Chat/MetaNavigation"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <MetaNavigation
        chatId="chatid"
        onClose={() => console.log("close")}
        open={true}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
