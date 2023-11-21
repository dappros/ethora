import React from "react"
import renderer from "react-test-renderer"
import { PdfMessage } from "../../src/components/Chat/PdfMessage"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <PdfMessage
          onPress={() => console.log("press")}
          size={"20"}
          url={"url"}
          onLongPress={() => console.log("long press")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
