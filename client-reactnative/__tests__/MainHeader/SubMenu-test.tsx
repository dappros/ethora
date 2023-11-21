import React from "react"
import renderer from "react-test-renderer"
import SubMenu from "../../src/components/MainHeader/SubMenu"
import { IMenuItem } from "../../src/components/MainHeader/HeaderMenu"
import { NativeBaseProvider } from "native-base"

test("renders correctly", () => {
  const mockMenuItems: IMenuItem[] = [
    {
      value: "string",
      label: "string",
      visible: false,
    },
    {
      value: "string",
      label: "string",
      visible: false,
    },
    {
      value: "string",
      label: "string",
      visible: false,
    },
  ]
  const tree = renderer
    .create(
      <NativeBaseProvider>
        <SubMenu
          menuItems={mockMenuItems}
          onMenuItemPress={() => console.log("menu item press")}
          title="title"
        />
      </NativeBaseProvider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
