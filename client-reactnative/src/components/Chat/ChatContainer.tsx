import React, { useCallback, useEffect, useRef, useState } from "react"
import { Actions, GiftedChat, Send } from "react-native-gifted-chat"
import { AudioSendButton } from "./AudioSendButton"
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ImageBackground,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native"
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player"
import RNFetchBlob from "react-native-blob-util"
import { fileUpload } from "../../config/routesConstants"
import { normalizeData } from "../../helpers/normalizeData"
import { useStores } from "../../stores/context"
import { httpUpload } from "../../config/apiService"
import { showToast } from "../Toast/toast"
import { Actionsheet, HStack, Text, View, useDisclose } from "native-base"
import {
  allowIsTyping,
  commonColors,
  defaultBotsList,
  defaultChatBackgroundTheme,
  textStyles,
} from "../../../docs/config"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import IonIcons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import { IMessage, roomListProps } from "../../stores/chatStore"
import MessageBody from "./MessageBody"
import { ImageMessage } from "./ImageMessage"
import { VideoMessage } from "./VideoMessage"
import { AudioMessage } from "./AudioMessage"
import { PdfMessage } from "./PdfMessage"
import { FileMessage } from "./FileMessage"
import { downloadFile } from "../../helpers/downloadFile"
import { ChatComposer } from "./Composer"
import { MentionSuggestionsProps } from "../../helpers/chat/inputTypes"
import { useNavigation } from "@react-navigation/native"
import RenderChatFooter from "./RenderChatFooter"
import DocumentPicker from "react-native-document-picker"
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from "../../helpers/underscoreLogic"
import {
  IMessageToSend,
  createMainMessageForThread,
} from "../../helpers/chat/createMessageObject"
import {
  deleteMessageStanza,
  isComposing,
  pausedComposing,
  sendInvite,
  sendMediaMessageStanza,
  sendMessageStanza,
  sendReplaceMessageStanza,
} from "../../xmpp/stanzas"
import SecondaryHeader from "../SecondaryHeader/SecondaryHeader"
import parseLink from "../../helpers/parseLink"
import openChatFromChatLink from "../../helpers/chat/openChatFromChatLink"
import { mentionRegEx, parseValue } from "../../helpers/chat/inputUtils"
//@ts-ignore
import matchAll from "string.prototype.matchall"
import AudioPlayer from "../AudioPlayer/AudioPlayer"
import { ChatLongTapModal } from "../Modals/Chat/ChatLongTapModal"
import { QRModal } from "../Modals/QR/QRModal"
import { ChatMediaModal } from "../Modals/ChatMediaModal"
import { MetaNavigation } from "./MetaNavigation"
import { NftItemGalleryModal } from "../../../NftItemGalleryModal"
import Clipboard from "@react-native-clipboard/clipboard"
import { IDataForTransfer } from "../Modals/Chat/types"
import { observer } from "mobx-react-lite"
import { systemMessage } from "../../helpers/systemMessage"
import { banSystemMessage } from "../../helpers/banSystemMessage"
import { useDebounce } from "../../hooks/useDebounce"
import {
  isImageMimetype,
  isVideoMimetype,
  isAudioMimetype,
  isPdfMimetype,
} from "../../helpers/checkMimetypes"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { HomeStackNavigationProp } from "../../navigation/types"
import { TCombinedMimeType } from "../../constants/mimeTypes"

//interfaces and types
export type containerType = "main" | "thread"
interface ChatContainerProps {
  containerType: containerType
  roomDetails: roomListProps
  messages: IMessage[]
  onLoadEarlier?: () => void
  currentThreadMessage?: IMessage
}

interface IMediaProps {
  expiresAt: number
  isPrivate: boolean
  _id: string
  userId: string
  ownerKey: string
  location: string
  locationPreview: string
  originalname: string
  filename: string
  mimetype: string
  size: number
  createdAt: Date
  updatedAt: Date
  __v: number
  duration: any
}

interface ISystemMessage {
  _id: number
  text: string
  createdAt: Date
  system: true
  tokenAmount: number
  receiverMessageId: string
  tokenName: string
  nftId: string
  transactionId: string
}
//interfaces and types

//styles
const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    padding: 5,
    marginRight: 5,
    paddingLeft: 7,
    marginBottom: 5,
  },
  attachmentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attachmentActionContainer: {
    width: hp("4%"),
    height: hp("4%"),
    alignItems: "center",
    justifyContent: "center",
  },
  nameTextStyle: {
    fontFamily: textStyles.boldFont,
    fontSize: hp("2"),
    color: "white",
  },
  usernameTextStyle: {
    fontSize: hp("2.216%"),
    fontFamily: textStyles.boldFont,
    color: "#ffff",
    fontWeight: Platform.OS === "ios" ? "bold" : "normal",
  },
  suggestionsContainer: {
    position: "absolute",
    bottom: 43,
    backgroundColor: "white",
    left: 0,
    padding: 10,
    borderRadius: 10,
    width: 200,
  },
  suggestionsPressableStyle: {
    paddingBottom: 5,
  },
  suggestionsTextStyle: {
    fontFamily: textStyles.semiBoldFont,
    color: "#000",
  },
  parentTimeStyle: {
    fontSize: hp("1.5%"),
    fontFamily: textStyles.mediumFont,
    color: "#ffff",
    marginLeft: 3,
  },
  currentThreadMessageTextStyle: {
    fontSize: hp("2%"),
    fontFamily: textStyles.mediumFont,
    color: "#ffff",
  },
  renderAttachmentContainerStyle: {
    position: "relative",
  },
  activityIndicatorContainerStyle: {
    backgroundColor: "transparent",
  },
})
//styles

//main component
const audioRecorderPlayer = new AudioRecorderPlayer()

const ChatContainer = observer((props: ChatContainerProps) => {
  //props
  const {
    containerType,
    roomDetails,
    messages,
    onLoadEarlier,
    currentThreadMessage,
  } = props
  //props

  //mobx stores
  const { loginStore, debugStore, chatStore, walletStore, apiStore } =
    useStores()
  //mobx stores

  //local states
  const [recording, setRecording] = useState<boolean>(false)
  const [fileUploadProgress, setFileUploadProgress] = useState<number>(0)
  const [isNftItemGalleryVisible, setIsNftItemGalleryVisible] =
    useState<boolean>(false)
  const [text, setText] = useState<string>("")
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const [onTapMessageObject, setOnTapMessageObject] = useState<IMessage>()
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [composingUsername, setComposingUsername] = useState<string>("")
  const [showQrModal, setShowQrModal] = useState(false)
  const [isShowDeleteOption, setIsShowDeleteOption] = useState(true)
  const [showReplyOption, setShowReplyOption] = useState(true)
  const [showViewThread, setShowViewThread] = useState(false)
  const [showEditOption, setShowEditOption] = useState(true)
  const [showMetaNavigation, setShowMetaNavigation] = useState(true)
  const [showInChannel, setShowInChannel] = useState<boolean>(false)
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false)
  const [mediaModal, setMediaModal] = useState<{
    open: boolean
    url: string | undefined
    type: TCombinedMimeType | undefined
    message: IMessage | undefined
  }>({
    open: false,
    url: undefined,
    type: undefined,
    message: undefined,
  })
  const [dataForLongTapModal, setDataForLongTapModal] = useState<
    IDataForTransfer & { open: boolean }
  >({
    name: "",
    message_id: "",
    senderName: "",
    walletFromJid: "",
    chatJid: "",
    open: false,
  })
  const { isOpen, onOpen, onClose } = useDisclose()
  //local states

  //local variables
  const mediaButtonAnimation = new Animated.Value(1)
  const path = Platform.select({
    ios: "audio.m4a",
    android: `${RNFetchBlob.fs.dirs.CacheDir}/audio.mp3`,
  })

  const giftedRef = useRef(null)
  const navigation = useNavigation<HomeStackNavigationProp>()
  const manipulatedWalletAddress: string = underscoreManipulation(
    loginStore.initialData.walletAddress
  )
  const { tokenTransferSuccess } = walletStore
  const debouncedChatText = useDebounce(text, 500)
  //local variables

  //local functions

  //animation on button press
  const animateMediaButtonIn = () => {
    Animated.spring(mediaButtonAnimation, {
      toValue: 2.5,
      useNativeDriver: true,
    }).start()
  }

  //animation on button release
  const animateMediaButtonOut = () => {
    Animated.spring(mediaButtonAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,

      friction: 3,
    }).start()
  }

  //get Waveform
  const getWaveformArray = async (url: string) => {
    if (Platform.OS !== "ios") {
      const res = await NativeModules.Waveform.getWaveformArray(url)
      const data = JSON.parse(res)
      return data
    } else {
      const res = await NativeModules.RNWaveform.loadAudioFile()
      return res
    }
  }

  //normalize audio waveform data
  function filterData(arr: any) {
    const samples = 24
    const blockSize = Math.floor(arr.length / samples)
    const res = new Array(samples)
      .fill(0)
      .map((_, i) =>
        arr
          .slice(i * blockSize, (i + 1) * blockSize)
          .reduce((sum: number, val: number) => sum + Math.abs(val), 0)
      )

    return res
  }

  //handle to get audio waveform
  const getAudioData = async (url?: string) => {
    const audioPath =
      (url as string) ||
      (Platform.OS === "ios"
        ? `${RNFetchBlob.fs.dirs.CacheDir}/audio.m4a`
        : (path as string))
    const data = await getWaveformArray(audioPath)
    const normalizedData = normalizeData(filterData(data))
    return normalizedData
  }

  //to start audio recording
  const onStartRecord = async () => {
    setRecording(true)
    animateMediaButtonIn()

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.low,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    }
    const result = await audioRecorderPlayer.startRecorder(path, audioSet, true)
    console.log(result, "fileResult")
  }

  //handle to stop audio recording, get the recorded details and send as a message
  const onStopRecord = async () => {
    setRecording(false)
    animateMediaButtonOut()

    const result = await audioRecorderPlayer.stopRecorder()

    const filesApiURL = fileUpload
    const FormData = require("form-data")
    const data = new FormData()
    const waveform = await getAudioData()
    // let correctpath = '';
    // const str1 = 'file://';
    // const str2 = res.uri;
    // correctpath = str2.replace(str1, '');

    data.append("files", {
      uri: result,
      type: "audio/mpeg",
      name: "sound.mp3",
    })
    try {
      const response = await httpUpload(
        filesApiURL,
        data,
        loginStore.userToken,
        setFileUploadProgress
      )
      setFileUploadProgress(0)

      if (response.data.results.length) {
        debugStore.addLogsApi(response.data.results)
        submitMediaMessage(
          response.data.results,
          roomDetails,
          chatStore.xmpp,
          waveform
        )
      }
    } catch (error) {
      console.log(error.response)
      showToast("error", "Error", "Cannot upload file, try again later", "top")
    }
  }

  //handle to submit media type message
  const submitMediaMessage = (
    mediaListArray: IMediaProps[],
    roomDetail: roomListProps,
    xmpp: any,
    waveForm?: any
  ) => {
    mediaListArray.map(async (item) => {
      // console.log(item.duration, 'masdedia messsdfsdfage');
      const data: IMessageToSend = {
        senderFirstName: loginStore.initialData.firstName,
        senderLastName: loginStore.initialData.lastName,
        senderWalletAddress: loginStore.initialData.walletAddress,
        photoURL: loginStore.userAvatar,
        location: item.location,
        locationPreview: item.locationPreview,
        mimetype: item.mimetype,
        originalName: item.originalname,
        wrappable: true,
        push: true,
        mucname: roomDetail.name,
        roomJid: roomDetail.jid as string,
        receiverMessageId: "0",
        fileName: item.filename,
        size: item.size.toString(),
        duration: item?.duration,
        waveForm: JSON.stringify(waveForm),
        attachmentId: item._id,
      }

      sendMediaMessageStanza(
        manipulatedWalletAddress,
        roomDetail.jid,
        data,
        xmpp
      )
    })
  }

  const displayNftItems = async () => {
    setIsNftItemGalleryVisible(true)
  }

  //handle to scroll to the top of the list of messages
  const scrollToParentMessage = (currentMessage: any) => {
    const parentIndex = messages.findIndex(
      (item) => item._id === currentMessage?.mainMessage?.id
    )

    //@ts-ignore
    giftedRef.current?._messageContainerRef?.current?.scrollToIndex({
      animated: true,
      index: parentIndex,
    })
  }

  //handle to pick attachment and send
  const sendAttachment = async (
    userToken: string,
    roomDetail: roomListProps
  ) => {
    const xmpp = chatStore.xmpp
    const filesApiURL = apiStore.defaultUrl + fileUpload
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: "cachesDirectory",
      })
      const FormData = require("form-data")
      const data = new FormData()
      data.append("files", {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      })
      const absolutePath = res[0].fileCopyUri || undefined
      const response = await httpUpload(
        filesApiURL,
        data,
        userToken,
        setFileUploadProgress
      )
      setFileUploadProgress(0)

      if (response.data.results?.length) {
        if (response.data.results[0].mimetype === "audio/mpeg") {
          const wave = await getAudioData(absolutePath)
          submitMediaMessage(response.data.results, roomDetail, xmpp, wave)
        } else {
          submitMediaMessage(response.data.results, roomDetail, xmpp, [])
        }
      }
    } catch (err) {
      console.log(err.response)
      // User cancelled the picker, exit any dialogs or menus and move on
      showToast("error", "Error", "Cannot upload file, try again later", "top")
      console.log(err)
    }
  }

  const handleSetIsEditing = (value: boolean) => {
    setIsEditing(value)
  }

  //handle to send a message
  const handleSendMessage = (message: IMessage[]) => {
    const messageText = message[0].text
    const tokenAmount = message[0].tokenAmount || 0
    const receiverMessageId = message[0].receiverMessageId || 0
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: false,
      tokenAmount: tokenAmount,
      receiverMessageId: receiverMessageId,
      mucname: roomDetails.name,
      photoURL: loginStore.userAvatar,
      roomJid: roomDetails.jid,
      isReply: containerType === "thread" || false,
      mainMessage:
        containerType === "thread" &&
        createMainMessageForThread(currentThreadMessage as IMessage),
      showInChannel: showInChannel,
      push: true,
    }
    console.log(data)

    if (isEditing) {
      sendReplaceMessageStanza(
        manipulatedWalletAddress,
        roomDetails.jid,
        messageText as string,
        onTapMessageObject?._id as string,
        data,
        chatStore.xmpp
      )
      setIsEditing(false)
    } else {
      const parsedext = parseValue(
        messageText as string,
        partTypes as any
      ).plainText
      const matches = Array.from(matchAll(messageText ?? "", mentionRegEx))
      matches.forEach((match: any) =>
        sendInvite(
          manipulatedWalletAddress,
          roomDetails.jid,
          match[4],
          chatStore.xmpp
        )
      )
      sendMessageStanza(
        manipulatedWalletAddress,
        roomDetails.jid,
        parsedext,
        data,
        chatStore.xmpp
      )
    }
  }

  //handle to open rooms from chatlink
  const handleChatLinks = (chatLink: string) => {
    const parsedChatId = parseLink(chatLink)
    if (parsedChatId) {
      const chatJID = parsedChatId + apiStore.xmppDomains.CONFERENCEDOMAIN
      openChatFromChatLink(
        chatJID,
        loginStore.initialData.walletAddress,
        navigation,
        chatStore.xmpp
      )
    } else {
      showToast("error", "Error", "Invalid QR", "top")
    }
  }

  //handle to send nft items as message
  const sendNftItemsFromGallery = (item: any) => {
    const data: IMessageToSend = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      mucname: roomDetails.name,
      photoURL: loginStore.userAvatar,
      location: item.nftFileUrl,
      locationPreview: item.nftFileUrl,
      mimetype: item.nftMimetype,
      originalName: item.nftOriginalname,
      nftName: item.tokenName,
      nftId: item.nftId,
      wrappable: true,
      push: true,
      roomJid: roomDetails.jid,
      receiverMessageId: "0",
    }

    sendMediaMessageStanza(
      manipulatedWalletAddress,
      roomDetails.jid,
      data,
      chatStore.xmpp
    )
    setIsNftItemGalleryVisible(false)
  }

  const closeMediaModal = () => {
    setMediaModal({
      type: undefined,
      open: false,
      url: "",
      message: undefined,
    })
  }

  //function to copy text
  const handleCopyText = () => {
    Clipboard.setString(onTapMessageObject?.text as string)
    showToast("success", "Info", "Message copied", "top")
    return onClose()
  }

  const closeLongTapModal = () => {
    setDataForLongTapModal({
      name: "",
      message_id: "",
      senderName: "",
      walletFromJid: "",
      chatJid: "",
      open: false,
    })
  }

  //handle to initiate edit process
  const handleEdit = () => {
    if (!onTapMessageObject?.image || !onTapMessageObject.preview) {
      setIsEditing(true)
      setText(onTapMessageObject?.text as string)
      //@ts-ignore
      giftedRef?.current?.textInput?.focus()
    }
    setShowEditOption(true)
    onClose()
  }

  //handle to initiate delete process
  const handleDelete = () => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message",
      [
        {
          text: "Delete",
          onPress: () => {
            deleteMessageStanza(
              onTapMessageObject?.user._id as string,
              onTapMessageObject?.roomJid as string,
              onTapMessageObject?._id as string,
              chatStore.xmpp
            )
            onClose()
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    )
  }

  //handle to send is typing to xmpp server when user inputs keywords in the message composer section
  const handleInputChange = (inputText: string) => {
    setText(inputText)
    const { firstName, lastName } = loginStore.initialData
    const fullName = firstName + " " + lastName
    setTimeout(() => {
      isComposing(
        manipulatedWalletAddress,
        roomDetails.jid,
        fullName,
        chatStore.xmpp
      )
    }, 2000)
  }

  //handle to preview any media in a modal
  const onMediaMessagePress = (
    type: TCombinedMimeType | undefined,
    url: string | undefined,
    message: IMessage
  ) => {
    setMediaModal({ open: true, type, url, message })
  }

  const handleOnLongPress = (message: IMessage) => {
    if (message.user._id.includes(manipulatedWalletAddress)) {
      return
    }
    if (
      !message.user._id.includes(apiStore.xmppDomains.CONFERENCEDOMAIN_WITHOUT)
    ) {
      const jid = message.user._id.split("@" + apiStore.xmppDomains.DOMAIN)[0]
      const walletFromJid = reverseUnderScoreManipulation(jid)

      setDataForLongTapModal({
        name: message.user.name,
        message_id: message._id,
        senderName:
          loginStore.initialData.firstName +
          " " +
          loginStore.initialData.lastName,
        walletFromJid: walletFromJid,
        chatJid: roomDetails.jid,
        open: true,
      })
    }
  }

  //handle to open other user profile when clicked on their avatar in the chat screen
  const onUserAvatarPress = (avatarProps: {
    _id: string
    name: string
    avatar: string
  }) => {
    //to set the current another user profile
    // otherUserStore.setUserData(firstName, lastName, avatar);
    const xmppID = avatarProps._id.split("@")[0]
    const walletAddress = reverseUnderScoreManipulation(xmppID)
    if (walletAddress === loginStore.initialData.walletAddress) {
      navigation.navigate("ProfileScreen")
      return
    } else {
      chatStore.getOtherUserDetails({
        jid: avatarProps._id,
        avatar: avatarProps.avatar,
        name: avatarProps.name,
      })
      navigation.navigate("OtherUserProfileScreen", {
        walletAddress: walletAddress,
      })
    }
  }

  //handle to initiate reply
  const handleReply = (message?: any) => {
    setShowViewThread(false)
    //navigate to thread screen with current message details.
    //@ts-ignore
    navigation.navigate("ThreadScreen", {
      currentMessage: onTapMessageObject,
      chatJid: roomDetails.jid,
      chatName: roomDetails.name,
    })
    onClose()
  }

  //handle to show options when a message bubble is tapped
  const onMessageBubbleTap = (message: any) => {
    //if the current message is by the owner only then show delete and edit option
    if (!message.user._id.includes(manipulatedWalletAddress)) {
      setIsShowDeleteOption(false)
      setShowEditOption(false)
    } else {
      setIsShowDeleteOption(true)
      setShowEditOption(true)
    }

    //if the current message is already a reply message then don't allow to reply to this message.
    if (message.isReply) {
      setShowReplyOption(false)
    } else {
      setShowReplyOption(true)
    }

    //if there are any replies to this message then the Menu should show View thread option.
    if (message.numberOfReplies > 0) {
      setShowViewThread(true)
    } else {
      setShowViewThread(false)
    }

    //save the message that is tapped by the user for further process.
    setOnTapMessageObject(message)
    return onOpen()
  }

  const sendSystemMessage = useCallback(
    (message: ISystemMessage[]) => {
      const messageText = message[0].text
      const tokenAmount = message[0].tokenAmount || 0
      const receiverMessageId = message[0].receiverMessageId || 0

      const data = {
        ...message[0],
        senderFirstName: loginStore.initialData.firstName,
        senderLastName: loginStore.initialData.lastName,
        senderWalletAddress: loginStore.initialData.walletAddress,
        isSystemMessage: true,
        tokenAmount: tokenAmount,
        receiverMessageId: receiverMessageId,
        mucname: roomDetails.name,
        photoURL: loginStore.userAvatar,
        roomJid: roomDetails.jid,
        isReply: false,
        mainMessage: undefined,
        push: true,
      }
      sendMessageStanza(
        manipulatedWalletAddress,
        roomDetails.jid,
        messageText,
        data,
        chatStore.xmpp
      )
    },
    [
      chatStore.xmpp,
      loginStore.initialData.firstName,
      loginStore.initialData.lastName,
      loginStore.initialData.walletAddress,
      loginStore.userAvatar,
      manipulatedWalletAddress,
      roomDetails.jid,
      roomDetails.name,
    ]
  )

  //local functions

  //use effects
  useEffect(() => {
    if (
      chatStore.isComposing.chatJID === roomDetails.jid &&
      chatStore.isComposing.manipulatedWalletAddress !==
        manipulatedWalletAddress
    ) {
      setIsTyping(chatStore.isComposing.state)
      setComposingUsername(chatStore.isComposing.username)
    }
  }, [
    chatStore.isComposing.chatJID,
    chatStore.isComposing.manipulatedWalletAddress,
    chatStore.isComposing.state,
    chatStore.isComposing.username,
    manipulatedWalletAddress,
    roomDetails.jid,
  ])

  useEffect(() => {
    if (tokenTransferSuccess.success) {
      const message = systemMessage({
        senderName: tokenTransferSuccess.senderName,
        tokenName: tokenTransferSuccess.tokenName,
        receiverMessageId: tokenTransferSuccess.receiverMessageId as string,
        receiverName: tokenTransferSuccess.receiverName,
        nftId: tokenTransferSuccess.nftId,
        tokenAmount: tokenTransferSuccess.amount,
        transactionId: tokenTransferSuccess.transaction?._id,
      })
      sendSystemMessage(message)
      walletStore.clearPreviousTransfer()
    }
  }, [
    sendSystemMessage,
    tokenTransferSuccess.amount,
    tokenTransferSuccess.nftId,
    tokenTransferSuccess.receiverMessageId,
    tokenTransferSuccess.receiverName,
    tokenTransferSuccess.senderName,
    tokenTransferSuccess.success,
    tokenTransferSuccess.tokenName,
    tokenTransferSuccess.transaction?._id,
    walletStore,
  ])

  useEffect(() => {
    if (chatStore.userBanData.success) {
      const message = banSystemMessage({ ...chatStore.userBanData })
      //@ts-ignore
      sendSystemMessage(message)
      chatStore.clearUserBanData()
    }
  }, [chatStore, chatStore.userBanData.success, sendSystemMessage])

  useEffect(() => {
    pausedComposing(manipulatedWalletAddress, roomDetails.jid, chatStore.xmpp)
  }, [
    chatStore.xmpp,
    debouncedChatText,
    manipulatedWalletAddress,
    roomDetails.jid,
  ])

  useEffect(() => {
    if (
      chatStore.isComposing.chatJID === roomDetails.jid &&
      chatStore.isComposing.manipulatedWalletAddress !==
        manipulatedWalletAddress
    ) {
      setIsTyping(chatStore.isComposing.state)
      setComposingUsername(chatStore.isComposing.username)
    }
  }, [
    chatStore.isComposing.chatJID,
    chatStore.isComposing.manipulatedWalletAddress,
    chatStore.isComposing.state,
    chatStore.isComposing.username,
    manipulatedWalletAddress,
    roomDetails.jid,
  ])
  //use effects

  //smaller components

  //component to render send button in the main chat text input.
  const renderSend = (sendProps: any) => {
    if (!sendProps.text) {
      return (
        <AudioSendButton
          recording={recording}
          onPressIn={onStartRecord}
          onPressOut={onStopRecord}
        />
      )
    }
    return (
      <Send {...sendProps}>
        <View style={[styles.sendButton]}>
          <IonIcons name="ios-send" color={"white"} size={hp("3%")} />
        </View>
      </Send>
    )
  }

  //component to render attachments in the main chat text input.
  const renderAttachment = () => {
    const options = walletStore.nftItems.length
      ? {
          "Upload File": async () =>
            await sendAttachment(loginStore.userToken, roomDetails),
          "Display an Item": async () => await displayNftItems(),
          Cancel: () => {
            console.log("Cancel")
          },
        }
      : {
          "Upload File": async () =>
            await sendAttachment(loginStore.userToken, roomDetails),
          Cancel: () => {
            console.log("Cancel")
          },
        }
    return (
      <View style={styles.renderAttachmentContainerStyle}>
        <View
          accessibilityLabel="Choose attachment"
          style={styles.attachmentContainer}
        >
          <Actions
            containerStyle={styles.attachmentActionContainer}
            icon={() => (
              <Entypo
                accessibilityLabel="Send Attachment"
                name="attachment"
                color={"black"}
                size={hp("3%")}
              />
            )}
            options={options}
            optionTintColor="#000000"
          />
        </View>
      </View>
    )
  }

  //component to render message body
  const renderMessage = (messageProps: IMessage) => {
    return <MessageBody {...messageProps} />
  }

  //component to render message image
  const renderMedia = (mediaProps: IMessage | any) => {
    if (!mediaProps) {
      return null
    }
    const {
      image,
      mimetype,
      size,
      waveForm,
      originalName,
      nftId,
      preview,
      nftName,
    } = mediaProps
    let parsedWaveform = []
    if (waveForm) {
      try {
        parsedWaveform = JSON.parse(waveForm)
      } catch (error) {
        console.log("cant parse wave")
      }
    }
    if (isImageMimetype(mimetype as string)) {
      return (
        <ImageMessage
          nftName={nftName}
          nftId={nftId}
          url={image}
          size={size}
          onLongPress={() => handleOnLongPress(mediaProps)}
          onPress={() => onMediaMessagePress(mimetype, image, mediaProps)}
        />
      )
    } else if (isVideoMimetype(mimetype as string)) {
      return (
        <VideoMessage
          url={image}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, image, mediaProps)}
        />
      )
    } else if (isAudioMimetype(mimetype as string)) {
      return (
        <AudioMessage
          waveform={parsedWaveform}
          message={mediaProps}
          onPress={() => onMediaMessagePress(mimetype, image, mediaProps)}
          onLongPress={handleOnLongPress}
        />
      )
    } else if (isPdfMimetype(mimetype as string)) {
      const pdfImage =
        "https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g=w480-h960-rw"
      return (
        <PdfMessage
          url={preview || pdfImage}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, image, mediaProps)}
        />
      )
    } else if (mimetype) {
      return (
        <FileMessage
          url={image as string}
          size={size as string}
          onPress={() => downloadFile(image as string, originalName as string)}
        />
      )
    }
  }

  //component to render chat composer
  const renderComposer = (composerProps: any) => {
    return (
      <ChatComposer
        onTextChanged={setText}
        partTypes={partTypes}
        selection={selection}
        {...composerProps}
      />
    )
  }

  //component to render suggestions
  const renderSuggestions: React.FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null) {
      return null
    }

    return (
      <View style={styles.suggestionsContainer}>
        {defaultBotsList
          .filter((one) =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          )
          .map((one) => (
            <Pressable
              key={one.id}
              onPress={() => onSuggestionPress(one)}
              style={styles.suggestionsPressableStyle}
            >
              <Text style={styles.suggestionsTextStyle}>{one.name}</Text>
            </Pressable>
          ))}
      </View>
    )
  }
  const partTypes = [
    {
      trigger: "@", // Should be a single character like '@' or '#'
      renderSuggestions,
      textStyle: { fontWeight: "bold", color: "blue" }, // The mention style in the input
    },
  ]
  //component to render the UI for main message or the message to which replies and threads are created. This is shown in thread view
  const RenderMainMessageSection: React.FC = () => {
    const firstName = currentThreadMessage?.user.name.split(" ")[0] || "N/A"
    const lastName = currentThreadMessage?.user.name.split(" ")[1] || "N/A"
    //@ts-ignore

    const parentDate = new Date(currentThreadMessage?.createdAt)
    const parentTime = parentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    return (
      <HStack
        shadow="5"
        borderRadius={10}
        bg={commonColors.primaryColor}
        margin={2}
      >
        <View flex={0.19} alignItems="center" paddingTop={2}>
          <View
            width={hp("5.46%")}
            height={hp("5.46%")}
            justifyContent={"center"}
            alignItems={"center"}
            bgColor={commonColors.primaryDarkColor}
            borderRadius={hp("5.46%") / 2}
          >
            {currentThreadMessage?.user.avatar ? (
              <Image
                source={{ uri: currentThreadMessage.user.avatar }}
                style={{
                  height: hp("5.46%"),
                  width: hp("5.46%"),
                  borderRadius: hp("5.46%") / 2,
                }}
              />
            ) : (
              <Text style={styles.nameTextStyle}>
                {firstName[0] + lastName[0]}
              </Text>
            )}
          </View>
        </View>

        <View flex={0.9} padding={2} justifyContent={"flex-start"}>
          <HStack>
            <Text style={styles.usernameTextStyle}>
              {currentThreadMessage?.user.name}
            </Text>
            <Text style={styles.parentTimeStyle}>{parentTime}</Text>
          </HStack>
          <View marginTop={1}>
            <Text style={styles.currentThreadMessageTextStyle}>
              {currentThreadMessage?.text}
            </Text>
          </View>

          {renderMedia(currentThreadMessage as IMessage)}
        </View>
      </HStack>
    )
  }
  //component to render Action items of each menu
  type ActionItemType = "edit" | "delete" | "reply" | "copy" | "thread"
  const ActionItems = (type: ActionItemType) => {
    type TIconName =
      | "delete"
      | "edit"
      | "text-snippet"
      | "content-copy"
      | "reply"
      | ""
    type TItemTitle = "Delete" | "Edit" | "View thread" | "Copy" | "Reply" | ""
    let handleOnPress = () => onClose()
    let itemTitle: TItemTitle = ""
    let iconName: TIconName = ""
    // const handleOnPress = () => {
    switch (type) {
      case "reply":
        handleOnPress = () => handleReply(currentThreadMessage)
        itemTitle = "Reply"
        iconName = "reply"
        break

      case "thread":
        handleOnPress = () => handleReply()
        itemTitle = "View thread"
        iconName = "text-snippet"
        break

      case "copy":
        handleOnPress = () => handleCopyText()
        itemTitle = "Copy"
        iconName = "content-copy"
        break

      case "delete":
        handleOnPress = () => handleDelete()
        itemTitle = "Delete"
        iconName = "delete"
        break

      case "edit":
        handleOnPress = () => handleEdit()
        itemTitle = "Edit"
        iconName = "edit"
        break

      default:
        handleOnPress = () => onClose()
        itemTitle = ""
        iconName = ""
    }

    return (
      <Actionsheet.Item onPress={handleOnPress}>
        <HStack
          alignItems={"center"}
          w={"full"}
          justifyContent={"space-evenly"}
        >
          <View flex={0.5} justifyContent={"center"} alignItems={"flex-start"}>
            <Text
              fontSize={hp("2%")}
              fontWeight={"bold"}
              fontFamily={textStyles.mediumFont}
            >
              {itemTitle}
            </Text>
          </View>
          <View flex={0.5} justifyContent={"center"} alignItems={"flex-end"}>
            <MaterialIcons size={hp("3%")} name={iconName} />
          </View>
        </HStack>
      </Actionsheet.Item>
    )
  }

  //component to show menu on tap of message (Action sheet)
  const ActionSheetContent: React.FC = () => {
    return (
      <Actionsheet.Content>
        {ActionItems("copy")}
        {showReplyOption ? ActionItems("reply") : null}
        {showViewThread ? ActionItems("thread") : null}
        {showEditOption && ActionItems("edit")}
        {isShowDeleteOption && ActionItems("delete")}
      </Actionsheet.Content>
    )
  }
  //smaller components

  return (
    <>
      <ImageBackground
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        source={{
          uri: roomDetails.roomBackground
            ? roomDetails.roomBackground
            : defaultChatBackgroundTheme[0].value,
        }}
      >
        {containerType === "main" ? (
          <SecondaryHeader
            roomJID={roomDetails.jid}
            title={chatStore.roomsInfoMap[roomDetails.jid]?.name}
            isQR={true}
            onQRPressed={() => setShowQrModal(true)}
            isChatRoomDetail={true}
          />
        ) : (
          <SecondaryHeader title="Thread" />
        )}
        {/* @ts-ignore */}
        {isAudioMimetype(mediaModal.type) && (
          <AudioPlayer
            closePlayer={closeMediaModal}
            audioUrl={mediaModal.url}
          />
        )}
        {containerType === "thread" && (
          <View bg={commonColors.primaryDarkColor}>
            <RenderMainMessageSection />
          </View>
        )}
        {chatStore.isLoadingEarlierMessages && (
          <View style={styles.activityIndicatorContainerStyle}>
            <ActivityIndicator size={30} color={commonColors.primaryColor} />
          </View>
        )}
        <GiftedChat
          ref={giftedRef}
          renderSend={renderSend}
          renderActions={renderAttachment}
          renderLoading={() => (
            <ActivityIndicator size={30} color={commonColors.primaryColor} />
          )}
          text={text}
          //@ts-ignore
          containerType={containerType}
          scrollToParentMessage={(currentMessage: any) =>
            scrollToParentMessage(currentMessage)
          }
          renderUsernameOnMessage
          onInputTextChanged={handleInputChange}
          //@ts-ignore
          renderMessage={renderMessage}
          //@ts-ignore
          renderMessageImage={(renderMessageImageProps) =>
            renderMedia(renderMessageImageProps.currentMessage)
          }
          renderComposer={renderComposer}
          //@ts-ignore
          messages={messages}
          renderAvatarOnTop
          onPressAvatar={onUserAvatarPress}
          renderChatFooter={() => (
            <RenderChatFooter
              setShowInChannel={setShowInChannel}
              isEditing={isEditing}
              setIsEditing={handleSetIsEditing}
              onTapMessageObject={onTapMessageObject}
              closeReply={() => handleReply("close")}
              replyMessage={onTapMessageObject?.text}
              replyUserName={onTapMessageObject?.user?.name}
              allowIsTyping={allowIsTyping}
              composingUsername={composingUsername}
              fileUploadProgress={fileUploadProgress}
              isTyping={isTyping}
              showInChannel={showInChannel}
              showAlsoSendInRoom={containerType === "thread" && true}
              setFileUploadProgress={setFileUploadProgress}
            />
          )}
          placeholder={"Type a message"}
          listViewProps={{
            onEndReached: onLoadEarlier && onLoadEarlier,
            onEndReachedThreshold: 0.05,
          }}
          // onLoadEarlier={onLoadEarlier}
          // textInputProps={{onSelectionChange: e => console.log(e)}}
          keyboardShouldPersistTaps={"handled"}
          //@ts-ignore
          onSend={(messageString) => handleSendMessage(messageString)}
          user={{
            _id:
              loginStore.initialData.xmppUsername +
              "@" +
              apiStore.xmppDomains.DOMAIN,
            name: loginStore.initialData.username,
          }}
          // inverted={true}
          alwaysShowSend
          showUserAvatar
          textInputProps={{
            color: "black",
            onSelectionChange: (e: { nativeEvent: { selection: any } }) =>
              setSelection(e.nativeEvent.selection),
          }}
          onLongPress={(message: any) => handleOnLongPress(message)}
          onTap={(message: any) => onMessageBubbleTap(message)}
          handleReply={handleReply}
          // onInputTextChanged={()=>{alert('hhh')}}
          parsePatterns={(linkStyle) => [
            {
              pattern: /\bhttps:\/\/www\.eto\.li\?c=0x[0-9a-f]+_0x[0-9a-f]+/gm,
              style: linkStyle,
              onPress: handleChatLinks,
            },
            {
              pattern: /\bhttps:\/\/www\.eto\.li\?c=[0-9a-f]+/gm,
              style: linkStyle,
              onPress: handleChatLinks,
            },
          ]}
        />
        <NftItemGalleryModal
          onItemPress={sendNftItemsFromGallery}
          isModalVisible={isNftItemGalleryVisible}
          nftItems={walletStore.nftItems}
          closeModal={() => setIsNftItemGalleryVisible(false)}
        />
        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            onClose()
            setIsShowDeleteOption(true)
            setShowReplyOption(true)
            setShowViewThread(false)
          }}
        >
          <ActionSheetContent />
        </Actionsheet>
        <MetaNavigation
          chatId={roomDetails.jid.split("@")[0]}
          open={showMetaNavigation || chatStore.showMetaNavigation}
          onClose={() => {
            setShowMetaNavigation(false)
            chatStore.toggleMetaNavigation(false)
          }}
        />
        <ChatMediaModal
          url={mediaModal.url}
          //@ts-ignore
          type={mediaModal.type}
          onClose={closeMediaModal}
          //@ts-ignore
          open={!isAudioMimetype(mediaModal.type) && mediaModal.open}
          messageData={mediaModal.message}
        />
        <QRModal
          open={showQrModal}
          onClose={() => setShowQrModal(false)}
          title={"Chatroom"}
          link={roomDetails.jid}
        />
        <ChatLongTapModal
          open={dataForLongTapModal.open}
          onClose={closeLongTapModal}
          dataForTransfer={dataForLongTapModal}
        />
      </ImageBackground>
    </>
  )
})

export default ChatContainer
