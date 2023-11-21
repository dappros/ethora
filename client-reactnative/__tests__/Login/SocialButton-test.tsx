import React from "react"
import renderer from "react-test-renderer"
import SocialButton from "../../src/components/Buttons/SocialButton"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <SocialButton />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
