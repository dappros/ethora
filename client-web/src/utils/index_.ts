import { MessageModel } from "@chatscope/chat-ui-kit-react"
import { format } from "date-fns"
import * as React from "react"
import { useLocation } from "react-router-dom"
import logo from "../assets/images/dpp.png"
import { mobileEthoraBaseUrl } from "../constants"
import { ILineChartData } from "../pages/Profile/types"
import { useZustandStore } from "../store_"

export function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}
export const truncateString = (input: string, textLength: number) => {
  return input.length > textLength
    ? `${input.slice(0, Math.max(0, textLength))}...`
    : input
}

export function checkNotificationsStatus() {
  if (!("Notification" in window)) {
    return console.log("This browser does not support system notifications!")
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      console.log(permission)
    })
  }
}
export function sendBrowserNotification(
  body: string,
  onNotificationClick: () => void
) {
  const notification = new Notification("New message from Ethora", {
    icon: logo,
    body: body,
  })
  notification.addEventListener("click", onNotificationClick)
}

export const produceNfmtItems = (array = []) => {
  const result = []
  const rareTotal = 20
  const uniqueTotal = 1

  for (const item of array) {
    if (item.tokenType === "NFMT") {
      for (let index = 0; index < item.balances.length; index++) {
        const tokenBalance = item.balances[index]
        const tokenType = +item.contractTokenIds[index]
        const total = item.maxSupplies.find(
          (supply, index) => tokenType === index + 1
        )
        const traits = item.traits.map((trait) =>
          trait.find((element, index) => tokenType === index + 1)
        )
        total < rareTotal && traits.push("Rare")
        total === uniqueTotal && traits.push("Unique!")
        const resItem = {
          ...item,
          balance: tokenBalance,
          nfmtType: tokenType,
          total: total,
          traits,
        }
        ;+tokenBalance > 0 && result.push(resItem)
      }
    }
  }
  return result
}
export function isValidHexCode(string_: string) {
  if (!string_) {
    return true
  }
  const regex = new RegExp(/^#([\dA-Fa-f]{6}|)$/)
  return regex.test(string_) === true
}
export function replaceNotAllowedCharactersInDomain(domain: string) {
  // Define the regex pattern for disallowed characters
  const disallowedPattern = /[^\dA-Za-z\-]/g

  // Replace disallowed characters with an empty string
  const cleanedDomain = domain.replaceAll(disallowedPattern, "")

  return cleanedDomain
}
export const filterNftBalances = (item) => {
  return (
    (item.tokenType === "NFT" || item.tokenType === "NFMT") &&
    (item.balance > 0 ||
      (item.balances?.length && item?.balances?.some((item) => +item > 0)))
  )
}

interface IProfileLink {
  firstName: string
  lastName: string
  walletAddress: string
  xmppId: string
  linkToken?: string
}

export const generateProfileLink = ({
  firstName,
  lastName,
  walletAddress,
  xmppId,
  linkToken,
}: IProfileLink) => {
  const domainName = useZustandStore.getState().applicationConfig.domainName
  return `${mobileEthoraBaseUrl}=profileLink&firstName=${firstName}&lastName=${lastName}&walletAddress=${walletAddress}&xmppId=${xmppId}&linkToken=${
    linkToken ?? ""
  }&app=${domainName}`
}
export const generateChatLink = ({ roomAddress }: { roomAddress: string }) => {
  if (!roomAddress) return ""
  const splitedAddress = roomAddress.split("@")[0]
  const domainName = useZustandStore.getState().applicationConfig.domainName

  return `${mobileEthoraBaseUrl}${splitedAddress}&app=${domainName}`
}
interface IDocumentLink {
  linkToken: string
}

export const generateDocumentLink = ({ linkToken }: IDocumentLink) => {
  return `https://app-dev.dappros.com/v1/docs/share/${linkToken}`
}

export type TChartData = { date: string; y: number }[]

export const transformDataForLineChart = (
  data: ILineChartData,
  dateFormat: string = "MM.dd.yyyy"
): TChartData => {
  const result: TChartData = []
  for (let index = 0; index < data.x.length; index++) {
    const elementX = format(new Date(data.x[index]), dateFormat)
    const elementY = data.y[index]
    result.push({ date: elementX, y: elementY })
  }
  return result
}

export type IMessagePosition = {
  position: MessageModel["position"]
  type: string
  separator?: string
}

export const dateToHumanReadableFormat = (date: string | Date) => {
  try {
    return format(new Date(date), "yyyy MMMM dd HH:mm")
  } catch (error) {
    console.log(error)
    return ""
  }
}

export const stripHtml = (html: string) => {
  let document: any
  let string_ = html

  string_ = string_.replaceAll(/<br>/gi, "\n")
  string_ = string_.replaceAll(/<p.*>/gi, "\n")
  string_ = string_.replaceAll(/<(?:.|\s)*?>/g, "")

  // eslint-disable-next-line prefer-const
  document =
    string_.trim().length === 0
      ? new DOMParser().parseFromString(html, "text/html")
      : new DOMParser().parseFromString(string_, "text/html")
  return document.body.textContent || ""
}

export function preprocessInputKeysToJson(input: string) {
  // Add double quotes around the keys
  return input.replaceAll(/([,{]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
}

export function findObjectInString(input: string) {
  const regex = /{([^}]+)}/g
  const matches = [...input.matchAll(regex)]
  if (matches) {
    return matches.map((match) => match[0])
  }

  return []
}
function findFirebaseConfig(input: string[]) {
  return input.find((index) => {
    return index.includes("authDomain") || index.includes("apiKey")
  })
}

export function getFirebaseConfigFromString(input: string) {
  if (!input) return {}
  const objects = findObjectInString(input)
  const configString = findFirebaseConfig(objects)
  const configJson = preprocessInputKeysToJson(configString)
  const configObject = JSON.parse(configJson)
  return configObject
}
