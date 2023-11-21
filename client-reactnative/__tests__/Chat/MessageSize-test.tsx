import React from "react"
import renderer from "react-test-renderer"
import { MessageSize } from "../../src/components/Chat/MessageSize"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <MessageSize size="20" duration="20" />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
