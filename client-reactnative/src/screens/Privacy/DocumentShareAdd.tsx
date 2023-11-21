import React, { useEffect, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import { HStack, Input, Text, View } from "native-base"

import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Select } from "native-base"

import { observer } from "mobx-react-lite"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { commonColors, textStyles } from "../../../docs/config"
import QRCodeGenerator from "../../components/QRCodeGenerator"
import { httpPost } from "../../config/apiService"
import { shareLink } from "../../config/routesConstants"
import { generateDocumentLink } from "../../helpers/generateDocumentLink"
import { useStores } from "../../stores/context"
import { Button } from "../../components/Button"

export interface IDocumentShareAdd {}

const HOUR = 60 * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = WEEK * 4

interface ISharedLink {
  _id: string
  createdAt?: Date
  expiration: string
  memo: string
  resource: string
  token: string
  updatedAt: string
  userId: string
  walletAddress: string
}

export const DocumentShareAdd: React.FC<IDocumentShareAdd> = observer(({}) => {
  const [memo, setMemo] = useState("")
  const [expiration, setExpiration] = useState("-1")
  const [documentId, setDocumentId] = useState("")

  const [createdLink, setCreatedLink] = useState<ISharedLink>({
    _id: "",
    expiration: "",
    memo: "",
    resource: "",
    token: "",
    updatedAt: "",
    userId: "",
    walletAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const { loginStore, walletStore } = useStores()
  const inputRef = useRef()

  useEffect(() => {
    walletStore.getDocuments(loginStore.initialData.walletAddress)
  }, [])

  const generateLink = async () => {
    const body = {
      expiration:
        expiration !== "-1"
          ? new Date().getTime() + +expiration * 1000
          : +expiration,
      memo: memo,
      resource: "document",
      documentId: documentId,
    }
    setLoading(true)
    try {
      const { data } = await httpPost(shareLink, body, loginStore.userToken)
      setCreatedLink(data.sharelinkData)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  if (!walletStore.documents.length) {
    return (
      <View style={{ marginHorizontal: 20 }}>
        <Text style={[styles.title, { textAlign: "center" }]}>
          You have no documents to share. Please, create one
        </Text>
      </View>
    )
  }
  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "white", paddingHorizontal: 20, flex: 1 }}
    >
      <View style={{ marginTop: 10 }}>
        <HStack justifyContent={"space-between"}>
          <Text style={styles.title}>Create a Document Sharing link</Text>
        </HStack>
        <Text style={styles.description}>
          Send this link to your trusted contact(s) so they can access your
          profile when you're in Restricted mode..
        </Text>
        <Text style={styles.note}>
          Note: you'll be able to remove this link any time if you change your
          mind.
        </Text>
      </View>
      <View>
        <Text style={styles.title}>Expiration</Text>

        <Text marginBottom={1}>
          If you set this, this link will only be valid for the given period of
          time.
        </Text>
        <Select
          selectedValue={expiration}
          minWidth="200"
          accessibilityLabel="Choose Expiration"
          placeholder="Choose Expiration"
          borderColor={commonColors.primaryColor}
          color={commonColors.primaryColor}
          mt={1}
          onValueChange={(itemValue) => setExpiration(itemValue)}
        >
          <Select.Item label="No Expiration" value={(-1).toString()} />
          <Select.Item label="1 hour" value={HOUR.toString()} />
          <Select.Item label="1 day" value={DAY.toString()} />
          <Select.Item label="1 week" value={WEEK.toString()} />
          <Select.Item label="1 month" value={MONTH.toString()} />
        </Select>
      </View>
      <View>
        <Text style={styles.title}>Document</Text>

        <Text marginBottom={1}>
          If you set this, this link will only be valid for the given period of
          time.
        </Text>
        <Select
          selectedValue={documentId}
          minWidth="200"
          accessibilityLabel="Choose document"
          placeholder="Choose document"
          borderColor={commonColors.primaryColor}
          color={commonColors.primaryColor}
          mt={1}
          onValueChange={(itemValue) => setDocumentId(itemValue)}
        >
          {walletStore.documents.map((item) => {
            return (
              <Select.Item
                key={item._id}
                label={item.documentName}
                value={item._id}
              />
            )
          })}
        </Select>
      </View>
      <View>
        <Text style={styles.title}>Memo</Text>
        <Text>
          Add an optional note so that you remember who you shared this with.
        </Text>
        <Input
          ref={inputRef}
          maxLength={30}
          marginBottom={2}
          marginTop={1}
          fontFamily={textStyles.lightFont}
          fontSize={hp("1.6%")}
          color={"black"}
          onChangeText={setMemo}
          value={memo}
          placeholder={"shared with Alice"}
          placeholderTextColor={commonColors.primaryColor}
          borderColor={commonColors.primaryColor}
        />
      </View>

      <View>
        <Text style={styles.title}> Here you go!</Text>
        <Text>
          Your unique link and QR code have been created. You can share them
          using buttons below.
        </Text>
        <Text style={styles.note}>
          Note: use "Manage" tab in case you want to copy or modify your sharing
          link in future.
        </Text>
      </View>
      {createdLink.walletAddress ? (
        <QRCodeGenerator
          removeBaseUrl
          shareKey={generateDocumentLink({
            linkToken: createdLink.token,
          })}
          close={() => {}}
        />
      ) : (
        <Button
          style={{ marginBottom: 30 }}
          loading={loading}
          title={"Generate Link"}
          onPress={generateLink}
        />
      )}
    </KeyboardAwareScrollView>
  )
})
const styles = StyleSheet.create({
  title: {
    fontFamily: textStyles.semiBoldFont,
    color: "black",
    fontSize: 18,
    marginVertical: 10,
  },
  description: {
    fontFamily: textStyles.regularFont,
    color: "black",
  },
  shareText: {
    color: "#fff",
    fontFamily: textStyles.mediumFont,
    // textAlign: 'center',
    fontSize: 18,
  },
  note: {
    color: "black",
    marginTop: 5,
    fontStyle: "italic",
    fontSize: 12,
  },
})
