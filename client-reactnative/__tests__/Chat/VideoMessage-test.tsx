import React from "react"
import renderer from "react-test-renderer"
import { VideoMessage } from "../../src/components/Chat/VideoMessage"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <VideoMessage
          onPress={() => console.log("press")}
          size={"20"}
          url={"url"}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
