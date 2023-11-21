import React from "react"
import renderer from "react-test-renderer"
import { HeaderMenu } from "../../src/components/MainHeader/HeaderMenu"

test("renders correctly", () => {
  const tree = renderer.create(<HeaderMenu />).toJSON()
  expect(tree).toMatchSnapshot()
})
