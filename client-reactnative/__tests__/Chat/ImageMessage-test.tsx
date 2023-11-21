import React from "react"
import renderer from "react-test-renderer"
import { ImageMessage } from "../../src/components/Chat/ImageMessage"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <ImageMessage
          onPress={() => console.log("press")}
          size={"20"}
          url={"url"}
          nftId="nfttest"
          nftName="NftTestName"
          onLongPress={() => console.log("long press")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
