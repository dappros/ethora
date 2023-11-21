import React from "react"
import renderer from "react-test-renderer"

import RoomDetailsCard from "../../../src/components/Chat/Chatdetails/RoomDetailsCard"
import { StoreProvider } from "../../../src/stores/context"

test("renders correctly", () => {
  const room = {
    jid: "string",
    name: "string",
    roomThumbnail: "string",
    roomBackground: "string",
  }

  const uploadedImage = {
    _id: "string",
    createdAt: "string",
    expiresAt: 1,
    filename: "string",
    isVisible: true,
    location: "string",
    locationPreview: "string",
    mimetype: "string",
    originalname: "string",
    ownerKey: "string",
    size: 20,
    updatedAt: "string",
    userId: "string",
  }
  const tree = renderer
    .create(
      <StoreProvider>
        <RoomDetailsCard
          handleEditDesriptionPress={() =>
            console.log("edit description press")
          }
          handleRoomNameEdit={() => console.log("room name edit")}
          onImagePress={() => new Promise(() => console.log("Image press"))}
          room={room}
          toggleNotification={() => console.log("asdasd")}
          uploadedImage={uploadedImage}
        />
      </StoreProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
