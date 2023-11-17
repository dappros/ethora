import React from "react"
import renderer from "react-test-renderer"
import ChangeRoomDescriptionModal from "../../../src/components/Modals/Chat/ChangeRoomDescriptionModal"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ChangeRoomDescriptionModal
        changeDescription={() => console.log("change description")}
        currentDescription="desc"
        modalVisible={true}
        setModalVisible={() => console.log("set modal visible")}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
