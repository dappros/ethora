import { IMessage } from "../../stores/chatStore"
import dayjs from "dayjs"

export function isSameUser(currentMessage: IMessage, diffMessage: IMessage) {
  return !!(
    diffMessage &&
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  )
}

export function isSameDay(currentMessage: IMessage, diffMessage: IMessage) {
  if (!diffMessage || !diffMessage.createdAt) {
    return false
  }
  const currentCreatedAt = dayjs(currentMessage.createdAt)
  const diffCreatedAt = dayjs(diffMessage.createdAt)
  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false
  }
  return currentCreatedAt.isSame(diffCreatedAt, "day")
}
export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
}
