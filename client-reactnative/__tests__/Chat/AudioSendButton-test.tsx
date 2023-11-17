import React from "react"
import renderer from "react-test-renderer"
import { AudioSendButton } from "../../src/components/Chat/AudioSendButton"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <AudioSendButton
        onPressIn={() => console.log("Press in")}
        onPressOut={() => console.log("Press out")}
        recording={true}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
