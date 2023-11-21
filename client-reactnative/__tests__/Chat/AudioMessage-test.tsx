import React from "react"
import renderer from "react-test-renderer"
import { AudioMessage } from "../../src/components/Chat/AudioMessage"
import { IMessage } from "../../src/stores/chatStore"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const mockMessage: IMessage = {
    _id: "1675255919817827",
    attachmentId: "",
    contractAddress: undefined,
    createdAt: `2023-01-31T18":"30":00.000Z`,
    duration: undefined,
    fileName: "",
    image: undefined,
    isEdited: false,
    isReply: false,
    isStoredFile: false,
    localURL: "",
    mainMessage: undefined,
    mimetype: undefined,
    nftId: "",
    nftName: "",
    numberOfReplies: 0,
    originalName: "",
    preview: undefined,
    quickReplies: "",
    realImageURL: "",
    roomJid:
      "34c16b11d97051f3bb6a25654d4bea1234fa812a89cc57631a785f3d0c2ad644@conference.dev.dxmpp.com",
    showInChannel: false,
    size: undefined,
    system: false,
    text: "Fdfdf",
    tokenAmount: 0,
    user: {
      _id: "string",
      name: "string",
      avatar: "string",
    },
    waveForm: undefined,
    wrappable: true,
    receiverMessageId: "undefined",
  }

  const tree = renderer
    .create(
      <NativeBaseProvider>
        <AudioMessage
          onLongPress={() => console.log("long press")}
          onPress={() => console.log("press")}
          waveform={[0, 3, 45]}
          message={mockMessage}
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
