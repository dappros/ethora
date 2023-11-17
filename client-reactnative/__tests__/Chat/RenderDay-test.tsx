import React from "react"
import renderer from "react-test-renderer"
import RenderDay from "../../src/components/Chat/RenderDay"

test("renders correctly", () => {
  const tree = renderer
    .create(<RenderDay currentMessage={{}} previousMessage={{}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
