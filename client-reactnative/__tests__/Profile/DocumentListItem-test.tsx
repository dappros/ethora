import React from "react"
import renderer from "react-test-renderer"
import { DocumentListItem } from "../../src/components/Profile/DocumentListItem"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const mockItem = {
    _id: "",
    admin: "",
    contractAddress: "",
    createdAt: new Date(),
    documentName: "",
    files: [""],
    hashes: [""],
    isBurnable: false,
    isFilesMutableByAdmin: false,
    isFilesMutableByOwner: false,
    isSignable: false,
    isSignatureRevoсable: false,
    isTransferable: false,
    owner: "",
    updatedAt: new Date(),
    userId: "",
    file: {
      _id: "",
      createdAt: "",
      expiresAt: 0,
      filename: "",
      isVisible: true,
      location: "",
      locationPreview: "",
      mimetype: "",
      originalname: "",
      ownerKey: "",
      size: 0,
      updatedAt: "",
      userId: "",
    },
  }

  const tree = renderer
    .create(
      <NativeBaseProvider>
        <DocumentListItem
          item={mockItem}
          onAssetPress={() => console.log("Asset press")}
          onItemPress={() => console.log("item press")}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
