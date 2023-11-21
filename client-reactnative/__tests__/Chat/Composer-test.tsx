import React from "react"
import renderer from "react-test-renderer"

import { ChatComposer } from "../../src/components/Chat/Composer"
import { PartType } from "../../src/helpers/chat/inputTypes"

const mockPartTypes: PartType[] = [
  {
    trigger: "@", // Should be a single character like '@' or '#'
  },
]

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ChatComposer
        onTextChanged={(text) => console.log(text)}
        partTypes={mockPartTypes}
        selection={{ start: 0, end: 0 }}
        text="dsds"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
