import React from "react"
import renderer from "react-test-renderer"
import { DeleteDialog } from "../../src/components/Modals/DeleteDialog"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <DeleteDialog
          description="desc"
          loading={false}
          onClose={() => console.log("close")}
          onDeletePress={() => console.log("delete press")}
          open={false}
          title="title"
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
