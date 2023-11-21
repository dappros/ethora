import React from "react"
import renderer from "react-test-renderer"
import NftTransactionList from "../../src/components/Nft/NftTransactionList"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <NftTransactionList
        onEndReached={() => console.log("end reach")}
        transactions={{}}
        walletAddress="wallet address"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
