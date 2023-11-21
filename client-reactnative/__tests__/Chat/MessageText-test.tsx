import React from "react"
import renderer from "react-test-renderer"
import { MessageText } from "../../src/components/Chat/MessageText"

test("renders correctly", () => {
  const tree = renderer.create(<MessageText />).toJSON()
  expect(tree).toMatchSnapshot()
})
