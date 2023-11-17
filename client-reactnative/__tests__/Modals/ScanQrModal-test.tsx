import React from "react"
import renderer from "react-test-renderer"
import { ScanQrModal } from "../../src/components/Modals/ScanQrModal"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <ScanQrModal
        closeModal={() => console.log("close")}
        onSuccess={() => console.log("success")}
        open={false}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
