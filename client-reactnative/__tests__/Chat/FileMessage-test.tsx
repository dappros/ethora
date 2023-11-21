import React from "react"
import renderer from "react-test-renderer"
import { FileMessage } from "../../src/components/Chat/FileMessage"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <FileMessage
          onPress={() => console.log("press")}
          size="20"
          url="https://abc.com"
          onLongPress={() => console.log("long press")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
