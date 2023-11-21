import React from "react"
import renderer from "react-test-renderer"

import AudioPlayer from "../../src/components/AudioPlayer/AudioPlayer"

test("renders correctly", () => {
  const tree = renderer.create(<AudioPlayer audioUrl={"asdasd"} />).toJSON()
  expect(tree).toMatchSnapshot()
})
