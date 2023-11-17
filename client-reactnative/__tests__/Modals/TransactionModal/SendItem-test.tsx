import React from "react"
import renderer from "react-test-renderer"
import SendItem from "../../../src/components/Modals/TransactionModal/SendItem"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <SendItem onPress={() => console.log("press")} title="title" />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
