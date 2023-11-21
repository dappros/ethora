import React from "react"
import renderer from "react-test-renderer"
import { CreateNewChatButton } from "../../src/components/Chat/CreateNewChatButton"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <CreateNewChatButton onPress={() => console.log("press")} />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
