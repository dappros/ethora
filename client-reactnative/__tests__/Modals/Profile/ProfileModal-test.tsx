import React from "react"
import renderer from "react-test-renderer"
import ProfileModal from "../../../src/components/Modals/Profile/ProfileModal"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ProfileModal
        description="desc"
        firstName="first name"
        isDescriptionEditable={false}
        isVisible={false}
        lastName="last name"
        modalType="name"
        onBackdropPress={() => console.log("back drop press")}
        onDescriptionChange={() => console.log("description change")}
        onNameChange={() => console.log("name change")}
        setDescription={() => console.log("set description")}
        setNewName={() => console.log("set new name")}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
