// to store information about other users to be displayed in the Chat Screen

import { makeAutoObservable, runInAction } from "mobx"
export class OtherUserStore {
  userAvatar = ""
  description = ""
  firstName = ""
  lastName = ""
  anotherUserLastSeen = {}
  transactions = []

  constructor() {
    makeAutoObservable(this)
  }

  setInitialState() {
    runInAction(() => {
      this.userAvatar = ""
      this.description = ""
      this.firstName = ""
      this.lastName = ""
      this.anotherUserLastSeen = {}
      this.transactions = []
    })
  }

  setDataFromVCard(description: string, avatar: string) {
    runInAction(() => {
      this.userAvatar = avatar
      this.description = description
    })
  }

  setUserData = (firstName: string, lastName: string, avatar: string) => {
    runInAction(() => {
      this.userAvatar = avatar
      this.firstName = firstName
      this.lastName = lastName
    })
  }
}
