import React from "react"
import renderer from "react-test-renderer"
import ChangeRoomNameModal from "../../../src/components/Modals/Chat/ChangeRoomNameModal"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <ChangeRoomNameModal
          changeRoomName={() => console.log("change room name")}
          currentRoomName="Current room name"
          modalVisible={true}
          setModalVisible={() => console.log("set modal visible")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
