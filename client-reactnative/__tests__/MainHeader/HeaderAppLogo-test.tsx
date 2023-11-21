import React from "react"
import renderer from "react-test-renderer"
import { HeaderAppLogo } from "../../src/components/MainHeader/HeaderAppLogo"

test("renders correctly", () => {
  const tree = renderer.create(<HeaderAppLogo />).toJSON()
  expect(tree).toMatchSnapshot()
})
