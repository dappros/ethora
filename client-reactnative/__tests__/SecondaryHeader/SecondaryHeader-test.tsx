//components/SecondaryHeader/SecondaryHeader.tsx

import React from "react"
import renderer from "react-test-renderer"
import SecondaryHeader from "../../src/components/SecondaryHeader/SecondaryHeader"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <SecondaryHeader title="Hi" />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
