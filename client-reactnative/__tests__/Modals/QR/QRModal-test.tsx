import React from "react"
import renderer from "react-test-renderer"
import { QRModal } from "../../../src/components/Modals/QR/QRModal"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <QRModal
        link="link"
        onClose={() => console.log("close")}
        open={true}
        title="title"
        removeBaseUrl={false}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
