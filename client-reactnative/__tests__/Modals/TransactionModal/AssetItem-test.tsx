import React from "react"
import renderer from "react-test-renderer"
import AssetItem from "../../../src/components/Modals/TransactionModal/AssetItem"

test("renders correctly", () => {
  const tree = renderer
    .create(
      <AssetItem
        assetsYouHave={[]}
        image="image"
        index={0}
        itemTransferFunc={() => console.log("Item transfer function")}
        name="name"
        nftId={"nftid"}
        selectedItem={"selected item"}
        totalAssets={0}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
