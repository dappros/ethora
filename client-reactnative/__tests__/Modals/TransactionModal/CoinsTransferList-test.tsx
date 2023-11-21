import React from "react"
import renderer from "react-test-renderer"
import { CoinsTransferList } from "../../../src/components/Modals/TransactionModal/CoinsTransferList"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <CoinsTransferList
          name="name"
          onCustomAmountPress={() => console.log("custom amount press")}
          onTokenTransferPress={() => console.log("token transfer press")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
