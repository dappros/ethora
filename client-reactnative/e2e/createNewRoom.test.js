/* eslint-disable no-undef */

const randomFiveDigitnumber = () => {
  return Math.floor(Math.random() * 90000) + 10000
}

describe("create new room", () => {
  //default operation before test suite starts

  //this function will launch the app.
  beforeAll(async () => {
    await device.launchApp()
  })

  //once the app launches, the react server is reloaded so that any old instance is deleted and freshly started
  beforeEach(async () => {
    await device.reloadReactNative()
  })
  //default operation before test suite starts

  //assumes that user is already login. If not then run login.test.js file to login with default account.

  const newRoomName = `TestRoom${randomFiveDigitnumber()}`
  const roomDescription = "Test description"
  it("should create a new room", async () => {
    //the following action will tap on the hamburger menu in the Main header
    await element(by.id("mainHeaderMenuButton")).tap()

    //the following assertion checks if the menu component is visible
    await expect(element(by.id("mainHeaderMenu"))).toBeVisible()

    //the following action will tap on the menu item named 'New Room' with testID as 'itemNewRoom'
    await element(by.id("itemNewRoom")).tap()

    //the following assertion will check if "NewChatScreen" is visible
    await expect(element(by.id("NewChatScreen"))).toBeVisible()

    //the following actions will fill new chat name and description
    await element(by.id("newChatName")).typeText(newRoomName)
    await element(by.id("chatDescription")).typeText(roomDescription)

    //the following action will tap on create/submit button
    await element(by.id("createNewChat")).tap()

    //the following assertion will check if "ChatScreen" is visible
    await expect(element(by.id("ChatScreen"))).toBeVisible()
  })
})
