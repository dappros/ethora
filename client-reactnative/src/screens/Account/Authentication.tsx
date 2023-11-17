import React, { useEffect, useState } from "react"
import Clipboard from "@react-native-clipboard/clipboard"
import { Linking, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { commonColors, textStyles } from "../../../docs/config"
import { Button } from "../../components/Button"
import { DeleteDialog } from "../../components/Modals/DeleteDialog"
import { ScanQrModal } from "../../components/Modals/ScanQrModal"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { showError, showSuccess } from "../../components/Toast/toast"
import { httpGet, httpDelete, httpPost } from "../../config/apiService"
import { isAddress } from "../../helpers/isAddress"
import { useStores } from "../../stores/context"
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native"
import { projectId, providerMetadata } from "../../constants/walletConnect"

//interfaces and types
export interface IAuthentication {}
//interfaces and types

//handle to get mail domain eg: Gmail etc
const getMail = (email: string) => {
  if (!email) return ""
  const splittedEmail = email.split("@")
  if (splittedEmail.length) {
    return splittedEmail[1].split(".")[0]
  }
  return ""
}
const walletRoute = "/wallets/ext-wallet/"

export const AuthenticationScreen: React.FC<IAuthentication> = ({}) => {
  //mobx stores
  const { loginStore } = useStores()
  //mobx stores

  //local states
  const [showQrScan, setShowQrScan] = useState(false)
  const [showRemoveAccount, setShowRemoveAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState("")
  const [accountVerified, setAccountVerified] = useState(false)
  //local states

  //local variables
  const { open, address, provider } = useWalletConnectModal()
  //local variables

  //hooks
  useEffect(() => {
    getAddress()
    return () => {
      provider?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (address) {
      updateAddress(address)
    }
  }, [address])
  //hooks

  //handle to connect to metamask
  const onMetamaskPress = () => {
    open()
  }

  //handle to show qr
  const onQRPress = () => {
    setShowQrScan(true)
  }

  const onRemovePress = () => {
    setShowRemoveAccount(true)
  }

  //handle to get mainnet address
  const getAddress = async () => {
    setLoading(true)
    try {
      const res = await httpGet(
        walletRoute + loginStore.initialData.walletAddress,
        loginStore.userToken
      )
      if (res.data.result) {
        setAccount(res.data.result.address)
        setAccountVerified(res.data.result?.verified)
      }
    } catch (error: any) {
      console.log(error.response)
    }
    setLoading(false)
  }

  //handle to open qr scanner
  const onQRScan = async (e: any) => {
    const data = e.data?.split(":")[1]?.split("@")[0]
    if (!isAddress(data)) {
      showError("Error", "This doesnt look like a valid Ethereum address")
      setShowQrScan(false)
      return
    }
    setAccount(data)
    await updateAddress(data)
  }

  //handle to remove mainnet address
  const removeAddress = async () => {
    setLoading(true)
    try {
      const res = await httpDelete(walletRoute + account, loginStore.userToken)
      console.log(res.data)

      showSuccess("Success", "Your Mainnet address was successfully removed.")
      setAccountVerified(false)
      setAccount("")
    } catch (error) {
      console.log(error)
      showError("Error", "Something went wrong, please try again")
    }
    setLoading(false)
    setShowRemoveAccount(false)
  }

  //update or add new address
  const updateAddress = async (address?: string) => {
    try {
      const res = await httpPost(
        walletRoute,
        {
          address: address || account,
        },
        loginStore.userToken
      )
      console.log(res.data)
      setAccount(res.data.data.address)

      showSuccess("Success", "Your address was successfully added.")
    } catch (error) {
      console.log(error)
      showError("Error", "Something went wrong, please try again")
    }
  }

  //ui to for displaying the main net address section
  const renderConnected = () => {
    if (account) {
      return (
        <>
          <View>
            <Text style={styles.title}>Mainnet address</Text>
            <Text style={styles.description}>
              You have confirmed the following address on Ethereum Mainnet:
            </Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(account)
              }}
            >
              <Text style={styles.boldFont}>{account} 📋</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://etherscan.io/address/" + account)
              }
            >
              <Text
                style={{
                  color: commonColors.primaryColor,
                  textDecorationLine: "underline",
                  textAlign: "center",
                }}
              >
                (View on Etherscan)
              </Text>
            </TouchableOpacity>
          </View>
          {!accountVerified && (
            <>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.description}>
                  Use button below if you need to remove your Mainnet address
                  association from your Ethora account.
                </Text>
              </View>
              <View style={styles.buttonBlock}>
                <View style={{ width: "50%" }}>
                  <Button
                    onPress={onRemovePress}
                    title="Remove"
                    style={{ backgroundColor: "red", marginBottom: 10 }}
                  />
                </View>
              </View>
            </>
          )}
        </>
      )
    }
    return (
      <>
        <View>
          <Text style={styles.title}>Mainnet address</Text>
          <Text style={styles.description}>
            (Optional) confirm your L1 (Ethereum Mainnet) wallet address here if
            you need to export your assets to Mainnet or carry out other L1
            related transactions.
          </Text>
        </View>
        <View style={styles.buttonBlock}>
          <View style={{ width: "50%" }}>
            <Button
              loading={loading}
              onPress={onMetamaskPress}
              title="Read from Metamask"
              style={{ backgroundColor: "#cc6228", marginBottom: 10 }}
            />
            <Button
              loading={loading}
              onPress={onQRPress}
              title="QR Scan"
              style={{ backgroundColor: "lightgrey" }}
              textStyle={{ color: "black" }}
            />
          </View>
        </View>
      </>
    )
  }
  return (
    <View>
      <SecondaryHeader title="Authentication" />
      <View style={{ paddingHorizontal: 10 }}>
        {renderConnected()}
        <View>
          <Text style={styles.title}>L2 Address</Text>
          <Text style={styles.description}>
            Your local address within Ethora side chain is:
          </Text>
          <TouchableOpacity
            onPress={() =>
              Clipboard.setString(loginStore.initialData.walletAddress)
            }
          >
            <Text style={styles.boldFont}>
              {loginStore.initialData.walletAddress} 📋
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>Ethora Sign On method</Text>
          <Text style={styles.description}>
            Your current sign on method is:
          </Text>
          <Text style={{ textAlign: "center" }}>
            <Text style={[styles.boldFont, { textTransform: "capitalize" }]}>
              {getMail(loginStore.initialData.email)}
            </Text>{" "}
            (
            {loginStore.initialData.email ??
              loginStore.initialData.username ??
              loginStore.initialData.walletAddress}
            )
          </Text>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.description}>
              Note: different sign on methods will generate different identities
              in our L2 chain. Please make sure to use the same sign on method
              to operate same profile and assets.
            </Text>
          </View>
        </View>
      </View>
      <ScanQrModal
        closeModal={() => setShowQrScan(false)}
        open={showQrScan}
        onSuccess={onQRScan}
      />
      <DeleteDialog
        title="Would you like to remove your Mainnet address association?"
        description={
          "Note: you can always add an association again using this screen later."
        }
        cancelButtonTitle={"No, Cancel"}
        deleteButtonTitle={"Yes, Remove"}
        loading={loading}
        onDeletePress={removeAddress}
        onClose={() => setShowRemoveAccount(false)}
        open={showRemoveAccount}
      />
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontFamily: textStyles.boldFont,
    marginTop: 20,
    color: "black",
    fontSize: 16,
  },
  description: {
    fontFamily: textStyles.mediumFont,
    color: "black",
  },
  boldFont: {
    fontWeight: "bold",
    color: "black",
  },
  buttonBlock: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
})
