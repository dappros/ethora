/* eslint-disable no-undef */
import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock"

const mockedNavigation = jest.fn()
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigation,
    }),
  }
})
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter")
jest.mock("react-native-device-info", () => mockRNDeviceInfo)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
)
jest.mock("react-native-permissions", () =>
  require("react-native-permissions/mock")
)
jest.mock("react-native-share", () => ({
  default: jest.fn(),
}))
