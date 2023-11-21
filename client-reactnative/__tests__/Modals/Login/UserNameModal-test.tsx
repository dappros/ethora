import React from "react"
import renderer from "react-test-renderer"
import { UserNameModal } from "../../../src/components/Modals/Login/UserNameModal"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <UserNameModal
          closeModal={() => console.log("close")}
          firstName="firstname"
          lastName="lastname"
          modalVisible={true}
          onSubmit={() =>
            new Promise(() => {
              console.log("submit")
            })
          }
          setFirstName={() => console.log("set first name")}
          setLastName={() => console.log("set last name")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
