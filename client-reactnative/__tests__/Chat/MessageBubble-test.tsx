import React from "react"
import renderer from "react-test-renderer"
import MessageBubble from "../../src/components/Chat/MessageBubble"
import { IMessage } from "../../src/stores/chatStore"

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
      <MessageBubble
        containerType="main"
        currentMessage={mockMessage}
        handleReply={() => console.log("handle reply")}
        onLongPress={() => console.log("long press")}
        onTap={() => console.log("Tap")}
        position="left"
        user={{}}
        scrollToParentMessage={() => console.log("scroll to parent")}
        bottomContainerStyle={{}}
        containerStyle={{}}
        containerToNextStyle={{}}
        containerToPreviousStyle={{}}
        image={{}}
        isCustomViewBottom={{}}
        messageImageProps={{}}
        messageTextProps={{}}
        messageTextStyle={{}}
        nextMessage={{}}
        previousMessage={{}}
        renderCustomView={{}}
        renderMessageImage={{}}
        renderMessageText={{}}
        renderTicks={{}}
        renderTime={{}}
        renderUsername={{}}
        tickStyle={{}}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
