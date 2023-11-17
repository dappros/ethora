import React from "react"
import renderer from "react-test-renderer"
import ReportAndBlockButton from "../../../src/components/Modals/TransactionModal/ReportAndBlockButton"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ReportAndBlockButton onPress={() => console.log("press")} text="text" />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
