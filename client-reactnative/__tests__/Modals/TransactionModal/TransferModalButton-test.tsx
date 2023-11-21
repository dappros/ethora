import React from "react"
import renderer from "react-test-renderer"
import { TransferModalButton } from "../../../src/components/Modals/TransactionModal/TransferModalButton"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <TransferModalButton
          onPress={() => console.log("press")}
          title="title"
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
