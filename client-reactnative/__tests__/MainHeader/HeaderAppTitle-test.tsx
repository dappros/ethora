import React from "react"
import renderer from "react-test-renderer"
import { HeaderAppTitle } from "../../src/components/MainHeader/HeaderAppTitle"

test("renders correctly", () => {
  const tree = renderer.create(<HeaderAppTitle />).toJSON()
  expect(tree).toMatchSnapshot()
})
