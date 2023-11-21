import React from "react"
import renderer from "react-test-renderer"
import PlayButton from "../../src/components/AudioPlayer/PlayButton"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <PlayButton onPress={() => console.log("play pressed")} state="pause" />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
