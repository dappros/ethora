import { makeAutoObservable, runInAction } from "mobx"
import { showToast } from "../components/Toast/toast"
import { httpDelete, httpGet, httpPost } from "../config/apiService"
import { addOrDeleteEmail, getListOfEmails } from "../config/routesConstants"
import { RootStore } from "./context"

export class AccountStore {
  isFetching = false
  error = false
  errorMessage = ""
  emailList = []
  stores: RootStore | {} = {}

  constructor(stores: RootStore) {
    makeAutoObservable(this)
    this.stores = stores
  }

  setInitialState() {
    runInAction(() => {
      this.isFetching = false
      this.error = false
      this.errorMessage = ""
      this.emailList = []
    })
  }

  async getEmailList(token: any) {
    const url = getListOfEmails
    runInAction(() => {
      this.isFetching = true
    })
    try {
      const res = await httpGet(url, token)
      this.isFetching = false
      if (res.data.success) {
        runInAction(() => {
          this.emailList = res.data.emails
        })
      } else {
        runInAction(() => {
          this.error = true
          this.errorMessage = res.data
        })
      }
    } catch (error: any) {
      runInAction(() => {
        this.isFetching = false
        this.error = true
        this.errorMessage = error
      })
    }
  }

  async addEmailToList(token: any, body: any) {
    const url = addOrDeleteEmail
    this.isFetching = true

    try {
      const res = await httpPost(url, body, token)

      runInAction(() => {
        this.isFetching = false
      })

      if (res.data.success || res.data === "") {
        this.getEmailList(token)
        showToast("success", "Success", "Email added succesfully", "top")
      } else {
        runInAction(() => {
          this.error = true
          this.errorMessage = res.data.msg
        })
      }
    } catch (error: any) {
      showToast("error", "Error", error, "top")
      runInAction(() => {
        this.isFetching = false
        this.error = true
        this.errorMessage = error
      })
    }
  }

  async deleteEmailFromList(token: any, email: any) {
    const url = addOrDeleteEmail + "/" + email

    runInAction(() => {
      this.isFetching = true
    })

    try {
      const res = await httpDelete(url, token)
      console.log(res.status)
      runInAction(() => {
        this.isFetching = true
      })
      if (res.data.success) {
        this.getEmailList(token)
        showToast("success", "Success", "Email deleted successfully", "top")
      } else {
        runInAction(() => {
          this.error = true
          this.errorMessage = res.data.msg
        })
      }
    } catch (error: any) {
      runInAction(() => {
        this.isFetching = false
        this.error = true
        this.errorMessage = error
      })
      if (error.code === "ERR_BAD_REQUEST") {
        showToast(
          "error",
          "Error",
          "You cannot delete your primary email",
          "top"
        )
      }
    }
  }
}
