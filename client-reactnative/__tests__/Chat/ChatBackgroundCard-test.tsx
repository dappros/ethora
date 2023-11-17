import React from "react"
import renderer from "react-test-renderer"
import ChatBackgroundCard from "../../src/components/Chat/ChatBackgroundCard"
import { NativeBaseProvider, View } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <ChatBackgroundCard
          index={0}
          onSelect={() => console.log("select")}
          alt="background"
          isSelected={false}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
