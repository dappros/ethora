import React from "react"
import renderer from "react-test-renderer"
import { RegisterExternalWalletModal } from "../../src/components/Login/RegisterExternalWalletModal"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <RegisterExternalWalletModal
        closeModal={() => console.log("close modal")}
        message="message"
        modalVisible={true}
        walletAddress="walletAddress"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
