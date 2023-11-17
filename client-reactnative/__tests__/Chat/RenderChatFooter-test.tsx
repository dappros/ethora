import React from "react"
import renderer from "react-test-renderer"
import RenderChatFooter from "../../src/components/Chat/RenderChatFooter"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <RenderChatFooter
          allowIsTyping={true}
          composingUsername="username"
          fileUploadProgress={20}
          isTyping={false}
          setFileUploadProgress={() => console.log("file progress")}
          setIsEditing={() => console.log("set is editing")}
          closeReply={() => console.log("close reply")}
          isEditing={false}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
