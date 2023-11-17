import {} from "react-native-gifted-chat"

/* eslint-disable no-undef */
describe("Testing login mechanism", () => {
  //test story
  // launch app
  // tap on 'Login with credentials
  // enter username and password
  // tap on login button

  //default login
  //username = test222@dappros.com;
  //password = dapprosplatform;

  const username = "test222@dappros.com",
    password = "dapprosplatform"

  //default operation before test suite starts
  //this function will launch the app.
  beforeAll(async () => {
    await device.launchApp({
      permissions: { notifications: "YES", userTracking: "YES" },
    })
  })

  //once the app launches, the react server is reloaded so that any old instance is deleted and freshly started
  beforeEach(async () => {
    await device.reloadReactNative()
  })
  //default operation before test suite starts

  //here the test suite starts with sequence of case we would like to perform
  it("should login with credentials", async () => {
    //once the app launches the below action will tap on the link with text 'Login with credentioals'
    await element(by.id("login-with-cred")).tap()
    //then an assertion function checks if the result of the click opens RegularLoginScreen
    await expect(element(by.id("regularLoginScreen"))).toBeVisible()

    //the following two actions will fill username and password
    await element(by.id("loginUsername")).typeText(username)
    await element(by.id("loginPassword")).typeText(password)

    //the following action will click on submit/login button
    await element(by.id("loginSubmitButton")).tap()
  })
})
