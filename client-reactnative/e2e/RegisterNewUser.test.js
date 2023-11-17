/* eslint-disable no-undef */
//function to generate random number
const randomNumbers = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min
}

//function to generate random username
const randomUsernameGenerator = () => {
  const uniqueValue1 = ["Small", "Blue", "Ugly"]
  const uniqueValue2 = ["Bear", "Dog", "Banana"]

  const rA = Math.floor(Math.random() * uniqueValue1.length)
  const rB = Math.floor(Math.random() * uniqueValue2.length)
  const name = uniqueValue1[rA] + uniqueValue2[rB]
  return name
}

//function to generate random name
const randomNameGenerator = (num) => {
  const n1 = ["Blue ", "Green", "Red", "Orange", "Violet", "Indigo", "Yellow "]
  const n2 = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Zero",
  ]
  return (
    n1[parseInt(Math.random() * n1.length, 10)] +
    "-" +
    n2[parseInt(Math.random() * n2.length, 10)]
  )
}

//funtion to generater random password
const randomPasswordGenerator = (PassLenght) => {
  const lenght = Number(PassLenght)
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let password = ""
  n = characters.length
  for (let i = 0; i < lenght; ++i) {
    password = characters.charAt(Math.floor(Math.random() * n))
  }
  return password
}

describe("Register new user", () => {
  const min = 3,
    max = 12,
    PassLenght = randomNumbers(6, 15),
    firstname = randomNameGenerator(7),
    lastname = randomNameGenerator(randomNumbers(min, max)),
    username = randomUsernameGenerator(),
    password = randomPasswordGenerator(PassLenght)
  console.log(firstname, lastname, username, password)

  //default operation before test suite starts

  //this function will launch the app.
  beforeAll(async () => {
    await device.launchApp()
  })

  //once the app launches, the react server is reloaded so that any old instance is deleted and freshly started
  beforeEach(async () => {
    // await device.reloadReactNative();
    await device.reloadReactNative()
  })
  //default operation before test suite starts

  // it("should load login screen", async () => {
  //   await expect(element(by.id('login-screen'))).toBeVisible();
  // })

  //default login
  //username = test111@dappros.com;
  //password = dapprosplatform;
  //password is kept same for all random account generation for simplicity.

  //here the test suite starts with sequence of case we would like to perform
  it("should register new user", async () => {
    //once the app launches the below action will tap on the link with text 'Login with credentials'
    await element(by.id("login-with-cred")).tap()
    //then an assertion function checks if the result of the click opens RegularLoginScreen
    await expect(element(by.id("regularLoginScreen"))).toBeVisible()
    //this action will tap on the link with text 'Create new account'
    await element(by.id("createNewAccount")).tap()
    //below assertion then checks if RegisterScreen is opened
    await expect(element(by.id("registerScreen"))).toBeVisible()
    //below actions will enter a random username, firstname, lastname and a default password in the respective fields
    await element(by.id("usernameInput")).typeText(username)
    await element(by.id("firstnameInput")).typeText(firstname)
    await element(by.id("lastnameInput")).typeText(lastname)
    await element(by.id("passwordInput")).typeText("dapprosplatform")
    await element(by.id("confirmPasswordInput")).typeText("dapprosplatform")

    //below action will then tap on create link/button
    await element(by.id("createAccountButton")).tap()
  })
})
