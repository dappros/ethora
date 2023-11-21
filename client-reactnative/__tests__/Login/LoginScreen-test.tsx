import React from "react"
import renderer from "react-test-renderer"

import LoginScreen from "../../src/Screens/Login/LoginScreen"

test("renders correctly", () => {
  const tree = renderer.create(<LoginScreen />).toJSON()
  expect(tree).toMatchSnapshot()
})
