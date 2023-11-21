import React from "react"
import renderer from "react-test-renderer"
import { HeaderBalanceButton } from "../../src/components/MainHeader/HeaderBalanceButton"

test("renders correctly", () => {
  const tree = renderer.create(<HeaderBalanceButton />).toJSON()
  expect(tree).toMatchSnapshot()
})
