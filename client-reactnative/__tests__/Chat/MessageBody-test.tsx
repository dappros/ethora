import React from "react"
import renderer from "react-test-renderer"

import MessageBody from "../../src/components/Chat/MessageBody"

test("renders correctly", () => {
  const tree = renderer.create(<MessageBody />).toJSON()
  expect(tree).toMatchSnapshot()
})
